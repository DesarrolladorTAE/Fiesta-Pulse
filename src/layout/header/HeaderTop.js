import Link from "next/link";

const HeaderTop = () => {
  return (
    <div className="header-top-wrap bgc-secondary">
      <div className="container-fluid">
        <div className="header-top">
          <div className="text">
            <span className="hello">¡Hola!</span>{" "}
            Somos una lavandería profesional. Deja tu ropa en manos expertas.{" "}
            <Link legacyBehavior href="/contact">
              <a>Contáctanos</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;