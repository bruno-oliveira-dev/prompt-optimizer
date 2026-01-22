# Prompt Optimizer SaaS - Product Design Document

## 1️⃣ Product Definition

**Prompt Optimizer** is an AI-first SaaS that transforms poorly-written prompts into high-quality, structured prompts that deliver better LLM responses. Users paste their raw prompt, click optimize, and instantly receive a professionally-engineered version with explanations of what changed and why. The product eliminates the guesswork from prompt engineering by codifying best practices into an AI system that learns from thousands of optimization patterns.

### Core Value Proposition

**"From messy to mastery in seconds"** — Turn any prompt into a professionally-engineered one instantly, without learning prompt engineering.

### Competitive Advantage

- **AI-native**: Uses Claude Sonnet 4.5 to optimize prompts, not templates or rule-based systems
- **Transparent**: Shows before/after comparison with explanations of changes
- **Fast**: Sub-3-second optimization with no manual editing required
- **Focused**: Does one thing exceptionally well instead of being a bloated AI toolkit

---

## 2️⃣ MVP Scope

### ✅ Features Included

1. **Prompt Optimization Core**
   - Single text input for raw prompt
   - One-click "Optimize" button
   - Display optimized prompt with syntax highlighting
   - Side-by-side comparison view
   - Copy to clipboard functionality

2. **Explanation Layer**
   - List of improvements made (e.g., "Added context", "Clarified output format")
   - Brief rationale for each change
   - Quality score (1-10) before and after

3. **Basic History** (localStorage only)
   - Last 10 optimizations stored locally
   - Quick access to previous optimizations

4. **Simple Analytics**
   - Track optimization count
   - Average quality improvement
   - Display simple stats on dashboard

5. **Usage Limits**
   - Anonymous users: 3 optimizations per day (cookie-based)
   - Signed-up users: 20 optimizations per day
   - Simple rate limiting via API

### ❌ Features Explicitly Excluded (For Now)

- User authentication (Phase 2)
- Persistent cloud storage of prompts
- Collaboration features
- Prompt versioning
- A/B testing prompts
- Custom optimization rules
- LLM integration testing
- Prompt templates library
- Team accounts
- Payment processing
- Advanced analytics dashboard

---

## 3️⃣ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (SPA)                      │
│                  React + TypeScript                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  Input View │  │ Compare View │  │ History Panel │ │
│  └─────────────┘  └──────────────┘  └───────────────┘ │
└────────────┬────────────────────────────────────────────┘
             │ HTTPS/JSON
             ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND API (REST)                    │
│                  Node.js + Express                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Rate Limiter │  │   Prompt     │  │  Analytics   │ │
│  │              │  │  Optimizer   │  │   Service    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────┬────────────────────────────────────────────┘
             │ API Call
             ▼
┌─────────────────────────────────────────────────────────┐
│                      AI LAYER                           │
│              Claude Sonnet 4.5 (Anthropic)              │
│          Prompt Engineering System Prompt               │
└─────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**Frontend (React SPA)**
- Render input/output UI
- Handle user interactions
- Manage local storage for history
- Display loading states and errors
- Format and syntax-highlight prompts

**Backend API (Node.js)**
- Expose REST endpoints
- Enforce rate limits (in-memory for MVP)
- Call Claude API with system prompt
- Parse and structure AI responses
- Return structured JSON to frontend

**AI Layer (Claude Sonnet 4.5)**
- Analyze input prompt quality
- Rewrite prompt following best practices
- Generate improvement explanations
- Assign quality scores

### Data Flow

```
1. User pastes raw prompt → Frontend
2. Frontend sends POST /api/optimize → Backend
3. Backend wraps prompt in system instructions → Claude API
4. Claude analyzes and optimizes → Returns structured response
5. Backend parses response → Returns JSON {optimized, score, changes[]}
6. Frontend displays comparison + explanations
7. Frontend saves to localStorage history
```

---

## 4️⃣ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast dev server, optimal for SPA)
- **Styling**: Vanilla CSS with CSS modules (keeps bundle small, full control)
- **State Management**: React hooks (useState, useReducer) — no Redux needed for MVP
- **HTTP Client**: Fetch API (native, no axios needed)
- **Code Highlighting**: react-syntax-highlighter (for prompt display)
- **Icons**: Lucide React (lightweight, modern)

**Why React + Vite?**
- Fast development experience
- Modern tooling with minimal config
- Easy deployment to Vercel/Netlify
- TypeScript catches errors early

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js (battle-tested, simple, fast)
- **Language**: TypeScript
- **Rate Limiting**: express-rate-limit (in-memory for MVP)
- **Validation**: Zod (type-safe schema validation)
- **Environment Config**: dotenv

**Why Express?**
- Minimal overhead for stateless API
- Huge ecosystem and documentation
- Easy to deploy to Railway, Render, or Vercel serverless

### Database
- **MVP**: None (stateless API)
- **Future**: PostgreSQL + Prisma for user accounts and saved prompts

**Why no database for MVP?**
- Keeps deployment simple
- Frontend handles history via localStorage
- No user auth = no need to persist data
- Can add later without refactoring API contracts

### AI Integration
- **Provider**: Anthropic Claude API
- **Model**: Claude Sonnet 4.5
- **SDK**: @anthropic-ai/sdk (official TypeScript client)

**Why Claude over OpenAI?**
- Superior instruction following
- Better at meta-analysis (analyzing prompts about prompts)
- More reliable structured output
- Anthropic's focus on helpful, harmless, honest AI aligns with product

### Hosting & Deployment
- **Frontend**: Vercel (zero-config React deployment)
- **Backend**: Railway or Render (simple Node.js deployment, free tier available)
- **Alternative**: Vercel serverless functions (entire stack on one platform)

### Auth (Future — Phase 2)
- **Planned**: Clerk or Supabase Auth
- **Reason**: Drop-in authentication with minimal backend code

---

## 5️⃣ AI Prompting Strategy

### System Prompt Architecture

The core AI functionality relies on a carefully designed **meta-prompt** that instructs Claude to act as a prompt engineering expert.

#### Structure

```xml
<role>
You are an expert prompt engineer specializing in optimizing prompts for large language models.
</role>

<task>
Analyze the user's prompt and rewrite it to be clearer, more structured, and more effective.
</task>

<criteria>
- Add missing context
- Structure with clear sections
- Specify desired output format
- Remove ambiguity
- Use precise language
- Apply prompt engineering best practices (chain-of-thought, examples, constraints)
</criteria>

<output_format>
Return a JSON object with this exact structure:
{
  "optimized_prompt": "The improved prompt text",
  "original_score": 5,
  "optimized_score": 9,
  "improvements": [
    {
      "category": "Context",
      "description": "Added background about the task"
    },
    {
      "category": "Structure",
      "description": "Organized into clear sections with headings"
    }
  ]
}
</output_format>

<original_prompt>
{USER_INPUT}
</original_prompt>
```

### Input Sanitization

1. **Length Limits**
   - Min: 10 characters
   - Max: 4000 characters (prevents abuse, fits in context window)

2. **Content Filtering**
   - Basic profanity filter (warn, don't block — prompts may discuss sensitive topics)
   - No PII detection needed (stateless, nothing stored)

3. **Validation**
   - Must be valid UTF-8
   - Strip leading/trailing whitespace
   - Reject empty prompts

### Quality Enforcement

1. **Scoring System**
   - 1-10 scale for both original and optimized
   - AI self-evaluates based on criteria
   - Frontend displays delta improvement

2. **Improvement Categories**
   - Context: Missing background info
   - Structure: Organization and formatting
   - Clarity: Ambiguity removal
   - Format: Output specification
   - Examples: Few-shot learning
   - Constraints: Boundaries and rules

3. **Consistency Mechanisms**
   - Use XML tags in system prompt (Claude best practice)
   - Request JSON output with strict schema
   - Validate response with Zod schema on backend
   - Retry once if malformed response

---

## 6️⃣ API Design

### Base URL
```
https://api.promptoptimizer.ai/v1
```

### Endpoints

#### `POST /api/optimize`

Optimizes a user's prompt.

**Request**
```json
{
  "prompt": "write a blog about AI",
  "user_id": "optional-anonymous-id"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "original_prompt": "write a blog about AI",
    "optimized_prompt": "Write a 1000-word blog post about the impact of AI on software development...",
    "original_score": 3,
    "optimized_score": 9,
    "improvements": [
      {
        "category": "Context",
        "description": "Added specificity about blog length and target audience"
      },
      {
        "category": "Structure",
        "description": "Broke down requirements into clear sections"
      },
      {
        "category": "Format",
        "description": "Specified desired tone and output structure"
      }
    ],
    "processing_time_ms": 1247
  }
}
```

**Error Response** (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PROMPT",
    "message": "Prompt must be between 10 and 4000 characters"
  }
}
```

**Error Response** (429 Too Many Requests)
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Daily limit reached. Sign up for more optimizations.",
    "retry_after_seconds": 86400
  }
}
```

#### `GET /api/health`

Health check endpoint.

**Response** (200 OK)
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime_seconds": 3600
}
```

---

## 7️⃣ Implementation Plan

### Phase 1: Core Backend (Days 1-2)

1. **Initialize Node.js project**
   ```bash
   npm init -y
   npm install express cors dotenv zod @anthropic-ai/sdk
   npm install -D typescript @types/node @types/express tsx
   ```

2. **Create Express server with health endpoint**
   - Set up TypeScript config
   - Create basic server.ts
   - Add health check route
   - Test locally with `curl`

3. **Implement `/api/optimize` endpoint**
   - Define Zod schemas for request/response
   - Add input validation
   - Return mock response (no AI yet)

4. **Integrate Claude API**
   - Set up Anthropic SDK
   - Create system prompt template
   - Call Claude API with user prompt
   - Parse and validate JSON response

5. **Add rate limiting**
   - Install express-rate-limit
   - Configure 3/day for anonymous, 20/day for users
   - Return 429 with retry-after header

6. **Error handling**
   - Wrap routes in try/catch
   - Return consistent error format
   - Log errors to console (use Winston later)

### Phase 2: Frontend (Days 3-4)

1. **Initialize React app with Vite**
   ```bash
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install
   ```

2. **Create UI components**
   - `PromptInput.tsx` — textarea for user prompt
   - `OptimizeButton.tsx` — calls API
   - `ComparisonView.tsx` — side-by-side display
   - `ImprovementsList.tsx` — shows changes
   - `ScoreDisplay.tsx` — shows before/after scores

3. **Implement API integration**
   - Create `api/client.ts` with fetch wrapper
   - Add loading states
   - Handle errors and display to user

4. **Add localStorage for history**
   - Save last 10 optimizations
   - Create `History.tsx` component
   - Load previous optimization on click

5. **Styling and polish**
   - Create dark mode design
   - Add smooth transitions
   - Responsive layout for mobile
   - Add copy-to-clipboard button

### Phase 3: Deployment (Day 5)

1. **Deploy backend to Railway**
   - Create Railway project
   - Add ANTHROPIC_API_KEY env var
   - Deploy from GitHub repo
   - Get production URL

2. **Deploy frontend to Vercel**
   - Connect GitHub repo
   - Set API_BASE_URL env var
   - Deploy with zero config
   - Get production URL

3. **Configure CORS**
   - Update backend to allow frontend origin
   - Test production API calls

4. **Testing and fixes**
   - Test full flow end-to-end
   - Fix any deployment issues
   - Monitor logs for errors

### What Can Be Skipped Initially

- User authentication (use cookie-based rate limiting)
- Database (use localStorage + stateless API)
- Analytics dashboard (just log to console)
- Advanced error monitoring (add Sentry later)
- Tests (add after MVP validation)
- CI/CD (manual deploy is fine for MVP)

---

## 8️⃣ Future Evolution

### Monetization Ideas

**Tier 1: Free**
- 3 optimizations/day
- Basic features
- Local history only

**Tier 2: Pro ($9/month)**
- Unlimited optimizations
- Cloud-saved history
- Prompt versioning
- Advanced explanations
- Priority support

**Tier 3: Teams ($29/month)**
- All Pro features
- 5 team members
- Shared prompt library
- Collaboration features
- Usage analytics

### Feature Expansion (Post-MVP)

1. **Prompt Templates Library**
   - Pre-built prompts for common tasks
   - Community-contributed templates
   - "Use this template" quick start

2. **A/B Testing**
   - Compare multiple optimized versions
   - Test with real LLMs
   - Show which performs best

3. **Custom Optimization Rules**
   - User-defined preferences
   - Industry-specific optimization (legal, medical, code)
   - Tone preferences (formal, casual, technical)

4. **LLM Integration Testing**
   - Test optimized prompts with OpenAI, Claude, Gemini
   - Show side-by-side outputs
   - Recommend best model for the prompt

5. **Browser Extension**
   - Optimize prompts in ChatGPT, Claude, etc.
   - Right-click → "Optimize with Prompt Optimizer"
   - Inject optimized prompt directly

6. **API as a Product**
   - `/api/optimize` as a paid API
   - Usage-based pricing
   - Integrate into other tools

7. **Advanced Analytics**
   - Track which improvements yield best results
   - Show optimization patterns over time
   - Suggest areas for improvement

---

## Summary: Why This Design?

| Decision | Rationale |
|----------|-----------|
| **No database for MVP** | Reduces complexity, faster to ship, localStorage works for history |
| **Claude over GPT-4** | Better at meta-analysis, superior instruction following |
| **React + Vite** | Modern DX, fast builds, easy deployment |
| **Express over NestJS** | Simpler for stateless API, less boilerplate |
| **Vercel + Railway** | Free tiers, zero-config deploys, production-ready |
| **No auth for MVP** | Cookie-based rate limiting is enough, add later |
| **Stateless API** | Horizontally scalable from day one |
| **JSON over streaming** | Simpler frontend, full response in one request |

This design prioritizes **speed to market** while maintaining **architectural flexibility** for future paid SaaS features. The MVP can be built in 5 days by a single engineer, validated with real users, and evolved based on feedback.

---

**Next Steps**: Ready to begin implementation? I can:
1. Generate the initial codebase structure
2. Write the backend API with Claude integration
3. Build the React frontend
4. Create deployment configs

Let me know how you'd like to proceed! 🚀
