import Counter from "@/src/components/Counter";
import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layout/Layout";
import Link from "next/link";

const About = () => {
  return (
    <Layout>
      <PageBanner
        pageName="Sobre Nosotros"
        description="Conoce Lavandería Premium. Comprometidos con la calidad, el cuidado de tus prendas y un servicio excepcional."
        path="/sobre-nosotros"
      />

      {/* ================= About ================= */}
      <section className="about-area-five py-130 rpt-100 rpb-65 rel z-1">
        <div className="container">
          <div className="row align-items-center gap-100">

            <div className="col-lg-6">
              <div className="about-five-images mt-55 rel z-1">
                <img src="assets/images/services/lll.avif" alt="Lavandería Premium" />
                <img src="assets/images/services/lav10.webp" alt="Lavandería Premium" />
                <div className="experience-years">
                  <span className="years" style={{ color: "#fff" }}>5</span>
                  <h4 style={{ color: "#fff" }}>Años Cuidando Tus Prendas</h4>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-content mt-55 rel z-1">
                <div className="section-title mb-60 rmb-40">
                  <span className="sub-title mb-15">Sobre Nosotros</span>
                  <h2>
                    Lavandería Premium con Calidad, Confianza y Profesionalismo
                  </h2>
                </div>

                <div className="row gap-40">

                  <div className="col-md-6">
                    <div className="service-item style-three">
                      <div className="icon">
                        <i className="flaticon-trophy" />
                      </div>
                      <h4>Calidad Garantizada</h4>
                      <p>
                        Utilizamos maquinaria moderna y productos de alta calidad
                        para garantizar el mejor cuidado de tus prendas.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="service-item style-three">
                      <div className="icon">
                        <i className="flaticon-pie-chart" />
                      </div>
                      <h4>Atención Personalizada</h4>
                      <p>
                        Tratamos cada prenda con cuidado especial,
                        asegurando limpieza profunda y excelente acabado.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= Servicios Destacados ================= */}
      <section className="services-area-six pb-100 rpb-70 rel z-1">
        <div className="container">
          <div className="row">

            <div className="col-lg-4 col-md-6">
              <div className="service-item-six">
                <div className="icon">
                  <i className="flaticon-agile" />
                </div>
                <h4>Lavado Profesional</h4>
                <p>
                  Separación por colores, eliminación de manchas
                  y procesos que cuidan cada tipo de tela.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="service-item-six">
                <div className="icon">
                  <i className="flaticon-mission" />
                </div>
                <h4>Planchado Impecable</h4>
                <p>
                  Servicio profesional para camisas, uniformes,
                  ropa formal y prendas delicadas.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="service-item-six">
                <div className="icon">
                  <i className="flaticon-mission-1" />
                </div>
                <h4>Compromiso y Confianza</h4>
                <p>
                  Entrega puntual y trato responsable.
                  Tu ropa está en buenas manos.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= Estadísticas ================= */}
      <section className="statistics-area-two rel z-2">
        <div className="container">
          <div
            className="statistics-inner style-two bgs-cover text-white p-80 pb-20"
            style={{
              backgroundImage: "url(assets/images/services/lal.avif)",
            }}
          >
            <div className="row">

              <div className="col-xl-5 col-lg-6">
                <div className="statistics-content mb-55">
                  <div className="section-title mb-30">
                    <span className="sub-title mb-15">Nuestra Trayectoria</span>
                    <h2>Resultados que Nos Respaldan</h2>
                  </div>
                </div>
              </div>

              <div className="col-xl-7 col-lg-6">
                <div className="row">

                  <div className="col-6 col-xl-4">
                    <div className="counter-item-modern">
                      <div className="icon-circle">
                        <i className="flaticon-target" />
                      </div>
                      <h2>
                        <Counter end={3500} />+
                      </h2>
                      <p>Prendas Lavadas</p>
                    </div>
                  </div>

                  <div className="col-6 col-xl-4">
                    <div className="counter-item-modern">
                      <div className="icon-circle">
                        <i className="flaticon-target-audience" />
                      </div>
                      <h2>
                        <Counter end={98.5} decimals="1" />%
                      </h2>
                      <p>Clientes Satisfechos</p>
                    </div>
                  </div>

                  <div className="col-6 col-xl-4">
                    <div className="counter-item-modern">
                      <div className="icon-circle">
                        <i className="flaticon-customer-experience" />
                      </div>
                      <h2>
                        <Counter end={5} />+
                      </h2>
                      <p>Años de Experiencia</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= Por Qué Elegirnos ================= */}
      <section className="why-choose-us-area py-130 rpy-100 rel z-1">
        <div className="container">
          <div className="section-title text-center mb-45">
            <span className="sub-title mb-15">¿Por Qué Elegirnos?</span>
            <h2>
              Calidad, puntualidad y atención personalizada en cada servicio.
            </h2>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default About;