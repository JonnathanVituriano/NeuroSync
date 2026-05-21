"use client";

import { ArrowRight, Brain, Target, ShieldAlert, Sparkles, CheckSquare, Settings, LogIn, History, User as UserIcon, ClipboardList, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function Home() {
  const router = useRouter();
  const resetAssessment = useAssessmentStore((state) => state.resetAssessment);
  const { user, username, logout } = useAuth();

  return (
    <div className="min-h-screen bg-brand-white text-brand-graphite font-sans">
      <header className="pt-10 pb-6 px-4 md:px-6 flex flex-wrap justify-between items-center bg-brand-white sticky top-0 z-10 gap-y-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-brand-teal to-brand-blue flex items-center justify-center shadow-md shrink-0">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-brand-white opacity-90" />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-brand-blue tracking-tight">NeuroSync</h1>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {user ? (
            <>
              <Link href="/historico" className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-brand-blue bg-brand-blue/10 rounded-full hover:bg-brand-blue/20 transition-colors">
                <History className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Histórico</span>
              </Link>
              <div className="flex items-center bg-brand-light rounded-full border border-brand-graphite/10 shadow-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-brand-graphite border-r border-brand-graphite/10">
                  <UserIcon className="w-4 h-4 shrink-0" />
                  <span className="max-w-[80px] sm:max-w-[150px] truncate">{username || user.email?.split('@')[0]}</span>
                </div>
                <button onClick={logout} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-r-full transition-colors" title="Sair da conta">
                  <LogOut className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-brand-blue rounded-full shadow hover:bg-brand-blue/90 hover:shadow-md transition-all">
              <LogIn className="w-4 h-4" />
              Entrar
            </Link>
          )}
          
          {/* Renderiza o botão de instalação apenas quando disponível */}
          <InstallPWAButton />
        </div>
      </header>

      <main className="px-6 pt-6 flex flex-col gap-8">
        <section className="bg-brand-light rounded-[32px] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-teal/15 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold mb-3 leading-tight text-brand-blue">
            Descubra o seu <br /> Perfil Comportamental
          </h2>
          <p className="text-brand-graphite/80 font-light mb-8 text-base">
            Conheça a si mesmo para dominar suas estratégias de carreira, relacionamentos e finanças.
          </p>
          
          {/* CTA Principal indo para o Questionário */}
          <Link href="/questionario" className="w-full bg-brand-teal text-white px-7 py-4 rounded-2xl font-medium shadow-xl shadow-brand-teal/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <ClipboardList size={20} />
            Iniciar Avaliação Gratuita
          </Link>
        </section>
      </main>
    </div>
  );
}
