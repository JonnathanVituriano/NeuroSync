"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export function Analytics() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    // Checa a preferência ao montar o componente
    setConsent(localStorage.getItem("cookieConsent"));

    // Fica escutando se o usuário clicou no Banner agorinha
    const handleConsentChange = () => {
      setConsent(localStorage.getItem("cookieConsent"));
    };

    window.addEventListener("cookie_consent_updated", handleConsentChange);
    return () => window.removeEventListener("cookie_consent_updated", handleConsentChange);
  }, []);

  // LGPD: Se não for "accepted", NÃO carrega os scripts do Google
  if (consent !== "accepted") {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-NZXR2CRQ1Y`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NZXR2CRQ1Y', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
