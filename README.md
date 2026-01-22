# ✨ Prompt Optimizer SaaS

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![React](https://img.shields.io/badge/React-18-cea119) ![Vite](https://img.shields.io/badge/Vite-5.0-646cff)

> **"Turn messy thoughts into masterclass prompts in seconds."**

**Prompt Optimizer** is an AI-first SaaS platform designed to transform raw, poorly structured ideas into professional, high-performance prompts for Large Language Models (LLMs). Whether you're using Claude, GPT-4, or Llama, this tool ensures your prompts are clear, structured, and effective.

---

## 🚀 Features

### 🧠 **Multi-Model Intelligence**
- **Universal Support**: Seamlessly switch between **Anthropic (Claude)**, **OpenAI (GPT-4/Turbo)**, and **Google (Gemini)**.
- **Groq & Llama Ready**: Native support for high-speed inference engines like Groq.
- **Local Model Support**: Connect to **Ollama**, **LM Studio**, or any OpenAI-compatible endpoint.

### 🎨 **Premium Experience**
- **Glassmorphism UI**: A stunning, modern interface featuring deep gradients, translucent cards, and neon accents.
- **Interactive Visualizations**: Animated score gauges and "Insight Cards" that explain exactly *why* your prompt improved.
- **Side-by-Side Comparison**: Real-time diff view to see the before/after magic instantly.

### 🔒 **Privacy First**
- **BYOK (Bring Your Own Key)**: Your API keys are stored securely in your browser's **Local Storage**. They never touch our database.
- **Zero Retention**: We don't store your history or prompts on our servers.

---

## 🛠️ Technology Stack

| Component | Tech |
|-----------|------|
| **Frontend** | React 18, TypeScript, Vite, CSS Modules (Glassmorphism) |
| **Backend** | Node.js, Express, Zod (Validation), TypeScript |
| **AI Layer** | Anthropic SDK, OpenAI SDK, Google Generative AI SDK |
| **Styling** | Vanilla CSS Variables (Theming), Lucide Icons |

---

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- An API Key (OpenAI, Anthropic, or Google)

### 1. Clone the Repository
```bash
git clone https://github.com/bruno-oliveira-dev/prompt-optimizer.git
cd prompt-optimizer
```

### 2. Backend Setup
```bash
cd backend
npm install
# Optional: Set global defaults in .env
cp .env.example .env
npm run dev
```
*Server runs on port `3001`.*

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*App runs on `http://localhost:5173`.*

---

## 🎮 How to Use

1. **Open the App**: Navigate to `http://localhost:5173`.
2. **Configure Provider**: Click the **Settings (⚙️)** icon.
   - Choose your provider (e.g., **OpenAI** for GPT-4 or Groq).
   - Enter your **API Key**.
   - (Optional) Set a custom **Model URL** for local testing.
3. **Optimize**: Type a rough prompt like *"make me a marketing email"* and click **Optimize**.
4. **Learn**: Watch the score count up and review the "AI Enhancements" cards to see what improved.

---

## 📸 Screenshots

*(Add screenshots here after running the project)*

---

## 🛡️ License

This project is open source and available under the [MIT License](LICENSE).

<div align="center">
  <sub>Built with ❤️ by Bruno Oliveira</sub>
</div>
