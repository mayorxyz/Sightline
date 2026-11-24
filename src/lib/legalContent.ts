export interface LegalSection {
  id: string;
  number: string;
  title: string;
  body: string;
}

export interface LegalDocument {
  key: 'privacy' | 'terms' | 'security';
  tag: string;
  title: string;
  italicWord: string;
  lastUpdated: string;
  demoNote: string;
  sections: LegalSection[];
}

export const LEGAL_CROSS_LINKS: {key: LegalDocument['key']; label: string; to: string}[] = [
  {key: 'privacy', label: 'Privacy Policy', to: '/legal/privacy'},
  {key: 'terms', label: 'Terms of Service', to: '/legal/terms'},
  {key: 'security', label: 'Security Policy', to: '/legal/security'},
];

export const LEGAL_DOCUMENTS: Record<LegalDocument['key'], LegalDocument> = {
  privacy: {
    key: 'privacy',
    tag: 'Legal',
    title: 'Privacy Policy',
    italicWord: 'Policy',
    lastUpdated: 'Last updated November 2026',
    demoNote: 'Sample content for a demo site',
    sections: [
      {
        id: 'data-we-collect',
        number: '01',
        title: 'Data we collect',
        body: 'We collect account details you provide directly, such as your name, work email address, and workspace configuration. When you instrument an AI agent, we ingest the trace metadata, latency timings, token counts, and prompt payloads your SDK is explicitly configured to send.',
      },
      {
        id: 'how-we-use-it',
        number: '02',
        title: 'How we use it',
        body: 'We process workspace telemetry solely to render trace waterfalls, compute eval pass rates, calculate token spend, and fire alerts you configure. Sightline never uses your private agent prompts, customer payloads, or evaluation datasets to train foundation models.',
      },
      {
        id: 'sharing',
        number: '03',
        title: 'Sharing',
        body: 'We do not sell or rent customer data. Information is shared only with vetted infrastructure subprocessors needed to host encrypted databases, send transactional email alerts, or process subscription billing, all bound by strict confidentiality and data processing terms.',
      },
      {
        id: 'retention',
        number: '04',
        title: 'Retention',
        body: 'Trace retention follows your workspace plan: 7 days on Starter, 30 days on Team, and custom 90-to-365-day windows on Enterprise. Deleted traces and expired logs are purged permanently from active storage and encrypted backups on a rolling schedule.',
      },
      {
        id: 'your-rights',
        number: '05',
        title: 'Your rights',
        body: 'Depending on your jurisdiction, you may request access, correction, export, or deletion of personal data stored in your workspace at any time. Workspace administrators can also configure regional EU or US storage pinning directly from security settings.',
      },
      {
        id: 'contact',
        number: '06',
        title: 'Contact',
        body: 'Questions regarding privacy requests, subprocessors, or Data Processing Addenda can be sent to privacy@Sightline.dev. We review and respond to every verified privacy inquiry within five business days.',
      },
    ],
  },
  terms: {
    key: 'terms',
    tag: 'Legal',
    title: 'Terms of Service',
    italicWord: 'Service',
    lastUpdated: 'Last updated November 2026',
    demoNote: 'Sample content for a demo site',
    sections: [
      {
        id: 'acceptance',
        number: '01',
        title: 'Acceptance',
        body: 'By creating an Sightline workspace, installing our SDKs, or running the browser sandbox, you agree to these Terms on behalf of yourself or your organization. If you enter into a separate Enterprise Order Form, that agreement governs where terms conflict.',
      },
      {
        id: 'accounts',
        number: '02',
        title: 'Accounts',
        body: 'You are responsible for safeguarding workspace API keys, OAuth tokens, and team member permissions. Please notify support@Sightline.dev promptly if you suspect unauthorized access or accidental exposure of an ingestion credential.',
      },
      {
        id: 'acceptable-use',
        number: '03',
        title: 'Acceptable use',
        body: 'You agree not to probe, disrupt, reverse-engineer, or exceed documented rate limits of Sightline ingestion collectors, nor transmit unlawful or malicious content designed to impair shared infrastructure or bypass tenant isolation controls.',
      },
      {
        id: 'billing',
        number: '04',
        title: 'Billing',
        body: 'Paid subscriptions renew monthly or annually based on active seat counts and selected trace volume tiers. Overages beyond included monthly quotas are billed transparently at published rates unless a workspace spending cap pauses ingestion.',
      },
      {
        id: 'liability',
        number: '05',
        title: 'Liability',
        body: 'To the maximum extent permitted by law, Sightline is provided on an as-available basis, and aggregate liability under these Terms is capped at the fees paid by your organization during the twelve months preceding any claim.',
      },
      {
        id: 'termination',
        number: '06',
        title: 'Termination',
        body: 'You may cancel your subscription or delete your workspace at any time in billing settings. Upon termination, SDK ingestion stops immediately and remaining workspace telemetry is deleted according to our standard retention schedule.',
      },
    ],
  },
  security: {
    key: 'security',
    tag: 'Legal',
    title: 'Security Policy',
    italicWord: 'Policy',
    lastUpdated: 'Last updated November 2026',
    demoNote: 'Sample content for a demo site',
    sections: [
      {
        id: 'infrastructure',
        number: '01',
        title: 'Infrastructure',
        body: 'Sightline runs on isolated multi-AZ cloud environments with strict VPC network segmentation, automated vulnerability scanning, and SOC 2 Type II audited operational controls. Enterprise teams may deploy collectors and storage inside their own private cloud VPC.',
      },
      {
        id: 'encryption',
        number: '02',
        title: 'Encryption',
        body: 'All SDK ingestion streams, dashboard requests, and webhook deliveries enforce TLS 1.3 in transit. Stored spans, eval datasets, and customer audit logs are encrypted at rest using AES-256 with managed key rotation.',
      },
      {
        id: 'access-control',
        number: '03',
        title: 'Access control',
        body: 'Workspace permissions enforce role-based access control across Viewer, Developer, and Admin tiers, with mandatory SAML/OIDC single sign-on, SCIM group sync, and short-lived scoped API tokens available on Enterprise.',
      },
      {
        id: 'pii-handling',
        number: '04',
        title: 'PII handling',
        body: 'Our SDK includes in-memory edge PII redaction that masks emails, credit cards, national IDs, and custom regex secrets before payloads serialize over the network, preserving consistent anonymized tokens for debugging.',
      },
      {
        id: 'incident-response',
        number: '05',
        title: 'Incident response',
        body: 'We maintain 24/7 automated anomaly detection and documented incident escalation runbooks. In the event of a confirmed security incident affecting customer data, impacted workspace owners receive prompt notification and remediation details.',
      },
      {
        id: 'reporting-vulnerabilities',
        number: '06',
        title: 'Reporting vulnerabilities',
        body: 'We welcome responsible disclosure from security researchers. Send findings with clear reproduction steps to security@Sightline.dev and refrain from accessing non-public customer data. We acknowledge reports within 24 hours.',
      },
    ],
  },
};
