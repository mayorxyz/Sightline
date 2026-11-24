export type ResourcesIconKey = 'docs' | 'blog' | 'changelog';

export interface ResourceHubCard {
  id: ResourcesIconKey;
  title: string;
  description: string;
  to: string;
  cta: string;
}

export const RESOURCES_NAV_ITEMS: {
  id: ResourcesIconKey;
  title: string;
  description: string;
  to: string;
}[] = [
  {
    id: 'docs',
    title: 'Docs',
    description: 'SDK quickstarts, span instrumentation, evals, and PII redaction.',
    to: '/resources/docs',
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Deep dives on agent debugging, eval gates, and token economics.',
    to: '/resources/blog',
  },
  {
    id: 'changelog',
    title: 'Changelog',
    description: 'Weekly SDK releases, UI upgrades, and reliability fixes.',
    to: '/resources/changelog',
  },
];

export const RESOURCES_HUB_CARDS: ResourceHubCard[] = [
  {
    id: 'docs',
    title: 'Docs',
    description: 'Instrument Python or TypeScript agents in under five minutes.',
    to: '/resources/docs',
    cta: 'Read Docs',
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Field notes on silent failures, eval CI gates, and cutting token waste.',
    to: '/resources/blog',
    cta: 'Read Blog',
  },
  {
    id: 'changelog',
    title: 'Changelog',
    description: 'Every new feature, speed improvement, and SDK release shipped.',
    to: '/resources/changelog',
    cta: 'View Releases',
  },
];

export type ChangelogCategory = 'New' | 'Improved' | 'Fixed';

export interface ChangelogEntry {
  version: string;
  date: string;
  categories: ChangelogCategory[];
  title: string;
  body: string;
  previewTag?: string;
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: 'v1.8.0',
    date: 'Nov 18, 2026',
    categories: ['New', 'Improved'],
    title: 'Span-level prompt replay & side-by-side diffs',
    body: 'Replay any production LLM span directly inside the trace drawer with edited system prompts or swap models while comparing eval scores.',
    previewTag: 'diff: -420ms · +0.08 eval',
  },
  {
    version: 'v1.7.4',
    date: 'Nov 11, 2026',
    categories: ['New'],
    title: 'Edge PII redaction rules for custom regex patterns',
    body: 'Scrub API keys, internal account numbers, and European IBAN identifiers inside the local SDK worker before payloads leave your VPC.',
    previewTag: 'pattern: IBAN_* -> [REDACTED]',
  },
  {
    version: 'v1.7.0',
    date: 'Nov 02, 2026',
    categories: ['Improved'],
    title: '3x faster waterfall rendering for 200+ span agents',
    body: 'Virtualized canvas timelines keep pan and zoom locked at 60fps even across deeply nested multi-agent research trees.',
  },
  {
    version: 'v1.6.3',
    date: 'Oct 24, 2026',
    categories: ['Fixed'],
    title: 'Prevent duplicate retry counts on Anthropic streaming aborts',
    body: 'Fixed an edge case where client-side stream cancellations logged both an abort span and an error retry counter.',
  },
  {
    version: 'v1.6.0',
    date: 'Oct 14, 2026',
    categories: ['New', 'Improved'],
    title: 'Prompt-cache hit telemetry across Claude and Gemini',
    body: 'Automatic breakdown of cached input tokens versus uncached tokens inside every Cost & Latency rollup.',
    previewTag: 'cache hit: 64.2% (-$0.0018/run)',
  },
  {
    version: 'v1.5.2',
    date: 'Oct 05, 2026',
    categories: ['Fixed'],
    title: 'Resolve OpenTelemetry baggage propagation in async workers',
    body: 'Context headers now flow reliably across Python asyncio task groups and TypeScript Promise.all branches.',
  },
  {
    version: 'v1.5.0',
    date: 'Sep 25, 2026',
    categories: ['New'],
    title: 'GitHub PR eval gates & pass-rate comments',
    body: 'Block pull requests automatically when golden dataset pass rates dip below your workspace threshold.',
    previewTag: 'PR #412: 96.4% pass gate',
  },
  {
    version: 'v1.4.1',
    date: 'Sep 12, 2026',
    categories: ['Improved', 'Fixed'],
    title: 'Snowflake sink batch compression & schema sync',
    body: 'Reduced warehouse export payload size by 48% using Zstandard batches and strict column typing.',
  },
];

export type BlogCategory = 'Engineering' | 'Evals' | 'Cost' | 'Product' | 'Security';

export interface BlogSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  initials: string;
  role: string;
  date: string;
  readingTime: string;
  featured?: boolean;
  sections: BlogSection[];
  code: {
    language: string;
    snippet: string;
  };
  pullQuote: string;
  relatedSlugs: [string, string];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-agents-fail-silently',
    title: 'Why Agents Fail Silently',
    excerpt: 'HTTP 200 status codes hide broken tool arguments, truncated context windows, and hallucinated answers in production.',
    category: 'Engineering',
    author: 'Nadia Chen',
    initials: 'NC',
    role: 'Staff Systems Engineer',
    date: 'Nov 14, 2026',
    readingTime: '4 min read',
    featured: true,
    sections: [
      {
        id: 'green-dashboards',
        heading: 'The illusion of green dashboards',
        paragraphs: [
          'Traditional backend monitoring was built around deterministic failures: timeouts, uncaught exceptions, and 500 status codes. Multi-step AI agents rarely crash that cleanly. A planner can call the wrong search query, misread an empty array, and compose a confident apology—all while returning HTTP 200 in 1.4 seconds.',
          'Across hundreds of audited production runs, fewer than 15% of customer-facing agent failures ever triggered an infrastructure alarm. The remaining 85% looked healthy on CPU, memory, and latency charts.',
        ],
      },
      {
        id: 'semantic-breakpoints',
        heading: 'Tracking semantic breakpoints',
        paragraphs: [
          'To surface silent failures, instrumentation has to capture structured inputs and outputs at every reasoning hop rather than treating the agent as one black-box endpoint. Every tool call needs its parsed schema recorded next to token counts and retry flags.',
          'Once spans share one trace ID, patterns surface immediately: loops where a model calls the same tool three times with identical arguments, or silent fallbacks when retrieval scores fall below threshold.',
        ],
      },
      {
        id: 'closing-the-loop',
        heading: 'Closing the production loop',
        paragraphs: [
          'Detection only pays off when bad traces feed straight back into your regression suite. Flagging a failing run should take one click and promote the exact prompt state into a test case.',
          'Teams that convert production failures into daily eval suites catch edge cases within hours instead of waiting for churn tickets.',
        ],
      },
    ],
    code: {
      language: 'python',
      snippet: `with oiq.trace("support-triage") as span:
    docs = search_kb(query)
    span.set_attribute("retrieval.hits", len(docs))
    if len(docs) == 0:
        span.flag("empty_retrieval_fallback")`,
    },
    pullQuote: 'A hallucinated refund promise returns HTTP 200 just as fast as a verified answer.',
    relatedSlugs: ['a-release-gate-for-llm-changes', 'reading-a-trace-waterfall'],
  },
  {
    slug: 'a-release-gate-for-llm-changes',
    title: 'A Release Gate For LLM Changes',
    excerpt: 'Treat prompt edits and model upgrades like database migrations with deterministic CI thresholds.',
    category: 'Evals',
    author: 'Sana Patel',
    initials: 'SP',
    role: 'ML Specialist',
    date: 'Nov 08, 2026',
    readingTime: '5 min read',
    sections: [
      {
        id: 'prompt-drift',
        heading: 'Small prompt edits have wide blast radii',
        paragraphs: [
          'Changing two sentences in a system prompt to fix billing tone often breaks JSON formatting or weakens refusal behavior in completely unrelated workflows. Manual spot-checking three examples before merging is not testing.',
          'Teams shipping weekly agent updates need repeatable quality gates that run automatically whenever prompts, retriever weights, or model IDs change in Git.',
        ],
      },
      {
        id: 'layered-scorers',
        heading: 'Combine fast checks with LLM judges',
        paragraphs: [
          'Effective eval pipelines pair cheap deterministic checks—valid JSON schema, allowed tool names, latency budgets—with targeted LLM-as-judge scorers checking groundedness against retrieved documents.',
          'Running both on 100 curated golden cases takes under 45 seconds in parallel and catches subtle regressions before any customer sees them.',
        ],
      },
      {
        id: 'ci-enforcement',
        heading: 'Enforcing thresholds in pull requests',
        paragraphs: [
          'Treat pass-rate regressions the same way you treat failing unit tests. Set an explicit floor—for example, 94% on critical flows and zero PII leaks—and report diff summaries right on the PR.',
          'Engineers gain confidence to refactor prompts aggressively because regressions cannot slip silently into main.',
        ],
      },
    ],
    code: {
      language: 'yaml',
      snippet: `- name: Run Sightline Evals
  run: npx oiq eval --dataset billing_gold --min-pass 0.94`,
    },
    pullQuote: 'If you would not deploy code without unit tests, do not deploy prompt edits without evals.',
    relatedSlugs: ['why-agents-fail-silently', 'pii-in-prompts-redaction-checklist'],
  },
  {
    slug: 'cutting-cost-per-run-by-30',
    title: 'Cutting Cost Per Run By 30%',
    excerpt: 'Where token spend actually hides in multi-step agents and how span attribution trims waste without hurting quality.',
    category: 'Cost',
    author: 'Marcus Klein',
    initials: 'MK',
    role: 'Solutions Engineer',
    date: 'Oct 29, 2026',
    readingTime: '4 min read',
    sections: [
      {
        id: 'hidden-token-multipliers',
        heading: 'Where token budgets quietly double',
        paragraphs: [
          'Most teams assume expensive frontier models are their primary bill driver. In reality, unit economics blow up because agents pass bloated conversation history and oversized tool schemas across five sequential LLM turns.',
          'When each turn re-sends 6,000 uncached system tokens, a single user question costs 30,000 input tokens before counting output completions.',
        ],
      },
      {
        id: 'cache-and-routing',
        heading: 'Prompt caching and model tiering',
        paragraphs: [
          'Attribution per span immediately separates heavy planner calls from lightweight classification or formatting steps. Static instructions belong in cacheable prefixes at the very top of message arrays.',
          'Meanwhile, deterministic routing steps can move to faster small models once evals prove zero drop in tool selection accuracy.',
        ],
      },
      {
        id: 'verify-before-shipping',
        heading: 'Verifying cost cuts with quality gates',
        paragraphs: [
          'Never optimize token cost blind. Run your cheaper prompt structure against the same golden eval suite and verify groundedness stays flat.',
          'Teams routinely trim 30% to 45% off unit run costs within their first week of span-level visibility.',
        ],
      },
    ],
    code: {
      language: 'typescript',
      snippet: `const res = await oiq.wrap("router", () =>
  client.models.generateContent({ model: "gemini-2.5-flash", contents: prompt })
);`,
    },
    pullQuote: 'You cannot cut agent spend safely until you measure cost alongside eval pass rate.',
    relatedSlugs: ['retries-are-not-free', 'a-release-gate-for-llm-changes'],
  },
  {
    slug: 'reading-a-trace-waterfall',
    title: 'Reading A Trace Waterfall',
    excerpt: 'A visual field guide to spotting serial bottlenecks, retry storms, and oversized guardrail spans in seconds.',
    category: 'Product',
    author: 'Devon Ross',
    initials: 'DR',
    role: 'Product Lead',
    date: 'Oct 21, 2026',
    readingTime: '3 min read',
    sections: [
      {
        id: 'shape-of-healthy-run',
        heading: 'The shape of a healthy run',
        paragraphs: [
          'A healthy agent trace looks like a tight staircase: fast initial routing, parallel context retrieval where possible, one primary synthesis span, and a millisecond guardrail validation before output.',
          'Whenever end-to-end p95 drifts above two seconds, the visual length of each bar tells you immediately whether latency lives in model inference or third-party APIs.',
        ],
      },
      {
        id: 'spotting-gaps',
        heading: 'What blank gaps between bars mean',
        paragraphs: [
          'Unexplained whitespace between a tool completion and the next LLM span usually points to client-side serialization, heavy synchronous PII checks, or thread starvation in Python event loops.',
          'Similarly, three sequential bars to the same endpoint signal unbatched retrieval calls that can be collapsed into a single parallel fan-out.',
        ],
      },
      {
        id: 'from-waterfall-to-fix',
        heading: 'Turning traces into faster responses',
        paragraphs: [
          'Hovering spans exposes exact token counts and cost right alongside elapsed milliseconds. Often trimming 40% of retrieval chunk length cuts both inference time and bill simultaneously.',
          'Waterfall literacy lets any engineer diagnose slow runs in under thirty seconds.',
        ],
      },
    ],
    code: {
      language: 'typescript',
      snippet: `await Promise.all([
  oiq.span("search_kb", () => kb.query(q)),
  oiq.span("fetch_account", () => crm.get(userId)),
]);`,
    },
    pullQuote: 'Most p95 latency spikes live in sequential tool calls, not model inference.',
    relatedSlugs: ['why-agents-fail-silently', 'retries-are-not-free'],
  },
  {
    slug: 'pii-in-prompts-redaction-checklist',
    title: 'PII In Prompts: A Redaction Checklist',
    excerpt: 'Keep sensitive customer identifiers out of telemetry disks without blinding your engineers during debugging.',
    category: 'Security',
    author: 'Amara Okafor',
    initials: 'AO',
    role: 'Security Architect',
    date: 'Oct 11, 2026',
    readingTime: '4 min read',
    sections: [
      {
        id: 'scrub-before-egress',
        heading: 'Scrub before payloads leave your process',
        paragraphs: [
          'Waiting until data reaches an observability vendor backend to mask emails or card numbers violates most enterprise security policies. Redaction has to happen in-memory inside the SDK before spans serialize.',
          'Deterministic placeholder tokens like [EMAIL_1] preserve conversational structure so engineers can still see whether an agent misread a field without exposing real user data.',
        ],
      },
      {
        id: 'five-point-checklist',
        heading: 'Five items to verify before launch',
        paragraphs: [
          'First, strip bearer headers and webhook secrets from tool arguments. Second, mask national IDs, phone numbers, and emails with consistent per-trace hashes. Third, pin telemetry storage to EU or US residency zones.',
          'Fourth, audit who can export raw traces. Fifth, test redaction rules continuously using synthetic adversarial cases in CI.',
        ],
      },
      {
        id: 'debuggable-privacy',
        heading: 'Privacy without losing debuggability',
        paragraphs: [
          'Security and velocity do not have to fight each other. Consistent hashing lets engineers correlate repeat failures for the same masked user ID while keeping zero raw PII on disk.',
        ],
      },
    ],
    code: {
      language: 'python',
      snippet: `oiq.init(
    api_key=os.environ["OIQ_KEY"],
    redact_pii=["email", "ssn", "credit_card", "bearer_token"],
)`,
    },
    pullQuote: 'Consistent tokens like [USER_4F2A] keep traces debuggable while keeping raw PII off disk.',
    relatedSlugs: ['a-release-gate-for-llm-changes', 'why-agents-fail-silently'],
  },
  {
    slug: 'retries-are-not-free',
    title: 'Retries Are Not Free',
    excerpt: 'Hidden exponential backoff multiplies both token spend and tail latency when rate limits collide.',
    category: 'Engineering',
    author: 'Liam Brooks',
    initials: 'LB',
    role: 'Principal Platform Engineer',
    date: 'Oct 02, 2026',
    readingTime: '4 min read',
    sections: [
      {
        id: 'retry-storms',
        heading: 'How polite SDK retries become storms',
        paragraphs: [
          'Most LLM client libraries silently retry rate limits three to five times out of the box. Under normal traffic that feels helpful; during a provider brownout, nested agent loops multiply those retries exponentially.',
          'A workflow with four sub-agents can trigger 20 queued calls from a single user click, blowing past SLA timeouts while customers wait.',
        ],
      },
      {
        id: 'instrumenting-retries',
        heading: 'Surface retry counters as first-class spans',
        paragraphs: [
          'If your observability tool collapses retries into the parent LLM call, your dashboards hide the approaching cliff until timeouts cascade. Recording each retry attempt as an explicit child span exposes rate-limit pressure early.',
          'Alerting when retry rates exceed 2% buys platform teams hours to shift traffic to fallback providers.',
        ],
      },
      {
        id: 'smart-fallbacks',
        heading: 'Bounding latency with model fallbacks',
        paragraphs: [
          'Cap per-span timeouts strictly and route overflow cleanly to secondary regions or standby models. Fast failover protects user experience while keeping unit costs predictable.',
        ],
      },
    ],
    code: {
      language: 'typescript',
      snippet: `oiq.setFallback({
  primary: "claude-sonnet",
  onTimeoutMs: 2500,
  fallback: "gemini-2.5-flash",
});`,
    },
    pullQuote: 'Silent SDK retries turn a minor provider blip into a 12-second p95 cliff.',
    relatedSlugs: ['cutting-cost-per-run-by-30', 'reading-a-trace-waterfall'],
  },
];

export interface DocSectionItem {
  id: string;
  heading: string;
  body: string;
}

export interface DocPageItem {
  slug: string;
  group: 'Getting Started' | 'Core Instrumentation' | 'Quality & Governance';
  title: string;
  summary: string;
  sections: DocSectionItem[];
  code: {
    python: string;
    typescript: string;
  };
  callout: {
    type: 'note' | 'tip';
    title: string;
    body: string;
  };
  prevSlug?: string;
  nextSlug?: string;
}

export const DOC_GROUPS: DocPageItem['group'][] = [
  'Getting Started',
  'Core Instrumentation',
  'Quality & Governance',
];

export const DOC_PAGES: DocPageItem[] = [
  {
    slug: 'quickstart',
    group: 'Getting Started',
    title: 'Quickstart',
    summary: 'Send your first agent trace to Sightline in under five minutes.',
    sections: [
      {
        id: 'overview',
        heading: 'Overview',
        body: 'Sightline captures nested LLM calls, tool executions, token spend, and guardrail outcomes with one lightweight wrapper. Complete the three steps below to see live traces stream into your workspace.',
      },
      {
        id: 'checklist',
        heading: 'Three-step setup',
        body: 'Once your API key is exported in your environment, wrapping your primary agent entry point automatically instruments nested model SDK calls and records wall-clock latency.',
      },
    ],
    code: {
      python: `import Sightline as oiq

oiq.init(api_key="oiq_live_***")

@oiq.trace(name="support-triage")
def run_agent(ticket: str):
    return agent.invoke({"input": ticket})`,
      typescript: `import { oiq } from '@Sightline/sdk';

oiq.init({ apiKey: process.env.OIQ_API_KEY });

export const runAgent = oiq.trace('support-triage', async (ticket: string) => {
  return await agent.invoke({ input: ticket });
});`,
    },
    callout: {
      type: 'tip',
      title: 'Zero-downtime capture',
      body: 'Spans buffer asynchronously in memory and flush every 500ms—never blocking your agent response.',
    },
    nextSlug: 'install-sdk',
  },
  {
    slug: 'install-sdk',
    group: 'Getting Started',
    title: 'Install the SDK',
    summary: 'Install the Python or TypeScript package and configure credentials.',
    sections: [
      {
        id: 'package-install',
        heading: 'Install package',
        body: 'The SDK has zero heavy runtime dependencies and supports Python 3.9+ as well as Node 18+, Deno, Bun, and edge runtimes.',
      },
      {
        id: 'env-config',
        heading: 'Environment configuration',
        body: 'Set OIQ_API_KEY and an optional OIQ_ENV tag (production or staging) so traces group cleanly by deployment environment.',
      },
    ],
    code: {
      python: `pip install Sightline
export OIQ_API_KEY="oiq_live_***"
export OIQ_ENV="production"`,
      typescript: `npm install @Sightline/sdk
export OIQ_API_KEY="oiq_live_***"
export OIQ_ENV="production"`,
    },
    callout: {
      type: 'note',
      title: 'Already on OpenTelemetry?',
      body: 'Point your existing OTLP exporter to ingest.Sightline.dev/v1/traces with a Bearer token header.',
    },
    prevSlug: 'quickstart',
    nextSlug: 'first-trace',
  },
  {
    slug: 'first-trace',
    group: 'Getting Started',
    title: 'Your First Trace',
    summary: 'Wrap an agent entry point and inspect prompts, tokens, and latency.',
    sections: [
      {
        id: 'wrap-entrypoint',
        heading: 'Wrap your entry point',
        body: 'Use the trace decorator or wrapper around the top-level handler for each user turn. Every downstream OpenAI, Anthropic, or Gemini call inherits the active trace context automatically.',
      },
      {
        id: 'session-grouping',
        heading: 'Attach session and user IDs',
        body: 'Pass a session_id to thread multi-turn conversations together in the UI while keeping individual turn metrics crisp.',
      },
    ],
    code: {
      python: `@oiq.trace(name="refund-resolver")
def handle_ticket(session_id: str, prompt: str):
    oiq.tag(session_id=session_id, tier="enterprise")
    return llm.complete(prompt)`,
      typescript: `export async function handleTicket(sessionId: string, prompt: string) {
  return oiq.withTrace({ name: 'refund-resolver', sessionId }, async () => {
    return await llm.complete(prompt);
  });
}`,
    },
    callout: {
      type: 'tip',
      title: 'Verify locally',
      body: 'Pass debug=True in development to print trace URLs directly to stdout after each run.',
    },
    prevSlug: 'install-sdk',
    nextSlug: 'custom-spans',
  },
  {
    slug: 'custom-spans',
    group: 'Core Instrumentation',
    title: 'Custom Spans',
    summary: 'Time retrieval calls, database lookups, and custom tool executions.',
    sections: [
      {
        id: 'nested-tools',
        heading: 'Nested tool spans',
        body: 'LLM calls are rarely the whole story. Wrap vector searches, SQL queries, and external REST calls in child spans to pinpoint where wall-clock time goes.',
      },
      {
        id: 'span-attributes',
        heading: 'Structured attributes',
        body: 'Record lightweight metadata like hit counts, cache status, or SQL row totals so you can filter slow runs instantly.',
      },
    ],
    code: {
      python: `with oiq.span("search_kb", kind="tool") as sp:
    results = vector_db.search(query, top_k=5)
    sp.set_attribute("hits", len(results))`,
      typescript: `const results = await oiq.span('search_kb', { kind: 'tool' }, async (sp) => {
  const docs = await vectorDb.search(query, 5);
  sp.setAttribute('hits', docs.length);
  return docs;
});`,
    },
    callout: {
      type: 'note',
      title: 'Async propagation',
      body: 'Context propagates automatically across Python asyncio tasks and Node AsyncLocalStorage.',
    },
    prevSlug: 'first-trace',
    nextSlug: 'running-evals',
  },
  {
    slug: 'running-evals',
    group: 'Core Instrumentation',
    title: 'Running Evals',
    summary: 'Score live traffic and golden datasets inside your CI pipeline.',
    sections: [
      {
        id: 'golden-datasets',
        heading: 'Golden datasets & scorers',
        body: 'Attach built-in groundedness, hallucination, and tool-accuracy scorers to any dataset—or register custom Python/JS assertion functions.',
      },
      {
        id: 'ci-gate',
        heading: 'Gate pull requests cleanly',
        body: 'Fail builds whenever pass rates dip below your configured floor so regressions never ship silently.',
      },
    ],
    code: {
      python: `from Sightline.evals import run_suite

report = run_suite(
    dataset="billing_v4",
    target=run_agent,
    scorers=["groundedness", "tool_choice"],
)
assert report.pass_rate >= 0.94`,
      typescript: `import { runSuite } from '@Sightline/sdk/evals';

const report = await runSuite({
  dataset: 'billing_v4',
  target: runAgent,
  scorers: ['groundedness', 'tool_choice'],
});
if (report.passRate < 0.94) process.exit(1);`,
    },
    callout: {
      type: 'tip',
      title: 'Promote bad runs',
      body: 'Any trace flagged in the Sandbox or Dashboard can be added to a dataset in one click.',
    },
    prevSlug: 'custom-spans',
    nextSlug: 'setting-alerts',
  },
  {
    slug: 'setting-alerts',
    group: 'Core Instrumentation',
    title: 'Setting Alerts',
    summary: 'Route latency, cost, and quality spikes to Slack, Email, or PagerDuty.',
    sections: [
      {
        id: 'threshold-rules',
        heading: 'Quality and operational rules',
        body: 'Define rules across p95 latency, retry spikes, unit cost anomalies, or dropping eval pass rates over rolling 5-minute windows.',
      },
      {
        id: 'routing-channels',
        heading: 'Actionable notifications',
        body: 'Every Slack and PagerDuty alert embeds direct links to the top three offending trace IDs so on-call engineers skip guesswork.',
      },
    ],
    code: {
      python: `oiq.alerts.create(
    name="hallucination-spike",
    metric="eval.hallucination_rate",
    operator=">",
    threshold=0.02,
    channel="pagerduty:#ai-oncall",
)`,
      typescript: `await oiq.alerts.create({
  name: 'hallucination-spike',
  metric: 'eval.hallucination_rate',
  operator: '>',
  threshold: 0.02,
  channel: 'pagerduty:#ai-oncall',
});`,
    },
    callout: {
      type: 'note',
      title: 'Alert fatigue protection',
      body: 'Built-in cooldown windows group bursty regressions into a single thread update.',
    },
    prevSlug: 'running-evals',
    nextSlug: 'cost-tracking',
  },
  {
    slug: 'cost-tracking',
    group: 'Quality & Governance',
    title: 'Cost Tracking',
    summary: 'Attribute USD token spend across models, workflows, and customer tiers.',
    sections: [
      {
        id: 'automatic-pricing',
        heading: 'Automatic provider pricing',
        body: 'Sightline parses prompt, completion, and cached token counts across OpenAI, Anthropic, and Gemini using up-to-date rate tables.',
      },
      {
        id: 'customer-attribution',
        heading: 'Margin visibility per tenant',
        body: 'Tag runs with tenant_id to spot accounts consuming heavy multi-step reasoning loops and set hard budget thresholds.',
      },
    ],
    code: {
      python: `with oiq.trace("code-reviewer"):
    oiq.tag(tenant_id="acme_corp", feature="pr_audit")
    review = model.generate(diff)`,
      typescript: `await oiq.withTrace({ name: 'code-reviewer', tags: { tenantId: 'acme_corp' } }, async () => {
  return await model.generate(diff);
});`,
    },
    callout: {
      type: 'tip',
      title: 'Cache hit tracking',
      body: 'Cached input tokens appear separately in Cost dashboards so you can measure prompt-caching savings.',
    },
    prevSlug: 'setting-alerts',
    nextSlug: 'redacting-pii',
  },
  {
    slug: 'redacting-pii',
    group: 'Quality & Governance',
    title: 'Redacting PII',
    summary: 'Mask sensitive identifiers at the edge before spans leave your infrastructure.',
    sections: [
      {
        id: 'edge-redaction',
        heading: 'Local in-memory scrubbing',
        body: 'Enable edge redaction to replace emails, SSNs, phone numbers, credit cards, and custom regex matches inside your process before network serialization.',
      },
      {
        id: 'consistent-hashing',
        heading: 'Debuggable tokens',
        body: 'Masked values retain deterministic per-trace labels like [EMAIL_3B] so engineers can trace broken formatting without ever viewing secrets.',
      },
    ],
    code: {
      python: `oiq.init(
    api_key=os.environ["OIQ_KEY"],
    redact_pii=["email", "ssn", "credit_card"],
    custom_patterns=[r"sk-[a-zA-Z0-9]{20,}"],
)`,
      typescript: `oiq.init({
  apiKey: process.env.OIQ_API_KEY,
  redactPii: ['email', 'ssn', 'credit_card'],
  customPatterns: [/sk-[a-zA-Z0-9]{20,}/],
});`,
    },
    callout: {
      type: 'note',
      title: 'EU & US residency',
      body: 'Combine edge PII redaction with regional ingestion endpoints for strict GDPR compliance.',
    },
    prevSlug: 'cost-tracking',
  },
];

export interface SearchIndexItem {
  id: string;
  kind: 'Doc' | 'Blog';
  title: string;
  subtitle: string;
  to: string;
}

// Built once at module load for instant client search
export const RESOURCES_SEARCH_INDEX: SearchIndexItem[] = [
  ...DOC_PAGES.map((d) => ({
    id: `doc-${d.slug}`,
    kind: 'Doc' as const,
    title: d.title,
    subtitle: `${d.group} · ${d.summary}`,
    to: `/resources/docs/${d.slug}`,
  })),
  ...BLOG_POSTS.map((p) => ({
    id: `blog-${p.slug}`,
    kind: 'Blog' as const,
    title: p.title,
    subtitle: `${p.category} · ${p.readingTime}`,
    to: `/resources/blog/${p.slug}`,
  })),
];
