import { sliderTwoActive } from "@/src/sliderProps";
import Link from "next/link";
import { Component, Fragment } from "react";
import Slider from "react-slick";

export default class Hero4Slider extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.handleAfterChange = this.handleAfterChange.bind(this);

    // índice actual para saber desde qué slide se mueven las flechas
    this.state = {
      currentSlide: 0,
    };

    // IDs legibles por slide
    this.slideIds = [
      "sound_lights_action",
      "fuel_the_night",
      "light_it_sound_it_own_it",
      "built_for_djs_ready_for_events",
      "your_event_amplified",
    ];
  }

  // Helper GA4
  trackEvent(name, params = {}) {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  }

  componentDidMount() {
    // Primer slide visto al cargar
    this.trackEvent("home_hero_slide_view", {
      slide_index: 0,
      slide_id: this.slideIds[0],
    });
  }

  handleAfterChange(index) {
    this.setState({ currentSlide: index });
    const slideId = this.slideIds[index] || `slide_${index}`;
    this.trackEvent("home_hero_slide_view", {
      slide_index: index,
      slide_id: slideId,
    });
  }

  next() {
    this.trackEvent("home_hero_arrow_click", {
      direction: "next",
      from_slide: this.state.currentSlide,
    });
    this.slider.slickNext();
  }

  previous() {
    this.trackEvent("home_hero_arrow_click", {
      direction: "prev",
      from_slide: this.state.currentSlide,
    });
    this.slider.slickPrev();
  }

  // CTA click
  trackHeroCta(slideId, href) {
    this.trackEvent("home_hero_cta_click", {
      slide_id: slideId,
      target: href,
    });
  }

  // Social click
  trackSocialClick(slideId, network, url) {
    this.trackEvent("home_hero_social_click", {
      slide_id: slideId,
      network,
      url,
    });
  }

  render() {
    const sliderSettings = {
      ...sliderTwoActive,
      afterChange: this.handleAfterChange,
    };

    return (
      <Fragment>
        <Slider
          {...sliderSettings}
          ref={(c) => (this.slider = c)}
          className="slider-two-active"
        >
          {/* SLIDE 1 */}
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Welcome to Fiesta Pulse</span>
                <h2>Sound, Lights and Action</h2>
                <Link legacyBehavior href="/shop">
                  <a
                    className="theme-btn mt-15"
                    onClick={() =>
                      this.trackHeroCta("sound_lights_action", "/shop")
                    }
                  >
                    Let’s Get Started <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
                <div className="social-style-two">
                  <a
                    href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
                    onClick={() =>
                      this.trackSocialClick(
                        "sound_lights_action",
                        "facebook",
                        "https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
                      )
                    }
                  >
                    <i className="fab fa-facebook-f" />
                  </a>

                  <a
                    href="https://www.instagram.com/fiesta_pulse"
                    onClick={() =>
                      this.trackSocialClick(
                        "sound_lights_action",
                        "instagram",
                        "https://www.instagram.com/fiesta_pulse"
                      )
                    }
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
                    onClick={() =>
                      this.trackSocialClick(
                        "sound_lights_action",
                        "tiktok",
                        "https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
                      )
                    }
                  >
                    <i className="fab fa-tiktok" />
                  </a>
                </div>
              </div>
            </div>
            <div
              className="slider-image"
              style={{
                backgroundImage: "url(assets/images/services/luces.jpeg)",
              }}
            />
          </div>

          {/* SLIDE 2 */}
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Welcome to Fiesta Pulse</span>
                <h2>Fuel the Night</h2>
                <Link legacyBehavior href="/shop">
                  <a
                    className="theme-btn mt-15"
                    onClick={() =>
                      this.trackHeroCta("fuel_the_night", "/shop")
                    }
                  >
                    Let’s Get Started <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
                <div className="social-style-two">
                  <a
                    href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
                    onClick={() =>
                      this.trackSocialClick(
                        "fuel_the_night",
                        "facebook",
                        "https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
                      )
                    }
                  >
                    <i className="fab fa-facebook-f" />
                  </a>

                  <a
                    href="https://www.instagram.com/fiesta_pulse"
                    onClick={() =>
                      this.trackSocialClick(
                        "fuel_the_night",
                        "instagram",
                        "https://www.instagram.com/fiesta_pulse"
                      )
                    }
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
                    onClick={() =>
                      this.trackSocialClick(
                        "fuel_the_night",
                        "tiktok",
                        "https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
                      )
                    }
                  >
                    <i className="fab fa-tiktok" />
                  </a>
                </div>
              </div>
            </div>
            <div
              className="slider-image"
              style={{
                backgroundImage: "url(assets/images/services/lala.jpg)",
              }}
            />
          </div>

          {/* SLIDE 3 */}
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Welcome to Fiesta Pulse</span>
                <h2>Light It. Sound It. Own It</h2>
                <Link legacyBehavior href="/shop">
                  <a
                    className="theme-btn mt-15"
                    onClick={() =>
                      this.trackHeroCta(
                        "light_it_sound_it_own_it",
                        "/shop"
                      )
                    }
                  >
                    Let’s Get Started <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
                <div className="social-style-two">
                  <a
                    href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
                    onClick={() =>
                      this.trackSocialClick(
                        "light_it_sound_it_own_it",
                        "facebook",
                        "https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
                      )
                    }
                  >
                    <i className="fab fa-facebook-f" />
                  </a>

                  <a
                    href="https://www.instagram.com/fiesta_pulse"
                    onClick={() =>
                      this.trackSocialClick(
                        "light_it_sound_it_own_it",
                        "instagram",
                        "https://www.instagram.com/fiesta_pulse"
                      )
                    }
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
                    onClick={() =>
                      this.trackSocialClick(
                        "light_it_sound_it_own_it",
                        "tiktok",
                        "https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
                      )
                    }
                  >
                    <i className="fab fa-tiktok" />
                  </a>
                </div>
              </div>
            </div>
            <div
              className="slider-image"
              style={{
                backgroundImage: "url(assets/images/services/luces2.jpg)",
              }}
            />
          </div>

          {/* SLIDE 4 */}
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Welcome to Fiesta Pulse</span>
                <h2>Built for DJs. Ready for Events.</h2>
                <Link legacyBehavior href="/shop">
                  <a
                    className="theme-btn mt-15"
                    onClick={() =>
                      this.trackHeroCta(
                        "built_for_djs_ready_for_events",
                        "/shop"
                      )
                    }
                  >
                    Let’s Get Started <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
                <div className="social-style-two">
                  <a
                    href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
                    onClick={() =>
                      this.trackSocialClick(
                        "built_for_djs_ready_for_events",
                        "facebook",
                        "https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
                      )
                    }
                  >
                    <i className="fab fa-facebook-f" />
                  </a>

                  <a
                    href="https://www.instagram.com/fiesta_pulse"
                    onClick={() =>
                      this.trackSocialClick(
                        "built_for_djs_ready_for_events",
                        "instagram",
                        "https://www.instagram.com/fiesta_pulse"
                      )
                    }
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
                    onClick={() =>
                      this.trackSocialClick(
                        "built_for_djs_ready_for_events",
                        "tiktok",
                        "https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
                      )
                    }
                  >
                    <i className="fab fa-tiktok" />
                  </a>
                </div>
              </div>
            </div>
            <div
              className="slider-image"
              style={{
                backgroundImage: "url(assets/images/services/luces3.jpg)",
              }}
            />
          </div>

          {/* SLIDE 5 */}
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Welcome to Fiesta Pulse</span>
                <h2>Your Event, Amplified</h2>
                <Link legacyBehavior href="/about">
                  <a
                    className="theme-btn mt-15"
                    onClick={() =>
                      this.trackHeroCta("your_event_amplified", "/about")
                    }
                  >
                    Let’s Get Started <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
                <div className="social-style-two">
                  <a
                    href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
                    onClick={() =>
                      this.trackSocialClick(
                        "your_event_amplified",
                        "facebook",
                        "https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
                      )
                    }
                  >
                    <i className="fab fa-facebook-f" />
                  </a>

                  <a
                    href="https://www.instagram.com/fiesta_pulse"
                    onClick={() =>
                      this.trackSocialClick(
                        "your_event_amplified",
                        "instagram",
                        "https://www.instagram.com/fiesta_pulse"
                      )
                    }
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
                    onClick={() =>
                      this.trackSocialClick(
                        "your_event_amplified",
                        "tiktok",
                        "https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
                      )
                    }
                  >
                    <i className="fab fa-tiktok" />
                  </a>
                </div>
              </div>
            </div>
            <div
              className="slider-image"
              style={{
                backgroundImage: "url(assets/images/services/luces4.jpg)",
              }}
            />
          </div>
        </Slider>

        <div className="slider-arrows">
          <div className="container rel">
            <button className="prev-slider slick-arrow" onClick={this.previous}>
              <i className="fal fa-angle-left" />
            </button>
            <button className="next-slider slick-arrow" onClick={this.next}>
              <i className="fal fa-angle-right" />
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
