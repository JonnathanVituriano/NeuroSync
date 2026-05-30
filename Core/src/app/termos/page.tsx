import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function Termos() {
  return (
    <div className="min-h-screen bg-brand-light text-brand-graphite font-sans">
      <header className="bg-brand-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-brand-graphite/60 hover:text-brand-blue transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Voltar</span>
          </Link>
          <div className="flex items-center gap-2 text-brand-teal">
            <FileText className="w-5 h-5" />
            <h1 className="font-bold">Termos de Uso</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-brand-white rounded-3xl shadow-xl border border-brand-graphite/5 p-8 md:p-12 space-y-6">
          <h2 className="text-2xl font-black text-brand-blue mb-6">Termos e Condições de Uso</h2>
          
          <p className="text-brand-graphite/80 leading-relaxed text-justify">
            Ao acessar ao aplicativo NeuroSync, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
          </p>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">1. Natureza do Serviço</h3>
          <p className="text-brand-graphite/80 leading-relaxed text-justify">
            O NeuroSync é uma ferramenta educacional baseada em Programação Neuro-Linguística (PNL) desenhada para fornecer insights comportamentais. Os relatórios gerados pelo aplicativo têm caráter informativo e não substituem avaliações psicológicas, psiquiátricas ou médicas profissionais.
          </p>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">2. Conta do Usuário</h3>
          <p className="text-brand-graphite/80 leading-relaxed text-justify">
            Para acessar o histórico e salvar os relatórios permanentemente, é necessário criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem sob sua conta. O fornecimento de dados falsos pode resultar no encerramento imediato do seu acesso. O usuário pode encerrar e excluir sua conta a qualquer momento através da página "Meu Histórico", o que apagará permanentemente todos os registros do sistema.
          </p>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">3. Propriedade Intelectual</h3>
          <p className="text-brand-graphite/80 leading-relaxed text-justify">
            Os materiais contidos no aplicativo (textos, gráficos, questionários, algoritmos) são protegidos por leis de direitos autorais. O usuário recebe permissão apenas para uso pessoal e não comercial do serviço.
          </p>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">4. Precisão dos Resultados</h3>
          <p className="text-brand-graphite/80 leading-relaxed text-justify">
            O mapeamento de perfil é baseado nas respostas fornecidas por você. A precisão dos resultados depende da honestidade e clareza das respostas. O NeuroSync não garante que o resultado represente com exatidão a totalidade do comportamento do indivíduo em todas as situações da vida.
          </p>

          <div className="mt-12 p-4 bg-brand-light rounded-xl text-center text-sm text-brand-graphite/60">
            O uso contínuo de nosso aplicativo será considerado como aceitação de nossas práticas em torno de Termos de Uso e privacidade.
          </div>
        </div>
      </main>
    </div>
  );
}
