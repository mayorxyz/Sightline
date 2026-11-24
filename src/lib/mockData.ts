export interface KpiSpec {
  id: string;
  label: string;
  target: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  delta: string;
  deltaPositive: boolean;
  initialSpark: number[];
  walkStep: number;
  min: number;
  max: number;
}

export const KPI_SPECS: KpiSpec[] = [
  {
    id: 'traces',
    label: 'TRACES / DAY',
    target: 2.3,
    decimals: 1,
    suffix: 'M',
    delta: '+4.2%',
    deltaPositive: true,
    initialSpark: [1.9, 1.95, 2.0, 1.98, 2.05, 2.1, 2.08, 2.12, 2.15, 2.18, 2.16, 2.2, 2.24, 2.22, 2.25, 2.27, 2.26, 2.29, 2.28, 2.3],
    walkStep: 0.04,
    min: 1.85,
    max: 2.55,
  },
  {
    id: 'latency',
    label: 'P95 LATENCY',
    target: 1.84,
    decimals: 2,
    suffix: 's',
    delta: '-0.12s',
    deltaPositive: true,
    initialSpark: [2.04, 2.01, 1.98, 2.02, 1.96, 1.95, 1.93, 1.97, 1.92, 1.89, 1.91, 1.88, 1.87, 1.89, 1.86, 1.85, 1.87, 1.85, 1.83, 1.84],
    walkStep: 0.05,
    min: 1.65,
    max: 2.15,
  },
  {
    id: 'uptime',
    label: 'UPTIME',
    target: 99.97,
    decimals: 2,
    suffix: '%',
    delta: '0.00%',
    deltaPositive: true,
    initialSpark: [99.95, 99.96, 99.96, 99.97, 99.96, 99.97, 99.97, 99.98, 99.97, 99.97, 99.96, 99.97, 99.98, 99.97, 99.97, 99.97, 99.98, 99.97, 99.97, 99.97],
    walkStep: 0.01,
    min: 99.92,
    max: 100.0,
  },
  {
    id: 'cost',
    label: 'COST / RUN',
    target: 0.0042,
    decimals: 4,
    prefix: '$',
    delta: '-$0.0003',
    deltaPositive: true,
    initialSpark: [0.0047, 0.0046, 0.0046, 0.0045, 0.0046, 0.0045, 0.0044, 0.0045, 0.0044, 0.0043, 0.0044, 0.0043, 0.0043, 0.0042, 0.0043, 0.0042, 0.0042, 0.0043, 0.0042, 0.0042],
    walkStep: 0.00015,
    min: 0.0036,
    max: 0.0051,
  },
];

export interface StreamPoint {
  time: string;
  traces: number;
  errors: number;
}

export function createInitialStreamSeries(): StreamPoint[] {
  const pts: StreamPoint[] = [];
  const now = Date.now();
  for (let i = 59; i >= 0; i--) {
    const d = new Date(now - i * 1000);
    const label = d.toTimeString().slice(0, 8);
    const wave = Math.sin((60 - i) * 0.28) * 24 + Math.cos((60 - i) * 0.13) * 14;
    const spike = i === 18 || i === 42 ? 78 : 0;
    const errSpike = i === 18 ? 16 : i === 42 ? 9 : (i % 7 === 0 ? 3 : 1);
    pts.push({
      time: label,
      traces: Math.round(380 + wave + spike),
      errors: errSpike,
    });
  }
  return pts;
}

export interface LogTemplate {
  event: string;
  detail: string;
  duration: string;
  kind: 'tool' | 'retry' | 'llm' | 'guardrail' | 'eval' | 'output';
  status: 'ok' | 'retry' | 'fail';
}

export const LOG_TEMPLATES: LogTemplate[] = [
  {event: 'tool_call', detail: 'search_kb', duration: '312ms', kind: 'tool', status: 'ok'},
  {event: 'retry', detail: 'rate_limit', duration: '1.2s', kind: 'retry', status: 'retry'},
  {event: 'llm_call', detail: 'claude-sonnet', duration: '1.1s', kind: 'llm', status: 'ok'},
  {event: 'guardrail', detail: 'pass', duration: '9ms', kind: 'guardrail', status: 'ok'},
  {event: 'tool_call', detail: 'refund_api', duration: '204ms', kind: 'tool', status: 'ok'},
  {event: 'eval', detail: 'fail hallucination_007', duration: '—', kind: 'eval', status: 'fail'},
  {event: 'output', detail: 'sent', duration: '4ms', kind: 'output', status: 'ok'},
];

export interface AgentRowData {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'retrying';
  runs: number;
  p95: number;
  errorRate: number;
  cost: number;
  waterfall: {label: string; startMs: number; endMs: number; color: string}[];
}

export const INITIAL_AGENTS: AgentRowData[] = [
  {
    id: 'support-triage',
    name: 'Support-Triage',
    status: 'healthy',
    runs: 48210,
    p95: 1.42,
    errorRate: 0.4,
    cost: 201,
    waterfall: [
      {label: 'Classifier', startMs: 0, endMs: 110, color: '#0B2FA8'},
      {label: 'search_kb', startMs: 110, endMs: 410, color: '#3B66F5'},
      {label: 'claude-sonnet', startMs: 410, endMs: 1320, color: '#D9C4A8'},
      {label: 'guardrail', startMs: 1320, endMs: 1420, color: '#FFFFFF'},
    ],
  },
  {
    id: 'refund-resolver',
    name: 'Refund-Resolver',
    status: 'degraded',
    runs: 12904,
    p95: 2.91,
    errorRate: 2.3,
    cost: 88,
    waterfall: [
      {label: 'Policy Check', startMs: 0, endMs: 280, color: '#0B2FA8'},
      {label: 'refund_api (retry)', startMs: 280, endMs: 1480, color: '#F59E0B'},
      {label: 'claude-sonnet', startMs: 1480, endMs: 2820, color: '#D9C4A8'},
      {label: 'eval_gate', startMs: 2820, endMs: 2910, color: '#EF4444'},
    ],
  },
  {
    id: 'code-reviewer',
    name: 'Code-Reviewer',
    status: 'healthy',
    runs: 7633,
    p95: 3.1,
    errorRate: 0.9,
    cost: 164,
    waterfall: [
      {label: 'AST Diff', startMs: 0, endMs: 320, color: '#0B2FA8'},
      {label: 'repo_grep', startMs: 320, endMs: 740, color: '#3B66F5'},
      {label: 'gpt-4.1', startMs: 740, endMs: 2980, color: '#D9C4A8'},
      {label: 'post_comment', startMs: 2980, endMs: 3100, color: '#FFFFFF'},
    ],
  },
  {
    id: 'lead-enricher',
    name: 'Lead-Enricher',
    status: 'retrying',
    runs: 21447,
    p95: 1.77,
    errorRate: 1.6,
    cost: 59,
    waterfall: [
      {label: 'CRM Lookup', startMs: 0, endMs: 220, color: '#0B2FA8'},
      {label: 'clearbit_retry', startMs: 220, endMs: 920, color: '#F59E0B'},
      {label: 'gemini-2.5', startMs: 920, endMs: 1710, color: '#D9C4A8'},
      {label: 'upsert_lead', startMs: 1710, endMs: 1770, color: '#FFFFFF'},
    ],
  },
];

export interface ModelSegment {
  id: string;
  name: string;
  pct: number;
  runs: string;
  color: string;
}

export const MODEL_USAGE: ModelSegment[] = [
  {id: 'claude-sonnet', name: 'claude-sonnet', pct: 44, runs: '1.01M', color: '#2958FF'},
  {id: 'gpt-4.1', name: 'gpt-4.1', pct: 38, runs: '874K', color: '#D9C4A8'},
  {id: 'gemini-2.5', name: 'gemini-2.5', pct: 18, runs: '414K', color: '#FFFFFF'},
];

// --- Phase 6: Product, Pricing, Demo & Footer Data ---

export interface ProductTabItem {
  id: 'tracing' | 'evals' | 'cost' | 'alerts';
  label: string;
  heading: string;
  description: string;
  bullets: string[];
}

export const PRODUCT_TABS: ProductTabItem[] = [
  {
    id: 'tracing',
    label: 'Tracing',
    heading: 'End-to-end execution spans for every agent run',
    description:
      'Follow multi-step reasoning loops, retrieval chunks, tool retries, and guardrail decisions in one timeline with millisecond resolution.',
    bullets: [
      'Automatic OpenTelemetry and SDK context propagation',
      'Pinpoint slow tool calls and cascading retry loops',
      'Inspect full prompt, completion, and tool payloads safely',
    ],
  },
  {
    id: 'evals',
    label: 'Evals',
    heading: 'Continuous quality gates on live production traffic',
    description:
      'Score groundedness, tone, tool selection, and PII compliance automatically before regressions reach customers.',
    bullets: [
      'Run deterministic and LLM-as-judge evaluators in parallel',
      'Compare prompt versions side-by-side on golden datasets',
      'Flag hallucinated claims with span-level attribution',
    ],
  },
  {
    id: 'cost',
    label: 'Cost',
    heading: 'Real-time token economics and latency budgets',
    description:
      'Break down spend by model, agent workflow, and customer tier while tracking p95 latency drift across providers.',
    bullets: [
      'Per-run cost attribution across OpenAI, Anthropic, and Gemini',
      'Prompt-cache hit rate monitoring and token anomaly alerts',
      'Compare latency vs accuracy before switching model tiers',
    ],
  },
  {
    id: 'alerts',
    label: 'Alerts',
    heading: 'Actionable alerts routed where your engineers work',
    description:
      'Trigger threshold and anomaly alerts on hallucination spikes, tool failures, or latency breaches with zero noisy log hunting.',
    bullets: [
      'Sub-minute Slack, Email, and PagerDuty alert routing',
      'Attach direct trace links inside every incident payload',
      'Auto-resolve notifications once eval scores recover',
    ],
  },
];

export interface IntegrationItem {
  name: string;
  category: string;
  abbr: string;
}

export const INTEGRATIONS: IntegrationItem[] = [
  {name: 'OpenAI', category: 'Model Provider', abbr: 'OA'},
  {name: 'Anthropic', category: 'Model Provider', abbr: 'AN'},
  {name: 'Gemini', category: 'Model Provider', abbr: 'GM'},
  {name: 'LangChain', category: 'Orchestration', abbr: 'LC'},
  {name: 'LlamaIndex', category: 'Retrieval', abbr: 'LI'},
  {name: 'Slack', category: 'Alerting', abbr: 'SL'},
  {name: 'PagerDuty', category: 'Incident Ops', abbr: 'PD'},
  {name: 'Datadog', category: 'Metrics Sink', abbr: 'DD'},
  {name: 'GitHub', category: 'CI Evals', abbr: 'GH'},
  {name: 'Postgres', category: 'Warehouse', abbr: 'PG'},
  {name: 'Snowflake', category: 'Warehouse', abbr: 'SF'},
  {name: 'Webhooks', category: 'Custom Events', abbr: 'WH'},
];

export type CodeLanguage = 'Python' | 'TypeScript' | 'cURL';

export const CODE_SNIPPETS: Record<CodeLanguage, string> = {
  Python: `from Sightline import OrchestrateClient

client = OrchestrateClient(api_key="oiq_live_98a4f...")

@client.trace_agent("support-triage")
def run_support_agent(ticket_id: str, query: str):
    with client.span("tool.search_kb", metadata={"ticket": ticket_id}) as span:
        docs = search_kb(query)
        span.set_attribute("docs.count", len(docs))
    return synthesize_answer(query, docs)`,
  TypeScript: `import { OrchestrateClient } from "@Sightline/sdk";

const client = new OrchestrateClient({
  apiKey: process.env.ORCHESTRATE_API_KEY,
});

export async function runSupportAgent(ticketId: string, query: string) {
  return client.traceAgent("support-triage", async (trace) => {
    const docs = await trace.span("tool.search_kb", { ticketId }, () =>
      searchKb(query)
    );
    return synthesizeAnswer(query, docs);
  });
}`,
  cURL: `curl -X POST https://ingest.Sightline.dev/v1/traces \\
  -H "Authorization: Bearer oiq_live_98a4f..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent": "support-triage",
    "span": "tool.search_kb",
    "duration_ms": 312,
    "status": "ok",
    "tokens": 1120
  }'`,
};

export interface SecurityItem {
  id: string;
  title: string;
  description: string;
}

export const SECURITY_ITEMS: SecurityItem[] = [
  {
    id: 'soc2',
    title: 'SOC 2 Type II',
    description: 'Independently audited controls across ingestion, storage, and access.',
  },
  {
    id: 'pii',
    title: 'PII Redaction',
    description: 'Edge scrubbing masks emails, SSNs, and secrets before storage.',
  },
  {
    id: 'sso',
    title: 'SSO / SAML',
    description: 'Enterprise identity federation with Okta, Google Workspace, and Entra.',
  },
  {
    id: 'residency',
    title: 'Data Residency EU/US',
    description: 'Pin trace telemetry and eval logs strictly to EU or US regions.',
  },
];

export interface PricingTier {
  id: 'starter' | 'team' | 'enterprise';
  name: string;
  badge?: string;
  tagline: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  priceSuffix: string;
  ctaLabel: string;
  ctaTo: string;
  featured?: boolean;
  features: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For solo builders and early agent prototypes.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceSuffix: '/ month',
    ctaLabel: 'Start Free',
    ctaTo: '/demo',
    features: [
      '50K traces / month included',
      '7-day trace retention',
      '1 project workspace',
      'Community Discord support',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    badge: 'Most Popular',
    tagline: 'For shipping reliable production agents together.',
    monthlyPrice: 49,
    yearlyPrice: 39,
    priceSuffix: '/ seat / mo',
    ctaLabel: 'Start Trial',
    ctaTo: '/demo',
    featured: true,
    features: [
      '5M traces / month included',
      '30-day trace retention',
      'Automated evals & drift alerts',
      'Slack routing & email support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Dedicated scale, compliance, and private deployment.',
    monthlyPrice: null,
    yearlyPrice: null,
    priceSuffix: 'Custom contract',
    ctaLabel: 'Contact Sales',
    ctaTo: '/demo',
    features: [
      'Unlimited traces & custom retention',
      'SSO/SAML & immutable audit logs',
      'Private VPC deployment option',
      'Dedicated engineer & 99.99% SLA',
    ],
  },
];

export interface ComparisonRow {
  feature: string;
  starter: string | boolean;
  team: string | boolean;
  enterprise: string | boolean;
}

export interface ComparisonGroup {
  id: string;
  title: string;
  rows: ComparisonRow[];
}

export const COMPARISON_GROUPS: ComparisonGroup[] = [
  {
    id: 'core',
    title: 'Core Observability',
    rows: [
      {feature: 'Monthly traces', starter: '50K', team: '5M', enterprise: 'Unlimited'},
      {feature: 'Trace retention', starter: '7 days', team: '30 days', enterprise: 'Custom (up to 365d)'},
      {feature: 'Projects', starter: '1', team: 'Unlimited', enterprise: 'Unlimited'},
      {feature: 'Custom models', starter: true, team: true, enterprise: true},
    ],
  },
  {
    id: 'quality',
    title: 'Quality & Alerting',
    rows: [
      {feature: 'Evals', starter: '100 / mo', team: 'Unlimited', enterprise: 'Unlimited + custom'},
      {feature: 'Alerts', starter: false, team: 'Slack & Email', enterprise: 'Slack, Email & PagerDuty'},
      {feature: 'SLA', starter: false, team: '99.9%', enterprise: '99.99%'},
      {feature: 'Support', starter: 'Community', team: 'Priority Email', enterprise: 'Dedicated Slack'},
    ],
  },
  {
    id: 'security',
    title: 'Security & Deployment',
    rows: [
      {feature: 'SSO', starter: false, team: false, enterprise: 'SAML / OIDC'},
      {feature: 'Audit logs', starter: false, team: '30 days', enterprise: 'Immutable export'},
      {feature: 'Data residency', starter: 'US', team: 'US / EU', enterprise: 'US / EU / Custom'},
      {feature: 'VPC deployment', starter: false, team: false, enterprise: true},
    ],
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const PRICING_FAQS: FaqItem[] = [
  {
    question: 'How does seat and trace billing work?',
    answer:
      'Team plans are billed per active seat ($49/mo monthly or $39/mo billed yearly) and include 5M monthly traces across your organization.',
  },
  {
    question: 'What happens when I hit the 50K free tier limit?',
    answer:
      'We notify you at 80% and 100% usage and never abruptly break your agent execution. You can upgrade to Team in one click or apply head-sampling.',
  },
  {
    question: 'How are trace overages priced on Team?',
    answer:
      'Additional traces beyond your 5M monthly allowance are billed transparently at $2.50 per 1M traces, with configurable hard spending caps.',
  },
  {
    question: 'Can we configure custom data retention windows?',
    answer:
      'Starter keeps traces for 7 days, Team for 30 days, and Enterprise customers can configure 90-day to 365-day retention or stream directly to Snowflake.',
  },
  {
    question: 'How do you protect sensitive prompt and user data?',
    answer:
      'Sightline is SOC 2 Type II certified with edge PII redaction before payloads ever reach disk, plus optional private VPC deployment on Enterprise.',
  },
  {
    question: 'Can I cancel or change plans at any time?',
    answer:
      'Yes. You can downgrade, pause, or cancel directly from workspace billing settings with zero lock-in fees.',
  },
];

export interface DemoTerminalStep {
  cmd: string;
  detail: string;
  latencyMs: number;
  status: 'ok' | 'info';
}

export const DEMO_TERMINAL_STEPS: DemoTerminalStep[] = [
  {cmd: 'agent.start', detail: 'Support-Triage', latencyMs: 12, status: 'info'},
  {cmd: 'tool_call', detail: 'search_kb 312ms', latencyMs: 312, status: 'ok'},
  {cmd: 'llm_call', detail: 'claude-sonnet 1.1s', latencyMs: 1100, status: 'ok'},
  {cmd: 'guardrail', detail: 'pass 9ms', latencyMs: 9, status: 'ok'},
  {cmd: 'output', detail: 'sent 4ms', latencyMs: 4, status: 'ok'},
];

export const DEMO_EXPECT_STEPS = [
  {
    step: '01',
    title: 'Intro call',
    description: '10 minutes aligning on your agent architecture, model stack, and failure modes.',
  },
  {
    step: '02',
    title: 'Live walkthrough on your data',
    description: 'Instrument one real agent flow and inspect spans, eval scores, and cost live.',
  },
  {
    step: '03',
    title: 'Tailored plan',
    description: 'Leave with a clear rollout checklist, retention sizing, and security review.',
  },
];

export const DEMO_FAQS: FaqItem[] = [
  {
    question: 'Do we need to prepare slides or production credentials?',
    answer:
      'No slides needed. You can test with our sandbox SDK key or bring a single staging agent endpoint to trace live during the call.',
  },
  {
    question: 'How long does SDK instrumentation take?',
    answer:
      'Most teams wrap their first agent in under 5 minutes using our Python or TypeScript decorator without rewriting orchestration logic.',
  },
  {
    question: 'Can security and platform engineers join the demo?',
    answer:
      'Yes—feel free to invite engineering leads, ML engineers, or security reviewers. We cover SOC 2, PII redaction, and VPC options on request.',
  },
];

export const FOOTER_COLUMNS = [
  {
    heading: 'Product',
    links: [
      {label: 'Agent Tracing', to: '/product/tracing'},
      {label: 'Automated Evals', to: '/product/evals'},
      {label: 'Cost & Latency', to: '/product/cost-latency'},
      {label: 'Pricing', to: '/pricing'},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'Home', to: '/'},
      {label: 'Book a Demo', to: '/demo'},
      {label: 'Customers', to: '/'},
      {label: 'Security', to: '/product'},
    ],
  },
  {
    heading: 'Resources',
    links: [
      {label: 'Python SDK', to: '/product'},
      {label: 'TypeScript SDK', to: '/product'},
      {label: 'Usage Calculator', to: '/pricing'},
      {label: 'Live Dashboard', to: '/'},
    ],
  },
  {
    heading: 'Legal',
    links: [
      {label: 'Privacy Policy', to: '/demo'},
      {label: 'Terms of Service', to: '/demo'},
      {label: 'SOC 2 Report', to: '/product'},
      {label: 'DPA', to: '/demo'},
    ],
  },
];

