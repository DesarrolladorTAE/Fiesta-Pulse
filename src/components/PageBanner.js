import Link from "next/link";
import Head from "next/head";

const SITE_NAME = "Lavandería Premium";
const SITE_URL = "https://lavanderiapremium.com";
const DEFAULT_DESC =
  "Lavado y planchado premium. Agenda fácilmente por WhatsApp.";

const DEFAULT_IMAGE = `${SITE_URL}/assets/images/logos/lol.png`;

const PageBanner = ({
  pageName,
  pageTitle,
  description,
  path,
  image,
}) => {
  const title = pageTitle ? pageTitle : pageName;
  const fullTitle = `${title} | ${SITE_NAME}`;
  const metaDesc = description || DEFAULT_DESC;
  const canonical = path ? `${SITE_URL}${path}` : SITE_URL;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <>
      {/* ✅ SEO dinámico */}
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      {/* Banner visual */}
      <section
        className="page-banner-area bgs-cover py-135 rpy-100"
        style={{ backgroundImage: "url(/assets/images/background/banner.jpg)" }}
      >
        <div className="container">
          <div className="banner-inner text-white text-center">
            <h1 className="page-title wow fadeInUp delay-0-2s animated">
              {title}
            </h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center mb-5 wow fadeInUp delay-0-4s animated">
                <li className="breadcrumb-item">
                  <Link legacyBehavior href="/">
                    <a>Inicio</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">{pageName}</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
};

export default PageBanner;