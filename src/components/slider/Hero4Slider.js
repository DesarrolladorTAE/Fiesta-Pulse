import { sliderTwoActive } from "@/src/sliderProps";
import Link from "next/link";
import { Component, Fragment } from "react";
import Slider from "react-slick";

export default class Hero4Slider extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }
  render() {
    return (
      <Fragment>
        <Slider
          {...sliderTwoActive}
          ref={(c) => (this.slider = c)}
          className="slider-two-active"
        >
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Welcome to Fiesta Pulse</span>
                <h2>Sound, Lights and Action</h2>
                <Link legacyBehavior href="/shop">
                  <a className="theme-btn mt-15">
                    Let’s Get Started <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
                            <div className="social-style-two">
              <a href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL">
                <i className="fab fa-facebook-f" />
              </a>

              <a href="https://www.instagram.com/fiesta_pulse">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1">
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
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Welcome to Fiesta Pulse</span>
                <h2>Fuel the Night</h2>
                <Link legacyBehavior href="/shop">
                  <a className="theme-btn mt-15">
                    Let’s Get Started <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
                            <div className="social-style-two">
              <a href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL">
                <i className="fab fa-facebook-f" />
              </a>

              <a href="https://www.instagram.com/fiesta_pulse">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1">
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
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Welcome to Fiesta Pulse</span>
                <h2>Light It. Sound It. Own It</h2>
                <Link legacyBehavior href="/shop">
                  <a className="theme-btn mt-15">
                    Let’s Get Started <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
                            <div className="social-style-two">
              <a href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL">
                <i className="fab fa-facebook-f" />
              </a>

              <a href="https://www.instagram.com/fiesta_pulse">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1">
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
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Welcome to Fiesta Pulse</span>
                <h2>Built for DJs. Ready for Events.</h2>
                <Link legacyBehavior href="/shop">
                  <a className="theme-btn mt-15">
                    Let’s Get Started <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
                            <div className="social-style-two">
              <a href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL">
                <i className="fab fa-facebook-f" />
              </a>

              <a href="https://www.instagram.com/fiesta_pulse">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1">
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
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Welcome to Fiesta Pulse</span>
                <h2>Your Event, Amplified</h2>
                <Link legacyBehavior href="/about">
                  <a className="theme-btn mt-15">
                    Let’s Get Started <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
                            <div className="social-style-two">
              <a href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL">
                <i className="fab fa-facebook-f" />
              </a>

              <a href="https://www.instagram.com/fiesta_pulse">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1">
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
