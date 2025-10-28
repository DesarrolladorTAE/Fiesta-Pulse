import Layout from "@/layout";
import ProgressBar from "@/src/components/ProgressBar";
import Hero4Slider from "@/src/components/slider/Hero4Slider";
import { projectThreeActive, servicesFiveActive } from "@/src/sliderProps";
import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import Slider from "react-slick";

const Index4 = () => {
  return (
    <Layout header={4}>
      {/* Slider Section Start */}
      <Hero4Slider />
      {/* Slider Section End */}
      {/* Feature Area Start */}

      {/* Feature Area End */}
      {/* About Area start */}
      <section className="about-area-four pt-25 rpt-0 rel z-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6">
              <div className="about-four-image rel z-1 mb-65 wow fadeInRight delay-0-2s">
                <div className="about-circle">
                  <img
                    src="assets/images/about/about-circle.png"
                    alt="Circle"
                  />
                  {/* <img
                    className="text"
                    src="assets/images/about/about-circle-text.png"
                    alt="Circle Text"
                  /> */}
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
                      >
                        Atmospheric Effects
                      </Nav.Link>
                    </li>
                  </Nav>
                  <Tab.Content className="tab-content">
                    <Tab.Pane className="tab-pane fade" eventKey="about-tap1">
                      <p>
                        Build your sound with pro-grade mixers, controllers, PA speakers, and wireless mics.
                        Everything is rental-ready and tested before delivery so you can plug in and play with
                        clean power, balanced cabling, and crystal-clear output.
                      </p>
                      <ul className="list-style-one my-30">
                        <li>Club-level controllers (Rekordbox/Serato)</li>
                        <li>Active PA speakers & subs (SPL for small to large rooms)</li>
                        <li>Wireless handheld/lapel microphones</li>
                        <li>Same-day setup and quick swaps</li>
                      </ul>
                      <Link legacyBehavior href="/shop">
                        <a className="theme-btn mt-10">
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
                        Transform any venue with intelligent moving heads, pixel bars, uplights, and hazers. Add
                        atmosphere with cold-spark fountains, low-lying fog, and confetti for show-stopping
                        intros and dance-floor peaks.
                      </p>
                      <Link legacyBehavior href="/shop">
                        <a className="theme-btn mt-10">
                          Learn About Us{" "}
                          <i className="fas fa-long-arrow-right" />
                        </a>
                      </Link>
                    </Tab.Pane>
                    <Tab.Pane className="tab-pane fade" eventKey="about-tap3">
                      <p>
                        Atmospheric effects enhance any event by creating immersive environments using
                        fog, haze, snow, and special lighting effects. Perfect for concerts, weddings,
                        festivals, and stage performances, they help build atmosphere and amplify
                        visual impact.
                      </p>

                      <ul className="list-style-one my-30">
                        <li>Smoke and fog machines for dynamic stage effects</li>
                        <li>Haze generators for beam and laser visibility</li>
                        <li>CO₂ jet cannons and cryo effects for high-energy shows</li>
                        <li>Artificial snow and bubble machines for themed events</li>
                        <li>Low-lying fog systems for dancing-on-clouds effects</li>
                        <li>Setup, calibration, and operator support included</li>
                      </ul>

                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Area end */}
      {/* Work Process Area start */}
      <section className="work-process-area-two pt-130 pb-100 rpt-100 rpb-70 rel z-1">
        <div className="section-title text-center mb-70 wow fadeInUp delay-0-2s">
          <span className="sub-title mb-15">Selling Process</span>
          <h2>Simple Steps to Shop Online</h2>
          <span className="bg-text">Process</span>
        </div>

        <div className="work-process-line-two text-center">
          <img src="assets/images/shapes/work-process-line.png" alt="process-line" />
        </div>

        <div className="container">
          <div className="row gap-50 justify-content-center">
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="work-process-item-two mt-40 wow fadeInUp delay-0-2s">
                <div className="image">
                  <img src="assets/images/work-process/process1.jpg" alt="Choose your products" />
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
                  <img src="assets/images/work-process/process2.jpg" alt="Build your cart" />
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
                  <img src="assets/images/work-process/process3.jpg" alt="Pay securely" />
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
                  <img src="assets/images/work-process/process4.jpg" alt="Enjoy your products" />
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



      {/* <section className="testimonials-area-four rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-6 ms-lg-auto">
              <div className="testimonials-four-content py-65 rpt-0 rpb-35">
                <div className="section-title mb-35 wow fadeInUp delay-0-2s">
                  <span className="sub-title mb-15">Clients Testimonials</span>
                  <h2>What Our Client’s Say About Our Agency</h2>
                  <span className="bg-text">Says</span>
                </div>
                <div className="testimonial-item style-two wow fadeInUp delay-0-2s">
                  <div className="image">
                    <img
                      src="assets/images/testimonials/testi-author1.jpg"
                      alt="Author"
                    />
                  </div>
                  <div className="content">
                    <div className="testi-header">
                      <h4>Excellent Works</h4>
                    </div>
                    <div className="testi-text">
                      Sed ut perspiciatis unde omnis iste natus voluptatem accus
                      antiume dolorem queauy antium totam aperiam eaque quaey
                      abillosa inventore veritatis vitaec
                    </div>
                    <div className="testi-footer">
                      <div className="icon">
                        <i className="flaticon-quotation" />
                      </div>
                      <div className="title">
                        <h4>Andrew D. Bricker</h4>
                        <span className="designation">CEO &amp; Founder</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-item style-two wow fadeInUp delay-0-2s">
                  <div className="image">
                    <img
                      src="assets/images/testimonials/testi-author3.jpg"
                      alt="Author"
                    />
                  </div>
                  <div className="content">
                    <div className="testi-header">
                      <h4>Excellent Works</h4>
                    </div>
                    <div className="testi-text">
                      On the other hand denounce righteous indignation and
                      dislike men who are so beguiled and demorzed charms of
                      pleasure of the moment blinde
                    </div>
                    <div className="testi-footer">
                      <div className="icon">
                        <i className="flaticon-quotation" />
                      </div>
                      <div className="title">
                        <h4>Michael M. Callaway</h4>
                        <span className="designation">CEO &amp; Founder</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-item style-two wow fadeInUp delay-0-2s">
                  <div className="image">
                    <img
                      src="assets/images/testimonials/testi-author4.jpg"
                      alt="Author"
                    />
                  </div>
                  <div className="content">
                    <div className="testi-header">
                      <h4>Excellent Works</h4>
                    </div>
                    <div className="testi-text">
                      At vero eos et accusamuse iusto odio dignissimos ducimus
                      qui blanditiis praesentium voluptatu delntc atque corrupti
                      quos dolores quas molestias
                    </div>
                    <div className="testi-footer">
                      <div className="icon">
                        <i className="flaticon-quotation" />
                      </div>
                      <div className="title">
                        <h4>William G. Manno</h4>
                        <span className="designation">CEO &amp; Founder</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="testimonial-four-image"
          style={{
            backgroundImage:
              "url(assets/images/testimonials/testimonial-four.jpg)",
          }}
        />
      </section> */}
      {/* Testimonial Area Three end */}
      {/* Partners Area start */}
      {/* <section className="partners-area-two bgc-secondary pt-80 pb-50 rel z-1">
        <div className="container">
          <div className="section-title text-white text-center mb-50 wow fadeInUp delay-0-2s">
            <span className="sub-title mb-15">Global Partners</span>
            <h2>World Wide Partners</h2>
            <span className="bg-text">Partners</span>
          </div>
          <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2 justify-content-center">
            <div className="col">
              <Link legacyBehavior href="/contact">
                <a className="partner-item wow fadeInUp delay-0-3s">
                  <img
                    src="assets/images/partners/partner1.png"
                    alt="Partner"
                  />
                </a>
              </Link>
            </div>
            <div className="col">
              <Link legacyBehavior href="/contact">
                <a className="partner-item wow fadeInUp delay-0-4s">
                  <img
                    src="assets/images/partners/partner2.png"
                    alt="Partner"
                  />
                </a>
              </Link>
            </div>
            <div className="col">
              <Link legacyBehavior href="/contact">
                <a className="partner-item wow fadeInUp delay-0-5s">
                  <img
                    src="assets/images/partners/partner3.png"
                    alt="Partner"
                  />
                </a>
              </Link>
            </div>
            <div className="col">
              <Link legacyBehavior href="/contact">
                <a className="partner-item wow fadeInUp delay-0-6s">
                  <img
                    src="assets/images/partners/partner4.png"
                    alt="Partner"
                  />
                </a>
              </Link>
            </div>
            <div className="col">
              <Link legacyBehavior href="/contact">
                <a className="partner-item wow fadeInUp delay-0-7s">
                  <img
                    src="assets/images/partners/partner5.png"
                    alt="Partner"
                  />
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="partners-shapes">
          <img
            className="left-shape"
            src="assets/images/partners/partner-shape-left.png"
            alt="Shape"
          />
          <img
            className="right-shape"
            src="assets/images/partners/partner-shape-right.png"
            alt="Shape"
          />
        </div>
      </section> */}
      {/* Partners Area end */}

    </Layout>
  );
};
export default Index4;
