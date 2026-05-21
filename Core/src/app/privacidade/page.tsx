import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-brand-light text-brand-graphite font-sans">
      <header className="bg-brand-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-brand-graphite/60 hover:text-brand-blue transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Voltar</span>
          </Link>
          <div className="flex items-center gap-2 text-brand-teal">
            <Shield className="w-5 h-5" />
            <h1 className="font-bold">Política de Privacidade</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-brand-white rounded-3xl shadow-xl border border-brand-graphite/5 p-8 md:p-12 space-y-6">
          <h2 className="text-2xl font-black text-brand-blue mb-6">Política de Privacidade do NeuroSync</h2>
          
          <p className="text-brand-graphite/80 leading-relaxed text-justify">
            A sua privacidade é importante para nós. É política do NeuroSync respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no aplicativo NeuroSync.
          </p>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">1. Coleta de Dados</h3>
          <p className="text-brand-graphite/80 leading-relaxed text-justify">
            Solicitamos informações pessoais, como nome de usuário e e-mail, apenas quando realmente precisamos delas para lhe fornecer nossos serviços de mapeamento de perfil comportamental e histórico de testes. A coleta é feita por meios justos e legais, com o seu conhecimento e consentimento.
          </p>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">2. Uso e Armazenamento dos Dados</h3>
          <p className="text-brand-graphite/80 leading-relaxed text-justify">
            Os dados coletados (incluindo e-mail e respostas do questionário) são armazenados em um banco de dados seguro na nuvem com criptografia moderna. Utilizamos essas informações exclusivamente para:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-brand-graphite/80 mt-2">
            <li>Autenticar seu acesso à plataforma.</li>
            <li>Gerar relatórios personalizados do seu perfil comportamental.</li>
            <li>Manter um histórico da sua evolução.</li>
          </ul>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">3. Compartilhamento de Informações</h3>
          <p className="text-brand-graphite/80 leading-relaxed text-justify">
            Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei. O NeuroSync não vende, aluga ou comercializa seus dados pessoais.
          </p>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">4. Seus Direitos</h3>
          <p className="text-brand-graphite/80 leading-relaxed text-justify">
            Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer o serviço de mapeamento de perfil. A qualquer momento, você pode solicitar a exclusão da sua conta e de todos os dados associados entrando em contato conosco.
          </p>

          <div className="mt-12 p-4 bg-brand-light rounded-xl text-center text-sm text-brand-graphite/60">
            Última atualização: Maio de 2026. Ao utilizar o NeuroSync, você concorda com o uso de suas informações conforme descrito nesta política.
          </div>
        </div>
      </main>
    </div>
  );
}
