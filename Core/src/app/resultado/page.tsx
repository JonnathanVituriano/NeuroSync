"use client";

import { Target, Share2, RefreshCcw, ShieldAlert, Sparkles, Brain, CheckSquare, Square, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useMemo, useRef } from "react";
import { questionsData } from "@/data/questions";
import { profilesData } from "@/data/profiles";
import { practiceChecklist } from "@/data/practice";
import { interpretationsData, pnlStrategies } from "@/data/interpretations";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";

function getLevel(score: number, maxScore: number, thresholds: {baixa: number, media: number}) {
  if (score <= thresholds.baixa) return "BAIXO";
  if (score <= thresholds.media) return "MÉDIO";
  return "ALTO";
}

function getShortLabel(cat: string) {
  if (cat === "Crença Limitante") return "Crenças";
  if (cat === "Gatilho Emocional") return "Gatilhos";
  if (cat === "Recurso Interno") return "Recursos";
  return cat;
}

export default function Resultado() {
  const router = useRouter();
  const { user } = useAuth();
  const { answers, resetAssessment } = useAssessmentStore();
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [sharing, setSharing] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const result = useMemo(() => {
    if (!isMounted) return null;

    let scores = { "Crença Limitante": 0, "Gatilho Emocional": 0, "Visual": 0, "Auditivo": 0, "Sinestésico": 0, "Recurso Interno": 0 };
    let segmentScores = {
      Carreira: { "Crença Limitante": 0, "Gatilho Emocional": 0, "Visual": 0, "Auditivo": 0, "Sinestésico": 0, "Recurso Interno": 0 },
      IntEmocional: { "Crença Limitante": 0, "Gatilho Emocional": 0, "Visual": 0, "Auditivo": 0, "Sinestésico": 0, "Recurso Interno": 0 },
      Financas: { "Crença Limitante": 0, "Gatilho Emocional": 0, "Visual": 0, "Auditivo": 0, "Sinestésico": 0, "Recurso Interno": 0 }
    };

    Object.entries(answers).forEach(([questionIdStr, optionIndex]) => {
      const qId = parseInt(questionIdStr);
      const q = questionsData.find(q => q.id === qId);
      if (q && optionIndex !== null) {
        const pts = optionIndex + 1;
        const cat = q.categoria as keyof typeof scores;
        scores[cat] += pts;
        if (qId >= 1 && qId <= 20) segmentScores.Carreira[cat] += pts;
        else if (qId >= 21 && qId <= 40) segmentScores.IntEmocional[cat] += pts;
        else if (qId >= 41 && qId <= 60) segmentScores.Financas[cat] += pts;
      }
    });

    const crencasLevel = getLevel(scores["Crença Limitante"], 70, { baixa: 23, media: 47 });
    const gatilhosLevel = getLevel(scores["Gatilho Emocional"], 65, { baixa: 21, media: 43 });
    const recursosLevel = getLevel(scores["Recurso Interno"], 75, { baixa: 25, media: 50 });
    
    const vak = [
      { name: "VISUAL", score: scores["Visual"] },
      { name: "AUDITIVO", score: scores["Auditivo"] },
      { name: "SINESTÉSICO", score: scores["Sinestésico"] }
    ].sort((a, b) => b.score - a.score);
    const vakLevel = vak[0].name;

    const profile = profilesData.find(p => 
      p.crencas === crencasLevel && p.gatilhos === gatilhosLevel && 
      p.aprendizagem === vakLevel && p.recursos === recursosLevel
    );

    const radarCategories = ["Recurso Interno", "Gatilho Emocional", "Visual", "Auditivo", "Sinestésico", "Crença Limitante"];
    const radarCarreira = radarCategories.map(cat => ({ subject: getShortLabel(cat), A: segmentScores.Carreira[cat as keyof typeof scores] }));
    const radarIE = radarCategories.map(cat => ({ subject: getShortLabel(cat), A: segmentScores.IntEmocional[cat as keyof typeof scores] }));
    const radarFinancas = radarCategories.map(cat => ({ subject: getShortLabel(cat), A: segmentScores.Financas[cat as keyof typeof scores] }));

    return { 
      scores, crencasLevel, gatilhosLevel, recursosLevel, vakLevel, profile,
      radarCarreira, radarIE, radarFinancas
    };
  }, [answers, isMounted]);

  const handleRestart = () => {
    resetAssessment();
    router.push("/");
  };

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleShare = async () => {
    if (!shareRef.current || !result?.profile) return;
    setSharing(true);
    
    try {
      const canvas = await html2canvas(shareRef.current, {
        scale: 1,
        width: 1080,
        height: 1080,
        useCORS: true,
        backgroundColor: '#0A325A'
      });
      const dataUrl = canvas.toDataURL('image/png');

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'meu-perfil-neurosync.png', { type: 'image/png' });
      const SHARE_URL = 'https://neuro-sync-ruby.vercel.app';
      const SHARE_TEXT = `Acabei de descobrir que meu Perfil Comportamental PNL é o ${result.profile.nome}! Descubra o seu também no aplicativo NeuroSync:`;

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Meu Perfil NeuroSync',
          text: SHARE_TEXT,
          url: SHARE_URL,
          files: [file]
        });
      } else {
        // Fallback para PC ou navegadores sem suporte
        const link = document.createElement('a');
        link.download = 'meu-perfil-neurosync.png';
        link.href = dataUrl;
        link.click();
        
        // Copiar texto pro clipboard
        navigator.clipboard.writeText(`${SHARE_TEXT} ${SHARE_URL}`);
        alert('A imagem do seu perfil foi salva no seu dispositivo! 📸\nO texto com o link também foi copiado para sua área de transferência para você colar no WhatsApp, Instagram ou Facebook!');
      }
    } catch (err) {
      console.error("Erro ao gerar imagem", err);
      alert('Ops! Ocorreu um erro ao gerar a sua imagem de compartilhamento.');
    } finally {
      setSharing(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center font-sans">
        <div className="w-16 h-16 rounded-full border-4 border-brand-light border-t-brand-teal animate-spin mb-6 shadow-xl shadow-brand-teal/20"></div>
        <h2 className="text-xl font-bold text-brand-graphite">Analisando seu perfil...</h2>
        <p className="text-brand-graphite/60 text-sm mt-2">Gerando relatório detalhado PNL</p>
      </div>
    );
  }

  if (!result || !result.profile) return null;

  return (
    <div className="min-h-screen bg-brand-light flex flex-col font-sans">
      
      {/* 
        COMPONENT INVISÍVEL (POSTER 1080x1080)
        Usado exclusivamente para tirar o screenshot e compartilhar. 
        Tamanho perfeito para Feed do Instagram e WhatsApp.
      */}
      <div 
        ref={shareRef}
        style={{ 
          display: 'flex',
          width: '1080px', 
          height: '1080px', 
          position: 'absolute', 
          top: '-9999px', 
          left: '-9999px',
          zIndex: -9999,
          opacity: 1,
          pointerEvents: 'none',
          flexDirection: 'column',
          backgroundColor: '#0A325A', // brand-blue
          backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(45, 212, 191, 0.2) 0%, transparent 50%)',
          padding: '80px',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        <div style={{ width: '150px', height: '150px', backgroundColor: 'white', borderRadius: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
          <Target size={80} color="#2dd4bf" />
        </div>
        
        <h3 style={{ color: '#2dd4bf', fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '8px', marginBottom: '20px' }}>
          Mapeamento NeuroSync
        </h3>
        
        <h2 style={{ color: 'white', fontSize: '85px', fontWeight: '900', lineHeight: '1.1', marginBottom: '40px' }}>
          {result.profile.nome}
        </h2>
        
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '32px', fontWeight: '300', lineHeight: '1.5', maxWidth: '900px', marginBottom: '80px' }}>
          "{result.profile.descricao}"
        </p>
        
        <div style={{ display: 'flex', gap: '30px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '30px 50px', borderRadius: '30px', width: '100%', justifyContent: 'space-between', marginTop: 'auto' }}>
           <div style={{ color: 'white', fontSize: '26px', fontWeight: 'bold' }}>Crenças: <span style={{ color: '#2dd4bf'}}>{result.crencasLevel}</span></div>
           <div style={{ color: 'white', fontSize: '26px', fontWeight: 'bold' }}>Gatilhos: <span style={{ color: '#2dd4bf'}}>{result.gatilhosLevel}</span></div>
           <div style={{ color: 'white', fontSize: '26px', fontWeight: 'bold' }}>VAK: <span style={{ color: '#2dd4bf'}}>{result.vakLevel}</span></div>
        </div>
        
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '24px', marginTop: '50px' }}>
          Faça o teste gratuito em: <strong>neuro-sync-ruby.vercel.app</strong>
        </p>
      </div>

      {/* RENDERIZAÇÃO REAL DA PÁGINA */}
      <main className="flex-1 px-5 pt-8 pb-12 flex flex-col items-center max-w-2xl mx-auto w-full">
        
        <div className="w-full text-center mb-6 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-teal to-brand-blue flex items-center justify-center shadow-md">
              <div className="w-4 h-4 rounded-full bg-white opacity-90" />
            </div>
            <h1 className="text-2xl font-black text-brand-blue tracking-tight">NeuroSync</h1>
          </Link>
          <h2 className="text-[12px] font-bold text-brand-graphite/60 tracking-widest uppercase">
            Estudo de Programação Neuro-Linguística (PNL)
          </h2>
          <h1 className="text-lg font-black text-brand-blue uppercase mt-1">
            Resultado de Análise de Perfil
          </h1>
        </div>
        
        <div className="w-full bg-brand-white rounded-3xl p-8 shadow-sm border border-brand-graphite/5 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-bl-full"></div>
          
          <h3 className="text-[11px] font-black text-brand-teal uppercase tracking-widest mb-1">I. Perfil Identificado</h3>
          <h2 className="text-[28px] font-black text-brand-blue leading-tight mb-4">{result.profile.nome}</h2>
          
          <h4 className="text-[12px] font-bold text-brand-graphite/50 uppercase mb-2">I.A. Descrição</h4>
          <p className="text-[15px] text-brand-graphite/80 leading-relaxed text-justify">
            {result.profile.descricao}
          </p>
        </div>

        <div className="w-full mb-10">
          <h4 className="text-[12px] font-bold text-brand-graphite/50 uppercase mb-4 pl-2">I.B. Pontuação</h4>
          <div className="grid gap-3">
            <ProgressBar title="Crenças Limitantes" score={result.scores["Crença Limitante"]} max={70} level={result.crencasLevel} icon={<ShieldAlert size={16} className="text-amber-500" />} colorClass="bg-amber-500" />
            <ProgressBar title="Gatilhos Emocionais" score={result.scores["Gatilho Emocional"]} max={65} level={result.gatilhosLevel} icon={<Target size={16} className="text-rose-500" />} colorClass="bg-rose-500" />
            <ProgressBar title="Recursos Internos" score={result.scores["Recurso Interno"]} max={75} level={result.recursosLevel} icon={<Brain size={16} className="text-brand-blue" />} colorClass="bg-brand-blue" />
            <ProgressBar title={`Estilo Predominante: ${result.vakLevel}`} score={result.scores[result.profile.aprendizagem === "VISUAL" ? "Visual" : result.profile.aprendizagem === "AUDITIVO" ? "Auditivo" : "Sinestésico"]} max={30} level={result.vakLevel} icon={<Sparkles size={16} className="text-indigo-500" />} colorClass="bg-indigo-500" />
          </div>
        </div>

        <div className="w-full bg-brand-white rounded-3xl p-8 shadow-sm border border-brand-graphite/5 mb-10">
          <h3 className="text-[14px] font-black text-brand-blue uppercase tracking-widest mb-6">II. Interpretação dos Resultados</h3>
          <div className="space-y-6">
            <InterpretationItem letter="A" title="Crenças Limitantes" level={result.crencasLevel} text={interpretationsData.crencas[result.crencasLevel as keyof typeof interpretationsData.crencas]} />
            <InterpretationItem letter="B" title="Gatilhos Emocionais" level={result.gatilhosLevel} text={interpretationsData.gatilhos[result.gatilhosLevel as keyof typeof interpretationsData.gatilhos]} />
            <InterpretationItem letter="C" title="Estilo de Aprendizagem" level={result.vakLevel} text={interpretationsData.estilo[result.vakLevel as keyof typeof interpretationsData.estilo]} />
            <InterpretationItem letter="D" title="Recursos Internos" level={result.recursosLevel} text={interpretationsData.recursos[result.recursosLevel as keyof typeof interpretationsData.recursos]} />
          </div>
        </div>

        <div className="w-full mb-10">
          <h3 className="text-[14px] font-black text-brand-blue uppercase tracking-widest mb-6 pl-2">III. Estratégia PNL de Desenvolvimento</h3>
          <div className="space-y-5">
            {pnlStrategies.map((strategy) => (
              <div key={strategy.id} className="bg-brand-white rounded-2xl p-6 shadow-sm border border-brand-graphite/5">
                <h4 className="font-bold text-brand-blue text-[15px] mb-3">{strategy.id}. {strategy.title}</h4>
                <div className="space-y-2 text-[14px] text-brand-graphite/80">
                  <p><span className="font-semibold text-brand-graphite">Técnica:</span> {strategy.technique}</p>
                  <p><span className="font-semibold text-brand-graphite">Método:</span> {strategy.method}</p>
                  <p className="bg-brand-light p-3 rounded-xl mt-2 text-[13.5px] leading-relaxed border border-slate-100">
                    <span className="font-bold text-brand-teal block mb-1">Aplicação Prática:</span> 
                    {strategy.application}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-[14px] font-black text-brand-blue uppercase tracking-widest mt-4 mb-6 pl-2 w-full">IV. Ilustração Gráfica do Perfil</h3>
        <RadarSection title="Carreira" data={result.radarCarreira} color="#00b4d8" />
        <RadarSection title="Inteligência Emocional" data={result.radarIE} color="#0A457D" />
        <RadarSection title="Finanças" data={result.radarFinancas} color="#2dd4bf" />

        {/* INCENTIVO DE CADASTRO (CTA) */}
        {!user && (
          <div className="mt-8 w-full bg-gradient-to-tr from-brand-teal to-brand-blue rounded-3xl p-6 shadow-lg shadow-brand-teal/20 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <h3 className="text-xl font-black text-white mb-2">Não perca o seu resultado!</h3>
            <p className="text-white/80 text-[15px] mb-5 leading-relaxed">
              Você não está logado. Crie uma conta gratuita agora mesmo para salvar este relatório permanentemente no seu Histórico e acompanhar sua evolução.
            </p>
            <Link href="/cadastro" className="inline-flex items-center gap-2 bg-white text-brand-blue px-6 py-3 rounded-xl font-bold text-[15px] shadow-md hover:scale-105 active:scale-95 transition-transform">
              <Download size={18} /> Salvar meu Resultado
            </Link>
          </div>
        )}

        {/* BOTOES DE AÇÃO */}
        <div className="mt-6 flex flex-col items-center gap-4 w-full bg-brand-white p-6 rounded-3xl shadow-sm border border-brand-graphite/5">
          
          <h3 className="text-[16px] font-black text-brand-graphite mb-1">Incrível, não acha?</h3>
          <p className="text-sm text-brand-graphite/60 text-center mb-4">Compartilhe sua descoberta no Instagram, WhatsApp ou onde quiser!</p>

          <button 
            onClick={handleShare}
            disabled={sharing}
            className="w-full bg-brand-teal text-white px-5 py-4 rounded-[20px] font-bold shadow-lg shadow-brand-teal/30 hover:bg-teal-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
          >
            {sharing ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Gerando Imagem...
              </>
            ) : (
              <>
                <Share2 size={20} /> Compartilhar meu Relatório
              </>
            )}
          </button>
          
          <button onClick={handleRestart} className="text-brand-graphite/50 text-sm font-semibold flex items-center gap-2 hover:text-brand-graphite transition-colors mt-2 p-2">
            <RefreshCcw size={16} /> Refazer Avaliação Completa
          </button>
        </div>

      </main>
    </div>
  );
}

function InterpretationItem({ letter, title, level, text }: { letter: string, title: string, level: string, text: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-brand-light rounded-full flex items-center justify-center font-bold text-brand-teal text-sm">
        {letter}
      </div>
      <div>
        <h4 className="font-bold text-brand-graphite text-[15px] mb-1 uppercase">
          {title}: <span className="text-brand-teal font-black">{level}</span>
        </h4>
        <p className="text-[14px] text-brand-graphite/70 leading-relaxed text-justify">
          {text}
        </p>
      </div>
    </div>
  );
}

function ProgressBar({ title, score, max, level, icon, colorClass }: any) {
  const percent = Math.round((score / max) * 100) || 0;
  return (
    <div className="bg-brand-white rounded-[20px] p-4 shadow-sm border border-brand-graphite/5 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 font-bold text-brand-graphite text-[14px]">
          {icon} {title}
        </div>
        <div className="text-[10px] font-black text-brand-graphite bg-brand-light px-3 py-1.5 rounded-lg tracking-wide uppercase">
          {level}
        </div>
      </div>
      <div className="w-full bg-brand-graphite/10 rounded-full h-2.5 mb-2 overflow-hidden">
        <div className={`${colorClass} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percent}%` }}></div>
      </div>
      <div className="text-[11px] text-brand-graphite/50 text-right font-bold">
        {score}/{max} pts ({percent}%)
      </div>
    </div>
  );
}

function RadarSection({ title, data, color }: { title: string, data: any[], color: string }) {
  return (
    <div className="w-full bg-brand-white rounded-3xl p-6 shadow-sm border border-brand-graphite/5 mb-6 flex flex-col items-center">
      <h4 className="text-[16px] font-black text-brand-graphite mb-2">{title}</h4>
      <div className="w-full h-[260px] -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
            <Radar name={title} dataKey="A" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.15} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
