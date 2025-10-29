import Link from "next/link";
import Search from "../Search";
import HeaderTop from "./HeaderTop";
import Menu from "./Menu";

const DefaultHeader = () => {
  return (
    <header className="main-header header-two">
      <HeaderTop />
      {/*Header-Upper*/}
      <div className="header-upper bg-white">
        <div className="container-fluid clearfix">
          <div className="header-inner rel d-flex align-items-center">
            <div className="logo-outer">
              <div className="logo small-logo">
                <Link legacyBehavior href="/">
                  <a>
                    <img
                      src="assets/images/logos/logo-one.png"
                      alt="Logo"
                      title="Logo"
                    />
                  </a>
                </Link>
              </div>
            </div>

            <div className="nav-outer mx-auto clearfix">
              {/* Main Menu */}
              <Menu />
              {/* Main Menu End*/}
            </div>
            {/* Nav Search */}
            {/* <div className="nav-search ms-xl-auto py-10">
              <Search />
            </div> */}
            {/* Menu Button */}

            {/* Header Social */}
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
      </div>
      {/*End Header Upper*/}
    </header>
  );
};
export default DefaultHeader;
