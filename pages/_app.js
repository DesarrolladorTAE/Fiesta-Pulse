// src/pages/_app.js
import JeenaHead from "@/src/layout/JeenaHead";
import Preloader from "@/src/layout/Preloader";
import "@/styles/globals.css";
import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// 🔒 Evita SSR del AlertProvider (y de su ToastViewport/portales)
const AlertProvider = dynamic(
  () =>
    import("@/src/components/alerts/AlertProvider").then(
      (m) => m.AlertProvider
    ),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fragment>
      {loading && <Preloader />}
      <JeenaHead />

      {/* ✅ Toda la app dentro del AlertProvider (solo cliente) */}
      <AlertProvider>
        <Component {...pageProps} />
      </AlertProvider>
    </Fragment>
  );
}
