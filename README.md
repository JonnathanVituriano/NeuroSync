# NeuroSync 🧠

O **NeuroSync** é uma plataforma moderna de Análise de Perfil Comportamental baseada em Programação Neuro-Linguística (PNL) e Inteligência Emocional.

Este sistema permite que os usuários realizem um teste aprofundado, descubram seu perfil predominante (crenças, gatilhos, e estilo de aprendizagem) e mantenham um histórico contínuo do seu desenvolvimento pessoal, tudo salvo com segurança na nuvem.

## 🚀 Funcionalidades Principais

- **Avaliação de 60 Questões:** Teste dinâmico e fluído com barra de progresso e feedbacks visuais em tempo real.
- **Relatório Completo de Perfil:** Geração de diagnósticos com textos explicativos, pontuações de categoria e gráficos de radar interativos (Carreira, Inteligência Emocional e Finanças).
- **Sistema de Autenticação e Histórico (Supabase):** Contas de usuário seguras com banco de dados em nuvem. Cada avaliação finalizada é guardada automaticamente no histórico do perfil, permitindo recarregar relatórios anteriores a qualquer momento.
- **Compartilhamento Visual:** Geração instantânea de um pôster virtual (Screenshot) para compartilhamento em redes sociais ou WhatsApp.
- **Design Inteligente (Dark Mode):** Interface premium desenvolvida com TailwindCSS e suporte completo a "Tema Escuro" automatizado e com seleção manual.
- **Instalável (PWA):** O aplicativo pode ser instalado no celular ou desktop como uma aplicação nativa.

## 🛠️ Tecnologias Utilizadas

- **Next.js 15+** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS** (Estilização de interface e responsividade)
- **Supabase** (Banco de dados PostgreSQL + Autenticação e RLS)
- **Recharts** (Gráficos)
- **Framer Motion** (Micro-interações e animações)
- **Zustand** (Gerenciamento global de estado)
- **Lucide React** (Ícones SVG otimizados)

## 💻 Como Rodar o Projeto Localmente

1. Clone o repositório:
```bash
git clone https://github.com/SEU-USUARIO/neurosync.git
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env.local` na raiz do projeto com as suas chaves do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://SUA_URL_AQUI.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_AQUI
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

---
*Desenvolvido com excelência e tecnologia de ponta.*
