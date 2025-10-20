import PageBanner from "@/components/PageBanner";
import Layout from "@/layout";
import axios from "axios";
import { useState } from "react";
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
      const ok = await confirm({
        title: "¿Send Message?",
        text: "Your message will be sent for attention.",
        confirmText: "Yes",
        cancelText: "No",
      });
      if (!ok) { setLoading(false); return; }

      const res = await axios.post(API_URL, { phone: destination, message });

      // Si tu API responde algo como { success: true }
      if (!res?.data || res.data?.success === false) {
        throw new Error("API respondió sin éxito");
      }

      toast.success("Message sent! We'll contact you soon.", { title: "Sent" });
      f.reset();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while sending your message.", { title: "Could not send" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Layout>
      <PageBanner pageName={"Contact Us"} />{" "}
      <section className="contact-page-info pt-130 rpt-100 pb-100 rpb-70 rel z-1">
        <div className="container">
          <div className="row text-center mb-35 justify-content-center wow fadeInUp delay-0-2s">
            <div className="col-xl-8 col-lg-10">
              <div className="section-title mb-25">
                <span className="sub-title mb-15">Need any Helps</span>
                <h2>Contact Informations</h2>
              </div>
              <p>
                Add rhythm, light, and energy to your event! 🎶✨
                Contact us and discover how Fiesta Pulse can transform your stage into an unforgettable experience.
                Let's talk today!
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            {/* <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="contact-info-box wow fadeInUp delay-0-2s">
                <div className="icon">
                  <i className="fal fa-map-marker-alt" />
                </div>
                <h4>Locations</h4>
                <span>553 Main Street, 2nd - Block, New York 32500</span>
              </div>
            </div> */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="contact-info-box wow fadeInUp delay-0-3s">
                <div className="icon">
                  <i className="fal fa-envelope-open" />
                </div>
                <h4>Email Us</h4>
                <a href="mailto:majanel1110@att.net">
                  majanel1110@att.net
                </a>
                <br />
                <a href="http://www.fiestapulse.com">www.fiestapulse.com</a>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="contact-info-box wow fadeInUp delay-0-4s">
                <div className="icon">
                  <i className="fal fa-phone-plus" />
                </div>
                <h4>Locations</h4>
                <span>
                  Mobile : <a href="tel:+13235078749">+1 (323) 507-8749</a>
                </span>
                {/* <span>
                  Teliphone : <a href="callto:+1234566">+1234566</a>
                </span> */}
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
      {/* Location Map Area Start */}
      {/* <div className="contact-page-map wow fadeInUp delay-0-2s">
        <div className="our-location">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m12!1m10!1m3!1d142190.2862584524!2d-74.01298319978558!3d40.721725351435126!2m1!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sbd!4v1663473911885!5m2!1sen!2sbd"
            style={{ border: 0, width: "100%" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div> */}
      {/* Location Map Area End */}
      {/* Contact Form Start */}
      <section className="contact-page-form pb-130 rpb-100">
        <div className="container">
          <div className="contact-form-wrap form-style-two bgc-lighter wow fadeInUp delay-0-2s">
            <div className="row text-center mb-35 justify-content-center">
              <div className="col-xl-9 col-lg-11">
                <div className="section-title mb-25 wow fadeInUp delay-0-2s">
                  <span className="sub-title mb-15">Get In Touch</span>
                  <h2>Send Us Message</h2>
                </div>
                <p>
                  At Fiesta Pulse, we believe every event deserves a high-quality production.
                  If you'd like to collaborate with us, request a quote for professional equipment, or request advice for special projects, we'd love to hear from you.
                </p>
                <p>
                  Fill out the form or write to us directly. Our team will respond with a proposal tailored to your needs and budget.
                </p>
                <p>✉️ Send us a message and let us help you achieve an unforgettable event.</p>
              </div>
            </div>

            {/* ✅ ahora el form sí envía */}
            <form onSubmit={handleSubmit} id="contactForm" className="contactForm" name="contactForm">
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
                    <button type="submit" className="theme-btn style-two" disabled={loading}>
                      {loading ? "Sending..." : "Send message"} <i className="far fa-long-arrow-right" />
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
