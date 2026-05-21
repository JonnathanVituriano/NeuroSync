"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, History, FileText, ArrowRight, Trash2 } from "lucide-react";

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const setAnswers = useAssessmentStore((state) => state.setAnswers);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('history')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (data) setHistory(data);
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    };

    fetchHistory();
  }, [user, loading, router]);

  const loadOldResult = (answers: any) => {
    // Carrega as respostas antigas na loja e manda pra página de resultado que vai calcular tudo na hora!
    setAnswers(answers);
    router.push("/resultado");
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Tem certeza absoluta? Isso apagará todos os seus testes e seu acesso permanentemente. Essa ação não pode ser desfeita.");
    if (!confirm) return;

    setDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      
      await supabase.auth.signOut();
      router.push("/");
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir a conta. Certifique-se de que a função SQL foi criada no Supabase.");
      setDeleting(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light text-brand-graphite font-sans">
      <header className="bg-brand-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-brand-graphite/60 hover:text-brand-blue transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Voltar para Home</span>
          </Link>
          <div className="flex items-center gap-2 text-brand-blue">
            <History className="w-5 h-5" />
            <h1 className="font-bold">Meu Histórico</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-brand-white rounded-3xl shadow-xl border border-brand-graphite/5 p-8">
          <h2 className="text-2xl font-bold mb-6">Testes Anteriores</h2>
          
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-brand-graphite/30" />
              </div>
              <p className="text-brand-graphite/60 font-medium">Nenhum teste encontrado em seu histórico.</p>
              <Link href="/questionario" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-brand-blue text-white rounded-full font-bold shadow hover:bg-brand-blue/90 transition-all">
                Iniciar meu primeiro teste
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => {
                const data = new Date(item.date);
                const formatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
                const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                return (
                  <button 
                    key={item.id}
                    onClick={() => loadOldResult(item.answers)}
                    className="w-full text-left p-5 rounded-2xl border border-brand-light hover:border-brand-blue/30 hover:bg-brand-light/20 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-blue">Avaliação #{history.length - index}</h3>
                        <p className="text-sm text-brand-graphite/60">Realizada em {formatada} às {hora}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-brand-graphite/30 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Zona de Perigo */}
        <div className="mt-16 pt-8 border-t border-brand-graphite/10 flex flex-col items-center text-center">
          <h3 className="text-lg font-bold text-brand-graphite mb-2">Zona de Perigo</h3>
          <p className="text-sm text-brand-graphite/60 mb-6 max-w-md">
            Ao excluir sua conta, todos os seus dados e históricos de testes serão permanentemente apagados dos nossos servidores.
          </p>
          <button 
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-full font-bold transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
            {deleting ? "Excluindo..." : "Excluir Minha Conta"}
          </button>
        </div>
      </main>
    </div>
  );
}
