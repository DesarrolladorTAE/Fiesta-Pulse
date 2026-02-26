import Layout from "@/layout";
import Hero4Slider from "@/src/components/slider/Hero4Slider";
import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";

const Index4 = () => {
  return (
    <Layout header={4}>
      
      {/* Slider */}
      <Hero4Slider />

      {/* ================= Servicios ================= */}
      <section className="about-area-four pt-25 rpt-0 rel z-2">
        <div className="container">
          <div className="row align-items-center">
            
            <div className="col-xl-6">
              <div className="about-four-image rel z-1 mb-65">
                <div className="about-circle">
                  <img
                    src="assets/images/about/about-circle.png"
                    alt="Lavandería"
                  />
                </div>
              </div>
            </div>

            <div className="col-xl-6 col-lg-10">
              <div className="about-four-content mb-65 rel z-1">
                
                <div className="section-title mb-50">
                  <span className="sub-title mb-15">Nuestros Servicios</span>
                  <h2>Lavado Profesional en Nuestro Local</h2>
                  <span className="bg-text">Servicios</span>
                </div>

                <Tab.Container defaultActiveKey={"about-tap1"}>
                  <Nav as={"ul"} className="nav nav-pills nav-fill mb-35">
                    
                    <li className="nav-item">
                      <Nav.Link eventKey="about-tap1">
                        Lavado & Secado
                      </Nav.Link>
                    </li>

                    <li className="nav-item">
                      <Nav.Link eventKey="about-tap2">
                        Planchado
                      </Nav.Link>
                    </li>

                    <li className="nav-item">
                      <Nav.Link eventKey="about-tap3">
                        Cuidado Especial
                      </Nav.Link>
                    </li>

                  </Nav>

                  <Tab.Content>

                    {/* TAB 1 */}
                    <Tab.Pane eventKey="about-tap1">
                      <p>
                        Ofrecemos lavado profesional en nuestras instalaciones
                        con maquinaria moderna y productos de alta calidad.
                      </p>

                      <ul className="list-style-one my-30">
                        <li>Lavado por carga o por kilo</li>
                        <li>Secado profesional</li>
                        <li>Separación por colores</li>
                        <li>Eliminación de manchas difíciles</li>
                      </ul>

                      <Link legacyBehavior href="/contact">
                        <a className="theme-btn mt-10" style={{ color: "#fff" }}>
                          Visítanos <i className="fas fa-long-arrow-right" />
                        </a>
                      </Link>
                    </Tab.Pane>

                    {/* TAB 2 */}
                    <Tab.Pane eventKey="about-tap2">
                      <p>
                        Servicio de planchado profesional para que tu ropa
                        quede impecable y lista para usar.
                      </p>

                      <ul className="list-style-one my-30">
                        <li>Planchado tradicional</li>
                        <li>Ropa formal y uniformes</li>
                        <li>Camisas y pantalones</li>
                        <li>Entrega organizada y doblada</li>
                      </ul>

                      <Link legacyBehavior href="/contact">
                        <a className="theme-btn mt-10" style={{ color: "#fff" }}>
                          Más Información <i className="fas fa-long-arrow-right" />
                        </a>
                      </Link>
                    </Tab.Pane>

                    {/* TAB 3 */}
                    <Tab.Pane eventKey="about-tap3">
                      <p>
                        Tratamos prendas delicadas con cuidado especial,
                        respetando cada tipo de tela y sus necesidades.
                      </p>

                      <ul className="list-style-one my-30">
                        <li>Ropa delicada</li>
                        <li>Trajes y vestidos</li>
                        <li>Telas finas</li>
                        <li>Tratamiento personalizado</li>
                      </ul>
                    </Tab.Pane>

                  </Tab.Content>
                </Tab.Container>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Proceso ================= */}
      <section className="work-process-area-two pt-130 pb-100 rpt-100 rpb-70 rel z-1">

        <div className="section-title text-center mb-70">
          <span className="sub-title mb-15">Cómo Funciona</span>
          <h2>Proceso Simple en Nuestro Local</h2>
          <span className="bg-text">Proceso</span>
        </div>

        <div className="container">
          <div className="row gap-50 justify-content-center">

            {/* Paso 1 */}
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="work-process-item-two mt-40">
                <div className="image">
                  <img src="assets/images/work-process/process1.png" alt="Trae tu ropa" />
                  <div className="number">01</div>
                </div>
                <div className="content">
                  <h5>Trae tu Ropa</h5>
                  <p>Visítanos y entrega tus prendas en el mostrador.</p>
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="work-process-item-two">
                <div className="image">
                  <img src="assets/images/work-process/process2.png" alt="Clasificación" />
                  <div className="number">02</div>
                </div>
                <div className="content">
                  <h5>Clasificación</h5>
                  <p>Separamos tus prendas según tipo y color.</p>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="work-process-item-two mt-20">
                <div className="image">
                  <img src="assets/images/work-process/process3.png" alt="Lavado" />
                  <div className="number">03</div>
                </div>
                <div className="content">
                  <h5>Lavado Profesional</h5>
                  <p>Utilizamos maquinaria moderna y productos de calidad.</p>
                </div>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="work-process-item-two">
                <div className="image">
                  <img src="assets/images/work-process/process4.png" alt="Recoge tu ropa" />
                  <div className="number">04</div>
                </div>
                <div className="content">
                  <h5>Recoge tu Ropa</h5>
                  <p>Pasa por tus prendas limpias y listas para usar.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Index4;