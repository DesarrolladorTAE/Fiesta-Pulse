// src/layout/JeenaHead.jsx
import Head from "next/head";

const SITE_NAME = "Lavandería Premium";
const SITE_URL = "https://lavanderiapremium.com";
const SITE_DESC =
  "Lavado y planchado premium. Agenda tu visita fácilmente por WhatsApp.";

const OG_IMAGE = `${SITE_URL}/assets/images/logos/lol.png`;

export default function JeenaHead({
  title,
  description,
  path = "",
  image,
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const pageDesc = description || SITE_DESC;

  // canonical: por defecto al home o a una ruta
  const canonical = path
    ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
    : SITE_URL;

  const ogImage = image || OG_IMAGE;

  return (
    <Head>
      {/* Básico */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonical} />

      {/* Favicons (opcional si ya los tienes) */}
      <link rel="icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:alt" content={`${SITE_NAME} - Logo`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}