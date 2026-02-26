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
          {/* ===== Slide 1 ===== */}
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Bienvenido a Lavandería Premium</span>
                <h2>Ropa impecable, como nueva</h2>
                <Link legacyBehavior href="/shop">
                  <a
                    className="theme-btn mt-15"
                    style={{ color: "#fff" }}
                  >
                    Ver Ahora <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
              </div>
            </div>
            <div
              className="slider-image"
              style={{ backgroundImage: "url(assets/images/services/lav3.avif)" }}
            />
          </div>

          {/* ===== Slide 2 ===== */}
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Lavado, secado y doblado</span>
                <h2>Entrega rápida y con calidad</h2>
                <Link legacyBehavior href="/shop">
                  <a
                    className="theme-btn mt-15"
                    style={{ color: "#fff" }}
                  >
                    Ver ahora <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
              </div>
            </div>
            <div
              className="slider-image"
              style={{ backgroundImage: "url(assets/images/services/lav1.jpeg)" }}
            />
          </div>

          {/* ===== Slide 3 ===== */}
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Cuidado especial para tus prendas</span>
                <h2>Delicados, blancos y colores</h2>
                <Link legacyBehavior href="/shop">
                  <a
                    className="theme-btn mt-15"
                    style={{ color: "#fff" }}
                  >
                    Ver Ahora <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
              </div>
            </div>
            <div
              className="slider-image"
              style={{ backgroundImage: "url(assets/images/services/lav9.webp)" }}
            />
          </div>

          {/* ===== Slide 4 ===== */}
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Planchado y presentación</span>
                <h2>Listo para usar, sin arrugas</h2>
                <Link legacyBehavior href="/shop">
                  <a
                    className="theme-btn mt-15"
                    style={{ color: "#fff" }}
                  >
                    Ver Ahora <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
              </div>
            </div>
            <div
              className="slider-image"
              style={{ backgroundImage: "url(assets/images/services/lav6.avif)" }}
            />
          </div>

          {/* ===== Slide 5 ===== */}
          <div className="slider-item-two">
            <div className="container">
              <div className="slide-content">
                <span className="sub-title">Servicio a domicilio</span>
                <h2>Recogemos y entregamos por ti</h2>
                <Link legacyBehavior href="/about">
                  <a
                    className="theme-btn mt-15"
                    style={{ color: "#fff" }}
                  >
                    Ver Ahora <i className="fas fa-long-arrow-right" />
                  </a>
                </Link>
              </div>
            </div>
            <div
              className="slider-image"
              style={{ backgroundImage: "url(assets/images/services/lav2.jpg)" }}
            />
          </div>
        </Slider>

        <div className="slider-arrows">
          <div className="container rel">
            <button className="prev-slider slick-arrow" onClick={this.previous} title="Anterior">
              <i className="fal fa-angle-left" />
            </button>
            <button className="next-slider slick-arrow" onClick={this.next} title="Siguiente">
              <i className="fal fa-angle-right" />
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}