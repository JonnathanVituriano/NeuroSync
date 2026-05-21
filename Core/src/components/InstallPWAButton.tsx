"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verifica se já está rodando como app (standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Captura o evento de instalação que o navegador dispara
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previne que o mini-info bar padrão apareça em alguns navegadores
      e.preventDefault();
      // Salva o evento para usarmos no click do botão
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Limpa o botão caso o usuário instale
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Se o prompt não estiver pronto ou se já estiver instalado, não mostramos nada.
  if (!deferredPrompt || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Dispara o popup nativo de instalação
      deferredPrompt.prompt();
      // Aguarda o usuário aceitar ou recusar
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-full text-sm font-medium shadow-md shadow-brand-blue/20 hover:opacity-90 active:scale-95 transition-all"
    >
      <Download size={16} />
      Instalar App
    </button>
  );
}
