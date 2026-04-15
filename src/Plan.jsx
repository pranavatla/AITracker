import { useState, useEffect, useRef } from "react";

const WEEKS = [
  {
    week: 1, phase: "foundation", title: "AWS Migration + Intent Classification Study",
    hours: "28–32 hrs", focus: "Ship atla.in on AWS. Start thinking in 'user intent → system action' patterns.",
    daily: [
      { day: "Mon", task: "Finish S3 + CloudFront + ACM setup for atla.in frontend (ap-south-1)" },
      { day: "Tue", task: "Configure Route53 DNS records, validate HTTPS certificate end-to-end" },
      { day: "Wed", task: "Set up GitHub OIDC → GitHub Actions CI/CD deploy pipeline for ai_agent_1" },
      { day: "Thu", task: "Deploy FastAPI backend to AWS (ECS Fargate or Lambda). Wire frontend → backend" },
      { day: "Fri", task: "DNS cutover: point atla.in to CloudFront. Smoke test. Kill Railway + Netlify" },
      { day: "Sat", task: "Draw architecture diagram (Excalidraw → SVG). Write AWS migration case study for README" },
      { day: "Sun", task: "Study: intent classification patterns — how travel apps route 'book flight' vs 'find hotel' vs 'plan trip'" },
    ],
    deliverables: ["atla.in live on AWS (HTTPS)", "GitHub Actions CI/CD pipeline", "Architecture diagram in repo"],
    checkpoint: "atla.in loads over HTTPS from CloudFront. Old infra deleted. You understand intent routing.",
    agodaSkills: ["Production deployment", "Cloud infrastructure", "CI/CD"],
  },
  {
    week: 2, phase: "foundation", title: "GitHub Portfolio Overhaul + ML Fundamentals Refresh",
    hours: "28–32 hrs", focus: "Make GitHub recruiter-ready. Refresh classical ML concepts Agoda will test.",
    daily: [
      { day: "Mon", task: "Rewrite ai_agent_1 README: problem → architecture diagram → demo GIF → setup instructions" },
      { day: "Tue", task: "Record 60-sec demo GIF/video. Add pytest tests for FastAPI endpoints (5+ cases)" },
      { day: "Wed", task: "Clean up .env handling: use AWS Secrets Manager. Add .github/workflows CI with tests" },
      { day: "Thu", task: "Build portfolio landing page on atla.in (projects list, about, GitHub/LinkedIn links)" },
      { day: "Fri", task: "ML refresher: precision/recall/F1, AUC-ROC, confusion matrix. When to use ML vs LLM" },
      { day: "Sat", task: "ML refresher: feature engineering for tabular data, train/val/test splits, cross-validation" },
      { day: "Sun", task: "ML refresher: complete Kaggle Intro to ML course (free, ~4 hrs). Update LinkedIn headline" },
    ],
    deliverables: ["Professional README with demo", "CI pipeline", "Portfolio page on atla.in", "ML fundamentals refreshed"],
    checkpoint: "A stranger visiting your GitHub gets it in 30 seconds. You can explain precision vs recall cold.",
    agodaSkills: ["Feature engineering", "Modeling fundamentals", "ML metrics"],
  },
  {
    week: 3, phase: "certification", title: "AWS AI Practitioner — Domains 1-3",
    hours: "28–32 hrs", focus: "AI/ML fundamentals + Generative AI + Foundation Models on AWS.",
    daily: [
      { day: "Mon", task: "Register for AIF-C01 exam ($100). Start AWS Skill Builder Exam Prep Plan" },
      { day: "Tue", task: "Domain 1: AI/ML fundamentals — supervised, unsupervised, reinforcement learning on AWS" },
      { day: "Wed", task: "Domain 1 contd: deep learning, neural networks, training vs inference, SageMaker basics" },
      { day: "Thu", task: "Domain 2: Generative AI — foundation models, transformers, tokenization, prompt engineering" },
      { day: "Fri", task: "Domain 2 contd: RAG concepts, fine-tuning basics, Amazon Bedrock architecture" },
      { day: "Sat", task: "Domain 3: Foundation models — model selection, evaluation metrics, SageMaker JumpStart, Bedrock" },
      { day: "Sun", task: "Hands-on: Explore Amazon Bedrock free tier — invoke Claude + Llama via API. Practice quiz D1-3" },
    ],
    deliverables: ["Domains 1-3 complete", "Bedrock hands-on experience"],
    checkpoint: "Score 80%+ on Domain 1-3 practice questions.",
    agodaSkills: ["AWS AI services", "Model selection", "GenAI fundamentals"],
  },
  {
    week: 4, phase: "certification", title: "AWS AI Practitioner — Domains 4-5 + PASS EXAM",
    hours: "30–35 hrs", focus: "Responsible AI, Security → Crush the exam. Start stats study.",
    daily: [
      { day: "Mon", task: "Domain 4: Responsible AI — bias detection, fairness, Amazon A2I, model cards, explainability" },
      { day: "Tue", task: "Domain 5: Security & governance — data privacy, compliance, AWS Config, CloudTrail, Audit Manager" },
      { day: "Wed", task: "Full practice exam #1 (Tutorials Dojo). Target 80%+. Deep-review every wrong answer" },
      { day: "Thu", task: "Full practice exam #2. Flashcard blitz on weak areas. Focus on Bedrock + SageMaker distinctions" },
      { day: "Fri", task: "🎯 EXAM DAY — Take AWS AI Practitioner (AIF-C01). 65 questions, 90 minutes, 700/1000 to pass" },
      { day: "Sat", task: "Stats study: hypothesis testing fundamentals — null/alt hypotheses, p-values, significance levels" },
      { day: "Sun", task: "Stats study: confidence intervals, sample size calculation, Type I/II errors. Read Evan Miller's A/B guide" },
    ],
    deliverables: ["AWS Certified AI Practitioner ✅", "LinkedIn cert post", "A/B testing basics started"],
    checkpoint: "AWS AI Practitioner PASSED. You can explain p-values and confidence intervals.",
    agodaSkills: ["AWS certification", "Statistics fundamentals", "A/B testing basics"],
  },
  {
    week: 5, phase: "agents", title: "LangGraph Deep Dive + Experimentation Theory",
    hours: "28–32 hrs", focus: "Master LangGraph. Understand how Agoda would A/B test LLM features.",
    daily: [
      { day: "Mon", task: "Complete LangChain Academy free LangGraph course (Part 1: basics)" },
      { day: "Tue", task: "LangGraph core concepts: StateGraph, nodes, edges, conditional routing, state schema" },
      { day: "Wed", task: "LangGraph advanced: checkpointing, persistent memory, human-in-the-loop interrupts" },
      { day: "Thu", task: "Study multi-agent patterns: supervisor, network, hierarchical. When to use which" },
      { day: "Fri", task: "Follow official multi-agent collaboration tutorial (researcher + chart generator) end-to-end" },
      { day: "Sat", task: "Experiment: build 2-agent system (researcher + writer) with Claude API on your own" },
      { day: "Sun", task: "A/B testing for LLMs: how to test prompt variations, measure output quality, online vs offline eval" },
    ],
    deliverables: ["LangGraph course complete", "Working 2-agent prototype", "A/B testing for LLMs understood"],
    checkpoint: "You can whiteboard StateGraph, checkpointing, and supervisor patterns. You understand experiment design.",
    agodaSkills: ["Agent orchestration", "Multi-agent systems", "Experimentation/A/B testing"],
  },
  {
    week: 6, phase: "agents", title: "Multi-Agent System — Design with Intent Classification",
    hours: "30–35 hrs", focus: "Build your flagship project. Lead with intent routing — exactly what Agoda does.",
    daily: [
      { day: "Mon", task: "Design system: AI Travel Research Assistant — intent classifier → specialist agents → aggregator" },
      { day: "Tue", task: "Build intent classifier as supervisor's FIRST node: detect 'search', 'compare', 'plan', 'book-info'" },
      { day: "Wed", task: "Build web search agent (Tavily/SerpAPI tool) + RAG retrieval agent (ChromaDB)" },
      { day: "Thu", task: "Build report writer agent. Wire all agents through supervisor with state management" },
      { day: "Fri", task: "Add context/memory management: conversation history, cross-agent shared state" },
      { day: "Sat", task: "End-to-end testing. Handle edge cases: ambiguous intent, agent failures, timeout handling" },
      { day: "Sun", task: "Create architecture diagram showing intent flow. Write initial README with system design" },
    ],
    deliverables: ["Multi-agent system with intent classification", "Architecture diagram", "Edge case handling"],
    checkpoint: "Query 'plan a 3-day trip to Bangkok' → intent detected → agents search, retrieve, write report.",
    agodaSkills: ["User intent understanding", "Agent orchestration", "Context/memory management", "Multi-step planning"],
  },
  {
    week: 7, phase: "agents", title: "Deploy + LLM Evaluation Pipeline",
    hours: "30–35 hrs", focus: "Production deploy. Build the eval system Agoda will ask about in interviews.",
    daily: [
      { day: "Mon", task: "Write Dockerfile + docker-compose.yml. Test multi-agent system in containers locally" },
      { day: "Tue", task: "Push to Amazon ECR. Deploy to ECS Fargate with health checks + auto-restart" },
      { day: "Wed", task: "Set up CloudWatch Logs + error alerting. Add LangSmith tracing (free tier)" },
      { day: "Thu", task: "Build eval pipeline: create test suite of 50+ queries with expected outputs/quality criteria" },
      { day: "Fri", task: "Implement LLM-as-judge: use Claude to score agent outputs on relevance, accuracy, completeness" },
      { day: "Sat", task: "Add automated metrics: latency/query, cost/query, retrieval precision@k, intent accuracy %" },
      { day: "Sun", task: "Record demo video (3 min). Write comprehensive README. Push to GitHub. Share on LinkedIn" },
    ],
    deliverables: ["Dockerized multi-agent on AWS", "LLM eval pipeline with 50+ test cases", "Automated quality metrics", "Demo video"],
    checkpoint: "Live URL works. Eval pipeline runs automatically and produces a quality report.",
    agodaSkills: ["LLM evaluation & testing", "Production deployment", "Latency/cost/quality tradeoffs", "Monitoring"],
  },
  {
    week: 8, phase: "finetuning", title: "LLM Fine-Tuning — LoRA/QLoRA Deep Dive",
    hours: "28–32 hrs", focus: "Learn when/how to fine-tune. Understand the fine-tune vs prompt vs RAG decision framework.",
    daily: [
      { day: "Mon", task: "Hugging Face LLM Course Ch.11: Supervised Fine-Tuning fundamentals + chat templates" },
      { day: "Tue", task: "HF Course Ch.11: LoRA theory — rank decomposition, adapter matrices, target modules" },
      { day: "Wed", task: "HF Blog: hands-on fine-tuning with PyTorch + PEFT + BitsAndBytes + SFTTrainer" },
      { day: "Thu", task: "Hands-on: Fine-tune Qwen-1.5B or SmolLM with QLoRA on Google Colab (free GPU)" },
      { day: "Fri", task: "Evaluate: base vs fine-tuned on test prompts. Measure perplexity, task accuracy, latency" },
      { day: "Sat", task: "Decision framework study: when to fine-tune vs prompt-engineer vs RAG vs combine. Write decision tree" },
      { day: "Sun", task: "Watch Karpathy 'Let's build GPT from scratch'. Read Raschka's LoRA insights blog" },
    ],
    deliverables: ["First fine-tuned model", "Eval notebook: base vs tuned", "Fine-tune vs prompt vs RAG decision tree"],
    checkpoint: "You can explain LoRA mathematically AND practically. You know when fine-tuning is worth the cost.",
    agodaSkills: ["LLM fine-tuning", "Model evaluation", "Cost/quality tradeoff analysis"],
  },
  {
    week: 9, phase: "finetuning", title: "Fine-Tuned Model → Production API + HF Hub",
    hours: "28–32 hrs", focus: "Ship a domain-tuned model end-to-end. This is your 'I can do the full lifecycle' proof.",
    daily: [
      { day: "Mon", task: "Choose domain dataset: travel QA, customer support, or code — pick what maps to Agoda's use case" },
      { day: "Tue", task: "Prepare dataset: clean, format as instruction pairs, proper train/val split, check for data leakage" },
      { day: "Wed", task: "Fine-tune with QLoRA. Track loss curves, learning rate schedule. Iterate hyperparams" },
      { day: "Thu", task: "Merge adapter weights. Evaluate against baseline: accuracy, latency, cost per inference" },
      { day: "Fri", task: "Push model + detailed model card to Hugging Face Hub (training config, eval results, usage)" },
      { day: "Sat", task: "Wrap in FastAPI. Dockerize. Deploy inference API to AWS. Add response time monitoring" },
      { day: "Sun", task: "Document full pipeline: data prep → train → eval → deploy. Add to portfolio" },
    ],
    deliverables: ["Domain fine-tuned model on HF Hub", "Deployed inference API on AWS", "Full pipeline documentation"],
    checkpoint: "Your HF model card shows training config, eval metrics, and usage examples. API responds in <2s.",
    agodaSkills: ["End-to-end ML lifecycle", "Model deployment", "Performance optimization"],
  },
  {
    week: 10, phase: "production", title: "Technical Blogging + Statistics Deep Dive",
    hours: "28–32 hrs", focus: "Build public proof of expertise. Fill the stats/experimentation gap for Agoda.",
    daily: [
      { day: "Mon", task: "Set up blog on Hashnode (atla.in subdomain or blog.atla.in) or dev.to" },
      { day: "Tue", task: "Write + publish Blog 1: 'Migrating an AI Agent from Railway to AWS — Architecture Decisions'" },
      { day: "Wed", task: "Write + publish Blog 2: 'Building a Multi-Agent Travel Assistant with LangGraph + Claude'" },
      { day: "Thu", task: "Write + publish Blog 3: 'How I Built an LLM Evaluation Pipeline That Actually Catches Regressions'" },
      { day: "Fri", task: "Stats deep dive: Bayesian vs frequentist A/B testing. Multi-armed bandits for LLM prompt selection" },
      { day: "Sat", task: "Stats practice: implement a simple A/B test simulator in Python. Calculate sample sizes for LLM experiments" },
      { day: "Sun", task: "Share all blogs on LinkedIn, Twitter/X, r/MachineLearning. Cross-post to HackerNews" },
    ],
    deliverables: ["3 published technical blogs", "A/B test simulator", "Social media presence launched"],
    checkpoint: "Each blog has architecture diagrams, real code, and lessons. You can design an A/B test for an LLM feature.",
    agodaSkills: ["Technical communication", "Experimentation design", "Statistical reasoning"],
  },
  {
    week: 11, phase: "production", title: "Multi-Agent v2 — Production-Grade Features",
    hours: "30–35 hrs", focus: "Upgrade flagship project with the exact features Agoda's JD describes.",
    daily: [
      { day: "Mon", task: "Add MCP (Model Context Protocol) support for standardized external tool integration" },
      { day: "Tue", task: "Implement persistent agent memory: long-term user preferences via vector store" },
      { day: "Wed", task: "Add human-in-the-loop: LangGraph interrupt() for high-stakes actions (booking confirmation)" },
      { day: "Thu", task: "Build cost + latency tracking: per-agent token usage, p50/p95 response times, cost/query dashboard" },
      { day: "Fri", task: "Add safety guardrails: input validation, output filtering, hallucination detection, rate limiting" },
      { day: "Sat", task: "Stress test: concurrent users, failure injection, graceful degradation. Fix all edge cases" },
      { day: "Sun", task: "Update README, architecture docs, demo video for v2. Push to GitHub" },
    ],
    deliverables: ["Multi-agent v2: MCP, memory, HITL, cost tracking, guardrails", "Latency/cost dashboard"],
    checkpoint: "System handles 'plan a 5-day Thailand trip under $2000' with search → price → plan → confirm flow.",
    agodaSkills: ["Quality/latency/cost/reliability balancing", "Production monitoring", "System reliability"],
  },
  {
    week: 12, phase: "production", title: "Open Source Contribution + AWS Cert #2 Start",
    hours: "28–32 hrs", focus: "Build public credibility. Chain your AWS certs for maximum signal.",
    daily: [
      { day: "Mon", task: "Pick 1 repo to contribute to: LangChain, LlamaIndex, or ChromaDB" },
      { day: "Tue", task: "Read CONTRIBUTING.md. Find 'good first issue'. Submit a docs/test PR to learn workflow" },
      { day: "Wed", task: "Work on a meaningful PR: bug fix, feature, or integration that uses skills you've built" },
      { day: "Thu", task: "Submit PR. Engage in code review feedback. Help answer 2-3 GitHub issues" },
      { day: "Fri", task: "Register AWS ML Engineer Associate (MLA-C01) — use your 50% voucher from passing AIF-C01" },
      { day: "Sat", task: "Start MLA-C01 prep: SageMaker pipelines, ML workflow design, model monitoring" },
      { day: "Sun", task: "Review all projects. Ensure every repo README is polished. Update portfolio site" },
    ],
    deliverables: ["1+ open source PR submitted/merged", "MLA-C01 registered at 50% off", "All repos polished"],
    checkpoint: "Your GitHub shows contributions to a major AI open source project. Second cert journey started.",
    agodaSkills: ["Open source community", "Collaboration", "Continuous learning"],
  },
  {
    week: 13, phase: "launch", title: "Interview Prep — Agoda-Specific + Applications",
    hours: "28–32 hrs", focus: "Prepare for LLM Data Scientist interviews. Start applying aggressively.",
    daily: [
      { day: "Mon", task: "System design prep: 'Design a travel booking agent' — draw architecture, discuss tradeoffs" },
      { day: "Tue", task: "System design prep: 'Your RAG has 8s latency, costs ₹50K/week' — caching, async, model selection" },
      { day: "Wed", task: "ML interview prep: explain precision/recall for intent classifier, feature importance, model selection" },
      { day: "Thu", task: "Stats interview prep: design an A/B test for 'does the LLM agent improve booking conversion?'" },
      { day: "Fri", task: "Craft resume: lead with projects not education. Quantify impact. Tailor for Staff LLM Data Scientist" },
      { day: "Sat", task: "Research target companies: Agoda, Grab, Gojek, Booking.com, + AI startups in Bengaluru" },
      { day: "Sun", task: "Apply to 5 roles. Write personalized cover message linking your deployed projects to each JD" },
    ],
    deliverables: ["Interview-ready resume", "5 system design answers practiced", "5 job applications sent"],
    checkpoint: "You can whiteboard 'design a multi-step travel booking agent' in 30 minutes with tradeoff discussion.",
    agodaSkills: ["System design", "Cross-functional communication", "Problem-solving under ambiguity"],
  },
  {
    week: 14, phase: "launch", title: "Full Send — Applications + OMSCS + Momentum",
    hours: "28–32 hrs", focus: "Maximum application velocity. Secure your long-term credential path.",
    daily: [
      { day: "Mon", task: "Apply to 5 more roles. Include Agoda Staff/Lead LLM Data Scientist (Bangkok, relocation)" },
      { day: "Tue", task: "Mock interview: explain your multi-agent architecture in 5 min. Practice behavioral questions" },
      { day: "Wed", task: "Prepare OMSCS application: Statement of Purpose, transcripts, request 2 recommendations" },
      { day: "Thu", task: "Continue MLA-C01 prep (parallel track: 1 hr/day going forward)" },
      { day: "Fri", task: "Attend 1 AI meetup in Bengaluru: BangPypers, TFUG Bangalore, or local AI/ML meetup" },
      { day: "Sat", task: "Write Blog 4: 'My 14-Week Journey: From AI Hobbyist to Production LLM Engineer'" },
      { day: "Sun", task: "Submit OMSCS application. Review 14 weeks. Plan next quarter's goals. Celebrate 🎉" },
    ],
    deliverables: ["10+ active applications (including Agoda)", "OMSCS application submitted", "4th blog post", "Network growing"],
    checkpoint: "Complete portfolio tells a story: deployed systems, published model, technical blogs, open source, AWS cert.",
    agodaSkills: ["Ownership mindset", "Continuous iteration", "Career trajectory"],
  },
];

const PHASE_META = {
  foundation: { label: "Foundation", color: "#14b8a6", bg: "#14b8a615", icon: "🏗️" },
  certification: { label: "AWS Cert", color: "#3b82f6", bg: "#3b82f615", icon: "🎯" },
  agents: { label: "Multi-Agent", color: "#8b5cf6", bg: "#8b5cf615", icon: "🤖" },
  finetuning: { label: "Fine-Tuning", color: "#f59e0b", bg: "#f59e0b15", icon: "⚡" },
  production: { label: "Production", color: "#ef4444", bg: "#ef444415", icon: "🚀" },
  launch: { label: "Launch", color: "#ec4899", bg: "#ec489915", icon: "🎯" },
};

const MILESTONES = [
  { week: 2, text: "atla.in live on AWS + GitHub polished + ML fundamentals refreshed", color: "#14b8a6" },
  { week: 4, text: "AWS AI Practitioner CERTIFIED + A/B testing basics learned", color: "#3b82f6" },
  { week: 7, text: "Multi-agent system with intent classification + eval pipeline deployed", color: "#8b5cf6" },
  { week: 9, text: "Fine-tuned model on HF Hub + deployed inference API", color: "#f59e0b" },
  { week: 11, text: "Production v2 with cost/latency tracking + guardrails", color: "#ef4444" },
  { week: 12, text: "Open source PR + second AWS cert started", color: "#ef4444" },
  { week: 14, text: "Full portfolio ready + Agoda application submitted + OMSCS applied", color: "#ec4899" },
];

const AGODA_MAP = [
  { req: "Production LLM systems (RAG, agents)", weeks: "W5-7, W11", status: "covered", detail: "Multi-agent system with RAG, deployed on AWS" },
  { req: "Tool/agent orchestration", weeks: "W5-7", status: "covered", detail: "LangGraph supervisor + specialist agents" },
  { req: "Context & memory management", weeks: "W6, W11", status: "covered", detail: "Shared state, persistent vector memory" },
  { req: "User intent understanding", weeks: "W1, W6", status: "covered", detail: "Intent classifier as supervisor's first routing node" },
  { req: "Evaluation, testing, iteration", weeks: "W7, W8", status: "covered", detail: "50+ test suite, LLM-as-judge, RAGAS metrics" },
  { req: "Latency, cost, reliability tradeoffs", weeks: "W7, W11", status: "covered", detail: "p50/p95 tracking, cost/query, guardrails" },
  { req: "Statistics & experimentation", weeks: "W4, W5, W10", status: "covered", detail: "A/B testing, hypothesis testing, sample sizing" },
  { req: "Modeling & feature engineering", weeks: "W2", status: "covered", detail: "ML refresher + Kaggle course + metrics mastery" },
  { req: "Ship quickly, iterate from feedback", weeks: "W1-14", status: "covered", detail: "Entire plan philosophy: build → deploy → measure → improve" },
  { req: "Cross-functional product thinking", weeks: "W13", status: "covered", detail: "System design practice, tradeoff discussions" },
];

const RESOURCES = {
  "AWS Certification": [
    ["AWS Skill Builder (Free Prep)", "https://aws.amazon.com/certification/certified-ai-practitioner/"],
    ["Maarek AIF-C01 (Udemy)", "https://www.udemy.com/course/aws-ai-practitioner-certified/"],
    ["Tutorials Dojo Practice Exams", "https://portal.tutorialsdojo.com/courses/aws-certified-ai-practitioner-aif-c01-practice-exams/"],
  ],
  "Multi-Agent Systems": [
    ["LangGraph Docs", "https://langchain-ai.github.io/langgraph/"],
    ["LangChain Academy (Free)", "https://www.langchain.com/langgraph"],
    ["Multi-Agent Tutorial", "https://langchain-ai.github.io/langgraph/tutorials/multi_agent/multi-agent-collaboration/"],
    ["Andrew Ng Agentic AI", "https://deeplearning.ai"],
  ],
  "LLM Fine-Tuning": [
    ["HF LLM Course — SFT", "https://huggingface.co/learn/llm-course/en/chapter11/1"],
    ["HF LLM Course — LoRA", "https://huggingface.co/learn/llm-course/en/chapter11/4"],
    ["Hands-On Fine-Tuning", "https://huggingface.co/blog/dvgodoy/fine-tuning-llm-hugging-face"],
    ["LLM Course Roadmap", "https://huggingface.co/blog/mlabonne/llm-course"],
  ],
  "Statistics & Experimentation": [
    ["Evan Miller A/B Testing Guide", "https://www.evanmiller.org/ab-testing/"],
    ["Kaggle Intro to ML (Free)", "https://www.kaggle.com/learn/intro-to-machine-learning"],
    ["Trustworthy Online Experiments (Book)", "https://experimentguide.com/"],
  ],
  "Foundations": [
    ["Karpathy Zero to Hero", "https://karpathy.ai/zero-to-hero.html"],
    ["Fast.ai Practical DL", "https://course.fast.ai"],
    ["DeepLearning.AI Short Courses", "https://www.deeplearning.ai/short-courses/"],
  ],
};

function ProgressRing({ pct, size = 54, stroke = 4, color }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
    </svg>
  );
}

export default function FinalPlan({ accessToken, onLogout }) {
  const [tasks, setTasks] = useState({});
  const [expanded, setExpanded] = useState(1);
  const [view, setView] = useState("plan");
  const [syncing, setSyncing] = useState(true);
  const firstLoadRef = useRef(false);

  // Load progress from API on mount
  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE_URL;
    if (!accessToken || !API) { setSyncing(false); return; }
    fetch(`${API}/progress`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : {})
      .then(data => { setTasks(data); setSyncing(false); })
      .catch(() => setSyncing(false));
  }, [accessToken]);

  // Save progress immediately on every change — no debounce so a refresh never loses data
  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE_URL;
    if (!accessToken || !API) return;
    if (!firstLoadRef.current) { firstLoadRef.current = true; return; }
    fetch(`${API}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(tasks),
    }).catch(console.error);
  }, [tasks]);

  const toggle = (w, d) => { const k = `${w}-${d}`; setTasks(p => ({ ...p, [k]: !p[k] })); };
  const wp = (wn) => { const w = WEEKS.find(x => x.week === wn); if (!w) return { d: 0, t: 0, p: 0 }; const t = w.daily.length; const d = w.daily.filter((_, i) => tasks[`${wn}-${i}`]).length; return { d, t, p: Math.round((d/t)*100) }; };
  const totalT = WEEKS.reduce((s, w) => s + w.daily.length, 0);
  const totalD = Object.values(tasks).filter(Boolean).length;
  const totalP = Math.round((totalD / totalT) * 100);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0e1a", color: "#e2e8f0", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .wc:hover { border-color: #334155 !important; }
        .dr:hover { background: #1e293b22 !important; }
      `}</style>

      <div style={{ background: "linear-gradient(135deg, #0f172a, #1a1040, #0f172a)", padding: "22px 18px 14px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h1 style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>
                14-Week <span style={{ color: "#14b8a6" }}>AI Career Blitz</span>
                <span style={{ fontSize: 12, color: "#f59e0b", marginLeft: 8, fontWeight: 500 }}>Agoda-Ready Edition</span>
              </h1>
              <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Apr 14 → Jul 21, 2026 · ~30 hrs/week · Staff/Lead LLM Data Scientist track</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {syncing && <span style={{ fontSize: 11, color: "#475569" }}>Syncing…</span>}
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ProgressRing pct={totalP} color="#14b8a6" />
                <span style={{ position: "absolute", fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: "#14b8a6" }}>{totalP}%</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "'JetBrains Mono'" }}>{totalD}/{totalT}</div>
              {onLogout && (
                <button onClick={onLogout} style={{
                  fontSize: 11, padding: "3px 9px", background: "transparent",
                  border: "1px solid #334155", borderRadius: 5, color: "#64748b", cursor: "pointer",
                }}>Sign out</button>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 3, marginTop: 12 }}>
            {["plan","agoda","milestones","resources"].map(t => (
              <button key={t} onClick={() => setView(t)} style={{
                padding: "5px 12px", fontSize: 11, fontWeight: 500, border: "none", borderRadius: 5, cursor: "pointer",
                background: view === t ? "#14b8a6" : "transparent", color: view === t ? "#0a0e1a" : "#94a3b8", textTransform: "capitalize",
              }}>{t === "agoda" ? "Agoda Fit" : t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "14px 18px 36px" }}>

        {view === "plan" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", gap: 2, marginBottom: 16, borderRadius: 6, overflow: "hidden", height: 26 }}>
              {WEEKS.map(w => { const p = wp(w.week); const m = PHASE_META[w.phase]; return (
                <div key={w.week} onClick={() => setExpanded(w.week)} style={{
                  flex: 1, background: p.p === 100 ? m.color : m.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  border: expanded === w.week ? `2px solid ${m.color}` : "2px solid transparent", borderRadius: 3, transition: "all 0.2s",
                }}><span style={{ fontSize: 9, fontWeight: 700, color: p.p === 100 ? "#0a0e1a" : m.color }}>{w.week}</span></div>
              ); })}
            </div>

            {WEEKS.map(w => {
              const m = PHASE_META[w.phase]; const p = wp(w.week); const isX = expanded === w.week;
              return (
                <div key={w.week} className="wc" style={{
                  background: "#0f1525", border: `1px solid ${isX ? m.color + "66" : "#1e293b"}`,
                  borderRadius: 9, marginBottom: 6, overflow: "hidden", borderLeft: `3px solid ${m.color}`,
                }}>
                  <div onClick={() => setExpanded(isX ? null : w.week)} style={{ padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{m.icon}</span>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: m.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>Week {w.week}</span>
                          <span style={{ fontSize: 9, color: "#475569", padding: "1px 5px", background: "#1e293b", borderRadius: 3 }}>{w.hours}</span>
                        </div>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginTop: 1 }}>{w.title}</h3>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 50, height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${p.p}%`, height: "100%", background: m.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: p.p === 100 ? m.color : "#64748b" }}>{p.d}/{p.t}</span>
                      <span style={{ fontSize: 12, color: "#475569", transform: isX ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▾</span>
                    </div>
                  </div>

                  {isX && (
                    <div style={{ animation: "fadeIn 0.2s ease" }}>
                      <div style={{ padding: "0 14px 4px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>{w.focus}</div>
                      <div style={{ borderTop: "1px solid #1e293b" }}>
                        {w.daily.map((d, di) => (
                          <label key={di} className="dr" style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 14px", cursor: "pointer", borderBottom: di < w.daily.length - 1 ? "1px solid #1e293b11" : "none", textAlign: "left" }}>
                            <input type="checkbox" checked={!!tasks[`${w.week}-${di}`]} onChange={() => toggle(w.week, di)}
                              style={{ marginTop: 3, accentColor: m.color, width: 14, height: 14, cursor: "pointer", flexShrink: 0 }} />
                            <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 6 }}>
                              <span style={{ fontSize: 10, fontWeight: 600, color: m.color, minWidth: 26, flexShrink: 0 }}>{d.day}</span>
                              <span style={{ fontSize: 12.5, color: tasks[`${w.week}-${di}`] ? "#475569" : "#cbd5e1", textDecoration: tasks[`${w.week}-${di}`] ? "line-through" : "none" }}>{d.task}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                      <div style={{ padding: "10px 14px", background: "#0a0e1a", borderTop: "1px solid #1e293b" }}>
                        <div style={{ marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Deliverables</span>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
                            {w.deliverables.map((d, i) => (
                              <span key={i} style={{ fontSize: 10, padding: "2px 7px", background: m.bg, color: m.color, borderRadius: 4, border: `1px solid ${m.color}33` }}>{d}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Agoda Skills Covered</span>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
                            {w.agodaSkills.map((s, i) => (
                              <span key={i} style={{ fontSize: 10, padding: "2px 7px", background: "#f59e0b15", color: "#f59e0b", borderRadius: 4, border: "1px solid #f59e0b33" }}>{s}</span>
                            ))}
                          </div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Checkpoint</span>
                        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>✓ {w.checkpoint}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {view === "agoda" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ padding: "14px 16px", background: "#f59e0b10", border: "1px solid #f59e0b33", borderRadius: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f59e0b", marginBottom: 4 }}>Agoda: Staff/Lead LLM Data Scientist</h3>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Bangkok, Thailand · Relocation provided · LLM systems for travel booking at scale</p>
            </div>

            <div style={{ background: "#0f1525", border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>JD Requirement</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Where You'll Build It</span>
              </div>
              {AGODA_MAP.map((item, i) => (
                <div key={i} style={{ padding: "10px 16px", borderBottom: i < AGODA_MAP.length - 1 ? "1px solid #1e293b11" : "none", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: "#e2e8f0" }}>{item.req}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{item.detail}</div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 80 }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#14b8a620", color: "#14b8a6", fontWeight: 600 }}>
                      ✓ {item.weeks}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: "14px 16px", background: "#14b8a610", border: "1px solid #14b8a633", borderRadius: 10 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: "#14b8a6", marginBottom: 6 }}>After 14 Weeks, You Can Say This in Your Application</h4>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>
                "I built and deployed a production multi-agent travel research system on AWS that routes user intent to specialized agents, uses RAG + web search for retrieval, tracks latency and cost per query, and includes an automated LLM evaluation pipeline with 50+ test cases. I've also fine-tuned open-source models with LoRA, published the results on Hugging Face Hub, and hold the AWS AI Practitioner certification. Everything is live, documented, and open source."
              </div>
            </div>
          </div>
        )}

        {view === "milestones" && (
          <div style={{ animation: "fadeIn 0.3s ease", padding: "8px 0" }}>
            <div style={{ position: "relative", paddingLeft: 26 }}>
              <div style={{ position: "absolute", left: 8, top: 6, bottom: 6, width: 2, background: "#1e293b" }} />
              {MILESTONES.map((ml, i) => {
                const done = wp(ml.week).p === 100;
                return (
                  <div key={i} style={{ position: "relative", marginBottom: 24 }}>
                    <div style={{ position: "absolute", left: -20, top: 3, width: 16, height: 16, borderRadius: "50%", background: done ? ml.color : "#0a0e1a", border: `2px solid ${done ? ml.color : "#334155"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {done && <span style={{ color: "#0a0e1a", fontSize: 9, fontWeight: 700 }}>✓</span>}
                    </div>
                    <div style={{ paddingLeft: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: ml.color, textTransform: "uppercase" }}>End of Week {ml.week}</span>
                      <div style={{ fontSize: 13, fontWeight: 500, color: done ? "#14b8a6" : "#e2e8f0", marginTop: 1 }}>{ml.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, padding: 14, background: "#0f1525", border: "1px solid #1e293b", borderRadius: 10 }}>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>Final Portfolio After 14 Weeks</h4>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>
                <strong style={{ color: "#14b8a6" }}>1 AWS Certification</strong> + second in progress<br/>
                <strong style={{ color: "#8b5cf6" }}>4 Deployed Projects</strong> on AWS with live URLs<br/>
                <strong style={{ color: "#f59e0b" }}>1 Published Model</strong> on Hugging Face Hub<br/>
                <strong style={{ color: "#ef4444" }}>4 Technical Blog Posts</strong> with real architecture stories<br/>
                <strong style={{ color: "#ec4899" }}>1+ Open Source PR</strong> to LangChain/LlamaIndex/ChromaDB<br/>
                <strong style={{ color: "#3b82f6" }}>OMSCS Application</strong> submitted for Georgia Tech MS
              </div>
            </div>
          </div>
        )}

        {view === "resources" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {Object.entries(RESOURCES).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, color: "#14b8a6", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 6 }}>
                  {items.map(([name, url], i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{
                      display: "block", padding: "10px 14px", background: "#0f1525", border: "1px solid #1e293b", borderRadius: 7, textDecoration: "none", color: "#e2e8f0", fontSize: 12, fontWeight: 500
                    }}>{name}<div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>{url.replace("https://","").substring(0,45)}...</div></a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
