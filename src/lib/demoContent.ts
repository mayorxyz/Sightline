export interface DemoPathCard {
  id: 'sandbox' | 'walkthrough';
  badge: string;
  duration: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  variant: 'sand' | 'navy';
}

export const DEMO_PATHS: DemoPathCard[] = [
  {
    id: 'sandbox',
    badge: 'Self-serve',
    duration: '5 min · No signup',
    title: 'Try the sandbox',
    description:
      'Explore preloaded production agents, inspect waterfalls, run an eval suite, and simulate live alert spikes in your browser.',
    bullets: [
      '12 multi-step agent traces ready to inspect',
      'Interactive eval threshold & rule builder',
      'Zero API keys or SDK setup required',
    ],
    ctaLabel: 'Launch Sandbox',
    variant: 'sand',
  },
  {
    id: 'walkthrough',
    badge: 'Guided session',
    duration: '30 min · Live engineer',
    title: 'Book a live walkthrough',
    description:
      'Pair with a solutions engineer on your own agent workflows, review cost and latency bottlenecks, and leave with a rollout plan.',
    bullets: [
      'Tailored to your model & orchestration stack',
      'Live instrumentation walkthrough on one flow',
      'Architecture, retention & VPC security review',
    ],
    ctaLabel: 'Pick a Time',
    variant: 'navy',
  },
];

export const WIZARD_ROLES = [
  'ML Engineer',
  'Platform',
  'Product',
  'Founder',
  'Other',
] as const;

export const TEAM_SIZES = ['1-10', '11-50', '51-200', '200+'] as const;

export const AGENT_FRAMEWORKS = [
  'LangChain',
  'LlamaIndex',
  'OpenAI SDK',
  'Custom',
] as const;

export const MONTHLY_TRACE_RANGES = [
  'Under 50K / mo',
  '50K – 500K / mo',
  '500K – 5M / mo',
  '5M – 25M / mo',
  '25M+ / mo',
] as const;

export const DEMO_GOALS = [
  'Debugging',
  'Cost control',
  'Evals',
  'Alerts',
  'Compliance',
] as const;

export type DemoGoal = (typeof DEMO_GOALS)[number];

export const GOAL_CHECKLIST_MAP: Record<DemoGoal, {title: string; detail: string}> = {
  Debugging: {
    title: 'Span waterfall & retry attribution',
    detail: 'Inspect tool payloads, model latency, and cascading loops.',
  },
  'Cost control': {
    title: 'Per-agent token economics',
    detail: 'Track model splits, cache hit rates, and spend caps.',
  },
  Evals: {
    title: 'CI & live quality gates',
    detail: 'Run groundedness and hallucination checks on golden sets.',
  },
  Alerts: {
    title: 'Real-time regression routing',
    detail: 'Threshold rules into Slack, Email, and PagerDuty.',
  },
  Compliance: {
    title: 'Edge PII redaction & VPC',
    detail: 'Review SOC 2 controls, residency, and audit exports.',
  },
};

export const COMMON_TIMEZONES = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Singapore',
  'Asia/Tokyo',
  'UTC',
] as const;

export interface DemoBookingData {
  fullName: string;
  workEmail: string;
  company: string;
  role: string;
  teamSize: string;
  framework: string;
  monthlyTraces: string;
  notes: string;
  goals: DemoGoal[];
  dateIso: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm (24h)
  timezone: string;
}

export interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  bio: string;
  accent: string;
}

export const DEMO_TEAM: TeamMember[] = [
  {
    id: 'se',
    initials: 'MK',
    name: 'Marcus K.',
    role: 'Solutions Engineer',
    bio: 'Helps teams instrument Python and TypeScript agents with OpenTelemetry in under 10 minutes.',
    accent: 'bg-[#0B2FA8] text-white',
  },
  {
    id: 'ml',
    initials: 'SP',
    name: 'Sana P.',
    role: 'ML Specialist',
    bio: 'Designs custom LLM-as-judge eval rubrics and catch-rate benchmarks for multi-turn workflows.',
    accent: 'bg-[#0A1F6B] text-[#D9C4A8]',
  },
  {
    id: 'pl',
    initials: 'DR',
    name: 'Devon R.',
    role: 'Product Lead',
    bio: 'Walks through roadmap alignment, enterprise VPC deployments, and volume pricing models.',
    accent: 'bg-[#D9C4A8] text-[#0A1F6B]',
  },
];

export interface PrepItem {
  id: string;
  title: string;
  hint: string;
}

export const PREP_CHECKLIST_ITEMS: PrepItem[] = [
  {
    id: 'trace-export',
    title: 'Sample trace export',
    hint: 'Optional JSON log or staging endpoint from one representative agent run.',
  },
  {
    id: 'agent-list',
    title: 'List of agents',
    hint: 'Names and primary orchestration frameworks (LangChain, LlamaIndex, or custom).',
  },
  {
    id: 'monthly-spend',
    title: 'Current monthly spend',
    hint: 'Rough LLM token bill and daily trace volume for accurate retention sizing.',
  },
  {
    id: 'success-criteria',
    title: 'Success criteria',
    hint: 'Top 1–2 regressions or latency targets you want caught automatically.',
  },
];

export const DEMO_PAGE_FAQS = [
  {
    question: 'Is it free?',
    answer:
      'Yes—both the interactive browser sandbox and the 30-minute live walkthrough with an engineer are completely free, with no credit card required.',
  },
  {
    question: 'Do I need to share data?',
    answer:
      'No. You can run the session using our synthetic sandbox streams, or send anonymized staging traces with edge PII redaction enabled.',
  },
  {
    question: 'How long to set up?',
    answer:
      'Most engineering teams wrap their first agent in under 5 minutes by installing our Python or TypeScript SDK and wrapping the run handler.',
  },
  {
    question: 'Can my team join?',
    answer:
      'Of course. Invite ML engineers, platform leads, product managers, or security reviewers directly using the calendar invite generated after booking.',
  },
  {
    question: 'What happens after?',
    answer:
      'You receive a tailored instrumentation guide, a dedicated 14-day Team trial workspace, and direct Slack access if you want follow-up help.',
  },
];

// --- Sandbox Data ---

export interface SandboxTraceSpan {
  name: string;
  type: 'planner' | 'tool' | 'llm' | 'guardrail';
  durationMs: number;
  tokens: number;
  status: 'ok' | 'retry' | 'fail';
}

export interface SandboxTraceRun {
  id: string;
  agent: string;
  status: 'ok' | 'degraded' | 'fail';
  durationMs: number;
  cost: number;
  timestamp: string;
  model: string;
  prompt: string;
  response: string;
  spans: SandboxTraceSpan[];
}

export const SANDBOX_TRACES: SandboxTraceRun[] = [
  {
    id: 'tr_94c2',
    agent: 'Support-Triage',
    status: 'ok',
    durationMs: 1420,
    cost: 0.0038,
    timestamp: '12s ago',
    model: 'claude-sonnet',
    prompt: 'Customer asks why invoice #4812 shows a duplicate seat charge on Nov 18.',
    response: 'Verified Stripe charge ch_3Q9x. Duplicate webhook retry detected; issued automated $49 credit memo.',
    spans: [
      {name: 'Planner', type: 'planner', durationMs: 110, tokens: 320, status: 'ok'},
      {name: 'search_kb', type: 'tool', durationMs: 300, tokens: 940, status: 'ok'},
      {name: 'claude-sonnet', type: 'llm', durationMs: 910, tokens: 1840, status: 'ok'},
      {name: 'guardrail', type: 'guardrail', durationMs: 100, tokens: 80, status: 'ok'},
    ],
  },
  {
    id: 'tr_94c1',
    agent: 'Refund-Resolver',
    status: 'fail',
    durationMs: 2910,
    cost: 0.0094,
    timestamp: '28s ago',
    model: 'claude-sonnet',
    prompt: 'Process partial refund for enterprise annual contract #ENT-209 within 14-day window.',
    response: 'Hallucinated unsupported 90-day refund clause; blocked by policy guardrail before refund_api executed.',
    spans: [
      {name: 'Policy Check', type: 'planner', durationMs: 280, tokens: 490, status: 'ok'},
      {name: 'refund_api (retry)', type: 'tool', durationMs: 1200, tokens: 610, status: 'retry'},
      {name: 'claude-sonnet', type: 'llm', durationMs: 1340, tokens: 2450, status: 'ok'},
      {name: 'eval_gate', type: 'guardrail', durationMs: 90, tokens: 120, status: 'fail'},
    ],
  },
  {
    id: 'tr_94b9',
    agent: 'Code-Reviewer',
    status: 'ok',
    durationMs: 3100,
    cost: 0.0112,
    timestamp: '44s ago',
    model: 'gpt-4.1',
    prompt: 'Review PR #1184: migrate session store to Redis cluster with TLS.',
    response: 'Flagged missing connection timeout on Redis failover path; suggested exponential backoff config.',
    spans: [
      {name: 'AST Diff', type: 'planner', durationMs: 320, tokens: 640, status: 'ok'},
      {name: 'repo_grep', type: 'tool', durationMs: 420, tokens: 1280, status: 'ok'},
      {name: 'gpt-4.1', type: 'llm', durationMs: 2240, tokens: 3420, status: 'ok'},
      {name: 'post_comment', type: 'guardrail', durationMs: 120, tokens: 150, status: 'ok'},
    ],
  },
  {
    id: 'tr_94b8',
    agent: 'Lead-Enricher',
    status: 'degraded',
    durationMs: 2180,
    cost: 0.0029,
    timestamp: '1m ago',
    model: 'gemini-2.5',
    prompt: 'Enrich inbound signup domain acme-robotics.io with firmographics and ARR band.',
    response: 'Primary Clearbit call timed out at 700ms; fallback Crunchbase tool succeeded on attempt 2.',
    spans: [
      {name: 'CRM Lookup', type: 'planner', durationMs: 210, tokens: 290, status: 'ok'},
      {name: 'clearbit_retry', type: 'tool', durationMs: 940, tokens: 410, status: 'retry'},
      {name: 'gemini-2.5', type: 'llm', durationMs: 950, tokens: 1510, status: 'ok'},
      {name: 'upsert_lead', type: 'guardrail', durationMs: 80, tokens: 95, status: 'ok'},
    ],
  },
  {
    id: 'tr_94b5',
    agent: 'Support-Triage',
    status: 'ok',
    durationMs: 1180,
    cost: 0.0031,
    timestamp: '2m ago',
    model: 'claude-sonnet',
    prompt: 'User cannot rotate OAuth signing secret in EU workspace.',
    response: 'Returned step-by-step Workspace Settings > Security flow and confirmed RBAC Admin permission required.',
    spans: [
      {name: 'Planner', type: 'planner', durationMs: 95, tokens: 240, status: 'ok'},
      {name: 'search_kb', type: 'tool', durationMs: 245, tokens: 810, status: 'ok'},
      {name: 'claude-sonnet', type: 'llm', durationMs: 780, tokens: 1490, status: 'ok'},
      {name: 'guardrail', type: 'guardrail', durationMs: 60, tokens: 70, status: 'ok'},
    ],
  },
  {
    id: 'tr_94b2',
    agent: 'SQL-Analyst',
    status: 'ok',
    durationMs: 1940,
    cost: 0.0064,
    timestamp: '3m ago',
    model: 'gpt-4.1',
    prompt: 'Compare weekly retention cohort for workspaces created after v2.4 release.',
    response: 'Executed read-only Snowflake query; D7 retention rose +6.4% across self-serve signups.',
    spans: [
      {name: 'Schema Fetch', type: 'planner', durationMs: 180, tokens: 520, status: 'ok'},
      {name: 'snowflake_ro', type: 'tool', durationMs: 610, tokens: 740, status: 'ok'},
      {name: 'gpt-4.1', type: 'llm', durationMs: 1090, tokens: 2100, status: 'ok'},
      {name: 'pii_scrub', type: 'guardrail', durationMs: 60, tokens: 90, status: 'ok'},
    ],
  },
  {
    id: 'tr_94a9',
    agent: 'Refund-Resolver',
    status: 'ok',
    durationMs: 1650,
    cost: 0.0044,
    timestamp: '4m ago',
    model: 'claude-sonnet',
    prompt: 'Cancel annual renewal for customer #8821 and prorate remaining 4 days.',
    response: 'Calculated $18.40 proration and scheduled invoice void at period end.',
    spans: [
      {name: 'Policy Check', type: 'planner', durationMs: 140, tokens: 310, status: 'ok'},
      {name: 'stripe_lookup', type: 'tool', durationMs: 360, tokens: 510, status: 'ok'},
      {name: 'claude-sonnet', type: 'llm', durationMs: 1070, tokens: 1790, status: 'ok'},
      {name: 'guardrail', type: 'guardrail', durationMs: 80, tokens: 85, status: 'ok'},
    ],
  },
  {
    id: 'tr_94a6',
    agent: 'Incident-Scribe',
    status: 'ok',
    durationMs: 1540,
    cost: 0.0033,
    timestamp: '5m ago',
    model: 'gemini-2.5',
    prompt: 'Summarize PagerDuty timeline for incident #INC-412 in us-east-1.',
    response: 'Compiled 14 Slack messages and 3 deploy events into a 5-bullet postmortem draft.',
    spans: [
      {name: 'Slack Fetch', type: 'tool', durationMs: 410, tokens: 1120, status: 'ok'},
      {name: 'Deploy Diff', type: 'tool', durationMs: 220, tokens: 430, status: 'ok'},
      {name: 'gemini-2.5', type: 'llm', durationMs: 840, tokens: 1960, status: 'ok'},
      {name: 'guardrail', type: 'guardrail', durationMs: 70, tokens: 65, status: 'ok'},
    ],
  },
  {
    id: 'tr_94a3',
    agent: 'Code-Reviewer',
    status: 'degraded',
    durationMs: 3640,
    cost: 0.0138,
    timestamp: '6m ago',
    model: 'gpt-4.1',
    prompt: 'Audit webhook signature verification PR #1179 for timing-attack safety.',
    response: 'Detected non-constant-time string equality; slow AST lookup triggered 1 retry.',
    spans: [
      {name: 'AST Diff', type: 'planner', durationMs: 480, tokens: 890, status: 'ok'},
      {name: 'repo_grep (retry)', type: 'tool', durationMs: 1010, tokens: 1540, status: 'retry'},
      {name: 'gpt-4.1', type: 'llm', durationMs: 2040, tokens: 3820, status: 'ok'},
      {name: 'post_comment', type: 'guardrail', durationMs: 110, tokens: 130, status: 'ok'},
    ],
  },
  {
    id: 'tr_949e',
    agent: 'Doc-Copilot',
    status: 'ok',
    durationMs: 980,
    cost: 0.0021,
    timestamp: '8m ago',
    model: 'gemini-2.5',
    prompt: 'Generate OpenTelemetry collector YAML snippet for self-hosted Kubernetes.',
    response: 'Returned validated otel-collector DaemonSet config with bearer auth header.',
    spans: [
      {name: 'Index Lookup', type: 'tool', durationMs: 210, tokens: 680, status: 'ok'},
      {name: 'gemini-2.5', type: 'llm', durationMs: 710, tokens: 1210, status: 'ok'},
      {name: 'guardrail', type: 'guardrail', durationMs: 60, tokens: 60, status: 'ok'},
    ],
  },
  {
    id: 'tr_9499',
    agent: 'Compliance-Guard',
    status: 'fail',
    durationMs: 2410,
    cost: 0.0056,
    timestamp: '10m ago',
    model: 'claude-sonnet',
    prompt: 'Draft outbound renewal summary for acme-health containing patient contact metadata.',
    response: 'Blocked response containing unredacted SSN pattern before email webhook dispatch.',
    spans: [
      {name: 'Context Load', type: 'planner', durationMs: 190, tokens: 410, status: 'ok'},
      {name: 'crm_fetch', type: 'tool', durationMs: 440, tokens: 920, status: 'ok'},
      {name: 'claude-sonnet', type: 'llm', durationMs: 1680, tokens: 2180, status: 'ok'},
      {name: 'pii_block', type: 'guardrail', durationMs: 100, tokens: 110, status: 'fail'},
    ],
  },
  {
    id: 'tr_9494',
    agent: 'Lead-Enricher',
    status: 'ok',
    durationMs: 1310,
    cost: 0.0025,
    timestamp: '12m ago',
    model: 'gemini-2.5',
    prompt: 'Classify enterprise demo request from northstar-ai.dev.',
    response: 'Assigned tier=Enterprise, industry=DevTools, routed to Solutions Engineering.',
    spans: [
      {name: 'CRM Lookup', type: 'planner', durationMs: 160, tokens: 250, status: 'ok'},
      {name: 'clearbit', type: 'tool', durationMs: 340, tokens: 480, status: 'ok'},
      {name: 'gemini-2.5', type: 'llm', durationMs: 740, tokens: 1320, status: 'ok'},
      {name: 'upsert_lead', type: 'guardrail', durationMs: 70, tokens: 80, status: 'ok'},
    ],
  },
];

export interface SandboxEvalCase {
  id: string;
  dataset: string;
  agent: string;
  scorer: string;
  score: number;
}

export const INITIAL_SANDBOX_EVALS: SandboxEvalCase[] = [
  {id: 'refund_policy_012', dataset: 'billing_v4', agent: 'Refund-Resolver', scorer: 'Groundedness', score: 0.96},
  {id: 'tone_check_044', dataset: 'support_gold', agent: 'Support-Triage', scorer: 'Tone & Empathy', score: 0.91},
  {id: 'hallucination_007', dataset: 'billing_v4', agent: 'Refund-Resolver', scorer: 'Hallucination', score: 0.42},
  {id: 'tool_choice_019', dataset: 'support_gold', agent: 'Support-Triage', scorer: 'Tool Accuracy', score: 0.88},
  {id: 'pii_leak_003', dataset: 'compliance_eu', agent: 'Compliance-Guard', scorer: 'PII Leak Guard', score: 0.99},
  {id: 'ast_security_011', dataset: 'pr_bench', agent: 'Code-Reviewer', scorer: 'CVE Catch Rate', score: 0.84},
];

export interface TourStep {
  id: string;
  targetId: string;
  tab?: 'overview' | 'traces' | 'evals' | 'cost' | 'alerts';
  title: string;
  body: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'overview',
    targetId: 'tour-overview',
    tab: 'overview',
    title: 'Overview KPIs & live stream',
    body: 'Track trace throughput, p95 latency, uptime, and unit cost in real time from a single shared ticker.',
  },
  {
    id: 'traces',
    targetId: 'tour-traces',
    tab: 'traces',
    title: 'Open any trace run',
    body: 'Click a run in the trace table to inspect its span waterfall, replay execution steps, or flag bad outputs.',
  },
  {
    id: 'evals',
    targetId: 'tour-evals',
    tab: 'evals',
    title: 'Run an automated eval',
    body: 'Adjust the pass-rate threshold slider and run your eval suite to catch hallucinations before deploy.',
  },
  {
    id: 'alerts',
    targetId: 'tour-alerts',
    tab: 'alerts',
    title: 'Set a regression alert',
    body: 'Configure metric thresholds, route to Slack or PagerDuty, and simulate a traffic spike.',
  },
  {
    id: 'cost',
    targetId: 'tour-cost',
    tab: 'cost',
    title: 'Inspect cost & latency',
    body: 'Switch time ranges and group spend by model, agent, or team to spot runaway prompt loops.',
  },
  {
    id: 'share',
    targetId: 'tour-share',
    title: 'Share a filtered view',
    body: 'Copy a snapshot link to share any trace, cost breakdown, or failing eval directly with your team.',
  },
];

export type SandboxActionId =
  | 'overview'
  | 'open_trace'
  | 'run_eval'
  | 'set_alert'
  | 'check_cost'
  | 'share_view';

export const SANDBOX_SCORE_LABELS: {id: SandboxActionId; label: string}[] = [
  {id: 'overview', label: 'Inspect live KPIs'},
  {id: 'open_trace', label: 'Open a trace waterfall'},
  {id: 'run_eval', label: 'Run eval suite'},
  {id: 'set_alert', label: 'Simulate an alert'},
  {id: 'check_cost', label: 'Check cost & group-by'},
  {id: 'share_view', label: 'Share a sandbox view'},
];
