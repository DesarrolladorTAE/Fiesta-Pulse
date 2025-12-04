import Layout from "@/layout";
import ProgressBar from "@/src/components/ProgressBar";
import Hero4Slider from "@/src/components/slider/Hero4Slider";
import { projectThreeActive, servicesFiveActive } from "@/src/sliderProps";
import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import Slider from "react-slick";
import { useEffect, useRef } from "react";

const Index4 = () => {
  // 🔥 Helper GA4
  const trackEvent = (name, params = {}) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  };

  // Refs para secciones que queremos trackear
  const aboutSectionRef = useRef(null);
  const processSectionRef = useRef(null);

  // 📊 Page view + tiempo en página + scroll depth
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Page view específico del Home
    trackEvent("home_page_view", {
      page_title: "Home",
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    // Tiempo en página: 30, 60, 120 seg
    const marks = [30, 60, 120];
    const timers = marks.map((sec) =>
      setTimeout(
        () =>
          trackEvent("home_time_on_page", {
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
          trackEvent("home_scroll_depth", {
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

  // 👀 Observer para secciones (about + process)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = [
      { ref: aboutSectionRef, id: "home_about_products" },
      { ref: processSectionRef, id: "home_selling_process" },
    ];

    const seen = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sec = sections.find((s) => s.ref.current === entry.target);
          if (!sec) return;
          if (entry.isIntersecting && !seen.has(sec.id)) {
            seen.add(sec.id);
            trackEvent("home_section_view", {
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

  return (
    <Layout header={4}>
      {/* Slider Section Start */}
      <Hero4Slider />
      {/* Slider Section End */}

      {/* About Area start */}
      <section
        className="about-area-four pt-25 rpt-0 rel z-2"
        ref={aboutSectionRef}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6">
              <div className="about-four-image rel z-1 mb-65 wow fadeInRight delay-0-2s">
                <div className="about-circle">
                  <img
                    src="assets/images/about/about-circle.png"
                    alt="Circle"
                  />
                </div>
                <div className="image">
                  {/* <img src="assets/images/about/about-four.jpg" alt="About" /> */}
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-10">
              <div className="about-four-content mb-65 rel z-1 wow fadeInLeft delay-0-2s">
                <div className="section-title mb-50">
                  <span className="sub-title mb-15">Products for Sale</span>
                  <h2>DJ Gear, Lighting & Atmospheric Effects</h2>
                  <span className="bg-text">Sale</span>
                </div>
                <Tab.Container defaultActiveKey={"about-tap1"}>
                  <Nav as={"ul"} className="nav nav-pills nav-fill mb-35">
                    <li className="nav-item">
                      <Nav.Link
                        as={"a"}
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#about-tap1"
                        eventKey="about-tap1"
                        onClick={() =>
                          trackEvent("home_products_tab_click", {
                            tab: "dj_audio_gear",
                          })
                        }
                      >
                        DJ & Audio Gear
                      </Nav.Link>
                    </li>
                    <li className="nav-item">
                      <Nav.Link
                        as={"a"}
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#about-tap2"
                        eventKey="about-tap2"
                        onClick={() =>
                          trackEvent("home_products_tab_click", {
                            tab: "special_effects",
                          })
                        }
                      >
                        Special Effects
                      </Nav.Link>
                    </li>
                    <li className="nav-item">
                      <Nav.Link
                        as={"a"}
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#about-tap3"
                        eventKey="about-tap3"
                        onClick={() =>
                          trackEvent("home_products_tab_click", {
                            tab: "atmospheric_effects",
                          })
                        }
                      >
                        Atmospheric Effects
                      </Nav.Link>
                    </li>
                  </Nav>
                  <Tab.Content className="tab-content">
                    <Tab.Pane className="tab-pane fade" eventKey="about-tap1">
                      <p>
                        Build your sound with pro-grade mixers, controllers, PA
                        speakers, and wireless mics. Everything is rental-ready
                        and tested before delivery so you can plug in and play
                        with clean power, balanced cabling, and crystal-clear
                        output.
                      </p>
                      <ul className="list-style-one my-30">
                        <li>Club-level controllers (Rekordbox/Serato)</li>
                        <li>
                          Active PA speakers & subs (SPL for small to large
                          rooms)
                        </li>
                        <li>Wireless handheld/lapel microphones</li>
                        <li>Same-day setup and quick swaps</li>
                      </ul>
                      <Link legacyBehavior href="/shop">
                        <a
                          className="theme-btn mt-10"
                          onClick={() =>
                            trackEvent("home_products_cta_click", {
                              source_tab: "dj_audio_gear",
                            })
                          }
                        >
                          Learn About Us{" "}
                          <i className="fas fa-long-arrow-right" />
                        </a>
                      </Link>
                    </Tab.Pane>
                    <Tab.Pane className="tab-pane fade" eventKey="about-tap2">
                      <ul className="list-style-one my-30">
                        <li>Moving heads & pixel mapping</li>
                        <li>Wireless battery uplights (RGB/Amber/UV)</li>
                        <li>Haze & low-fog for beam definition</li>
                      </ul>
                      <p>
                        Transform any venue with intelligent moving heads, pixel
                        bars, uplights, and hazers. Add atmosphere with
                        cold-spark fountains, low-lying fog, and confetti for
                        show-stopping intros and dance-floor peaks.
                      </p>
                      <Link legacyBehavior href="/shop">
                        <a
                          className="theme-btn mt-10"
                          onClick={() =>
                            trackEvent("home_products_cta_click", {
                              source_tab: "special_effects",
                            })
                          }
                        >
                          Learn About Us{" "}
                          <i className="fas fa-long-arrow-right" />
                        </a>
                      </Link>
                    </Tab.Pane>
                    <Tab.Pane className="tab-pane fade" eventKey="about-tap3">
                      <p>
                        Atmospheric effects enhance any event by creating
                        immersive environments using fog, haze, snow, and
                        special lighting effects. Perfect for concerts,
                        weddings, festivals, and stage performances, they help
                        build atmosphere and amplify visual impact.
                      </p>

                      <ul className="list-style-one my-30">
                        <li>Smoke and fog machines for dynamic stage effects</li>
                        <li>
                          Haze generators for beam and laser visibility
                        </li>
                        <li>
                          CO₂ jet cannons and cryo effects for high-energy shows
                        </li>
                        <li>
                          Artificial snow and bubble machines for themed events
                        </li>
                        <li>
                          Low-lying fog systems for dancing-on-clouds effects
                        </li>
                        <li>
                          Setup, calibration, and operator support included
                        </li>
                      </ul>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Process Area start */}
      <section
        className="work-process-area-two pt-130 pb-100 rpt-100 rpb-70 rel z-1"
        ref={processSectionRef}
      >
        <div className="section-title text-center mb-70 wow fadeInUp delay-0-2s">
          <span className="sub-title mb-15">Selling Process</span>
          <h2>Simple Steps to Shop Online</h2>
          <span className="bg-text">Process</span>
        </div>

        <div className="work-process-line-two text-center">
          <img
            src="assets/images/shapes/work-process-line.png"
            alt="process-line"
          />
        </div>

        <div className="container">
          <div className="row gap-50 justify-content-center">
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="work-process-item-two mt-40 wow fadeInUp delay-0-2s">
                <div className="image">
                  <img
                    src="assets/images/work-process/process1.jpg"
                    alt="Choose your products"
                  />
                  <div className="number">01</div>
                </div>
                <div className="content">
                  <h5>Choose Your Products</h5>
                  <p>Browse the catalog and pick what you need.</p>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="work-process-item-two wow fadeInDown delay-0-2s">
                <div className="image">
                  <img
                    src="assets/images/work-process/process2.jpg"
                    alt="Build your cart"
                  />
                  <div className="number">02</div>
                </div>
                <div className="content">
                  <h5>Build Your Cart</h5>
                  <p>Add the products you prefer to your cart.</p>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="work-process-item-two mt-20 wow fadeInUp delay-0-2s">
                <div className="image">
                  <img
                    src="assets/images/work-process/process3.jpg"
                    alt="Pay securely"
                  />
                  <div className="number">03</div>
                </div>
                <div className="content">
                  <h5>Pay Securely</h5>
                  <p>Choose your payment method and complete checkout.</p>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="work-process-item-two wow fadeInDown delay-0-2s">
                <div className="image">
                  <img
                    src="assets/images/work-process/process4.jpg"
                    alt="Enjoy your products"
                  />
                  <div className="number">04</div>
                </div>
                <div className="content">
                  <h5>Enjoy Your Products</h5>
                  <p>Receive your order and start enjoying your purchase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Work Process Area end */}
    </Layout>
  );
};

export default Index4;
