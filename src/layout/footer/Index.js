import Link from "next/link";

const Footer = () => {
  return (
    <footer className="main-footer bgc-gray footer-white rel z-1">

      {/* ================= CTA ================= */}
      <div className="footer-cta-wrap">
        <div className="container">
          <div
            className="footer-cta-inner bgs-cover"
            style={{
              backgroundImage: "url(assets/images/footer/lava22.jpg)",
            }}
          >
            <div className="section-title">
              <span className="sub-title" style={{ color: "#fff" }}>
                ¿Necesitas información sobre nuestros servicios?
              </span>
              <h2 style={{ color: "#fff" }}>Estamos listos para cuidar tu ropa.</h2>
            </div>

            <Link legacyBehavior href="/contact">
              <a className="theme-btn style-three">
                Contáctanos <i className="fas fa-long-arrow-right" />
              </a>
            </Link>

            <div className="hotline">
              <i className="fas fa-phone" />
              <div className="content">
                <span style={{ color: "#fff" }}>Teléfono</span>
                <br />
                <a href="tel:7444640535" style={{ color: "#fff" }}>744 464 0535</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Footer Principal ================= */}
      <footer className="fp-footer">
        <div className="container">
          <div className="fp-grid">

            {/* Marca */}
            <div className="fp-card">
              <div className="fp-logo">
                <Link legacyBehavior href="/">
                  <a aria-label="Inicio Lavandería">
                    <img src="assets/images/logos/lol1.png" alt="Logo Lavandería" />
                  </a>
                </Link>
              </div>

              <p className="fp-text">
                Somos una lavandería profesional comprometida con el cuidado de tus prendas.
                Utilizamos maquinaria moderna y productos de alta calidad para garantizar
                limpieza, frescura y un excelente acabado.
              </p>

              <Link legacyBehavior href="/about">
                <a className="fp-cta">
                  Conoce Más Sobre Nosotros <i className="fas fa-long-arrow-right" />
                </a>
              </Link>
            </div>

            {/* Páginas */}
            <div className="fp-card">
              <h4 className="fp-title">Enlaces</h4>
              <ul className="fp-links">
                <li><Link legacyBehavior href="/"><a>Inicio</a></Link></li>
                <li><Link legacyBehavior href="/shop"><a>Tienda</a></Link></li>
                <li><Link legacyBehavior href="/about"><a>Nosotros</a></Link></li>
                <li><Link legacyBehavior href="/contact"><a>Contacto</a></Link></li>
              </ul>
            </div>

          </div>
        </div>

        <style jsx>{`
          .fp-footer {
            position: relative;
            padding: 60px 0 40px;
            color: #d7dde3;
          }

          .fp-grid {
            display: grid;
            grid-template-columns: 1.2fr .8fr;
            gap: 48px;
            align-items: start;
          }

          @media (max-width: 992px) {
            .fp-grid { grid-template-columns: 1fr; gap: 36px; }
          }

          .fp-logo img {
            height: 106px;
            margin-bottom: 18px;
          }

          .fp-text {
            line-height: 1.75;
            font-size: 15.5px;
            color: #cbd5e1;
            margin: 0 0 16px;
            max-width: 520px;
          }

          .fp-cta {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            color: #8fd3ff;
            transition: .2s;
          }

          .fp-cta:hover { color: #b4e3ff; }

          .fp-title {
            font-size: 18px;
            font-weight: 700;
            color: #ffffff;
            margin: 6px 0 14px;
          }

          .fp-links {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            gap: 10px;
          }

          .fp-links a {
            color: #d7dde3;
            text-decoration: none;
            transition: .2s;
          }

          .fp-links a:hover {
            color: #ffffff;
          }
        `}</style>
      </footer>

      {/* ================= Footer Bottom ================= */}
      <div className="footer-bottom bgc-black mt-20 pt-20">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12 text-center">
              <div className="copyright-text">
                <p>
                  © {new Date().getFullYear()} <strong>Lavandería Premium / MiTiendaEnLineaMX</strong>.
                  Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;