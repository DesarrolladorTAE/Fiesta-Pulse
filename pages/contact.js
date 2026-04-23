import PageBanner from "@/components/PageBanner";
import Layout from "@/layout";
import axios from "axios";
import { useState } from "react";
import { useToast, useConfirm } from "@/components/alerts/AlertProvider";

const API_URL = "https://telorecargo.com/api/enviar-documentos-whatsapp";
const DESTINATION_WHATSAPP = "7445002399";

const normalizePhone = (raw) => {
  if (!raw) return "";
  return raw.replace(/[^\d+]/g, "");
};

const Contact = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const f = e.currentTarget;
    const name = f.name.value.trim();
    const phoneNumber = normalizePhone(f.phone_number.value);
    const email = f.email.value.trim();
    const subject = f.subject.value.trim();
    const body = f.message.value.trim();

    const message = [
      "📩 *Nuevo mensaje - Lavandería Premium*",
      "",
      `👤 *Nombre:* ${name}`,
      `📞 *Teléfono:* ${phoneNumber || "No proporcionado"}`,
      `📧 *Correo:* ${email}`,
      `📝 *Asunto:* ${subject}`,
      "",
      "💬 *Mensaje:*",
      body,
      "",
      "— Enviado desde https://lavanderiapremium.com/ 🧺",
    ].join("\n");

    try {
      setLoading(true);

      const ok = await confirm({
        title: "¿Enviar mensaje?",
        text: "Tu mensaje será enviado para atención.",
        confirmText: "Sí",
        cancelText: "Cancelar",
      });

      if (!ok) {
        setLoading(false);
        return;
      }

      const res = await axios.post(API_URL, {
        phone: DESTINATION_WHATSAPP,
        message,
      });

      if (!res?.data || res.data?.success === false) {
        throw new Error("La API no respondió correctamente");
      }

      toast.success("Mensaje enviado correctamente.", { title: "Enviado" });
      f.reset();
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al enviar el mensaje.", {
        title: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageBanner
        pageName="Contacto"
        description="Contáctanos en Lavandería Premium. Estamos listos para atenderte y resolver tus dudas."
        path="/contacto"
      />

      {/* ================= Información ================= */}
      <section className="contact-page-info pt-130 rpt-100 pb-100 rpb-70">
        <div className="container">
          <div className="row text-center mb-35 justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="section-title mb-25">
                <span className="sub-title mb-15">¿Necesitas ayuda?</span>
                <h2>Información de Contacto</h2>
              </div>
              <p>
                En Lavandería Premium estamos listos para atenderte.
                Escríbenos o visítanos dentro de nuestro horario de atención.
              </p>
            </div>
          </div>

          <div className="row justify-content-center">

            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="contact-info-box">
                <div className="icon">
                  <i className="fal fa-envelope-open" />
                </div>
                <h4>Correo</h4>
                <a href="mailto:contacto@lavanderiapremium.com">
                  contacto@lavanderiapremium.com
                </a>
                <br />
                <a href="https://lavanderiapremium.com/" target="_blank">
                  lavanderiapremium.com
                </a>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="contact-info-box">
                <div className="icon">
                  <i className="fal fa-phone-plus" />
                </div>
                <h4>Teléfono</h4>
                <span>
                  <a href="tel:7445002399">744 500 2399</a>
                </span>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="contact-info-box">
                <div className="icon">
                  <i className="fal fa-clock" />
                </div>
                <h4>Horario</h4>
                <span>Lunes – Domingo</span>
                <br />
                <span>10:00 am – 6:00 pm</span>
                <br />
                <span>Domingo: Cerrado</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= Formulario ================= */}
      <section className="contact-page-form pb-130 rpb-100">
        <div className="container">
          <div className="contact-form-wrap form-style-two bgc-lighter">
            <div className="row text-center mb-35 justify-content-center">
              <div className="col-xl-9 col-lg-11">
                <div className="section-title mb-25">
                  <span className="sub-title mb-15">Contáctanos</span>
                  <h2>Envíanos un Mensaje</h2>
                </div>
                <p>
                  Si tienes dudas sobre nuestros servicios, precios o tiempos de entrega,
                  escríbenos y con gusto te ayudaremos.
                </p>
                <p>🧺 ¡Tu ropa en las mejores manos!</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} id="contactForm" className="contactForm" name="contactForm">
              <div className="row">
                {/* Nombre */}
                <div className="col-md-6">
                  <div className="form-group mb-25">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Nombre completo"
                      required
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>

                {/* Teléfono */}
                <div className="col-md-6">
                  <div className="form-group mb-25">
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      className="form-control"
                      placeholder="Teléfono"
                      required
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>

                {/* Correo */}
                <div className="col-md-6">
                  <div className="form-group mb-25">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Correo electrónico"
                      required
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>

                {/* Asunto */}
                <div className="col-md-6">
                  <div className="form-group mb-25">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      placeholder="Asunto"
                      required
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>

                {/* Mensaje */}
                <div className="col-md-12">
                  <div className="form-group mb-25">
                    <textarea
                      name="message"
                      id="message"
                      className="form-control"
                      rows={6}
                      placeholder="Mensaje"
                      required
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>

                {/* Botón */}
                <div className="col-xl-12">
                  <div className="form-group text-center mb-0">
                    <button type="submit" className="theme-btn style-two" disabled={loading}>
                      {loading ? "Enviando..." : "Enviar Mensaje"}{" "}
                      <i className="far fa-long-arrow-right" />
                    </button>
                    <div id="msgSubmit" className="hidden" />
                  </div>
                </div>
              </div>
            </form>

          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Contact;