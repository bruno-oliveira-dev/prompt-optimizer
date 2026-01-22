# ✨ Prompt Optimizer

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![React](https://img.shields.io/badge/React-18-cea119) ![Vite](https://img.shields.io/badge/Vite-5.0-646cff)

> **"Transforme pensamentos desorganizados em prompts de mestre em segundos."**

O **Prompt Optimizer** é uma plataforma e aplicação web *AI-first* projetada para transformar ideias brutas e mal estruturadas em prompts profissionais de alta performance para Grandes Modelos de Linguagem (LLMs). Seja usando Claude, GPT-4 ou modelos Llama, esta ferramenta garante que seus prompts sejam claros, estruturados e eficazes.

---

## 🚀 Recursos

### 🧠 **Inteligência Multi-Modelo**
- **Suporte Universal**: Alterne facilmente entre **Anthropic (Claude)**, **OpenAI (GPT-4/Turbo)** e **Google (Gemini)**.
- **Pronto para Groq & Llama**: Suporte nativo para engines de inferência de ultra-velocidade como a Groq.
- **Modelos Locais**: Conecte-se ao **Ollama**, **LM Studio** ou qualquer endpoint compatível com OpenAI.

### 🎨 **Experiência Premium**
- **Interface Glassmorphism**: Um visual moderno e impressionante com gradientes profundos, cartões translúcidos e acentos neon.
- **Visualizações Interativas**: Medidores de pontuação animados e "Cards de Insights" que explicam exatamente *o que* e *por que* seu prompt melhorou.
- **Comparação Lado a Lado**: Visualização de diff em tempo real para ver a mágica do "antes e depois" instantaneamente.

### 🔒 **Privacidade em Primeiro Lugar**
- **BYOK (Traga Sua Própria Chave)**: Suas chaves de API são armazenadas com segurança no **Local Storage** do seu navegador. Elas nunca tocam nosso banco de dados.
- **Retenção Zero**: Não armazenamos seu histórico ou prompts em nossos servidores.

---

## 🛠️ Tecnologias Utilizadas

| Componente | Tecnologia |
|-----------|------|
| **Frontend** | React 18, TypeScript, Vite, CSS Modules (Glassmorphism) |
| **Backend** | Node.js, Express, Zod (Validação), TypeScript |
| **Camada de IA** | Anthropic SDK, OpenAI SDK, Google Generative AI SDK |
| **Estilização** | Variáveis CSS Vanilla (Temas), Ícones Lucide |

---

## 🏃‍♂️ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- Uma Chave de API (OpenAI, Anthropic ou Google)

### 1. Clonar o Repositório
```bash
git clone https://github.com/bruno-oliveira-dev/prompt-optimizer.git
cd prompt-optimizer
```

### 2. Configurar o Backend
```bash
cd backend
npm install
# Opcional: Definir padrões globais no .env
cp .env.example .env
npm run dev
```
*O servidor rodará na porta `3001`.*

### 3. Configurar o Frontend
Abra um novo terminal:
```bash
cd frontend
npm install
npm run dev
```
*A aplicação rodará em `http://localhost:5173`.*

---

## 🎮 Como Usar

1. **Abra a Aplicação**: Navegue até `http://localhost:5173`.
2. **Configure o Provedor**: Clique no ícone de **Configurações (⚙️)**.
   - Escolha seu provedor (ex: **OpenAI** para GPT-4 ou Groq).
   - Insira sua **Chave de API**.
   - (Opcional) Defina uma **URL Base** customizada para testes locais.
3. **Otimize**: Digite um rascunho de prompt como *"crie um email de marketing"* e clique em **Otimizar**.
4. **Learn**: Acompanhe a pontuação subir e veja os cards de "Melhorias de IA" para entender o que foi aprimorado.

---

## 📸 Capturas de Tela

*(Adicione suas capturas de tela aqui)*

---

## 🛡️ Licença

Este projeto é open source e está disponível sob a [Licença MIT](LICENSE).

<div align="center">
  <sub>Desenvolvido com ❤️ por Bruno Oliveira</sub>
</div>
