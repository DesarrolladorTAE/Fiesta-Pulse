import Link from "next/link";
import { useState } from "react";
import { Accordion } from "react-bootstrap";

import { Fragment } from "react";
const Menu = () => {
  return (
    <Fragment>
      <DeskTopMenu />
      <MobileMenu />
    </Fragment>
  );
};

const MobileMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const active = (value) => setActiveMenu(value === activeMenu ? null : value),
    activeSubMenu = (value) =>
      value == activeMenu ? { display: "block" } : { display: "none" };
  return (
    <nav className="main-menu navbar-expand-lg mobile-menu">
      <Accordion>
        <div className="navbar-header">
          <div className="mobile-logo">
            <Link href="/">
              <img
                src="assets/images/logos/logo-one.png"
                alt="Logo"
                title="Logo"
              />
            </Link>
          </div>
          {/* Toggle Button */}
          <Accordion.Toggle
            as={"button"}
            type="button"
            className="navbar-toggle"
            eventKey="collapse"
            data-bs-target=".navbar-collapse"
          >
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </Accordion.Toggle>

        </div>
<Accordion.Collapse
  eventKey="collapse"
  className="navbar-collapse clearfix"
>
  <div>
    <ul className="navigation clearfix">
      <li><Link href="/">Home</Link></li>
      <li><Link href="/shop">Shop</Link></li>
      {/* <li><Link href="/product-details">Product Details</Link></li> */}
      {/* <li><Link href="/cart">Cart</Link></li> */}
      {/* <li><Link href="/checkout">Checkout</Link></li> */}
      <li><Link href="/about">About us</Link></li>
      <li><Link href="/contact">Contact us</Link></li>
      {/* <li><Link href="/404">404 error</Link></li> */}
    </ul>

    {/* Socials (móvil) */}
    <div className="social-style-two mobile-socials">
      <a
        href="https://www.facebook.com/profile.php?id=61580899012055&mibextid=ZbWKwL"
        target="_blank" rel="noopener noreferrer" aria-label="Facebook"
      >
        <i className="fab fa-facebook-f" />
      </a>
      <a
        href="https://www.instagram.com/fiesta_pulse"
        target="_blank" rel="noopener noreferrer" aria-label="Instagram"
      >
        <i className="fab fa-instagram" />
      </a>
      <a
        href="https://www.tiktok.com/@fiestapulse?_t=ZT-90BrmVBJPzi&_r=1"
        target="_blank" rel="noopener noreferrer" aria-label="TikTok"
      >
        <i className="fab fa-tiktok" />
      </a>
    </div>
  </div>
</Accordion.Collapse>


      </Accordion>

    </nav>

  );

};
const DeskTopMenu = () => {
  return (
    <nav className="main-menu navbar-expand-lg desktop-menu">
      <div className="navbar-header">
        <div className="mobile-logo">
          <Link href="/">
            <img
              src="assets/images/logos/logo-one.png"
              alt="Logo"
              title="Logo"
            />
          </Link>
        </div>
        {/* Toggle Button */}
        <button
          type="button"
          className="navbar-toggle"
          data-bs-toggle="collapse"
          data-bs-target=".navbar-collapse"
        >
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
      </div>
      <div className="navbar-collapse collapse clearfix">
        <ul className="navigation clearfix">
          <li>
            <Link href="/">Home</Link>
          </li>

          <li><Link href="/shop">Shop</Link></li>
          {/* <li><Link href="/product-details">Product Details</Link></li> */}
          {/* <li><Link href="/cart">Cart</Link></li> */}
          {/* <li><Link href="/checkout">Checkout</Link></li> */}
          <li><Link href="/about">About us</Link></li>
          <li><Link href="/contact">Contact us</Link></li>
          {/* <li><Link href="/404">404 error</Link></li> */}
        </ul>

      </div>

    </nav>
  );
};
export default Menu;
