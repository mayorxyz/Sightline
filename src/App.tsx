import React, {Suspense, lazy, useEffect} from 'react';
import {BrowserRouter, Route, Routes, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import {Navbar} from './components/Navbar';
import {ScrollProgress} from './components/ScrollProgress';
import {NotFound} from './components/NotFound';
import {Home} from './pages/Home';
import {Product} from './pages/Product';
import {useReducedMotion} from './hooks/useReducedMotion';
import {useLenisGsap} from './hooks/useLenisGsap';

const TracingPage = lazy(() => import('./pages/product/Tracing'));
const EvalsPage = lazy(() => import('./pages/product/Evals'));
const CostLatencyPage = lazy(() => import('./pages/product/CostLatency'));
const AlertsPage = lazy(() => import('./pages/product/Alerts'));
const SecurityPage = lazy(() => import('./pages/product/Security'));
const IntegrationsPage = lazy(() => import('./pages/product/Integrations'));
const PricingPage = lazy(() => import('./pages/Pricing'));
const PricingComparePage = lazy(() => import('./pages/pricing/Compare'));
const PricingRoiPage = lazy(() => import('./pages/pricing/Roi'));
const PricingFindPlanPage = lazy(() => import('./pages/pricing/FindPlan'));
const PricingEnterprisePage = lazy(() => import('./pages/pricing/Enterprise'));
const ResourcesIndexPage = lazy(() => import('./pages/resources/Index'));
const ResourcesChangelogPage = lazy(() => import('./pages/resources/Changelog'));
const ResourcesBlogPage = lazy(() => import('./pages/resources/Blog'));
const ResourcesBlogPostPage = lazy(() => import('./pages/resources/BlogPost'));
const ResourcesDocsPage = lazy(() => import('./pages/resources/Docs'));
const ResourcesDocPage = lazy(() => import('./pages/resources/DocPage'));
const DemoPage = lazy(() => import('./pages/Demo'));
const DemoSandboxPage = lazy(() => import('./pages/demo/Sandbox'));
const DemoConfirmedPage = lazy(() => import('./pages/demo/Confirmed'));
const AboutPage = lazy(() => import('./pages/About'));
const CustomersPage = lazy(() => import('./pages/Customers'));
const CustomerDetailPage = lazy(() => import('./pages/CustomerDetail'));
const ContactPage = lazy(() => import('./pages/Contact'));
const LegalPrivacyPage = lazy(() => import('./pages/legal/Privacy'));
const LegalTermsPage = lazy(() => import('./pages/legal/Terms'));
const LegalSecurityPage = lazy(() => import('./pages/legal/Security'));

const ROUTE_META: Record<string, {title: string; description: string}> = {
  '/': {
    title: 'Sightline — The Observability Layer for Modern AI Agents',
    description:
      'Full traces, automated evals, cost telemetry, and real-time alerts across every AI agent run.',
  },
  '/product': {
    title: 'Product Hub — Sightline AI Agent Observability',
    description:
      'Explore Tracing, Evals, Cost & Latency analytics, Alerts, Security, and 12+ integrations.',
  },
  '/product/tracing': {
    title: 'Agent Tracing — Sightline',
    description:
      'See every span inside every run: sessions, tool calls, retries, prompt diffs, and sampling.',
  },
  '/product/evals': {
    title: 'Automated Evals — Sightline',
    description:
      'Ship prompts with confidence using datasets, LLM-as-judge scorers, CI gates, and human review.',
  },
  '/product/cost-latency': {
    title: 'Cost & Latency — Sightline',
    description:
      'Track per-model, per-agent, and per-user token spend alongside p50/p95/p99 latency.',
  },
  '/product/alerts': {
    title: 'Live Alerts — Sightline',
    description:
      'Catch regressions before users do with real-time rules routed to Slack, Email, and PagerDuty.',
  },
  '/product/security': {
    title: 'Security & Privacy — Sightline',
    description:
      'Edge PII redaction, SAML SSO, EU/US data residency, SOC 2 Type II, and private VPC hosting.',
  },
  '/product/integrations': {
    title: 'Integrations — Sightline',
    description:
      'Connect OpenAI, Anthropic, Gemini, LangChain, LlamaIndex, Slack, PagerDuty, and warehouses.',
  },
  '/pricing': {
    title: 'Pricing — Sightline',
    description:
      'Simple pricing that scales with agent runs. Start free on Starter, upgrade to Team, or deploy in a private VPC.',
  },
  '/pricing/compare': {
    title: 'Sightline vs Alternatives — Pricing & Comparison',
    description:
      'Compare Sightline against generic APMs, logging stacks, and homegrown scripts across 10 observability criteria.',
  },
  '/pricing/roi': {
    title: 'ROI Calculator — Sightline',
    description:
      'Estimate engineering hours recovered, LLM token savings, and incident costs avoided with Sightline.',
  },
  '/pricing/find-plan': {
    title: 'Find My Plan — Sightline',
    description:
      'Take our 3-question assessment to match your trace volume and compliance requirements to Starter, Team, or Enterprise.',
  },
  '/pricing/enterprise': {
    title: 'Enterprise — Sightline',
    description:
      'SSO/SAML, immutable audit logs, private VPC deployment, regional residency, and 99.99% uptime SLA.',
  },
  '/resources': {
    title: 'Resources — Docs, Blog & Changelog | Sightline',
    description:
      'Quickstart SDK documentation, engineering blog articles on AI agent reliability, and weekly product changelog.',
  },
  '/resources/changelog': {
    title: 'Changelog — Sightline',
    description: 'Latest Sightline SDK releases, performance upgrades, and feature announcements.',
  },
  '/resources/blog': {
    title: 'Blog — Notes From The Trace | Sightline',
    description: 'Engineering notes on silent agent failures, eval release gates, and cost optimization.',
  },
  '/resources/docs': {
    title: 'Docs — Sightline',
    description: 'Short, practical Python and TypeScript SDK guides for tracing, evals, alerts, and PII redaction.',
  },
  '/demo': {
    title: 'Book a Demo — Sightline',
    description:
      'Try the interactive agent sandbox now, or book a 30-minute technical walkthrough with an engineer.',
  },
  '/demo/sandbox': {
    title: 'Interactive Sandbox — Sightline',
    description:
      'Explore live agent traces, run automated evals, inspect cost breakdowns, and test alert rules in-browser.',
  },
  '/demo/confirmed': {
    title: 'Walkthrough Confirmed — Sightline',
    description:
      'Your Sightline live walkthrough is booked. Add the invite to your calendar or explore the sandbox while you wait.',
  },
  '/about': {
    title: 'About — Sightline',
    description:
      'Meet the distributed engineering team behind Sightline, our story, values, and open remote roles.',
  },
  '/customers': {
    title: 'Customers — Sightline',
    description:
      'See how production AI engineering teams reduce token spend, accelerate debugging, and ship reliable agents.',
  },
  '/contact': {
    title: 'Contact — Sightline',
    description:
      'Get in touch with Sightline sales, engineering support, or press across Lagos, London, and Toronto.',
  },
  '/legal/privacy': {
    title: 'Privacy Policy — Sightline',
    description:
      'How Sightline collects, uses, retains, and protects account and AI agent trace telemetry.',
  },
  '/legal/terms': {
    title: 'Terms of Service — Sightline',
    description:
      'Terms governing access to Sightline workspaces, OpenTelemetry ingestion, billing, and APIs.',
  },
  '/legal/security': {
    title: 'Security Policy — Sightline',
    description:
      'Infrastructure encryption, edge PII redaction, role-based access controls, and vulnerability disclosure.',
  },
};

const RouteSync: React.FC = () => {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'auto'});

    const matchedMeta =
      ROUTE_META[pathname] ??
      (pathname.startsWith('/resources/blog/')
        ? ROUTE_META['/resources/blog']
        : pathname.startsWith('/resources/docs/')
          ? ROUTE_META['/resources/docs']
          : pathname.startsWith('/customers/')
            ? ROUTE_META['/customers']
            : {
                title: '404 Not Found — Sightline',
                description: 'The requested Sightline route could not be found.',
              });
    document.title = matchedMeta.title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', matchedMeta.description);
    }
  }, [pathname]);

  return null;
};

const SubPageFallback: React.FC = () => (
  <div className="p-4 pt-24">
    <div className="max-w-[1360px] mx-auto min-h-[360px] rounded-[24px] bg-[#0B0B0B]/5 animate-pulse" />
  </div>
);

const AppShell: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const location = useLocation();
  useLenisGsap(reducedMotion);

  return (
    <div className="min-h-[calc(100vh-16px)] w-full rounded-[28px] bg-[#E9E8E6] overflow-x-clip relative shadow-[0_1px_0_rgba(255,255,255,0.45)_inset]">
      <ScrollProgress />
      <RouteSync />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
          animate={{opacity: 1, y: 0}}
          exit={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: -8}}
          transition={{
            duration: reducedMotion ? 0 : 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Suspense fallback={<SubPageFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product />} />
              <Route path="/product/tracing" element={<TracingPage />} />
              <Route path="/product/evals" element={<EvalsPage />} />
              <Route path="/product/cost-latency" element={<CostLatencyPage />} />
              <Route path="/product/alerts" element={<AlertsPage />} />
              <Route path="/product/security" element={<SecurityPage />} />
              <Route path="/product/integrations" element={<IntegrationsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/pricing/compare" element={<PricingComparePage />} />
              <Route path="/pricing/roi" element={<PricingRoiPage />} />
              <Route path="/pricing/find-plan" element={<PricingFindPlanPage />} />
              <Route path="/pricing/enterprise" element={<PricingEnterprisePage />} />
              <Route path="/resources" element={<ResourcesIndexPage />} />
              <Route path="/resources/changelog" element={<ResourcesChangelogPage />} />
              <Route path="/resources/blog" element={<ResourcesBlogPage />} />
              <Route path="/resources/blog/:slug" element={<ResourcesBlogPostPage />} />
              <Route path="/resources/docs" element={<ResourcesDocsPage />} />
              <Route path="/resources/docs/:slug" element={<ResourcesDocPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/demo/sandbox" element={<DemoSandboxPage />} />
              <Route path="/demo/confirmed" element={<DemoConfirmedPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/:slug" element={<CustomerDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/legal/privacy" element={<LegalPrivacyPage />} />
              <Route path="/legal/terms" element={<LegalTermsPage />} />
              <Route path="/legal/security" element={<LegalSecurityPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
