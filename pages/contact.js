import PageBanner from "@/components/PageBanner";
import Layout from "@/layout";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useToast, useConfirm } from "@/components/alerts/AlertProvider";

const API_URL = "https://telorecargo.com/api/enviar-documentos-whatsapp";

const DESTINATION_WHATSAPP = "3235078749";
// const DESTINATION_WHATSAPP = "7441663916";

const normalizePhone = (raw) => {
  if (!raw) return "";
  const digits = raw.replace(/[^\d+]/g, "");
  return digits;
};

const Contact = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false);

  // 🔥 Helper GA4
  const trackEvent = (name, params = {}) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  };

  // Refs para secciones (para contact_section_view)
  const infoSectionRef = useRef(null);
  const formSectionRef = useRef(null);

  // 📊 Page view + tiempo en página + scroll depth
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Page view específico de Contact
    trackEvent("contact_page_view", {
      page_title: "Contact Us",
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    // Tiempo en página: 30, 60, 120 seg
    const marks = [30, 60, 120];
    const timers = marks.map((sec) =>
      setTimeout(
        () =>
          trackEvent("contact_time_on_page", {
            seconds_mark: sec,
          }),
        sec * 1000
      )
    );

    // Scroll depth
    const reached = new Set();
    const points = [25, 50, 75, 100];

    const handleScroll = () => {
      const top =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const height =
        (document.documentElement.scrollHeight ||
          document.body.scrollHeight ||
          0) - window.innerHeight;

      if (height <= 0) return;

      const percent = Math.round((top / height) * 100);
      points.forEach((p) => {
        if (!reached.has(p) && percent >= p) {
          reached.add(p);
          trackEvent("contact_scroll_depth", {
            depth_percentage: p,
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 👀 Observer para secciones (info + form)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = [
      { ref: infoSectionRef, id: "contact_info" },
      { ref: formSectionRef, id: "contact_form" },
    ];

    const seen = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sec = sections.find((s) => s.ref.current === entry.target);
          if (!sec) return;
          if (entry.isIntersecting && !seen.has(sec.id)) {
            seen.add(sec.id);
            trackEvent("contact_section_view", {
              section_id: sec.id,
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => s.ref.current && observer.observe(s.ref.current));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const f = e.currentTarget;
    const name = f.name.value.trim();
    const phoneNumber = normalizePhone(f.phone_number.value);
    const email = f.email.value.trim();
    const subject = f.subject.value.trim();
    const body = f.message.value.trim();

    // 🔍 Track intento de envío
    trackEvent("contact_form_submit_attempt", {
      has_name: !!name,
      has_phone: !!phoneNumber,
      has_email: !!email,
      subject_length: subject.length,
      message_length: body.length,
    });

    const message = [
      "📩 *New contact request - Fiesta Pulse*",
      "",
      `👤 *Name:* ${name}`,
      `📞 *Phone:* ${phoneNumber || "Not provided"}`,
      `📧 *Email:* ${email}`,
      `📝 *Subject:* ${subject}`,
      "",
      "💬 *Message:*",
      body,
      "",
      "— Sent from https://fiestapulse.com/ 🎊",
    ].join("\n");

    const destination = DESTINATION_WHATSAPP;

    try {
      setLoading(true);

      // ❓ Confirmación con tu modal personalizado
      trackEvent("contact_form_confirm_open");
      const ok = await confirm({
        title: "¿Send Message?",
        text: "Your message will be sent for attention.",
        confirmText: "Yes",
        cancelText: "No",
      });

      if (!ok) {
        trackEvent("contact_form_confirm_cancel");
        setLoading(false);
        return;
      }
      trackEvent("contact_form_confirm_accept");

      const res = await axios.post(API_URL, { phone: destination, message });

      // Si tu API responde algo como { success: true }
      if (!res?.data || res.data?.success === false) {
        trackEvent("contact_form_submit_error", {
          reason: "api_response_not_success",
        });
        throw new Error("API respondió sin éxito");
      }

      toast.success("Message sent! We'll contact you soon.", { title: "Sent" });

      trackEvent("contact_form_submit_success", {
        to_whatsapp: destination,
      });

      f.reset();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while sending your message.", {
        title: "Could not send",
      });
      trackEvent("contact_form_submit_error", {
        message: String(err?.message || err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageBanner pageName={"Contact Us"} />
      <section
        className="contact-page-info pt-130 rpt-100 pb-100 rpb-70 rel z-1"
        ref={infoSectionRef}
      >
        <div className="container">
          <div className="row text-center mb-35 justify-content-center wow fadeInUp delay-0-2s">
            <div className="col-xl-8 col-lg-10">
              <div className="section-title mb-25">
                <span className="sub-title mb-15">Need any Helps</span>
                <h2>Contact Informations</h2>
              </div>
              <p>
                Add rhythm, light, and energy to your event! 🎶✨
                Contact us and discover how Fiesta Pulse can transform your
                stage into an unforgettable experience. Let&apos;s talk today!
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="contact-info-box wow fadeInUp delay-0-3s">
                <div className="icon">
                  <i className="fal fa-envelope-open" />
                </div>
                <h4>Email Us</h4>
                <a
                  href="mailto:majanel1110@att.net"
                  onClick={() =>
                    trackEvent("contact_click_email", {
                      email: "majanel1110@att.net",
                    })
                  }
                >
                  majanel1110@att.net
                </a>
                <br />
                <a
                  href="http://www.fiestapulse.com"
                  onClick={() =>
                    trackEvent("contact_click_website", {
                      url: "https://fiestapulse.com",
                    })
                  }
                >
                  www.fiestapulse.com
                </a>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="contact-info-box wow fadeInUp delay-0-4s">
                <div className="icon">
                  <i className="fal fa-phone-plus" />
                </div>
                <h4>Locations</h4>
                <span>
                  Mobile :{" "}
                  <a
                    href="tel:+13235078749"
                    onClick={() =>
                      trackEvent("contact_click_phone", {
                        phone: "+13235078749",
                      })
                    }
                  >
                    +1 (323) 507-8749
                  </a>
                </span>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="contact-info-box wow fadeInUp delay-0-5s">
                <div className="icon">
                  <i className="fal fa-clock" />
                </div>
                <h4>Working Hour</h4>
                <b>Monday _ Friday,</b>
                <span>08:00am - 04:00pm</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Info Area end */}

      {/* Contact Form Start */}
      <section
        className="contact-page-form pb-130 rpb-100"
        ref={formSectionRef}
      >
        <div className="container">
          <div className="contact-form-wrap form-style-two bgc-lighter wow fadeInUp delay-0-2s">
            <div className="row text-center mb-35 justify-content-center">
              <div className="col-xl-9 col-lg-11">
                <div className="section-title mb-25 wow fadeInUp delay-0-2s">
                  <span className="sub-title mb-15">Get In Touch</span>
                  <h2>Send Us Message</h2>
                </div>
                <p>
                  At Fiesta Pulse, we believe every event deserves a
                  high-quality production. If you&apos;d like to collaborate
                  with us, request a quote for professional equipment, or
                  request advice for special projects, we&apos;d love to hear
                  from you.
                </p>
                <p>
                  Fill out the form or write to us directly. Our team will
                  respond with a proposal tailored to your needs and budget.
                </p>
                <p>
                  ✉️ Send us a message and let us help you achieve an
                  unforgettable event.
                </p>
              </div>
            </div>

            {/* ✅ ahora el form sí envía */}
            <form
              onSubmit={handleSubmit}
              id="contactForm"
              className="contactForm"
              name="contactForm"
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Full name"
                      required
                      data-error="Please enter your name"
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      className="form-control"
                      placeholder="Phone Number"
                      required
                      data-error="Please enter your Phone Number"
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                      required
                      data-error="Please enter your Email"
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      placeholder="Subject"
                      required
                      data-error="Please enter your Subject"
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <textarea
                      name="message"
                      id="message"
                      className="form-control"
                      rows={3}
                      placeholder="Message"
                      required
                      data-error="Please enter your Message"
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>

                <div className="col-xl-12">
                  <div className="form-group text-center mb-0">
                    <button
                      type="submit"
                      className="theme-btn style-two"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send message"}{" "}
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
      {/* Contact Form End */}
    </Layout>
  );
};
export default Contact;
