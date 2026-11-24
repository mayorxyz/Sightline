import {FaqItem, PRICING_FAQS} from './mockData';

export interface PricingSubNavItem {
  label: string;
  to: string;
}

export const PRICING_SUBNAV_LINKS: PricingSubNavItem[] = [
  {label: 'Plans', to: '/pricing'},
  {label: 'Compare', to: '/pricing/compare'},
  {label: 'ROI', to: '/pricing/roi'},
  {label: 'Find My Plan', to: '/pricing/find-plan'},
  {label: 'Enterprise', to: '/pricing/enterprise'},
];

export type CompareCellStatus = 'full' | 'partial' | 'none';

export interface CompareCell {
  status: CompareCellStatus;
  text: string;
  tooltip: string;
}

export interface AlternativeCompareRow {
  criterion: string;
  Sightline: CompareCell;
  genericApm: CompareCell;
  loggingStack: CompareCell;
  homegrown: CompareCell;
}

export const ALTERNATIVE_COMPARE_ROWS: AlternativeCompareRow[] = [
  {
    criterion: 'Agent-aware traces',
    Sightline: {
      status: 'full',
      text: 'Native span tree',
      tooltip: 'Automatic nesting for planners, tool calls, retries, and guardrails.',
    },
    genericApm: {
      status: 'partial',
      text: 'HTTP spans only',
      tooltip: 'Tracks network latency without prompt, token, or reasoning hierarchy.',
    },
    loggingStack: {
      status: 'none',
      text: 'Flat log lines',
      tooltip: 'Requires manual correlation IDs across multi-turn agent loops.',
    },
    homegrown: {
      status: 'partial',
      text: 'Custom wrappers',
      tooltip: 'Brittle decorators break when frameworks upgrade SDKs.',
    },
  },
  {
    criterion: 'Eval scoring',
    Sightline: {
      status: 'full',
      text: 'CI + live judges',
      tooltip: 'Built-in groundedness, tone, and custom scorers attached to traces.',
    },
    genericApm: {
      status: 'none',
      text: 'Not included',
      tooltip: 'Traditional APMs only track uptime and HTTP error codes.',
    },
    loggingStack: {
      status: 'none',
      text: 'Not included',
      tooltip: 'No dataset management or LLM-as-judge evaluation pipeline.',
    },
    homegrown: {
      status: 'partial',
      text: 'Ad-hoc notebooks',
      tooltip: 'Offline Python scripts disconnected from production runs.',
    },
  },
  {
    criterion: 'Cost per run',
    Sightline: {
      status: 'full',
      text: 'Per-span USD',
      tooltip: 'Real-time token, cache-hit, and model pricing rollups per workflow.',
    },
    genericApm: {
      status: 'none',
      text: 'No token math',
      tooltip: 'Cannot map vendor token tables or prompt caching discounts.',
    },
    loggingStack: {
      status: 'partial',
      text: 'Regex dashboards',
      tooltip: 'Must maintain pricing tables manually in query queries.',
    },
    homegrown: {
      status: 'partial',
      text: 'Manual CSVs',
      tooltip: 'Monthly invoice reconciliations weeks after traffic spikes.',
    },
  },
  {
    criterion: 'Hallucination flags',
    Sightline: {
      status: 'full',
      text: 'Span-level alerts',
      tooltip: 'Detects ungrounded claims and routes offending spans in seconds.',
    },
    genericApm: {
      status: 'none',
      text: '200 OK blindspot',
      tooltip: 'A hallucinated response returns HTTP 200 and looks healthy.',
    },
    loggingStack: {
      status: 'none',
      text: 'Keyword search',
      tooltip: 'Cannot semantically verify claims against retrieved context.',
    },
    homegrown: {
      status: 'none',
      text: 'User reports',
      tooltip: 'Discovered only after customers complain in support tickets.',
    },
  },
  {
    criterion: 'Setup time',
    Sightline: {
      status: 'full',
      text: '< 5 minutes',
      tooltip: 'One SDK call or OpenTelemetry exporter with zero schema setup.',
    },
    genericApm: {
      status: 'partial',
      text: '1–2 days',
      tooltip: 'Requires custom attribute instrumentation for LLM payloads.',
    },
    loggingStack: {
      status: 'partial',
      text: '1–2 weeks',
      tooltip: 'Index pipelines, parsers, and dashboards must be built manually.',
    },
    homegrown: {
      status: 'none',
      text: '4–8 weeks',
      tooltip: 'Full storage, UI, queue, and aggregation engineering effort.',
    },
  },
  {
    criterion: 'Prompt replay',
    Sightline: {
      status: 'full',
      text: '1-click diff',
      tooltip: 'Replay any production span with edited prompts or newer models.',
    },
    genericApm: {
      status: 'none',
      text: 'No payload UI',
      tooltip: 'Large prompt strings are truncated or dropped for payload limits.',
    },
    loggingStack: {
      status: 'none',
      text: 'Copy/paste JSON',
      tooltip: 'Engineers manually reconstruct message arrays to test fixes.',
    },
    homegrown: {
      status: 'partial',
      text: 'CLI scripts',
      tooltip: 'Local replay tools without side-by-side eval score diffs.',
    },
  },
  {
    criterion: 'Alerts on quality',
    Sightline: {
      status: 'full',
      text: 'Slack & PagerDuty',
      tooltip: 'Trigger on eval drift, retry loops, p95 latency, or cost spikes.',
    },
    genericApm: {
      status: 'partial',
      text: 'Latency / 5xx',
      tooltip: 'Alerts on infrastructure errors, not output quality regressions.',
    },
    loggingStack: {
      status: 'partial',
      text: 'Log count rules',
      tooltip: 'Fires noisy volume alerts without trace context.',
    },
    homegrown: {
      status: 'none',
      text: 'Cron scripts',
      tooltip: 'Delayed batch checks with high false-positive maintenance.',
    },
  },
  {
    criterion: 'Retention',
    Sightline: {
      status: 'full',
      text: 'Up to 365 days',
      tooltip: 'Hot trace search plus automated warehouse export to Snowflake.',
    },
    genericApm: {
      status: 'partial',
      text: '7–14 days',
      tooltip: 'High-cardinality span tags trigger steep storage overages.',
    },
    loggingStack: {
      status: 'partial',
      text: 'Expensive text',
      tooltip: 'Full JSON prompt logs balloon index billing rapidly.',
    },
    homegrown: {
      status: 'full',
      text: 'Self-managed S3',
      tooltip: 'Cheap cold storage, but slow to query during live incidents.',
    },
  },
  {
    criterion: 'Maintenance burden',
    Sightline: {
      status: 'full',
      text: 'Zero ops',
      tooltip: 'Fully managed ingestion, schema updates, and provider pricing.',
    },
    genericApm: {
      status: 'partial',
      text: 'Low–medium',
      tooltip: 'Ongoing manual tag mapping when new models launch.',
    },
    loggingStack: {
      status: 'none',
      text: 'Medium–high',
      tooltip: 'Index tuning, regex upkeep, and dashboard sprawl.',
    },
    homegrown: {
      status: 'none',
      text: 'Full-time team',
      tooltip: 'Pulls senior ML and infra engineers away from core product.',
    },
  },
  {
    criterion: 'Total cost of ownership',
    Sightline: {
      status: 'full',
      text: 'Predictable',
      tooltip: 'Transparent seat + trace pricing with free tier and hard spend caps.',
    },
    genericApm: {
      status: 'none',
      text: 'High span fees',
      tooltip: 'Custom metrics & host pricing scale poorly for bursty agent runs.',
    },
    loggingStack: {
      status: 'partial',
      text: 'GB ingest spikes',
      tooltip: 'Verbose context windows drive unpredictable ingest bills.',
    },
    homegrown: {
      status: 'none',
      text: '$150K+ / yr eng',
      tooltip: 'Hidden salary cost of building and patching internal tooling.',
    },
  },
];

export const WHY_TEAMS_SWITCH = [
  {
    title: 'HTTP 200 does not mean correct',
    body: 'Generic APMs report green while agents loop on bad tool calls or fabricate policy citations. Sightline scores actual reasoning quality.',
  },
  {
    title: 'Replace 4 tools with 1 trace',
    body: 'Stop stitching stdout logs, spreadsheets, and Jupyter notebooks. Traces, cost, evals, and PII redaction share one timeline.',
  },
  {
    title: 'Cut debugging time by 60%',
    body: 'Jump straight from a Slack regression alert to the exact failing span and replay a fixed prompt in seconds.',
  },
];

export interface RoiInputs {
  engineers: number;
  debugHoursPerWeek: number;
  hourlyCost: number;
  monthlyLlmSpend: number;
  incidentsPerMonth: number;
  costPerIncident: number;
}

export const ROI_DEFAULTS: RoiInputs = {
  engineers: 8,
  debugHoursPerWeek: 6,
  hourlyCost: 95,
  monthlyLlmSpend: 18000,
  incidentsPerMonth: 4,
  costPerIncident: 3500,
};

export const ROI_ASSUMPTIONS = [
  {
    label: 'Debugging hours saved / month (60%)',
    formula: 'engineers × hours/week × 4.33 weeks × 0.60 × hourly rate',
  },
  {
    label: 'LLM spend saved / month (18%)',
    formula: 'monthly LLM spend × 0.18 via prompt-cache tuning & retry elimination',
  },
  {
    label: 'Incident cost avoided / month (50%)',
    formula: 'incidents/month × cost per incident × 0.50 via CI eval gates & live alerts',
  },
  {
    label: 'Payback vs Team plan',
    formula: 'Estimated Team workspace ($49/seat) compared against total monthly savings',
  },
];

export interface QuizOption {
  id: string;
  label: string;
  hint: string;
  points: {starter: number; team: number; enterprise: number};
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'volume',
    question: 'How many agent traces do you run per month?',
    options: [
      {
        id: 'under-50k',
        label: 'Under 50K',
        hint: 'Early prototypes, staging runs, or solo side projects.',
        points: {starter: 3, team: 1, enterprise: 0},
      },
      {
        id: '50k-5m',
        label: '50K – 5M',
        hint: 'Active production agents serving daily customer workflows.',
        points: {starter: 0, team: 3, enterprise: 1},
      },
      {
        id: 'over-5m',
        label: 'Over 5M',
        hint: 'High-throughput multi-agent pipelines across multiple orgs.',
        points: {starter: 0, team: 1, enterprise: 3},
      },
    ],
  },
  {
    id: 'alerts-evals',
    question: 'Do you need evals and alerts in production?',
    options: [
      {
        id: 'not-yet',
        label: 'Not yet',
        hint: 'Manual trace inspection is enough while iterating on prompts.',
        points: {starter: 3, team: 1, enterprise: 0},
      },
      {
        id: 'yes',
        label: 'Yes, CI evals & Slack alerts',
        hint: 'Automated quality checks, latency rules, and regression gates.',
        points: {starter: 0, team: 3, enterprise: 1},
      },
      {
        id: 'yes-sso',
        label: 'Yes, plus SSO and audit logs',
        hint: 'PagerDuty escalation, SAML SSO, and immutable compliance trails.',
        points: {starter: 0, team: 0, enterprise: 4},
      },
    ],
  },
  {
    id: 'access',
    question: 'Who needs access to Sightline?',
    options: [
      {
        id: 'just-me',
        label: 'Just me',
        hint: 'Single builder shipping and debugging an agent workflow.',
        points: {starter: 3, team: 1, enterprise: 0},
      },
      {
        id: 'my-team',
        label: 'My team',
        hint: 'Shared workspace for ML, platform, and product engineers.',
        points: {starter: 0, team: 3, enterprise: 1},
      },
      {
        id: 'whole-org',
        label: 'Whole org with compliance',
        hint: 'Private VPC, EU/US data residency, and security review.',
        points: {starter: 0, team: 0, enterprise: 4},
      },
    ],
  },
];

export interface QuizRecommendation {
  tierId: 'starter' | 'team' | 'enterprise';
  name: string;
  priceLabel: string;
  tagline: string;
  reasons: string[];
  ctaLabel: string;
  ctaTo: string;
}

export const QUIZ_RECOMMENDATIONS: Record<'starter' | 'team' | 'enterprise', QuizRecommendation> = {
  starter: {
    tierId: 'starter',
    name: 'Starter',
    priceLabel: '$0 / month',
    tagline: 'Everything one builder needs to trace and debug agents fast.',
    reasons: [
      'Includes 50K monthly traces and 7-day full span retention',
      'Zero credit card required with 5-minute Python/TS SDK setup',
      '100 monthly eval checks included to test quality baselines',
    ],
    ctaLabel: 'Start Free',
    ctaTo: '/demo/sandbox',
  },
  team: {
    tierId: 'team',
    name: 'Team',
    priceLabel: '$49 / seat / mo',
    tagline: 'Built for production teams shipping reliable multi-agent apps.',
    reasons: [
      'Includes 5M monthly traces with 30-day retention across unlimited projects',
      'Unlimited automated evals plus real-time Slack & Email alerts',
      'Shared prompt replay and per-agent cost attribution',
    ],
    ctaLabel: 'Start Trial',
    ctaTo: '/demo',
  },
  enterprise: {
    tierId: 'enterprise',
    name: 'Enterprise',
    priceLabel: 'Custom contract',
    tagline: 'Dedicated scale, compliance controls, and private VPC deployment.',
    reasons: [
      'Unlimited traces with custom 90–365 day retention & warehouse export',
      'SAML SSO, immutable audit logs, and EU/US/custom residency',
      '99.99% uptime SLA with a dedicated solutions engineer',
    ],
    ctaLabel: 'Contact Sales',
    ctaTo: '/pricing/enterprise',
  },
};

export interface EnterpriseCapability {
  id: string;
  title: string;
  description: string;
  badge: string;
}

export const ENTERPRISE_CAPABILITIES: EnterpriseCapability[] = [
  {
    id: 'sso',
    title: 'SSO / SAML',
    description: 'Enforce Okta, Azure AD, or Google Workspace login with SCIM group role sync.',
    badge: 'Identity',
  },
  {
    id: 'audit',
    title: 'Audit Logs',
    description: 'Immutable records of every prompt view, API key rotation, and RBAC change.',
    badge: 'Governance',
  },
  {
    id: 'vpc',
    title: 'VPC Deploy',
    description: 'Run collectors and trace stores inside your own AWS, GCP, or Azure VPC.',
    badge: 'Isolation',
  },
  {
    id: 'residency',
    title: 'EU / US Residency',
    description: 'Pin raw spans and eval datasets strictly to Frankfurt, Virginia, or custom regions.',
    badge: 'Compliance',
  },
  {
    id: 'sla',
    title: 'SLA 99.99%',
    description: 'Backed ingestion uptime guarantee with multi-AZ failover and priority routing.',
    badge: 'Reliability',
  },
  {
    id: 'support',
    title: 'Dedicated Support',
    description: 'Shared Slack channel with engineers plus quarterly architecture & eval reviews.',
    badge: 'Partnership',
  },
];

export const ENTERPRISE_NEXT_STEPS = [
  {
    step: '01',
    title: 'Security & architecture review',
    body: 'We share our SOC 2 Type II report, DPA, and VPC deployment topology.',
  },
  {
    step: '02',
    title: 'Volume & retention sizing',
    body: 'Estimate daily span throughput, warehouse sinks, and custom contract caps.',
  },
  {
    step: '03',
    title: 'Guided staging rollout',
    body: 'Provision your dedicated tenant or Helm chart with an engineer on Slack.',
  },
];

export type FaqCategory = 'All' | 'Plans & Billing' | 'Usage & Overages' | 'Trials & Refunds';

export interface CategorizedFaqItem extends FaqItem {
  category: Exclude<FaqCategory, 'All'>;
}

export const EXTENDED_PRICING_FAQS: CategorizedFaqItem[] = [
  {
    category: 'Plans & Billing',
    question: 'What invoices and payment methods do you support?',
    answer:
      'Starter and Team workspaces support major credit cards, Apple Pay, and Google Pay via Stripe. Annual Team and Enterprise plans also support ACH, wire transfer, and net-30 invoicing.',
  },
  {
    category: 'Plans & Billing',
    question: 'How easy is switching plans up or down?',
    answer:
      'You can upgrade or downgrade seats and plans anytime from billing settings. Upgrades prorate immediately; downgrades take effect cleanly at the end of your billing cycle.',
  },
  {
    category: 'Plans & Billing',
    question: 'Do you offer an annual billing discount?',
    answer:
      'Yes. Paying annually lowers Team pricing from $49 to $39 per active seat per month—a 20% discount across all workspace seats.',
  },
  {
    category: 'Usage & Overages',
    question: 'How do overage charges work beyond plan limits?',
    answer:
      'We alert you at 80% and 100% of your monthly trace quota and never drop traffic abruptly. Team overages are $2.50 per 1M traces with optional hard caps.',
  },
  {
    category: 'Trials & Refunds',
    question: 'What are the Team trial terms?',
    answer:
      'Every new workspace includes a 14-day full Team trial with unlimited evals and Slack alerts—no credit card needed until you choose to keep Team features.',
  },
  {
    category: 'Trials & Refunds',
    question: 'What is your refund policy?',
    answer:
      'If an annual charge renews unintentionally or an issue goes unresolved, contact billing within 14 days for a prompt prorated refund.',
  },
  // Existing Phase 6 items mapped into categories
  ...PRICING_FAQS.map((item, idx): CategorizedFaqItem => ({
    ...item,
    category: idx % 2 === 0 ? 'Plans & Billing' : 'Usage & Overages',
  })),
];
