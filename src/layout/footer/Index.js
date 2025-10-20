import Link from "next/link";

const Footer = () => {
  return (
    <footer className="main-footer bgc-gray footer-white rel z-1">
      <div className="footer-cta-wrap">
        <div className="container">
          <div
            className="footer-cta-inner bgs-cover"
            style={{
              backgroundImage: "url(assets/images/footer/footer-cta-bg.jpg)",
            }}
          >
            <div className="section-title wow fadeInLeft delay-0-2s">
              <span className="sub-title">Do you need any Consultation or Quote ?</span>
              <h2>We’re Ready for Growth in your Events.</h2>
            </div>
            <Link legacyBehavior href="/contact">
              <a className="theme-btn style-three wow fadeInRight delay-0-2s">
                Get a Quote <i className="fas fa-long-arrow-right" />
              </a>
            </Link>
            <div className="hotline wow fadeInRight delay-0-2s">
              <i className="fas fa-phone" />
              <div className="content">
                <span>Hotline</span>
                <br />
                <a href="tel:+13235078749">+1 (323) 507-8749</a>
              </div>
            </div>

          </div>
        </div>
      </div>
<footer className="fp-footer">
  <div className="container">
    <div className="fp-grid">
      {/* About / Brand */}
      <div className="fp-card wow fadeInUp delay-0-2s">
        <div className="fp-logo">
          <Link legacyBehavior href="/">
            <a aria-label="Fiesta Pulse Home">
              <img src="assets/images/logos/logo-one.png" alt="Fiesta Pulse Logo" />
            </a>
          </Link>
        </div>

        <p className="fp-text">
          Fiesta Pulse elevates every event with professional sound, spectacular lighting,
          and immersive special effects. We empower DJs, producers, and event decor stores
          with technology that transforms any space into a vibrant experience.
        </p>

        <Link legacyBehavior href="/about">
          <a className="fp-cta">
            Learn More About Us <i className="fas fa-long-arrow-right" />
          </a>
        </Link>
      </div>

      {/* Pages */}
      <div className="fp-card wow fadeInUp delay-0-4s">
        <h4 className="fp-title">Pages</h4>
        <ul className="fp-links">
          <li>
            <Link legacyBehavior href="/"><a>Home</a></Link>
          </li>
          <li>
            <Link legacyBehavior href="/shop"><a>Shop</a></Link>
          </li>
          <li>
            <Link legacyBehavior href="/about"><a>About Us</a></Link>
          </li>
          <li>
            <Link legacyBehavior href="/contact"><a>Contact Us</a></Link>
          </li>
        </ul>
      </div>
    </div>
  </div>

  {/* Estilos en el mismo bloque */}
  <style jsx>{`
    .fp-footer {
      position: relative;
      padding: 60px 0 40px;
      // background: radial-gradient(1400px 700px at 80% 120%, rgba(56,182,255,.12), transparent 60%) #0b0e13;
      color: #d7dde3;
      overflow: hidden;
    }

    .fp-grid {
      display: grid;
      grid-template-columns: 1.2fr .8fr; /* 2 columnas */
      gap: 48px;
      align-items: start;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .fp-grid { grid-template-columns: 1fr; gap: 36px; }
    }

    .fp-card { min-width: 0; }

    .fp-logo img {
      height: 106px;
      width: auto;
      display: block;
      margin-bottom: 18px;
      // filter: drop-shadow(0 2px 10px rgba(0,0,0,.25));}
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
      text-underline-offset: 3px;
      transition: transform .18s ease, color .18s ease;
    }
    .fp-cta:hover { color: #b4e3ff; transform: translateX(2px); }

    .fp-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin: 6px 0 14px;
      letter-spacing: .3px;
    }

    .fp-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 10px;
    }

    .fp-links a {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      color: #d7dde3;
      text-decoration: none;
      transition: color .18s ease, transform .18s ease;
    }

    /* Bullet/chevron con pseudo-elemento */
    .fp-links a::before {
      content: "›";
      display: inline-block;
      font-size: 16px;
      color: #5ec8ff;
      transform: translateY(-1px);
      opacity: .85;
      transition: transform .18s ease;
    }

    .fp-links a:hover {
      color: #ffffff;
      transform: translateX(2px);
    }
    .fp-links a:hover::before { transform: translate(2px, -1px); }
  `}</style>
</footer>

<div className="footer-bottom bgc-black mt-20 pt-20">
  <div className="container">
    <div className="row align-items-center">
      <div className="col-lg-8"></div>

      <div className="col-lg-4">
        <div className="copyright-text text-lg-end wow fadeInLeft delay-0-2s">
          <p>
            © 2025 <strong>Fiesta Pulse</strong>. All rights reserved. <br />
            Developed by{" "}
            <a
              href="https://tecnologiasadministrativas.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#5ec8ff", textDecoration: "none", fontWeight: "600" }}
            >
              TAE
            </a>{" "}
            | {" "}
            <a
              href="https://mitiendaenlineamx.com.mx/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#5ec8ff", textDecoration: "none", fontWeight: "600" }}
            >
              MiTiendaEnLineaMX
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="footer-shapes">
        <img
          className="shape one"
          src="assets/images/footer/footer-bg-weve-shape.png"
          alt="Shape"
        />
        <img
          className="shape two"
          src="assets/images/footer/footer-bg-line-shape.png"
          alt="Shape"
        />
        <img
          className="shape three wow fadeInRight delay-0-8s"
          src="assets/images/footer/footer-right.png"
          alt="Shape"
        />
      </div>
    </footer>
  );
};
export default Footer;
