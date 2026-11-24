import {FaqItem} from './mockData';

export type ProductIconKey =
  | 'tracing'
  | 'evals'
  | 'cost'
  | 'alerts'
  | 'security'
  | 'integrations';

export interface ProductNavItem {
  id: ProductIconKey;
  title: string;
  description: string;
  to: string;
}

export const PRODUCT_NAV_ITEMS: ProductNavItem[] = [
  {
    id: 'tracing',
    title: 'Tracing',
    description: 'End-to-end spans, tool calls, and session replays.',
    to: '/product/tracing',
  },
  {
    id: 'evals',
    title: 'Evals',
    description: 'Automated scorers and CI release gates.',
    to: '/product/evals',
  },
  {
    id: 'cost',
    title: 'Cost & Latency',
    description: 'Per-run token budgets and p50/p95/p99 tracking.',
    to: '/product/cost-latency',
  },
  {
    id: 'alerts',
    title: 'Alerts',
    description: 'Real-time rules routed to Slack and PagerDuty.',
    to: '/product/alerts',
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Edge PII redaction, SAML SSO, and VPC deploy.',
    to: '/product/security',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: '12+ connectors for models, frameworks, and sinks.',
    to: '/product/integrations',
  },
];

export interface ArchNode {
  id: string;
  label: string;
  tier: string;
  explanation: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ARCHITECTURE_NODES: ArchNode[] = [
  {
    id: 'sdk',
    label: 'SDK',
    tier: 'Ingest',
    explanation: 'Lightweight Python, TypeScript, and OpenTelemetry wrappers add <1ms overhead.',
    x: 24,
    y: 118,
    w: 112,
    h: 56,
  },
  {
    id: 'collector',
    label: 'Collector',
    tier: 'Edge',
    explanation: 'Edge gateway scrubs PII fields and batches spans before forwarding.',
    x: 184,
    y: 118,
    w: 126,
    h: 56,
  },
  {
    id: 'store',
    label: 'Trace Store',
    tier: 'Columnar',
    explanation: 'High-throughput columnar store indexes prompts, tool payloads, and latency.',
    x: 358,
    y: 118,
    w: 136,
    h: 56,
  },
  {
    id: 'evals',
    label: 'Evals',
    tier: 'Engine',
    explanation: 'Runs LLM-as-judge and deterministic checks asynchronously on sampled traffic.',
    x: 552,
    y: 36,
    w: 132,
    h: 52,
  },
  {
    id: 'cost',
    label: 'Cost Engine',
    tier: 'Engine',
    explanation: 'Attributes token spend and p95 latency by model, workflow, and tenant.',
    x: 552,
    y: 120,
    w: 132,
    h: 52,
  },
  {
    id: 'alerts',
    label: 'Alert Router',
    tier: 'Engine',
    explanation: 'Evaluates threshold and anomaly rules every 10 seconds with mute windows.',
    x: 552,
    y: 204,
    w: 132,
    h: 52,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    tier: 'Output',
    explanation: 'Live waterfall timelines, streaming charts, and prompt diff views.',
    x: 742,
    y: 36,
    w: 134,
    h: 52,
  },
  {
    id: 'slack',
    label: 'Slack',
    tier: 'Output',
    explanation: 'Actionable incident cards with direct links to the failing agent trace.',
    x: 742,
    y: 120,
    w: 134,
    h: 52,
  },
  {
    id: 'pagerduty',
    label: 'PagerDuty',
    tier: 'Output',
    explanation: 'Escalates critical error-rate or hallucination spikes to on-call engineers.',
    x: 742,
    y: 204,
    w: 134,
    h: 52,
  },
];

export const ARCHITECTURE_EDGES: {id: string; d: string}[] = [
  {id: 'a1', d: 'M 136 146 L 184 146'},
  {id: 'a2', d: 'M 310 146 L 358 146'},
  {id: 'a3', d: 'M 494 146 C 524 146, 522 62, 552 62'},
  {id: 'a4', d: 'M 494 146 L 552 146'},
  {id: 'a5', d: 'M 494 146 C 524 146, 522 230, 552 230'},
  {id: 'a6', d: 'M 684 62 L 742 62'},
  {id: 'a7', d: 'M 684 146 L 742 146'},
  {id: 'a8', d: 'M 684 230 L 742 230'},
];

export interface AudienceTab {
  id: 'ml' | 'platform' | 'product';
  label: string;
  headline: string;
  outcomes: string[];
  metricLabel: string;
  metricValue: string;
  widgetLines: {label: string; value: string; tone: string}[];
}

export const AUDIENCE_TABS: AudienceTab[] = [
  {
    id: 'ml',
    label: 'ML Engineers',
    headline: 'Debug reasoning failures without guessing from raw stdout.',
    outcomes: [
      'Compare prompt and system-instruction diffs across trace versions',
      'Pinpoint which retrieval chunk triggered a hallucinated answer',
      'Promote production failures directly into golden eval datasets',
    ],
    metricLabel: 'eval regression catch rate',
    metricValue: '98.4%',
    widgetLines: [
      {label: 'prompt_v14 vs v13', value: '+6.2% groundedness', tone: 'text-emerald-300'},
      {label: 'search_kb top_k=5', value: '0.94 recall@5', tone: 'text-[#D9C4A8]'},
      {label: 'hallucination_007', value: 'blocked in CI', tone: 'text-white'},
    ],
  },
  {
    id: 'platform',
    label: 'Platform Teams',
    headline: 'Keep latency, rate limits, and spend predictable at scale.',
    outcomes: [
      'Track p50, p95, and p99 latency across every external tool API',
      'Auto-detect provider 429 retry storms before queues back up',
      'Enforce edge PII redaction and regional EU/US storage policies',
    ],
    metricLabel: 'ingest availability',
    metricValue: '99.97%',
    widgetLines: [
      {label: 'OpenAI 429 retries', value: '0.3% (normal)', tone: 'text-emerald-300'},
      {label: 'PII edge redaction', value: '14,210 fields masked', tone: 'text-[#D9C4A8]'},
      {label: 'eu-west-1 collector', value: '11ms p95 ingest', tone: 'text-white'},
    ],
  },
  {
    id: 'product',
    label: 'Product Leads',
    headline: 'Measure whether agents actually solve user workflows.',
    outcomes: [
      'Track task completion rate and escalation volume by workflow',
      'Monitor unit economics per resolved support ticket or session',
      'Review flagged conversations in a structured human review queue',
    ],
    metricLabel: 'avg cost per resolved run',
    metricValue: '$0.0042',
    widgetLines: [
      {label: 'Support-Triage resolution', value: '87.4% autonomous', tone: 'text-emerald-300'},
      {label: 'Refund-Resolver CSAT', value: '4.7 / 5.0', tone: 'text-[#D9C4A8]'},
      {label: 'Weekly active sessions', value: '142,800 runs', tone: 'text-white'},
    ],
  },
];

export interface ProductSubPageData {
  id: ProductIconKey;
  tag: string;
  headlineTop: string;
  headlineItalic: string;
  sub: string;
  whatItIs: {
    title: string;
    body: string;
    chips: string[];
    diagramNodes: [string, string, string];
  };
  steps: {
    number: string;
    title: string;
    body: string;
    mockTag: string;
    mockValue: string;
  }[];
  capabilities: {
    title: string;
    body: string;
  }[];
  useCases: {
    title: string;
    problem: string;
    action: string;
    outcome: string;
    metric: string;
  }[];
  code: {
    python: string;
    ts: string;
    curl: string;
  };
  faq: FaqItem[];
  related: {
    title: string;
    description: string;
    to: string;
    tag: string;
  }[];
}

export const PRODUCT_PAGES: Record<ProductIconKey, ProductSubPageData> = {
  tracing: {
    id: 'tracing',
    tag: 'Tracing',
    headlineTop: 'See Every Span Inside',
    headlineItalic: 'Every Run',
    sub: 'Follow sessions, tool calls, retries, and prompt diffs down to the millisecond.',
    whatItIs: {
      title: 'Structured execution trees instead of scattered print logs.',
      body: 'Every agent run becomes a parent trace containing nested spans for prompts, retrieval queries, tool calls, and guardrails. Replay sessions, compare prompt revisions, and isolate slow dependencies without grepping server logs.',
      chips: ['OpenTelemetry Native', 'Session Replay', 'Prompt Diff'],
      diagramNodes: ['Session Root', 'Tool & LLM Spans', 'Verified Output'],
    },
    steps: [
      {
        number: '01',
        title: 'Capture Root Session',
        body: 'Start a trace automatically around each user conversation or background job.',
        mockTag: 'session_id',
        mockValue: 'sess_49a1',
      },
      {
        number: '02',
        title: 'Nest Tool & LLM Spans',
        body: 'Track search_kb calls, retries, and model generations in causal order.',
        mockTag: 'spans_linked',
        mockValue: '6 child spans',
      },
      {
        number: '03',
        title: 'Diff Prompt Revisions',
        body: 'Compare system prompts and token counts side by side across deployments.',
        mockTag: 'prompt_diff',
        mockValue: '-140 tokens',
      },
      {
        number: '04',
        title: 'Replay & Sample',
        body: 'Re-run failing inputs locally or configure tail sampling on slow traces.',
        mockTag: 'tail_sample',
        mockValue: '100% errors',
      },
    ],
    capabilities: [
      {
        title: 'Nested Trace Trees',
        body: 'Visualize multi-agent handoffs and recursive planner loops in one unified timeline.',
      },
      {
        title: 'Tool Retry Detection',
        body: 'Automatically flag 429 rate limits, timeouts, and fallback tool invocations.',
      },
      {
        title: 'Session Grouping',
        body: 'Link multi-turn user threads across stateless API requests with a single session ID.',
      },
      {
        title: 'Prompt & Response Diff',
        body: 'Highlight exact template changes and completion shifts between model versions.',
      },
      {
        title: 'Custom Span Attributes',
        body: 'Attach tenant IDs, feature flags, and retrieval scores to query any slice instantly.',
      },
      {
        title: 'Head & Tail Sampling',
        body: 'Keep 100% of error and slow traces while sampling routine healthy traffic.',
      },
    ],
    useCases: [
      {
        title: 'Isolating Cascade Timeouts',
        problem: 'Support-Triage p95 latency jumped to 4.8s with no obvious model slowdown.',
        action: 'Filtered waterfall spans by Tool calls and inspected retry timing.',
        outcome: 'Found an unindexed CRM lookup retrying twice per turn and added edge caching.',
        metric: '20 min to find root cause',
      },
      {
        title: 'Debugging Multi-Turn Drift',
        problem: 'Users reported agents forgetting refund constraints by turn four.',
        action: 'Opened session replay to inspect trimmed message history.',
        outcome: 'Fixed sliding window truncation so policy instructions stay pinned.',
        metric: '42% fewer escalations',
      },
      {
        title: 'Validating Custom Guardrails',
        problem: 'Safety checks were adding unpredictable overhead before streaming.',
        action: 'Instrumented guardrail steps as custom spans with token attributes.',
        outcome: 'Moved PII regex checks in-memory and cut guardrail overhead to 9ms.',
        metric: '9ms guardrail p95',
      },
    ],
    code: {
      python: `from Sightline import OrchestrateClient

client = OrchestrateClient(api_key="oiq_live_98a4f...")

@client.trace_agent("support-triage", sample_rate=1.0)
def handle_ticket(session_id: str, query: str):
    with client.span("tool.search_kb", session_id=session_id) as span:
        hits = search_kb(query)
        span.set_attribute("hits.count", len(hits))
    return call_claude(query, hits)`,
      ts: `import { OrchestrateClient } from "@Sightline/sdk";

const client = new OrchestrateClient({ apiKey: process.env.ORCHESTRATE_API_KEY });

export async function handleTicket(sessionId: string, query: string) {
  return client.traceAgent("support-triage", { sessionId }, async (trace) => {
    const hits = await trace.span("tool.search_kb", () => searchKb(query));
    return callClaude(query, hits);
  });
}`,
      curl: `curl -X POST https://ingest.Sightline.dev/v1/traces \\
  -H "Authorization: Bearer oiq_live_98a4f..." \\
  -H "Content-Type: application/json" \\
  -d '{"trace_id":"tr_94c2","span":"tool.search_kb","duration_ms":312}'`,
    },
    faq: [
      {
        question: 'Does tracing add latency to user-facing agent responses?',
        answer:
          'No. Spans are buffered in memory and flushed asynchronously in batches, adding less than 1ms to the critical path.',
      },
      {
        question: 'Can I attach custom metadata like tenant_id or user_tier?',
        answer:
          'Yes. Any JSON-serializable attributes attached to spans are indexed immediately for filtering and aggregation.',
      },
      {
        question: 'Do you support OpenTelemetry (OTLP) exporters?',
        answer:
          'Yes. Point any existing OTLP HTTP or gRPC exporter to our collector endpoint with your bearer API key.',
      },
    ],
    related: [
      {
        title: 'Automated Evals',
        description: 'Turn traced failures into continuous CI and production quality gates.',
        to: '/product/evals',
        tag: 'Evals',
      },
      {
        title: 'Cost & Latency',
        description: 'Break down token spend and p95 latency across every span.',
        to: '/product/cost-latency',
        tag: 'Cost & Latency',
      },
    ],
  },
  evals: {
    id: 'evals',
    tag: 'Evals',
    headlineTop: 'Ship Prompts With',
    headlineItalic: 'Confidence',
    sub: 'Run datasets, LLM-as-judge checks, CI release gates, and human reviews in one loop.',
    whatItIs: {
      title: 'Continuous quality measurement from staging to production.',
      body: 'Combine fast deterministic rule checks with calibrated LLM-as-judge evaluators. Catch hallucinated policies, broken tool schemas, and tone regressions in pull requests before shipping to live users.',
      chips: ['Golden Datasets', 'CI Release Gates', 'Human Review'],
      diagramNodes: ['Trace Sample', 'Rule + Judge Scorers', 'Release Gate'],
    },
    steps: [
      {
        number: '01',
        title: 'Curate Datasets',
        body: 'Promote tricky production traces into versioned test cases with one click.',
        mockTag: 'dataset',
        mockValue: '420 cases',
      },
      {
        number: '02',
        title: 'Attach Scorers',
        body: 'Mix regex/JSON validators with LLM-as-judge groundedness evaluators.',
        mockTag: 'scorers',
        mockValue: '4 active',
      },
      {
        number: '03',
        title: 'Compare A/B Runs',
        body: 'Inspect score deltas between prompt v13 and v14 across every slice.',
        mockTag: 'delta',
        mockValue: '+5.4% pass',
      },
      {
        number: '04',
        title: 'Gate CI Merges',
        body: 'Block merges automatically whenever pass rate drops below your threshold.',
        mockTag: 'github_ci',
        mockValue: '94.2% pass',
      },
    ],
    capabilities: [
      {
        title: 'LLM-as-Judge Scorers',
        body: 'Evaluate faithfulness, relevance, and policy adherence using calibrated rubrics.',
      },
      {
        title: 'Deterministic Rule Checks',
        body: 'Verify valid JSON schemas, citation links, and zero PII leakage in milliseconds.',
      },
      {
        title: 'CI/CD Release Gates',
        body: 'Run eval suites on GitHub pull requests and post diff tables directly in PR comments.',
      },
      {
        title: 'Version A/B Diffs',
        body: 'Spot exactly which test cases improved or regressed between two model prompts.',
      },
      {
        title: 'Human Review Queue',
        body: 'Route low-confidence borderline traces to domain experts for tie-breaking labels.',
      },
      {
        title: 'Live Traffic Scoring',
        body: 'Score a continuous percentage of production runs to detect silent drift early.',
      },
    ],
    useCases: [
      {
        title: 'Preventing Hallucinated Refunds',
        problem: 'A prompt tweak made Refund-Resolver cite expired 60-day return windows.',
        action: 'Added a groundedness judge and threshold gate at 0.90 in GitHub CI.',
        outcome: 'Blocked the regression before merge and saved manual support cleanups.',
        metric: '0 bad policy merges',
      },
      {
        title: 'Safe Model Migration',
        problem: 'Team wanted to move classification from a large model to a faster tier.',
        action: 'Ran A/B comparison across 500 historical support tickets.',
        outcome: 'Verified 99.1% agreement while cutting classification cost by 64%.',
        metric: '64% cheaper classifier',
      },
      {
        title: 'Auditing Tool Arguments',
        problem: 'Agents occasionally passed malformed ISO dates to calendar APIs.',
        action: 'Added deterministic schema assertions on tool_call spans.',
        outcome: 'Surfaced edge-case phrasing and raised tool call validity to 99.8%.',
        metric: '99.8% valid tool calls',
      },
    ],
    code: {
      python: `from Sightline import EvalSuite

suite = EvalSuite(dataset="refund_policy_v3", threshold=0.90)
suite.add_scorer("groundedness", model="gemini-2.5-flash")
suite.add_scorer("json_schema", strict=True)

report = suite.run(agent_fn=run_refund_agent)
assert report.pass_rate >= 0.90, f"Regression: {report.pass_rate}"`,
      ts: `import { EvalSuite } from "@Sightline/sdk";

const suite = new EvalSuite({ dataset: "refund_policy_v3", threshold: 0.9 });
const report = await suite.run(runRefundAgent, {
  scorers: ["groundedness", "json_schema"],
});

if (!report.passed) throw new Error(\`Gate failed: \${report.passRate}\`);`,
      curl: `curl -X POST https://api.Sightline.dev/v1/evals/run \\
  -H "Authorization: Bearer oiq_live_98a4f..." \\
  -d '{"dataset":"refund_policy_v3","threshold":0.90}'`,
    },
    faq: [
      {
        question: 'Can we write custom Python or TypeScript evaluators?',
        answer:
          'Yes. Register any custom scoring function returning a 0–1 score alongside built-in LLM judges.',
      },
      {
        question: 'How fast do CI evals run?',
        answer:
          'Suites execute with configurable concurrency so 200 test cases typically finish in under 25 seconds.',
      },
      {
        question: 'Can domain experts annotate traces without engineering help?',
        answer:
          'Yes. The Human Review queue gives reviewers clean input/output cards and 1-click pass/fail labels.',
      },
    ],
    related: [
      {
        title: 'Agent Tracing',
        description: 'Inspect the underlying spans behind every failing eval case.',
        to: '/product/tracing',
        tag: 'Tracing',
      },
      {
        title: 'Live Alerts',
        description: 'Notify Slack or PagerDuty whenever live eval scores dip.',
        to: '/product/alerts',
        tag: 'Alerts',
      },
    ],
  },
  cost: {
    id: 'cost',
    tag: 'Cost & Latency',
    headlineTop: 'Control Token Spend',
    headlineItalic: 'And Speed',
    sub: 'Attribute cost per model, agent, and user while hunting down p95 and p99 bottlenecks.',
    whatItIs: {
      title: 'Granular unit economics for every AI workflow.',
      body: 'Stop waiting for end-of-month provider invoices. See exact token spend and p50/p95/p99 latency broken down by model, agent, and customer tier—plus automated suggestions for cheaper routing.',
      chips: ['Per-User Attribution', 'p50 / p95 / p99', 'Routing Hints'],
      diagramNodes: ['Token Metering', 'Slow-Span Finder', 'Budget Forecast'],
    },
    steps: [
      {
        number: '01',
        title: 'Meter Every Call',
        body: 'Calculate prompt, cached, and completion costs automatically per provider.',
        mockTag: 'avg_run',
        mockValue: '$0.0042',
      },
      {
        number: '02',
        title: 'Group By Dimension',
        body: 'Slice spend by model, agent workflow, or individual customer account.',
        mockTag: 'top_agent',
        mockValue: 'Support 44%',
      },
      {
        number: '03',
        title: 'Find Slow Spans',
        body: 'Sort p99 outliers to spot bloated context windows or slow tool calls.',
        mockTag: 'p99_span',
        mockValue: 'search_kb 1.4s',
      },
      {
        number: '04',
        title: 'Optimize Routing',
        body: 'Identify simple classification steps safe to route to faster models.',
        mockTag: 'est_savings',
        mockValue: '-31% monthly',
      },
    ],
    capabilities: [
      {
        title: 'Per-User Cost Tracking',
        body: 'Spot power users or runaway loops skewing gross margins by customer ID.',
      },
      {
        title: 'p50 / p95 / p99 Percentiles',
        body: 'Monitor tail latency separately from averages across regions and models.',
      },
      {
        title: 'Slow-Span Finder',
        body: 'Rank the single spans responsible for 80% of total workflow wait time.',
      },
      {
        title: 'Prompt Cache Telemetry',
        body: 'Verify cache hit ratios and quantify savings from shared system prefixes.',
      },
      {
        title: 'Model Routing Advisor',
        body: 'Surface low-complexity turns where smaller models match accuracy at 1/5th cost.',
      },
      {
        title: 'Monthly Spend Forecasts',
        body: 'Project end-of-month bill trajectories with budget threshold warnings.',
      },
    ],
    useCases: [
      {
        title: 'Trimming Context Bloat',
        problem: 'Code-Reviewer cost doubled after an unannounced repository indexing change.',
        action: 'Grouped spend by span and noticed oversized AST snippets in system prompts.',
        outcome: 'Capped chunk context to relevant diffs and cut average run cost by 31%.',
        metric: '31% cost reduction',
      },
      {
        title: 'Fixing Tail Latency Spikes',
        problem: 'Average response felt snappy, yet enterprise users hit 6s timeouts.',
        action: 'Inspected p99 latency breakdown across tool calls vs model inference.',
        outcome: 'Parallelized two independent API fetches to cut p99 under 2.1s.',
        metric: '2.1s p99 latency',
      },
      {
        title: 'Enforcing Tenant Budgets',
        problem: 'Free-tier workspaces consumed disproportionate frontier-model tokens.',
        action: 'Attached customer_tier attributes and reviewed per-user spend tables.',
        outcome: 'Routed free tier to fast flash models while preserving pro accuracy.',
        metric: '$1,840/mo saved',
      },
    ],
    code: {
      python: `with client.trace_agent("lead-enricher", user_id="acct_882") as trace:
    trace.set_budget(max_cost_usd=0.05)
    profile = enrich_company(domain)
    print(trace.summary())  # cost_usd=0.0038, duration_ms=1770`,
      ts: `await client.traceAgent(
  "lead-enricher",
  { userId: "acct_882", budgetUsd: 0.05 },
  async () => enrichCompany(domain)
);`,
      curl: `curl "https://api.Sightline.dev/v1/metrics/cost?group_by=model&range=24h" \\
  -H "Authorization: Bearer oiq_live_98a4f..."`,
    },
    faq: [
      {
        question: 'How do you keep provider pricing tables up to date?',
        answer:
          'We maintain live pricing schedules for OpenAI, Anthropic, and Gemini models and let you override custom enterprise rates.',
      },
      {
        question: 'Can we track cost per customer or workspace?',
        answer:
          'Yes. Pass user_id or tenant_id on any trace to unlock per-account cost and margin breakdowns.',
      },
      {
        question: 'Does Sightline support custom or self-hosted open models?',
        answer:
          'Yes. Define custom per-1M input/output token rates for any vLLM, Bedrock, or Vertex endpoint.',
      },
    ],
    related: [
      {
        title: 'Agent Tracing',
        description: 'Drill from a slow-span outlier straight into the full execution tree.',
        to: '/product/tracing',
        tag: 'Tracing',
      },
      {
        title: 'Live Alerts',
        description: 'Trigger budget alerts before runaway loops burn through monthly credits.',
        to: '/product/alerts',
        tag: 'Alerts',
      },
    ],
  },
  alerts: {
    id: 'alerts',
    tag: 'Alerts',
    headlineTop: 'Catch Regressions',
    headlineItalic: 'Before Users Do',
    sub: 'Configure rules on latency, errors, cost, and eval scores routed to Slack, Email, or PagerDuty.',
    whatItIs: {
      title: 'Deterministic alerting engineered for non-deterministic agents.',
      body: 'Agents fail silently when hallucinations spike or tools rate-limit. Build multi-condition alert rules across latency, cost, error rate, and eval scores with mute windows and automatic incident escalation.',
      chips: ['Eval Thresholds', 'Mute Windows', 'Escalation Chains'],
      diagramNodes: ['Stream Evaluator', 'Rule Matcher', 'Slack / PagerDuty'],
    },
    steps: [
      {
        number: '01',
        title: 'Pick Metric & Slice',
        body: 'Monitor p95 latency, error rate, hourly spend, or live hallucination rate.',
        mockTag: 'metric',
        mockValue: 'hallucination > 2%',
      },
      {
        number: '02',
        title: 'Set Evaluation Window',
        body: 'Require sustained drift over 5 minutes to eliminate false-positive noise.',
        mockTag: 'window',
        mockValue: '5m rolling',
      },
      {
        number: '03',
        title: 'Route To Channels',
        body: 'Send critical incidents to PagerDuty and warnings to team Slack channels.',
        mockTag: 'channels',
        mockValue: 'Slack + PD',
      },
      {
        number: '04',
        title: 'Auto-Resolve',
        body: 'Post recovery confirmations automatically once metrics return to healthy baselines.',
        mockTag: 'status',
        mockValue: 'auto-resolved',
      },
    ],
    capabilities: [
      {
        title: 'Hallucination Spike Alerts',
        body: 'Page immediately when live groundedness eval scores drop below your baseline.',
      },
      {
        title: 'Latency & Error Rules',
        body: 'Combine p95 latency thresholds with HTTP 429/5xx tool retry rate triggers.',
      },
      {
        title: 'Spend Anomaly Guard',
        body: 'Detect infinite agent loops and sudden per-hour token burn spikes in seconds.',
      },
      {
        title: 'Scheduled Mute Windows',
        body: 'Silence non-critical alerts during planned migrations or load tests.',
      },
      {
        title: 'Trace Deep Links',
        body: 'Every Slack and PagerDuty payload includes the top 3 failing trace IDs.',
      },
      {
        title: 'Webhook Automation',
        body: 'Trigger automated rollback scripts or feature-flag toggles via signed webhooks.',
      },
    ],
    useCases: [
      {
        title: 'Stopping Rate-Limit Spirals',
        problem: 'Third-party enrichment API throttled requests during a Monday batch import.',
        action: 'Alert fired on Lead-Enricher retry rate > 5% directly into #ops-agents.',
        outcome: 'Team enabled exponential backoff before jobs timed out.',
        metric: '90s detection time',
      },
      {
        title: 'Guarding Eval Scores Live',
        problem: 'Upstream knowledge base sync introduced stale pricing paragraphs.',
        action: 'Hallucination rule > 2% triggered PagerDuty on Refund-Resolver.',
        outcome: 'Rolled back the KB index within 6 minutes.',
        metric: '6 min resolution',
      },
      {
        title: 'Capping Loop Runaways',
        problem: 'Recursive planner entered an 18-step tool loop on malformed PDFs.',
        action: 'Cost-per-run > $0.10 alert fired immediately with offending trace link.',
        outcome: 'Added max_steps=6 guard and prevented $2,400 wasted spend.',
        metric: '$2.4K spend saved',
      },
    ],
    code: {
      python: `client.alerts.create(
    name="refund-hallucination-guard",
    agent="Refund-Resolver",
    condition="eval.hallucination_rate > 0.02",
    window="5m",
    channels=["slack:#ai-oncall", "pagerduty:primary"],
)`,
      ts: `await client.alerts.create({
  name: "refund-hallucination-guard",
  agent: "Refund-Resolver",
  condition: "eval.hallucination_rate > 0.02",
  window: "5m",
  channels: ["slack:#ai-oncall", "pagerduty:primary"],
});`,
      curl: `curl -X POST https://api.Sightline.dev/v1/alerts/rules \\
  -H "Authorization: Bearer oiq_live_98a4f..." \\
  -d '{"agent":"Refund-Resolver","metric":"error_rate","op":">","value":2.0}'`,
    },
    faq: [
      {
        question: 'How fast do alerts fire after a regression starts?',
        answer:
          'Streaming rules evaluate every 10 seconds, so breaches notify Slack or PagerDuty in under 30 seconds.',
      },
      {
        question: 'Can we test rules without waking on-call engineers?',
        answer:
          'Yes. Every rule supports dry-run mode and simulated trigger payloads straight from the UI.',
      },
      {
        question: 'Do you support custom signed webhooks?',
        answer:
          'Yes. Webhook payloads include HMAC-SHA256 signatures and structured JSON trace references.',
      },
    ],
    related: [
      {
        title: 'Automated Evals',
        description: 'Score live traffic continuously to feed alert thresholds.',
        to: '/product/evals',
        tag: 'Evals',
      },
      {
        title: 'Integrations',
        description: 'Connect Slack, PagerDuty, Datadog, and custom webhooks in minutes.',
        to: '/product/integrations',
        tag: 'Integrations',
      },
    ],
  },
  security: {
    id: 'security',
    tag: 'Security',
    headlineTop: 'Observability Built For',
    headlineItalic: 'Regulated',
    sub: 'Edge PII redaction, field masking, SAML SSO, immutable audit logs, and private VPC hosting.',
    whatItIs: {
      title: 'Zero sensitive payloads stored in plain text.',
      body: 'Scrub emails, SSNs, credit cards, and API keys at the ingestion edge before spans ever hit storage. Pair field-level masking with SAML SSO, RBAC, EU/US data residency, and optional self-hosted VPC deployment.',
      chips: ['SOC 2 Type II', 'Edge PII Scrubbing', 'EU / US Residency'],
      diagramNodes: ['SDK Client', 'Edge Scrubber', 'Encrypted VPC Store'],
    },
    steps: [
      {
        number: '01',
        title: 'Mask At Edge',
        body: 'Detect and redact PII or custom regex secrets before disk persistence.',
        mockTag: 'pii_scrub',
        mockValue: '100% masked',
      },
      {
        number: '02',
        title: 'Encrypt & Pin Region',
        body: 'Store encrypted traces strictly inside your chosen US or EU region.',
        mockTag: 'residency',
        mockValue: 'eu-west-1',
      },
      {
        number: '03',
        title: 'Enforce SSO & RBAC',
        body: 'Restrict raw payload viewing to authorized roles via Okta or Entra SAML.',
        mockTag: 'auth',
        mockValue: 'SAML 2.0',
      },
      {
        number: '04',
        title: 'Audit & Retain',
        body: 'Export immutable access logs and enforce 7–365 day automatic deletion.',
        mockTag: 'audit_log',
        mockValue: 'immutable',
      },
    ],
    capabilities: [
      {
        title: 'Edge PII Redaction',
        body: 'Built-in detectors strip emails, phones, SSNs, and bearer tokens pre-storage.',
      },
      {
        title: 'Field-Level Masking',
        body: 'Mark sensitive prompt variables or tool arguments as write-only hashes.',
      },
      {
        title: 'SAML SSO & SCIM',
        body: 'Synchronize team groups and deprovision accounts automatically from your IdP.',
      },
      {
        title: 'Granular RBAC',
        body: 'Separate metrics-only viewers from engineers cleared to inspect trace payloads.',
      },
      {
        title: 'EU & US Data Residency',
        body: 'Isolate ingestion pipelines and backups within strict regional boundaries.',
      },
      {
        title: 'Private VPC Self-Host',
        body: 'Deploy the entire collector and storage plane inside your own cloud VPC.',
      },
    ],
    useCases: [
      {
        title: 'Fintech Compliance Approval',
        problem: 'Security team blocked observability tools from storing customer account numbers.',
        action: 'Enabled edge PII masking and custom PAN regex rules on the collector.',
        outcome: 'Passed infosec review in 4 days while keeping latency & eval metrics intact.',
        metric: '4-day security signoff',
      },
      {
        title: 'Strict EU Data Governance',
        problem: 'European healthcare workloads required zero cross-border trace replication.',
        action: 'Pinned workspace storage to eu-central-1 with 30-day auto-expiry.',
        outcome: 'Full GDPR compliance verified with regional audit exports.',
        metric: '100% EU pinned',
      },
      {
        title: 'Role-Scoped Debugging',
        problem: 'Support leads needed run counts without viewing raw legal document snippets.',
        action: 'Assigned payload-redacted RBAC roles via Okta SAML groups.',
        outcome: 'Zero raw document exposure outside core ML engineering.',
        metric: 'Zero plain-text leaks',
      },
    ],
    code: {
      python: `client = OrchestrateClient(
    api_key="oiq_live_98a4f...",
    region="eu",
    redact_pii=True,
    mask_fields=["ssn", "authorization", "card_number"],
)`,
      ts: `const client = new OrchestrateClient({
  apiKey: process.env.ORCHESTRATE_API_KEY,
  region: "eu",
  redactPii: true,
  maskFields: ["ssn", "authorization", "cardNumber"],
});`,
      curl: `curl -X POST https://eu.ingest.Sightline.dev/v1/traces \\
  -H "X-OIQ-Redact-PII: strict" \\
  -H "Authorization: Bearer oiq_live_98a4f..." \\
  -d '{"agent":"refund-resolver","input":"[REDACTED_EMAIL]"}'`,
    },
    faq: [
      {
        question: 'Do you train AI models on our trace payloads?',
        answer:
          'Never. Customer traces, prompts, and completions are strictly isolated and never used for model training.',
      },
      {
        question: 'Where does PII redaction happen?',
        answer:
          'Both client-side SDK scrubbing and our stateless edge collector mask sensitive fields before anything is written to storage.',
      },
      {
        question: 'Is a SOC 2 Type II report available under NDA?',
        answer:
          'Yes. Request our latest SOC 2 Type II report and penetration test summary during your demo.',
      },
    ],
    related: [
      {
        title: 'Agent Tracing',
        description: 'Inspect sanitized trace trees without compromising user privacy.',
        to: '/product/tracing',
        tag: 'Tracing',
      },
      {
        title: 'Integrations',
        description: 'Stream audit logs and metrics to Datadog, Snowflake, or Postgres.',
        to: '/product/integrations',
        tag: 'Integrations',
      },
    ],
  },
  integrations: {
    id: 'integrations',
    tag: 'Integrations',
    headlineTop: 'Connect Your Entire',
    headlineItalic: 'Agent Stack',
    sub: '12+ native connectors across model providers, frameworks, incident alerts, and warehouses.',
    whatItIs: {
      title: 'Zero lock-in across models, orchestrators, and data sinks.',
      body: 'Instrument OpenAI, Anthropic, Gemini, LangChain, or LlamaIndex with one unified SDK, route incidents to Slack and PagerDuty, and sync structured trace tables to Snowflake or Postgres.',
      chips: ['Drop-In SDKs', 'Incident Sinks', 'Warehouse Export'],
      diagramNodes: ['Model & Framework', 'Sightline Hub', 'Alerts & Warehouse'],
    },
    steps: [
      {
        number: '01',
        title: 'Install Adapter',
        body: 'Add the provider or framework integration package alongside your app.',
        mockTag: 'package',
        mockValue: 'npm / pip',
      },
      {
        number: '02',
        title: 'Auto-Instrument',
        body: 'Wrap OpenAI, Anthropic, Gemini, or LangChain clients with one line.',
        mockTag: 'auto_patch',
        mockValue: 'enabled',
      },
      {
        number: '03',
        title: 'Connect Alert Sinks',
        body: 'Authorize Slack, PagerDuty, or Datadog via OAuth or API token.',
        mockTag: 'sinks',
        mockValue: '3 linked',
      },
      {
        number: '04',
        title: 'Sync To Warehouse',
        body: 'Schedule hourly incremental Parquet exports to Snowflake or Postgres.',
        mockTag: 'export',
        mockValue: 'hourly sync',
      },
    ],
    capabilities: [
      {
        title: 'Multi-Model Coverage',
        body: 'Normalize token counts and latency spans across OpenAI, Anthropic, and Gemini.',
      },
      {
        title: 'Framework Callbacks',
        body: 'Native callback handlers for LangChain, LangGraph, and LlamaIndex pipelines.',
      },
      {
        title: 'CI/CD Checks',
        body: 'Post automated eval scorecards directly onto GitHub pull requests.',
      },
      {
        title: 'Incident Routing',
        body: 'Native bi-directional Slack threads and PagerDuty incident acknowledgements.',
      },
      {
        title: 'Datadog Metrics Bridge',
        body: 'Mirror p95 latency and error counters into existing Datadog infrastructure boards.',
      },
      {
        title: 'Warehouse Export',
        body: 'Sync trace metadata and eval scores into Postgres or Snowflake for BI analysis.',
      },
    ],
    useCases: [
      {
        title: 'Unifying Multi-Provider Agents',
        problem: 'Planner used Gemini while synthesis used Claude, splitting logs across consoles.',
        action: 'Enabled unified auto-instrumentation across both SDK clients.',
        outcome: 'Every multi-model agent step appears in a single parent trace.',
        metric: '1 unified timeline',
      },
      {
        title: 'BI Cost Reporting',
        problem: 'Finance needed weekly AI margin reports joined with Stripe billing.',
        action: 'Connected the Snowflake export integration on an hourly schedule.',
        outcome: 'Automated per-tenant margin dashboards with zero custom ETL scripts.',
        metric: '0 custom ETL code',
      },
      {
        title: 'PR Regression Gates',
        problem: 'Prompt edits were merged without checking accuracy on edge-case tickets.',
        action: 'Connected GitHub Actions with Sightline eval runner.',
        outcome: 'Every prompt PR now gets an automated pass/fail diff comment.',
        metric: '100% PRs gated',
      },
    ],
    code: {
      python: `from Sightline.integrations import patch_openai, patch_anthropic

patch_openai()
patch_anthropic()
# All downstream OpenAI and Anthropic SDK calls are traced automatically.`,
      ts: `import { instrumentLangChain } from "@Sightline/langchain";

const handler = instrumentLangChain({ project: "support-triage" });
await agentExecutor.invoke({ input: query }, { callbacks: [handler] });`,
      curl: `curl -X POST https://api.Sightline.dev/v1/integrations/webhook \\
  -H "Authorization: Bearer oiq_live_98a4f..." \\
  -d '{"url":"https://ops.example.com/oiq-hook","events":["alert.triggered"]}'`,
    },
    faq: [
      {
        question: 'Can we instrument multiple frameworks in the same project?',
        answer:
          'Yes. Spans from LangChain, raw OpenAI calls, and custom tools stitch together under the same trace context.',
      },
      {
        question: 'How fresh are Snowflake and Postgres warehouse syncs?',
        answer:
          'Exports run incrementally every 15 or 60 minutes, or stream continuously via webhooks.',
      },
      {
        question: 'What if we build a custom internal orchestrator?',
        answer:
          'Use our lightweight decorator/span helpers or standard OpenTelemetry OTLP endpoints.',
      },
    ],
    related: [
      {
        title: 'Agent Tracing',
        description: 'Inspect how auto-instrumented frameworks render as trace trees.',
        to: '/product/tracing',
        tag: 'Tracing',
      },
      {
        title: 'Security & Privacy',
        description: 'Keep integrations compliant with edge PII scrubbing and SAML.',
        to: '/product/security',
        tag: 'Security',
      },
    ],
  },
};

export type IntegrationCategory = 'All' | 'Models' | 'Frameworks' | 'Alerts' | 'Data';

export interface DetailedIntegration {
  name: string;
  abbr: string;
  category: Exclude<IntegrationCategory, 'All'>;
  summary: string;
  steps: [string, string, string];
  snippet: string;
}

export const DETAILED_INTEGRATIONS: DetailedIntegration[] = [
  {
    name: 'OpenAI',
    abbr: 'OA',
    category: 'Models',
    summary: 'Auto-capture GPT-4.1 completions, tool calls, and cached token counts.',
    steps: ['Install @Sightline/sdk', 'Call patchOpenAI(client)', 'Inspect token & tool spans live'],
    snippet: 'import { wrapOpenAI } from "@Sightline/sdk";\nconst openai = wrapOpenAI(new OpenAI());',
  },
  {
    name: 'Anthropic',
    abbr: 'AN',
    category: 'Models',
    summary: 'Trace Claude Sonnet messages, streaming chunks, and prompt cache hits.',
    steps: ['Install Sightline', 'Wrap Anthropic() client', 'View system prompt diffs'],
    snippet: 'from Sightline import wrap_anthropic\nclient = wrap_anthropic(Anthropic())',
  },
  {
    name: 'Gemini',
    abbr: 'GM',
    category: 'Models',
    summary: 'Instrument Gemini Flash and Pro tool calls with native grounding metadata.',
    steps: ['Install @Sightline/sdk', 'Wrap @google/genai client', 'Track cost & latency per turn'],
    snippet: 'const ai = wrapGenAI(new GoogleGenAI({ apiKey }));',
  },
  {
    name: 'LangChain',
    abbr: 'LC',
    category: 'Frameworks',
    summary: 'Drop-in callback handler for LangChain chains and LangGraph state nodes.',
    steps: ['Install @Sightline/langchain', 'Pass callback handler to invoke()', 'Visualize graph transitions'],
    snippet: 'const cb = new OrchestrateCallback({ project: "prod" });\nawait graph.invoke(input, { callbacks: [cb] });',
  },
  {
    name: 'LlamaIndex',
    abbr: 'LI',
    category: 'Frameworks',
    summary: 'Trace vector retrieval scores, rerankers, and query synthesis pipelines.',
    steps: ['Enable LlamaIndex global handler', 'Set OIQ_API_KEY env var', 'Inspect retrieved chunks per span'],
    snippet: 'from Sightline.llamaindex import set_global_handler\nset_global_handler("Sightline")',
  },
  {
    name: 'Slack',
    abbr: 'SL',
    category: 'Alerts',
    summary: 'Deliver alert payloads with root-cause trace links into team channels.',
    steps: ['Connect Slack workspace', 'Select alert channel', 'Route critical or warning rules'],
    snippet: 'POST /v1/integrations/slack { "channel": "#ai-alerts" }',
  },
  {
    name: 'PagerDuty',
    abbr: 'PD',
    category: 'Alerts',
    summary: 'Escalate critical hallucination spikes and error storms to on-call rotations.',
    steps: ['Paste PagerDuty routing key', 'Bind severity = critical', 'Auto-resolve when metrics recover'],
    snippet: 'POST /v1/integrations/pagerduty { "service": "agent-oncall" }',
  },
  {
    name: 'Datadog',
    abbr: 'DD',
    category: 'Alerts',
    summary: 'Forward p95 latency, run counts, and error rates into Datadog dashboards.',
    steps: ['Add Datadog API key', 'Pick metric prefix (oiq.*)', 'Correlate agent & infra latency'],
    snippet: 'POST /v1/integrations/datadog { "site": "datadoghq.com" }',
  },
  {
    name: 'GitHub',
    abbr: 'GH',
    category: 'Frameworks',
    summary: 'Run automated eval suites on every PR and gate merges on pass rate.',
    steps: ['Install GitHub Action', 'Reference eval dataset ID', 'Review diff table in PR comments'],
    snippet: 'uses: Sightline/eval-action@v1\nwith:\n  dataset: refund_policy_v3',
  },
  {
    name: 'Postgres',
    abbr: 'PG',
    category: 'Data',
    summary: 'Sync structured trace summaries and eval scores into your Postgres DB.',
    steps: ['Provide read-write DSN', 'Pick sync cadence (15m/1h)', 'Query traces alongside app tables'],
    snippet: 'SELECT agent, avg(cost_usd) FROM oiq_traces GROUP BY 1;',
  },
  {
    name: 'Snowflake',
    abbr: 'SF',
    category: 'Data',
    summary: 'Stream Parquet trace partitions directly to Snowflake for warehouse BI.',
    steps: ['Authorize Snowflake role', 'Select target schema', 'Build margin & cohort reports'],
    snippet: 'COPY INTO OIQ.TRACES FROM @oiq_stage FILE_FORMAT=(TYPE=PARQUET);',
  },
  {
    name: 'Webhooks',
    abbr: 'WH',
    category: 'Data',
    summary: 'Emit HMAC-signed JSON events whenever traces fail or alerts fire.',
    steps: ['Register HTTPS endpoint', 'Select subscribed event types', 'Verify X-OIQ-Signature header'],
    snippet: 'POST /v1/webhooks { "events": ["alert.triggered", "eval.failed"] }',
  },
];
