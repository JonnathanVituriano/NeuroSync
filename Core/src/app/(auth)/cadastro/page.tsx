"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User as UserIcon, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Save username in users table
        await supabase.from('users').insert([
          { id: data.user.id, username: name, email: email }
        ]);
      }

      router.push("/");
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setError("Este e-mail já está em uso.");
      } else if (err.message?.includes('weak')) {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-teal to-brand-blue flex items-center justify-center shadow-lg">
          <div className="w-5 h-5 rounded-full bg-brand-white opacity-90" />
        </div>
        <h1 className="text-3xl font-black text-brand-blue tracking-tight">NeuroSync</h1>
      </Link>

      <div className="w-full max-w-md bg-brand-white rounded-3xl shadow-xl border border-brand-graphite/5 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-graphite">Criar nova conta</h2>
          <p className="text-brand-graphite/60 mt-2 text-sm">Junte-se a nós e acompanhe sua evolução comportamental.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brand-graphite mb-2">Nome de Usuário</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="w-5 h-5 text-brand-graphite/40" />
              </div>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-light/50 border border-brand-graphite/10 rounded-xl text-brand-graphite placeholder-brand-graphite/30 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                placeholder="Como quer ser chamado?"
              />
            </div>
          </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-light/50 border border-brand-graphite/10 rounded-xl text-brand-graphite placeholder-brand-graphite/30 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                placeholder="Mínimo de 6 caracteres"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-brand-teal hover:bg-brand-teal/90 text-white font-bold rounded-xl shadow-lg shadow-brand-teal/20 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Criando..." : "Criar Conta"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-graphite/10 text-center">
          <p className="text-brand-graphite/60 text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-bold text-brand-blue hover:text-brand-teal transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
