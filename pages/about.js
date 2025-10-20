import Counter from "@/src/components/Counter";
import PageBanner from "@/src/components/PageBanner";
import TestimonialsSlider from "@/src/components/slider/TestimonialsSlider";
import Layout from "@/src/layout/Layout";
import Link from "next/link";

const About = () => {
  return (
    <Layout>
      <PageBanner pageName={"About Us"} />
      <section className="about-area-five py-130 rpt-100 rpb-65 rel z-1">
        <div className="container">
          <div className="row align-items-center gap-100">
            <div className="col-lg-6">
              <div className="about-five-images mt-55 rel z-1 wow fadeInRight delay-0-2s">
                <img src="assets/images/about/about-five1.jpg" alt="About Fiesta Pulse" />
                <img src="assets/images/about/about-five2.jpg" alt="About Fiesta Pulse" />
                <div className="experience-years">
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
                    <div className="service-item style-three">
                      <div className="icon">
                        <i className="flaticon-trophy" />
                      </div>
                      <h4>
                          Award-Winning Crew
                      </h4>
                      <p>
                        From intimate parties to large-scale productions, our team delivers flawless setups and show-stopping results.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="service-item style-three">
                      <div className="icon">
                        <i className="flaticon-pie-chart" />
                      </div>
                      <h4>
                          For Corporate & Startup Events
                      </h4>
                      <p>
                        Product brand activations—premium audio, lighting, and staging your guests will remember.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Area end */}
      {/* Services Area start */}
      <section className="services-area-six pb-100 rpb-70 rel z-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="service-item-six wow fadeInUp delay-0-2s">
                <div className="icon">
                  <i className="flaticon-agile" />
                </div>
                <h4>
                  <Link legacyBehavior href="service-details">
                    Stress-Free Setup
                  </Link>
                </h4>
                <p>
                  On-time delivery, quick installs, tidy cabling, and a pro crew that treats your venue like their own.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-item-six wow fadeInUp delay-0-4s">
                <div className="icon">
                  <i className="flaticon-mission" />
                </div>
                <h4>
                  <Link legacyBehavior href="service-details">
                    For Community & Social Events
                  </Link>
                </h4>
                <p>
                  Weddings, birthdays, school events and festivals—tailored packages for every vibe and budget.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-item-six wow fadeInUp delay-0-6s">
                <div className="icon">
                  <i className="flaticon-mission-1" />
                </div>
                <h4>
                  <Link legacyBehavior href="service-details">
                    Trusted Partner
                  </Link>
                </h4>
                <p>
                  Clear quotes, reliable gear, and responsive support from planning to the final song of the night.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Services Area end */}
      {/* Statistics Area start */}
      <section className="statistics-area-two rel z-2">
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
                    <div className="counter-item counter-text-wrap wow fadeInDown delay-0-3s">
                      <i className="flaticon-target" />
                      <span
                        className="count-text plus"
                        data-speed={3000}
                        data-stop={1800}
                      >
                        <Counter end={1800} />
                      </span>
                      <span className="counter-title">Equipment Delivered</span>
                    </div>
                  </div>
                  <div className="col-xl-3 col-small col-6">
                    <div className="counter-item counter-text-wrap wow fadeInUp delay-0-3s">
                      <i className="flaticon-target-audience" />
                      <span
                        className="count-text percent"
                        data-speed={3000}
                        data-stop="98.9"
                      >
                        <Counter end={98.9} decimals="1" />
                      </span>
                      <span className="counter-title">Client Satisfaction</span>
                    </div>
                  </div>
                  <div className="col-xl-3 col-small col-6">
                    <div className="counter-item counter-text-wrap wow fadeInDown delay-0-3s">
                      <i className="flaticon-customer-experience" />
                      <span
                        className="count-text plus"
                        data-speed={3000}
                        data-stop="5"
                      >
                        <Counter end={5} />
                      </span>
                      <span className="counter-title">Years in Business</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Statistics Area end */}

      {/* Why Choose Us Area start */}
      <section className="why-choose-us-area py-130 rpy-100 rel z-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="section-title text-center mb-45 wow fadeInUp delay-0-2s">
                <span className="sub-title mb-15">Why Choose Fiesta Pulse?</span>
                <h2>
                  Top-level, qualified equipment and perfect execution for all your events.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Why Choose Us Area end */}
      {/* Testimonials Area Two start */}

      {/* Partners Area start */}
      <div className="partners-area-three text-center rel z-1 pb-110 rpb-80">
        <div className="container">
          <hr className="mb-75" />
          <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2 justify-content-center">
            <div className="col">
              <Link legacyBehavior href="/contact">
                <a className="partner-item-two wow fadeInUp delay-0-3s">
                  <img src="assets/images/partners/partner1.png" alt="Partner" />
                </a>
              </Link>
            </div>
            <div className="col">
              <Link legacyBehavior href="/contact">
                <a className="partner-item-two wow fadeInUp delay-0-4s">
                  <img src="assets/images/partners/partner2.png" alt="Partner" />
                </a>
              </Link>
            </div>
            <div className="col">
              <Link legacyBehavior href="/contact">
                <a className="partner-item-two wow fadeInUp delay-0-5s">
                  <img src="assets/images/partners/partner3.png" alt="Partner" />
                </a>
              </Link>
            </div>
            <div className="col">
              <Link legacyBehavior href="/contact">
                <a className="partner-item-two wow fadeInUp delay-0-6s">
                  <img src="assets/images/partners/partner4.png" alt="Partner" />
                </a>
              </Link>
            </div>
            <div className="col">
              <Link legacyBehavior href="/contact">
                <a className="partner-item-two wow fadeInUp delay-0-7s">
                  <img src="assets/images/partners/partner5.png" alt="Partner" />
                </a>
              </Link>
            </div>
          </div>
          <hr className="mt-45" />
        </div>
      </div>
    </Layout>
  );
};
export default About;
