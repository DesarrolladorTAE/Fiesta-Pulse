import Counter from "@/src/components/Counter";
import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layout/Layout";
import Link from "next/link";
import { useEffect, useRef } from "react";

const About = () => {
  // 🔥 Helper para enviar eventos GA4
  const trackEvent = (name, params = {}) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  };

  // 📌 Refs para secciones (para IntersectionObserver)
  const aboutMainRef = useRef(null);
  const servicesRef = useRef(null);
  const statisticsRef = useRef(null);
  const whyChooseRef = useRef(null);
  const partnersRef = useRef(null);

  // 📊 1) Evento al cargar la página + tiempo en página
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Page view específico de About
    trackEvent("about_page_view", {
      page_title: "About Us",
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    const startTime = Date.now();
    const timeMarks = [30, 60, 120]; // segundos
    const timeouts = [];

    timeMarks.forEach((seconds) => {
      const id = setTimeout(() => {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        trackEvent("about_time_on_page", {
          seconds_mark: seconds,
          elapsed_seconds: elapsed,
        });
      }, seconds * 1000);
      timeouts.push(id);
    });

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, []);

  // 📈 2) Scroll depth (25%, 50%, 75%, 100%)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const thresholds = [25, 50, 75, 100];
    const reached = new Set();

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || 0;
      const docHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const winHeight = window.innerHeight || 1;

      const maxScroll = Math.min(
        100,
        Math.max(0, (scrollTop / (docHeight - winHeight)) * 100)
      );

      thresholds.forEach((t) => {
        if (!reached.has(t) && maxScroll >= t) {
          reached.add(t);
          trackEvent("about_scroll_depth", {
            depth_percentage: t,
          });
        }
      });
    };

    handleScroll(); // por si ya entran scrolleados
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 👀 3) Observer para vistas de secciones
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sectionMap = [
      { ref: aboutMainRef, id: "about_main" },
      { ref: servicesRef, id: "about_services" },
      { ref: statisticsRef, id: "about_statistics" },
      { ref: whyChooseRef, id: "about_why_choose" },
      { ref: partnersRef, id: "about_partners" },
    ];

    const seen = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sec = sectionMap.find((s) => s.ref.current === entry.target);
          if (!sec) return;

          if (entry.isIntersecting && !seen.has(sec.id)) {
            seen.add(sec.id);
            trackEvent("about_section_view", {
              section_id: sec.id,
            });
          }
        });
      },
      {
        threshold: 0.4, // 40% visible
      }
    );

    sectionMap.forEach((sec) => {
      if (sec.ref.current) observer.observe(sec.ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      <PageBanner pageName={"About Us"} />

      {/* ABOUT MAIN SECTION */}
      <section
        ref={aboutMainRef}
        className="about-area-five py-130 rpt-100 rpb-65 rel z-1"
      >
        <div className="container">
          <div className="row align-items-center gap-100">
            <div className="col-lg-6">
              <div className="about-five-images mt-55 rel z-1 wow fadeInRight delay-0-2s">
                <img
                  src="assets/images/about/about-five1.jpg"
                  alt="About Fiesta Pulse"
                />
                <img
                  src="assets/images/about/about-five2.jpg"
                  alt="About Fiesta Pulse"
                />

                <div
                  className="experience-years"
                  onClick={() =>
                    trackEvent("about_experience_click", { years: 5 })
                  }
                >
                  <span className="years">5</span>
                  <h4>Years of Events Excellence</h4>
                </div>

                <img
                  className="abut-bg-shape"
                  src="assets/images/about/about-five-bg.png"
                  alt="Shape"
                />
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="col-lg-6">
              <div className="about-content mt-55 rel z-1 wow fadeInLeft delay-0-2s">
                <div className="section-title mb-60 rmb-40">
                  <span className="sub-title mb-15">About Us</span>
                  <h2>
                    Sound & Lighting for Events that Elevates Every Celebration
                  </h2>
                </div>

                <div className="row gap-40">
                  <div className="col-md-6">
                    <div
                      className="service-item style-three"
                      onClick={() =>
                        trackEvent("about_service_click", {
                          service: "Award-Winning Crew",
                        })
                      }
                    >
                      <div className="icon">
                        <i className="flaticon-trophy" />
                      </div>
                      <h4>Award-Winning Crew</h4>
                      <p>
                        From intimate parties to large-scale productions, our
                        team delivers flawless setups and show-stopping
                        results.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className="service-item style-three"
                      onClick={() =>
                        trackEvent("about_service_click", {
                          service: "Corporate & Startup Events",
                        })
                      }
                    >
                      <div className="icon">
                        <i className="flaticon-pie-chart" />
                      </div>
                      <h4>For Corporate & Startup Events</h4>
                      <p>
                        Product brand activations—premium audio, lighting, and
                        staging your guests will remember.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES AREA */}
      <section
        ref={servicesRef}
        className="services-area-six pb-100 rpb-70 rel z-1"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div
                className="service-item-six wow fadeInUp delay-0-2s"
                onClick={() =>
                  trackEvent("about_service_card_click", {
                    card: "Stress-Free Setup",
                  })
                }
              >
                <div className="icon">
                  <i className="flaticon-agile" />
                </div>
                <h4>
                  <Link legacyBehavior href="service-details">
                    <a>Stress-Free Setup</a>
                  </Link>
                </h4>
                <p>
                  On-time delivery, quick installs, tidy cabling, and a pro
                  crew that treats your venue like their own.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                className="service-item-six wow fadeInUp delay-0-4s"
                onClick={() =>
                  trackEvent("about_service_card_click", {
                    card: "Community & Social Events",
                  })
                }
              >
                <div className="icon">
                  <i className="flaticon-mission" />
                </div>
                <h4>
                  <Link legacyBehavior href="service-details">
                    <a>For Community & Social Events</a>
                  </Link>
                </h4>
                <p>
                  Weddings, birthdays, school events and festivals—tailored
                  packages for every vibe and budget.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                className="service-item-six wow fadeInUp delay-0-6s"
                onClick={() =>
                  trackEvent("about_service_card_click", {
                    card: "Trusted Partner",
                  })
                }
              >
                <div className="icon">
                  <i className="flaticon-mission-1" />
                </div>
                <h4>
                  <Link legacyBehavior href="service-details">
                    <a>Trusted Partner</a>
                  </Link>
                </h4>
                <p>
                  Clear quotes, reliable gear, and responsive support from
                  planning to the final song of the night.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS AREA */}
      <section
        ref={statisticsRef}
        className="statistics-area-two rel z-2"
      >
        <div className="container">
          <div
            className="statistics-inner style-two bgs-cover text-white p-80 pb-20"
            style={{
              backgroundImage: "url(assets/images/background/statistics.jpg)",
            }}
          >
            <div className="row align-items-xl-start align-items-center">
              <div className="col-xl-5 col-lg-6">
                <div className="statistics-content mb-55 wow fadeInUp delay-0-2s">
                  <div className="section-title mb-30">
                    <span className="sub-title mb-15">Our Track Record</span>
                    <h2>Numbers that Keep Fiesta Pulse Going</h2>
                  </div>
                </div>
              </div>

              <div className="col-xl-7 col-lg-6">
                <div className="row">
                  <div className="col-xl-3 col-small col-6">
                    <div
                      className="counter-item counter-text-wrap wow fadeInDown delay-0-3s"
                      onClick={() =>
                        trackEvent("about_stat_click", {
                          stat: "equipment_delivered",
                          value: 1800,
                        })
                      }
                    >
                      <i className="flaticon-target" />
                      <span
                        className="count-text plus"
                        data-speed={3000}
                        data-stop={1800}
                      >
                        <Counter end={1800} />
                      </span>
                      <span className="counter-title">
                        Equipment Delivered
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-small col-6">
                    <div
                      className="counter-item counter-text-wrap wow fadeInUp delay-0-3s"
                      onClick={() =>
                        trackEvent("about_stat_click", {
                          stat: "client_satisfaction",
                          value: 98.9,
                        })
                      }
                    >
                      <i className="flaticon-target-audience" />
                      <span
                        className="count-text percent"
                        data-speed={3000}
                        data-stop="98.9"
                      >
                        <Counter end={98.9} decimals="1" />
                      </span>
                      <span className="counter-title">
                        Client Satisfaction
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-small col-6">
                    <div
                      className="counter-item counter-text-wrap wow fadeInDown delay-0-3s"
                      onClick={() =>
                        trackEvent("about_stat_click", {
                          stat: "years_in_business",
                          value: 5,
                        })
                      }
                    >
                      <i className="flaticon-customer-experience" />
                      <span
                        className="count-text plus"
                        data-speed={3000}
                        data-stop="5"
                      >
                        <Counter end={5} />
                      </span>
                      <span className="counter-title">
                        Years in Business
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section
        ref={whyChooseRef}
        className="why-choose-us-area py-130 rpy-100 rel z-1"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="section-title text-center mb-45 wow fadeInUp delay-0-2s">
                <span className="sub-title mb-15">
                  Why Choose Fiesta Pulse?
                </span>
                <h2>
                  Top-level, qualified equipment and perfect execution for all
                  your events.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <div
        ref={partnersRef}
        className="partners-area-three text-center rel z-1 pb-110 rpb-80"
      >
        <div className="container">
          <hr className="mb-75" />
          <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2 justify-content-center">
            {[1, 2, 3, 4, 5].map((partner) => (
              <div className="col" key={partner}>
                <Link legacyBehavior href="/contact">
                  <a
                    className="partner-item-two wow fadeInUp delay-0-3s"
                    onClick={() =>
                      trackEvent("about_partner_click", {
                        partner_id: partner,
                      })
                    }
                  >
                    <img
                      src={`assets/images/partners/partner${partner}.png`}
                      alt={`Partner ${partner}`}
                    />
                  </a>
                </Link>
              </div>
            ))}
          </div>
          <hr className="mt-45" />
        </div>
      </div>
    </Layout>
  );
};

export default About;
