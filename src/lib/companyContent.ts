import {FaqItem} from './mockData';

export type CompanyNavIconKey = 'about' | 'customers' | 'contact';

export const COMPANY_NAV_ITEMS: {
  id: CompanyNavIconKey;
  title: string;
  description: string;
  to: string;
}[] = [
  {
    id: 'about',
    title: 'About',
    description: 'Our mission, team, values, and open remote roles.',
    to: '/about',
  },
  {
    id: 'customers',
    title: 'Customers',
    description: 'Case studies from teams running agents in production.',
    to: '/customers',
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Reach sales, support, press, or our global hubs.',
    to: '/contact',
  },
];

export const ABOUT_MISSION =
  'We build calm, exact observability so engineering teams can trust AI agents in production without waking up at 2am to grep broken logs.';

export interface StoryMilestone {
  year: string;
  title: string;
  body: string;
}

export const STORY_MILESTONES: StoryMilestone[] = [
  {
    year: '2023',
    title: 'Idea',
    body: 'After three late-night outages caused by silent tool-call loops, we sketched a span tree built specifically for agent runs.',
  },
  {
    year: '2024',
    title: 'First trace',
    body: 'Shipped our lightweight Python wrapper and OpenTelemetry collector, cutting customer debugging from six hours down to twenty minutes.',
  },
  {
    year: '2025',
    title: 'Public beta',
    body: 'Launched automated LLM-as-judge CI gates, edge PII redaction, and per-run cost attribution across major model providers.',
  },
  {
    year: '2026',
    title: 'Production at scale',
    body: 'Over 140 engineering teams monitor 2.3M daily traces across private VPC and regional cloud clusters worldwide.',
  },
];

export interface CompanyValue {
  id: 'clarity' | 'ship' | 'outcome' | 'honesty';
  title: string;
  body: string;
}

export const COMPANY_VALUES: CompanyValue[] = [
  {
    id: 'clarity',
    title: 'Clarity over noise',
    body: 'Surface the single failing span and exact token cost instead of drowning teams in raw log lines.',
  },
  {
    id: 'ship',
    title: 'Ship small',
    body: 'Weekly SDK and UI improvements tested against real production agent traces before release.',
  },
  {
    id: 'outcome',
    title: 'Own the outcome',
    body: 'If a trace drops or an alert misfires, we fix the root cause fast and publish transparent notes.',
  },
  {
    id: 'honesty',
    title: 'Be honest about limits',
    body: 'Clear estimates, predictable pricing, and zero exaggerated claims about what automation solves.',
  },
];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  colorClass: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 't1',
    name: 'Tobi Adeyemi',
    role: 'Co-founder & CEO',
    bio: 'Previously built distributed tracing pipelines at high-scale payment infrastructure.',
    initials: 'TA',
    colorClass: 'bg-[#0B2FA8] text-white',
  },
  {
    id: 't2',
    name: 'Claire Vance',
    role: 'Co-founder & CTO',
    bio: 'Led ML observability tooling and streaming telemetry ingestion systems in London.',
    initials: 'CV',
    colorClass: 'bg-[#D9731A] text-white',
  },
  {
    id: 't3',
    name: 'Mateo Silva',
    role: 'Staff Systems Engineer',
    bio: 'Designs sub-millisecond Rust collectors and OpenTelemetry span processors.',
    initials: 'MS',
    colorClass: 'bg-[#0A1F6B] text-[#D9C4A8]',
  },
  {
    id: 't4',
    name: 'Rina Takahashi',
    role: 'Head of Evaluations',
    bio: 'Researches deterministic and LLM-as-judge benchmarks for multi-turn workflows.',
    initials: 'RT',
    colorClass: 'bg-[#2E8B57] text-white',
  },
  {
    id: 't5',
    name: 'Chidi Nwosu',
    role: 'Principal Product Designer',
    bio: 'Crafts dense waterfall timelines and low-latency operator interfaces.',
    initials: 'CN',
    colorClass: 'bg-[#0B2FA8] text-white',
  },
  {
    id: 't6',
    name: 'Hannah Lind',
    role: 'Security Lead',
    bio: 'Maintains edge PII scrubbing workers, SOC 2 controls, and VPC Helm deployments.',
    initials: 'HL',
    colorClass: 'bg-[#0A1F6B] text-[#D9C4A8]',
  },
  {
    id: 't7',
    name: 'Omar Farooq',
    role: 'Solutions Architect',
    bio: 'Helps enterprise teams migrate homegrown wrappers onto standardized traces.',
    initials: 'OF',
    colorClass: 'bg-[#D9731A] text-white',
  },
  {
    id: 't8',
    name: 'Elena Petrov',
    role: 'SDK Engineer',
    bio: 'Owns zero-overhead async propagation in our Python and TypeScript SDKs.',
    initials: 'EP',
    colorClass: 'bg-[#2E8B57] text-white',
  },
];

export const COMPANY_STATS = [
  {target: 12, decimals: 0, suffix: '', label: 'team members'},
  {target: 3, decimals: 0, suffix: '', label: 'time zones'},
  {target: 140, decimals: 0, suffix: '+', label: 'customers'},
  {target: 2.3, decimals: 1, suffix: 'M', label: 'traces / day'},
];

export interface OpenRole {
  id: string;
  title: string;
  team: string;
  location: string;
  type: string;
}

export const OPEN_ROLES: OpenRole[] = [
  {
    id: 'rust-ingest',
    title: 'Senior Distributed Systems Engineer',
    team: 'Ingestion & Storage',
    location: 'Remote (US / EU / Africa)',
    type: 'Full-time',
  },
  {
    id: 'sdk-ts',
    title: 'Staff SDK & Telemetry Engineer',
    team: 'Developer Experience',
    location: 'Remote (Global)',
    type: 'Full-time',
  },
  {
    id: 'ml-evals',
    title: 'Applied ML Engineer — Evals',
    team: 'Quality & Guardrails',
    location: 'Remote (US / EU)',
    type: 'Full-time',
  },
];

export type IndustryCategory = 'All' | 'Support' | 'Engineering' | 'Sales' | 'Finance';

export interface BeforeAfterComparison {
  label: string;
  beforeLabel: string;
  afterLabel: string;
  beforePct: number;
  afterPct: number;
  improvementTag: string;
}

export interface CaseStudy {
  slug: string;
  company: string;
  industry: Exclude<IndustryCategory, 'All'>;
  featured?: boolean;
  headlineMetric: string;
  summary: string;
  headline: string;
  metrics: {target: number; decimals?: number; prefix?: string; suffix: string; label: string}[];
  facts: {
    industry: string;
    teamSize: string;
    agentsInProd: string;
    stack: string;
  };
  productsUsed: {label: string; to: string}[];
  challenge: string[];
  approach: {title: string; detail: string}[];
  resultsSummary: string[];
  beforeAfter: BeforeAfterComparison[];
  quote: {
    text: string;
    author: string;
    role: string;
    initials: string;
  };
  whatsNext: string;
  relatedSlugs: [string, string];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'lumen-labs',
    company: 'Lumen Labs',
    industry: 'Support',
    featured: true,
    headlineMetric: '-31% cost per run',
    summary: 'Found a hidden multi-turn hallucination loop in 20 minutes and cut unit spend by 31%.',
    headline: 'How Lumen Labs eliminated silent support loops and cut unit cost by 31%',
    metrics: [
      {target: 31, suffix: '%', label: 'cost per run reduction'},
      {target: 20, suffix: 'm', label: 'time to root cause'},
      {target: 0.8, decimals: 1, suffix: '%', label: 'hallucination rate'},
    ],
    facts: {
      industry: 'Enterprise Support AI',
      teamSize: '24 ML & platform engineers',
      agentsInProd: '6 production workflows',
      stack: 'Python, LangChain, Claude Sonnet',
    },
    productsUsed: [
      {label: 'Agent Tracing', to: '/product/tracing'},
      {label: 'Automated Evals', to: '/product/evals'},
      {label: 'Cost & Latency', to: '/product/cost-latency'},
      {label: 'Live Alerts', to: '/product/alerts'},
    ],
    challenge: [
      'Lumen Labs processes over 420,000 customer billing and warranty tickets weekly through an autonomous triage and refund agent. As ticket complexity climbed, leadership noticed LLM invoices jumping 40% month over month while CSAT scores drifted downward on enterprise accounts.',
      'Because every failing run still returned HTTP 200 to their API gateway, standard APM charts looked completely green. Engineers spent up to six hours per incident stitching raw JSON logs together across distributed Celery workers without knowing which retrieval query or retry triggered bad policy citations.',
    ],
    approach: [
      {
        title: 'Wrap top-level triage handlers with OpenTelemetry spans',
        detail:
          'Using the Sightline Python decorator, Lumen Labs captured nested planner, knowledge-base search, and guardrail decisions within ten minutes without altering agent routing logic.',
      },
      {
        title: 'Pinpoint retry storms and uncached system prompts',
        detail:
          'Waterfall views immediately exposed a serial loop where empty vector-search matches triggered three redundant LLM re-plans—multiplying input tokens 3.4x per ticket.',
      },
      {
        title: 'Deploy CI release gates and Slack regression alerts',
        detail:
          'Flagged production transcripts were promoted straight into a 120-case golden eval dataset, gating every prompt pull request before merge.',
      },
    ],
    resultsSummary: [
      'Within the first 20 minutes of inspecting live span trees, Lumen Labs resolved the empty-retrieval loop and moved static warranty rules into cached prompt prefixes. Unit cost fell 31% across all workflows while hallucination flags dropped from 3.1% down to 0.8%.',
      'Mean incident triage time fell from six hours of log grep archaeology to under 20 minutes with span-linked Slack alerts.',
    ],
    beforeAfter: [
      {
        label: 'Mean time to root cause',
        beforeLabel: '6.0 hrs',
        afterLabel: '20 mins',
        beforePct: 100,
        afterPct: 12,
        improvementTag: '18x faster',
      },
      {
        label: 'Unit cost per resolved ticket',
        beforeLabel: '$0.0061',
        afterLabel: '$0.0042',
        beforePct: 100,
        afterPct: 69,
        improvementTag: '-31% spend',
      },
      {
        label: 'Hallucination flag rate',
        beforeLabel: '3.1%',
        afterLabel: '0.8%',
        beforePct: 100,
        afterPct: 26,
        improvementTag: '-74% flags',
      },
    ],
    quote: {
      text: 'We found a hallucination loop in 20 minutes that had been hiding behind HTTP 200 responses for three weeks.',
      author: 'Amara O.',
      role: 'Head of AI, Lumen Labs',
      initials: 'AO',
    },
    whatsNext:
      'Lumen Labs is now rolling out Sightline EU data residency for German banking customers and expanding automated tone evals to outbound email agents.',
    relatedSlugs: ['northwind', 'kestrel'],
  },
  {
    slug: 'northwind',
    company: 'Northwind',
    industry: 'Engineering',
    headlineMetric: '4x faster debugging',
    summary: 'Cut PR review agent debugging from hours to minutes with span-level AST diff attribution.',
    headline: 'How Northwind accelerated code review agent triage by 4x',
    metrics: [
      {target: 4, suffix: 'x', label: 'faster root-cause triage'},
      {target: 96.4, decimals: 1, suffix: '%', label: 'PR eval pass rate'},
      {target: 1.9, decimals: 1, suffix: 's', label: 'p95 review latency'},
    ],
    facts: {
      industry: 'Developer Tooling',
      teamSize: '18 platform engineers',
      agentsInProd: '4 repo review agents',
      stack: 'TypeScript, OpenAI SDK, GitHub Apps',
    },
    productsUsed: [
      {label: 'Agent Tracing', to: '/product/tracing'},
      {label: 'Automated Evals', to: '/product/evals'},
    ],
    challenge: [
      'Northwind runs automated pull-request security audits across thousands of customer repositories. Large monorepo diffs caused intermittent context-window overflows and stalled webhook workers without clean error attribution.',
    ],
    approach: [
      {
        title: 'Instrument AST chunking and grep tool spans',
        detail: 'Measured wall-clock time for file parsing separate from GPT inference.',
      },
      {
        title: 'Track token inflation across diff sizes',
        detail: 'Tagged every span with repository file count and diff byte totals.',
      },
      {
        title: 'Enforce latency alerts on slow workers',
        detail: 'Routed p95 spikes over 3.5s straight to platform Slack channels.',
      },
    ],
    resultsSummary: [
      'Engineers eliminated redundant repo grep calls, sped up debugging 4x, and stabilized PR eval accuracy at 96.4%.',
    ],
    beforeAfter: [
      {
        label: 'Incident triage duration',
        beforeLabel: '2.5 hrs',
        afterLabel: '35 mins',
        beforePct: 100,
        afterPct: 24,
        improvementTag: '4x faster',
      },
      {
        label: 'p95 PR audit latency',
        beforeLabel: '4.1s',
        afterLabel: '1.9s',
        beforePct: 100,
        afterPct: 46,
        improvementTag: '-54% latency',
      },
    ],
    quote: {
      text: 'Cost per run dropped 31% after one week of traces, and our review latency stayed predictable.',
      author: 'Daniel K.',
      role: 'CTO, Northwind',
      initials: 'DK',
    },
    whatsNext:
      'Expanding automated CVE detection golden suites across Go and Rust workspaces.',
    relatedSlugs: ['lumen-labs', 'kestrel'],
  },
  {
    slug: 'kestrel',
    company: 'Kestrel',
    industry: 'Finance',
    headlineMetric: '99.98% uptime',
    summary: 'Caught third-party rate-limit spirals early with retry span alerts and automatic fallbacks.',
    headline: 'How Kestrel protected financial reconciliation workflows with live retry alerts',
    metrics: [
      {target: 99.98, decimals: 2, suffix: '%', label: 'pipeline reliability'},
      {target: 0, suffix: '', label: 'unredacted PII leaks'},
      {target: 42, suffix: '%', label: 'faster close workflow'},
    ],
    facts: {
      industry: 'Fintech Automation',
      teamSize: '14 engineers',
      agentsInProd: '3 ledger reconciliation agents',
      stack: 'Python, Gemini 2.5, Snowflake',
    },
    productsUsed: [
      {label: 'Live Alerts', to: '/product/alerts'},
      {label: 'Security & PII', to: '/product/security'},
    ],
    challenge: [
      'Kestrel reconciles multi-currency invoices automatically for mid-market finance teams. Silent SDK retries during upstream API brownouts previously stalled batch jobs until morning.',
    ],
    approach: [
      {
        title: 'Expose retry attempts as explicit child spans',
        detail: 'Revealed hidden exponential backoffs before batch timeouts fired.',
      },
      {
        title: 'Enable edge PII redaction for account numbers',
        detail: 'Masked IBAN and tax IDs before traces ever left Kestrel’s VPC.',
      },
      {
        title: 'Route threshold spikes to PagerDuty',
        detail: 'Triggered failover routing whenever retry rate crossed 1.5%.',
      },
    ],
    resultsSummary: [
      'Kestrel hit 99.98% reconciliation uptime with zero unredacted financial identifiers stored on disk.',
    ],
    beforeAfter: [
      {
        label: 'Failed batch reconciliations / mo',
        beforeLabel: '11 runs',
        afterLabel: '1 run',
        beforePct: 100,
        afterPct: 9,
        improvementTag: '-91% failures',
      },
      {
        label: 'Alert detection lead time',
        beforeLabel: '45 mins',
        afterLabel: '45 secs',
        beforePct: 100,
        afterPct: 5,
        improvementTag: '60x faster',
      },
    ],
    quote: {
      text: 'Alerts caught a rate limit spiral before customers even noticed invoice delays.',
      author: 'Priya S.',
      role: 'Platform Lead, Kestrel',
      initials: 'PS',
    },
    whatsNext: 'Exporting daily sanitized audit tables directly to Snowflake.',
    relatedSlugs: ['lumen-labs', 'halcyon'],
  },
  {
    slug: 'halcyon',
    company: 'Halcyon',
    industry: 'Engineering',
    headlineMetric: '95% eval pass gate',
    summary: 'Built an automated release gate preventing prompt regressions across 8 product squads.',
    headline: 'How Halcyon standardized CI eval gates across eight product teams',
    metrics: [
      {target: 95, suffix: '%', label: 'minimum release floor'},
      {target: 3, suffix: 'x', label: 'faster prompt iteration'},
      {target: 180, suffix: '', label: 'golden regression cases'},
    ],
    facts: {
      industry: 'Workflow Software',
      teamSize: '32 engineers',
      agentsInProd: '8 assistant modules',
      stack: 'Python, LlamaIndex, GitHub Actions',
    },
    productsUsed: [
      {label: 'Automated Evals', to: '/product/evals'},
      {label: 'Integrations', to: '/product/integrations'},
    ],
    challenge: [
      'Whenever one squad tuned a shared retrieval prompt, subtle JSON formatting breakages slipped into production for another product surface.',
    ],
    approach: [
      {
        title: 'Consolidate golden datasets inside Sightline',
        detail: 'Unified 180 real user edge cases from Slack bug threads.',
      },
      {
        title: 'Block GitHub merges below 95% pass score',
        detail: 'Posted per-scorer diff summaries automatically on pull requests.',
      },
      {
        title: 'Track groundedness drift weekly',
        detail: 'Flagged retrieval embedding regressions after index rebuilds.',
      },
    ],
    resultsSummary: [
      'Halcyon cut prompt-related rollbacks by 80% while shipping three times more weekly improvements.',
    ],
    beforeAfter: [
      {
        label: 'Production prompt rollbacks / qtr',
        beforeLabel: '10',
        afterLabel: '2',
        beforePct: 100,
        afterPct: 20,
        improvementTag: '-80% rollbacks',
      },
      {
        label: 'PR eval suite runtime',
        beforeLabel: '14 mins',
        afterLabel: '42 secs',
        beforePct: 100,
        afterPct: 8,
        improvementTag: '20x faster',
      },
    ],
    quote: {
      text: 'Evals finally gave us a release gate our whole engineering org actually trusts.',
      author: 'Tunde A.',
      role: 'ML Engineer, Halcyon',
      initials: 'TA',
    },
    whatsNext: 'Adding automated multilingual tone scorers for European launches.',
    relatedSlugs: ['northwind', 'brightpath'],
  },
  {
    slug: 'brightpath',
    company: 'Brightpath',
    industry: 'Sales',
    headlineMetric: '-38% token spend',
    summary: 'Trimmed lead-enrichment token waste by switching low-risk routing spans to lighter models.',
    headline: 'How Brightpath cut lead enrichment costs by 38% without losing accuracy',
    metrics: [
      {target: 38, suffix: '%', label: 'lower token spend'},
      {target: 1.2, decimals: 1, suffix: 's', label: 'avg enrichment time'},
      {target: 98.1, decimals: 1, suffix: '%', label: 'CRM field accuracy'},
    ],
    facts: {
      industry: 'Revenue Intelligence',
      teamSize: '11 engineers',
      agentsInProd: '3 outbound & CRM agents',
      stack: 'TypeScript, OpenAI + Gemini',
    },
    productsUsed: [
      {label: 'Cost & Latency', to: '/product/cost-latency'},
      {label: 'Agent Tracing', to: '/product/tracing'},
    ],
    challenge: [
      'Brightpath ran high-volume inbound lead qualification on frontier models for every step, driving margins thin on free signups.',
    ],
    approach: [
      {
        title: 'Attribute spend per span inside enrichment DAGs',
        detail: 'Identified 65% of cost sitting in simple domain classification steps.',
      },
      {
        title: 'Benchmark lighter models against golden CRM sets',
        detail: 'Confirmed zero accuracy loss on firmographic extraction.',
      },
      {
        title: 'Monitor unit margin per customer workspace',
        detail: 'Alerted automatically whenever a workflow exceeded $0.01/run.',
      },
    ],
    resultsSummary: [
      'Brightpath lowered enrichment unit costs by 38% and doubled median response speed.',
    ],
    beforeAfter: [
      {
        label: 'Cost per enriched lead',
        beforeLabel: '$0.0084',
        afterLabel: '$0.0052',
        beforePct: 100,
        afterPct: 62,
        improvementTag: '-38% cost',
      },
      {
        label: 'End-to-end enrichment latency',
        beforeLabel: '2.6s',
        afterLabel: '1.2s',
        beforePct: 100,
        afterPct: 46,
        improvementTag: '2.1x faster',
      },
    ],
    quote: {
      text: 'Seeing cost per span showed us exactly which classifier calls did not need our heaviest model.',
      author: 'Maya L.',
      role: 'VP Engineering, Brightpath',
      initials: 'ML',
    },
    whatsNext: 'Rolling out automated prompt-cache optimization across outbound research agents.',
    relatedSlugs: ['orbital', 'lumen-labs'],
  },
  {
    slug: 'orbital',
    company: 'Orbital',
    industry: 'Support',
    headlineMetric: '15m onboarding',
    summary: 'Unified voice and chat triage traces across three regions with strict PII scrubbing.',
    headline: 'How Orbital unified multi-channel support traces in 15 minutes',
    metrics: [
      {target: 15, suffix: 'm', label: 'SDK instrumentation time'},
      {target: 28, suffix: '%', label: 'fewer escalations'},
      {target: 100, suffix: '%', label: 'EU PII redaction'},
    ],
    facts: {
      industry: 'Logistics Support',
      teamSize: '20 engineers',
      agentsInProd: '5 regional triage agents',
      stack: 'Python, Anthropic, Postgres',
    },
    productsUsed: [
      {label: 'Agent Tracing', to: '/product/tracing'},
      {label: 'Security & PII', to: '/product/security'},
    ],
    challenge: [
      'Orbital needed unified visibility across shipment tracking bots operating in three compliance zones without exposing customer phone numbers.',
    ],
    approach: [
      {
        title: 'Deploy edge PII scrubbing inside regional workers',
        detail: 'Hashed phone and address tokens consistently across turns.',
      },
      {
        title: 'Thread session IDs across voice and chat handoffs',
        detail: 'Kept full context visible when tickets escalated to humans.',
      },
      {
        title: 'Alert on empty carrier tracking lookups',
        detail: 'Caught broken webhook credentials immediately.',
      },
    ],
    resultsSummary: [
      'Orbital instrumented all five agents in 15 minutes and reduced human ticket escalations by 28%.',
    ],
    beforeAfter: [
      {
        label: 'Unresolved bot escalations',
        beforeLabel: '34%',
        afterLabel: '24%',
        beforePct: 100,
        afterPct: 71,
        improvementTag: '-28% escalations',
      },
      {
        label: 'Manual log lookup per escalation',
        beforeLabel: '18 mins',
        afterLabel: '90 secs',
        beforePct: 100,
        afterPct: 10,
        improvementTag: '12x faster',
      },
    ],
    quote: {
      text: 'Our support and platform engineers finally look at the same trace instead of guessing.',
      author: 'Jonas V.',
      role: 'Director of Platform, Orbital',
      initials: 'JV',
    },
    whatsNext: 'Connecting automated refund evals into weekly operations reviews.',
    relatedSlugs: ['lumen-labs', 'kestrel'],
  },
];

export const CUSTOMERS_AGGREGATE_STATS = [
  {target: 31, decimals: 0, suffix: '%', label: 'avg cost reduction'},
  {target: 4, decimals: 0, suffix: 'x', label: 'faster debugging'},
  {target: 20, decimals: 0, suffix: ' min', label: 'avg time to first insight'},
];

export interface ContactChannel {
  id: string;
  label: string;
  email: string;
  responseChip: string;
  description: string;
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'sales',
    label: 'Sales',
    email: 'sales@Sightline.dev',
    responseChip: '< 4 business hrs',
    description: 'Pricing, custom trace volumes, VPC trials, and procurement reviews.',
  },
  {
    id: 'support',
    label: 'Support',
    email: 'support@Sightline.dev',
    responseChip: '< 2 hrs priority',
    description: 'SDK instrumentation help, OpenTelemetry collectors, and workspace billing.',
  },
  {
    id: 'press',
    label: 'Press',
    email: 'press@Sightline.dev',
    responseChip: '< 1 business day',
    description: 'Media inquiries, benchmark reports, and speaking requests.',
  },
];

export interface OfficeHub {
  city: string;
  country: string;
  timezone: string;
  hours: string;
}

export const OFFICE_HUBS: OfficeHub[] = [
  {city: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', hours: '09:00–18:00 WAT'},
  {city: 'London', country: 'United Kingdom', timezone: 'Europe/London', hours: '09:00–18:00 GMT'},
  {city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', hours: '09:00–18:00 EST'},
];

export const CONTACT_FAQS: FaqItem[] = [
  {
    question: 'What is your typical response time?',
    answer:
      'Sales and general inquiries receive a human engineering reply within 4 business hours. Team and Enterprise customers get priority Slack and <2-hour email SLA.',
  },
  {
    question: 'What are your engineering support hours?',
    answer:
      'With hubs across Toronto, London, and Lagos, our solutions and on-call support engineers provide live coverage 18 hours per weekday plus 24/7 PagerDuty escalation for Enterprise.',
  },
  {
    question: 'How should I submit security or vulnerability reports?',
    answer:
      'Email security@Sightline.dev with reproduction steps, or read our full disclosure timeline on the Security legal page. We acknowledge every report within 24 hours.',
  },
];
