"use client";
import Layout from "@/layout";
import PageBanner from "@/components/PageBanner";
import { Accordion } from "react-bootstrap";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  getPayPalSdkCredentials,
  loadPayPalSdk,
  createPayPalOrder,
  capturePayPalOrder,
} from "../src/services/public"; // ajusta la ruta si es necesario

import { useToast } from "@/src/components/alerts/AlertProvider"; // 👈 toasts

const STORE_ID = 115;
const CART_KEY = `public_cart_${STORE_ID}`;
const CUSTOMER_KEY = `public_checkout_customer_${STORE_ID}`;
const ADDRESS_KEY = `public_checkout_address_${STORE_ID}`;
const PREFS_KEY = `public_checkout_prefs_${STORE_ID}`;

// Fuerza pagos en USD
const OVERRIDE_CURRENCY = "USD";

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

export default function Checkout() {
  const toast = useToast(); // 👈 listo

  // ---- State ----
  const [cart, setCart] = useState([]);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkCreds, setSdkCreds] = useState(null); // { client_id, currency, ... }

  const ppContainerRef = useRef(null);
  const ppButtonsRef = useRef(null);
  const [ppMounted, setPpMounted] = useState(false);

  // ---- Cart ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      setCart(raw ? JSON.parse(raw) : []);
    } catch {
      setCart([]);
    }
  }, []);

  const subtotal = useMemo(
    () => (cart || []).reduce((a, b) => a + Number(b.price || 0) * (b.qty || 1), 0),
    [cart]
  );

  // ---- Form ----
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      customer: { name: "", phone: "", email: "" },
      address: "",
      note: "",
      terms: false, // opcional
      pm: "paypal",
    },
  });

  // Prefill from localStorage
  useEffect(() => {
    try {
      const customer = JSON.parse(localStorage.getItem(CUSTOMER_KEY) || "null");
      const address = localStorage.getItem(ADDRESS_KEY) || "";
      const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || "null");
      if (customer || address || prefs) {
        reset({
          customer: customer || { name: "", phone: "", email: "" },
          address,
          note: (prefs && prefs.note) || "",
          terms: !!(prefs && prefs.terms),
          pm: (prefs && prefs.pm) || "paypal",
        });
      }
    } catch {}
  }, [reset]);

  const persistCustomer = (data) => {
    try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data)); } catch {}
  };
  const persistAddress = (val) => {
    try { localStorage.setItem(ADDRESS_KEY, val || ""); } catch {}
  };
  const persistPrefs = (partial) => {
    try {
      const prev = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
      localStorage.setItem(PREFS_KEY, JSON.stringify({ ...prev, ...partial }));
    } catch {}
  };

  // ---- Readiness con useWatch ----
  const nameVal = useWatch({ control, name: "customer.name" });
  const phoneVal = useWatch({ control, name: "customer.phone" });
  const emailVal = useWatch({ control, name: "customer.email" });
  const addrVal = useWatch({ control, name: "address" });

  const formReady = useMemo(() => {
    const okName = (nameVal || "").trim().length >= 2;
    const okPhone = /^[0-9+\-()\s]{7,20}$/.test(String(phoneVal || ""));
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(emailVal || ""));
    const okAddr = (addrVal || "").trim().length >= 6;
    return okName && okPhone && okEmail && okAddr;
  }, [nameVal, phoneVal, emailVal, addrVal]);

  // ---- PayPal SDK ----
  useEffect(() => {
    (async () => {
      try {
        const creds = await getPayPalSdkCredentials(STORE_ID);
        // Cargar SDK forzando USD
        await loadPayPalSdk({ clientId: creds.client_id, currency: OVERRIDE_CURRENCY });
        // Guardar creds con currency USD para usar en el payload
        setSdkCreds({ ...creds, currency: OVERRIDE_CURRENCY });
        setSdkReady(true);
      } catch (e) {
        console.error("[PayPal] SDK load failed:", e);
        toast?.error("PayPal could not be loaded. Please try again later.");
      }
    })();
  }, [toast]);

  // Render PayPal buttons cuando el formulario está listo
  useEffect(() => {
    if (!sdkReady || !formReady || subtotal < 0.01) return;
    if (!ppContainerRef.current) return;
    if (!window.paypal) return;
    if (ppMounted) return;

    const paypal = window.paypal;

    const instance = paypal.Buttons({
      style: { layout: "vertical", shape: "rect", label: "paypal", height: 45 },

      createOrder: async () => {
        try {
          if (!formReady) throw new Error("form_not_ready");

          const form = watch(); // snapshot actual
          // Persistir últimos datos
          persistCustomer(form.customer);
          persistAddress(form.address);
          persistPrefs({ note: form.note, terms: form.terms, pm: form.pm });

          const currentCurrency = (sdkCreds && sdkCreds.currency) || OVERRIDE_CURRENCY || "USD";

          const items = (cart || []).map((it) => ({
            name: it.name,
            quantity: String(it.qty || 1),
            unit_amount: {
              value: Number(Number(it.price || 0).toFixed(2)),
              currency_code: currentCurrency,
            },
            // auxiliares (si luego los usas en backend)
            product_id: it.id,
            variation_size_id: it.variation_size_id ?? null,
            unit_price: Number(it.price || 0),
          }));

          const payload = {
            amount: Number(subtotal.toFixed(2)),
            currency: currentCurrency, // Debe coincidir con la del SDK
            reference_id: `store${STORE_ID}-${Date.now()}`,
            items,
            customer: {
              full_name: form.customer?.name,
              phone: form.customer?.phone,
              email: form.customer?.email,
              address: form.address,
              order_note: form.note,        // opcional
              terms_accepted: !!form.terms, // opcional
            },
            shipping_preference: "NO_SHIPPING",
          };

          const res = await createPayPalOrder(STORE_ID, payload);
          if (!res || !res.ok || !res.order_id) {
            toast?.error("The order could not be created in PayPal.");
            throw new Error("order_create_failed");
          }
          return res.order_id;
        } catch (err) {
          console.error("[PayPal] createOrder error:", err);
          if (String(err?.message) === "form_not_ready") {
            toast?.info("Complete your details to continue.");
          } else {
            toast?.error("Error preparing payment.");
          }
          throw err; // detiene el flujo en PayPal
        }
      },

      onApprove: async (data) => {
        try {
          const orderId = data.orderID;
          await capturePayPalOrder(STORE_ID, orderId);

          // Clear cart after success
          try { localStorage.removeItem(CART_KEY); } catch {}
          setCart([]);

          toast?.success("Payment completed ✅");
          // window.location.href = "/thank-you";
        } catch (e) {
          console.error("[PayPal] capture error:", e);
          toast?.error("We were unable to capture the payment. Please try again.");
        }
      },

      onCancel: () => {
        console.log("[PayPal] user cancelled");
        toast?.info("Payment cancelled.");
      },

      onError: (err) => {
        console.error("[PayPal] error:", err);
        toast?.error("There was an error with PayPal. Contact us.");
      },
    });

    instance
      .render(ppContainerRef.current)
      .then(() => {
        ppButtonsRef.current = instance;
        setPpMounted(true);
      })
      .catch((e) => {
        console.error("render paypal", e);
        toast?.error("The PayPal buttons could not be displayed.");
      });
  }, [sdkReady, formReady, subtotal, sdkCreds, cart, ppMounted, toast]);

  // Desmonta botones solo si el carrito queda vacío
  useEffect(() => {
    if (!ppMounted) return;
    if (subtotal >= 0.01) return;
    try { ppButtonsRef.current && ppButtonsRef.current.close && ppButtonsRef.current.close(); } catch {}
    try { if (ppContainerRef.current) ppContainerRef.current.innerHTML = ""; } catch {}
    ppButtonsRef.current = null;
    setPpMounted(false);
  }, [subtotal, ppMounted]);

  const onSubmit = () => {
    toast?.info("Use the PayPal button to pay.");
  };

  return (
    <Layout>
      <PageBanner pageName="Checkout" />
      <Accordion defaultActiveKey="collapse4">
        <div className="checkout-form-area py-130">
          <div className="container">
            <div className="checkout-faqs" id="checkout-faqs">
              <div className="alert bgc-lighter wow fadeInUp delay-0-2s">
                <h6>
                  Customer details{" "}
                  <Accordion.Toggle as="a" className="card-header" eventKey="collapse4">
                    (required)
                  </Accordion.Toggle>
                </h6>

                <Accordion.Collapse eventKey="collapse4" className="content show">
                  <form onSubmit={handleSubmit(onSubmit)} className="checkout-form" noValidate>
                    {/* Contact */}
                    <div className="row">
                      <div className="col-lg-12 pt-15">
                        <h5>Contact information</h5>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Full name"
                            className={`form-control ${errors?.customer?.name ? "is-invalid" : ""}`}
                            {...register("customer.name", {
                              required: "Name is required",
                              minLength: { value: 2, message: "Min 2 characters" },
                            })}
                            onBlur={(e) => {
                              const c = { ...(watch("customer") || {}), name: e.target.value };
                              persistCustomer(c);
                            }}
                          />
                          {errors?.customer?.name && (
                            <div className="invalid-feedback">{errors.customer.name.message}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="tel"
                            placeholder="Phone"
                            className={`form-control ${errors?.customer?.phone ? "is-invalid" : ""}`}
                            {...register("customer.phone", {
                              required: "Phone is required",
                              pattern: { value: /^[0-9+\-()\s]{7,20}$/, message: "Invalid phone number" },
                            })}
                            onBlur={(e) => {
                              const c = { ...(watch("customer") || {}), phone: e.target.value };
                              persistCustomer(c);
                            }}
                          />
                          {errors?.customer?.phone && (
                            <div className="invalid-feedback">{errors.customer.phone.message}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="email"
                            placeholder="Email address"
                            className={`form-control ${errors?.customer?.email ? "is-invalid" : ""}`}
                            {...register("customer.email", {
                              required: "Email is required",
                              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                            })}
                            onBlur={(e) => {
                              const c = { ...(watch("customer") || {}), email: e.target.value };
                              persistCustomer(c);
                            }}
                          />
                          {errors?.customer?.email && (
                            <div className="invalid-feedback">{errors.customer.email.message}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="row mt-3">
                      <div className="col-lg-12">
                        <h5>Full address</h5>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <textarea
                            rows={3}
                            placeholder="Street, number, neighborhood, city, state, ZIP"
                            className={`form-control ${errors?.address ? "is-invalid" : ""}`}
                            {...register("address", {
                              required: "Address is required",
                              minLength: { value: 6, message: "Too short" },
                            })}
                            onBlur={(e) => persistAddress(e.target.value || "")}
                          />
                          {errors?.address && <div className="invalid-feedback">{errors.address.message}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Notes + Terms (opcionales) */}
                    <div className="row mt-3">
                      <div className="col-lg-12">
                        <h5>Order notes (optional)</h5>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <textarea
                            rows={4}
                            className="form-control"
                            placeholder="Delivery instructions, schedule, references, etc."
                            {...register("note")}
                            onBlur={(e) => {
                              const prev = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
                              persistPrefs({ ...prev, note: e.target.value });
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            {...register("terms")}
                            onChange={(e) => {
                              const prev = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
                              persistPrefs({ ...prev, terms: e.target.checked });
                            }}
                          />
                          I accept the Terms & Conditions (optional)
                        </label>
                      </div>
                    </div>

                    {/* Summary + PayPal */}
                    <div className="payment-cart-total pt-25">
                      <div className="row justify-content-between">
                        <div className="col-lg-6">
                          <div className="payment-method rmb-30">
                            <h5 className="mb-20">Pay with PayPal</h5>

                            <div style={{ position: "relative", minHeight: 50 }}>
                              <div ref={ppContainerRef} id="paypal-buttons" />
                              {(!sdkReady || !formReady || subtotal < 0.01) && (
                                <div
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(255,255,255,0.85)",
                                    borderRadius: 6,
                                    fontSize: 14,
                                    textAlign: "center",
                                    padding: 8,
                                  }}
                                >
                                  {!sdkReady
                                    ? "Loading PayPal…"
                                    : subtotal < 0.01
                                    ? "Your cart is empty."
                                    : "Complete your contact and address to continue."}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-5">
                          <div className="shoping-cart-total text-left mb-20">
                            <h5 className="text-center mb-20">Cart summary</h5>
                            <table>
                              <tbody>
                                {(cart || []).length === 0 && (
                                  <tr>
                                    <td colSpan={2}>Your cart is empty.</td>
                                  </tr>
                                )}
                                {(cart || []).map((it) => (
                                  <tr key={it.id}>
                                    <td>
                                      {it.name} <strong>× {it.qty || 1}</strong>
                                    </td>
                                    <td>{money(Number(it.price || 0) * (it.qty || 1))}</td>
                                  </tr>
                                ))}
                                <tr>
                                  <td>
                                    <strong>Total</strong>
                                  </td>
                                  <td>
                                    <strong>{money(subtotal)}</strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Optional submit (nos apoyamos en PayPal) */}
                    {/* <button type="submit" className="theme-btn w-100">Pay</button> */}
                  </form>
                </Accordion.Collapse>
              </div>
            </div>
          </div>
        </div>
      </Accordion>

      <style jsx global>{`
        .checkout-form .is-invalid { border-color: #dc3545; }
        .checkout-form .invalid-feedback { display: block; }
        #paypal-buttons, [data-funding-source] { min-height: 45px; }
      `}</style>
    </Layout>
  );
}
