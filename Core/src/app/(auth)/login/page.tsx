"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      router.push("/");
    } catch (err: any) {
      setError("Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-6">
      <Link href="/" className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-teal to-brand-blue flex items-center justify-center shadow-lg">
          <div className="w-5 h-5 rounded-full bg-brand-white opacity-90" />
        </div>
        <h1 className="text-3xl font-black text-brand-blue tracking-tight">NeuroSync</h1>
      </Link>

      <div className="w-full max-w-md bg-brand-white rounded-3xl shadow-xl border border-brand-graphite/5 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-graphite">Bem-vindo de volta</h2>
          <p className="text-brand-graphite/60 mt-2 text-sm">Acesse sua conta para ver seus históricos e relatórios.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brand-graphite mb-2">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-brand-graphite/40" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-light/50 border border-brand-graphite/10 rounded-xl text-brand-graphite placeholder-brand-graphite/30 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-graphite mb-2">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-brand-graphite/40" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-light/50 border border-brand-graphite/10 rounded-xl text-brand-graphite placeholder-brand-graphite/30 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl shadow-lg shadow-brand-blue/20 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar na Conta"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-graphite/10 text-center">
          <p className="text-brand-graphite/60 text-sm">
            Ainda não tem uma conta?{" "}
            <Link href="/cadastro" className="font-bold text-brand-blue hover:text-brand-teal transition-colors">
              Crie agora mesmo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
