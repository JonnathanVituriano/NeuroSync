"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Info } from "lucide-react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Verifica se já existe preferência salva
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShow(false);
    // Dispara evento para o componente Analytics capturar na hora
    window.dispatchEvent(new Event("cookie_consent_updated"));
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShow(false);
    window.dispatchEvent(new Event("cookie_consent_updated"));
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-brand-white border-t border-brand-graphite/10 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] p-4 sm:p-5 transform transition-transform animate-in slide-in-from-bottom-10">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-brand-teal shrink-0 mt-0.5 hidden sm:block" />
          <p className="text-sm text-brand-graphite/80 leading-relaxed text-justify sm:text-left">
            Utilizamos cookies essenciais e de análise para melhorar sua experiência. 
            Ao clicar em "Aceitar", você concorda com o uso de cookies de rastreamento (Google Analytics). 
            Leia nossa <Link href="/privacidade" className="text-brand-teal hover:underline font-bold">Política de Privacidade</Link>.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={handleReject}
            className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-semibold text-brand-graphite/60 hover:text-brand-graphite bg-brand-light rounded-xl transition-colors border border-brand-graphite/10"
          >
            Recusar
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-white bg-brand-teal hover:bg-teal-500 rounded-xl shadow-md transition-colors"
          >
            Aceitar Todos
          </button>
        </div>

      </div>
    </div>
  );
}
