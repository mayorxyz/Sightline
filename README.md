# Sightline

> **The Observability Layer for Modern AI Agents** — Full traces, automated evals, cost telemetry, and real-time alerts across every AI agent run.

Sightline is a React + Vite frontend for an AI agent observability platform. It provides tracing, evals, cost & latency analytics, live alerts, security, and integrations dashboards — built with Tailwind CSS, Framer Motion, GSAP, and Lenis for smooth, high-end scroll interactions.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data Layer (`src/lib`)](#data-layer-srclib)
- [Routing (`src/App.tsx`)](#routing-srcapptxs)
- [Design System](#design-system)
- [Key Pages](#key-pages)
- [Key Components](#key-components)
- [Sections](#sections)
- [Hooks](#hooks)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

---

## Project Overview

Sightline is a marketing/documentation site for an AI agent observability platform. It is **not** the observability backend itself — it's the customer-facing website that explains the product, demonstrates the sandbox, hosts documentation, and captures leads.

The site is built as a single-page React application with:
- **Client-side routing** via React Router
- **Scroll-driven animations** via Lenis + GSAP + ScrollTrigger
- **Motion layout** via Framer Motion
- **Utility-first CSS** via Tailwind CSS v4
- **Icons** via Lucide React

### Core Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Cobalt (`--color-cobalt`) | `#0B2FA8` | Primary brand, CTAs |
| Navy (`--color-navy`) | `#0A1F6B` | Dark accents, hero backgrounds |
| Sand (`--color-sand`) | `#D9C4A8` | Secondary brand, highlights |
| Ink (`--color-ink`) | `#0B0B0B` | Primary text |
| Page BG | `#E9E8E6` | Main page background |
| Outer Margin | `#B4B4B4` | Page wrapper background |

### Typography

| Font | Stack | Usage |
|------|-------|-------|
| Sans | `Inter Tight`, system-ui | Body, UI text |
| Serif | `Instrument Serif`, Georgia | Headline accents (italicized keywords) |
| Mono | `JetBrains Mono` | Code, labels, technical data |

---

## Tech Stack

| Category | Library | Version | Purpose |
|----------|---------|---------|---------|
| Framework | React | `^19.0.1` | UI library |
| DOM | React DOM | `^19.0.1` | React renderer |
| Routing | React Router DOM | `^7.18.6` | Client-side routing |
| Build Tool | Vite | `^8.3.0` | Bundler / dev server |
| CSS | Tailwind CSS | `^4.3.3` | Utility-first styling |
| CSS Plugin | `@tailwindcss/vite` | `^4.3.3` | Tailwind Vite integration |
| Animation | Framer Motion | `^14.14.0` | Layout & exit animations |
| Scroll | Lenis | `^1.3.27` | Smooth scrolling |
| Scroll GSAP | GSAP | `^3.15.1` | ScrollTrigger animations |
| Icons | Lucide React | `^0.546.0` | Icon library |
| Motion (extra) | Motion | `^12.23.24` | Additional motion utilities |
| AI SDK | `@google/genai` | `^2.4.0` | Google Generative AI |
| Server | Express | `^4.21.2` | Optional API server |
| Env | dotenv | `^17.2.3` | Environment variables |
| Type Check | TypeScript | `^7.0.2` | Static typing |
| TS Runner | tsx | `^4.21.0` | TypeScript execution |
| Bundler | esbuild | `^0.28.0` | JS bundling (dev dep) |

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommend 20+)
- npm (comes with Node)

### Installation

```bash
# Clone the repository
cd c:\Users\MAYOR\Desktop\Sightline

# Install dependencies
npm install
```

> **Note:** If you hit an `ERESOLVE` peer-dependency conflict with `esbuild` vs `vite@8`, ensure `esbuild` is set to `^0.28.0` in `package.json` (this project already reflects that fix).

### Development

```bash
# Start dev server on port 3000
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Lint / Type Check

```bash
# TypeScript type check (no emit)
npm run lint
```

### Clean

```bash
# Remove dist output
npm run clean
```


---

## Project Structure

```
Sightline/
├── index.html              # Entry HTML (favicon, fonts, meta tags)
├── package.json            # Dependencies, scripts, project config
├── vite.config.ts          # Vite config (Tailwind, React, asset copy)
├── README.md               # This file
├── public/
│   └── favicon-star.svg    # Site favicon (star with cobalt + sand colors)
├── dist/                   # Production build output (generated)
├── node_modules/           # Installed dependencies (generated)
└── src/
    ├── main.tsx            # React entry point (renders <App />)
    ├── index.css           # Tailwind imports + design tokens + animations
    ├── App.tsx             # Router shell, route definitions, route meta
    ├── lib/                # Data layer (content, mock data, types)
    ├── hooks/              # Custom React hooks
    ├── components/         # Reusable UI components
    ├── sections/           # Page-level section compositions
    └── pages/              # Route page components
```



---

## Data Layer (`src/lib`)

### `productContent.ts`

Defines all product page content used across the `/product/*` routes.

**Exports:**
- `ProductIconKey` — Union type: `'tracing' | 'evals' | 'cost' | 'alerts' | 'security' | 'integrations'`
- `ProductNavItem` — Interface: `{ id, title, description, to }`
- `PRODUCT_NAV_ITEMS` — Array of 6 product navigation items (Tracing, Evals, Cost & Latency, Alerts, Security, Integrations)
- `ArchNode` — Architecture diagram node type
- `ARCHITECTURE_NODES` — Architecture diagram data for the product page
- `ProductSubPageData` — Interface for each product sub-page's content (id, tag, headline, steps, capabilities, use cases, code, FAQ, related)
- `PRODUCT_PAGES` — Record keyed by `ProductIconKey` with full content for each product page

### `companyContent.ts`

Defines company/about page content.

**Exports:**
- `CompanyNavIconKey` — Union type: `'about' | 'customers' | 'contact'`
- `COMPANY_NAV_ITEMS` — Company navigation links
- `ABOUT_MISSION` — Mission statement string
- `StoryMilestone` / `STORY_MILESTONES` — Timeline milestones (2023 Idea, 2024 First trace, etc.)
- `COMPANY_VALUES` — Company values for the Values section
- `TEAM_MEMBERS` — Team member data
- `COMPANY_STATS` — Stat chip data for the "by the numbers" section

### `mockData.ts`

Central mock data used by demos and FAQs (dataset cases, FAQ items, etc.).

### `demoContent.ts`

Demo card content for the sandbox demo path chooser (variant: `'sand' | 'navy'`).

---

## Routing (`src/App.tsx`)

`App.tsx` is the application shell. It defines:

1. **Lazy-loaded route components** — All pages are code-split with `React.lazy()` for performance.
2. **`ROUTE_META`** — SEO title/description metadata per route.
3. **`RouteSync`** — Component that syncs document `<title>` and meta tags on route changes.
4. **`AppShell`** — The outer layout wrapper with:
   - `ScrollProgress` — Top scroll progress bar
   - `Navbar` — Main navigation
   - `AnimatePresence` + `motion.div` — Page transition animations on route change
   - `Suspense` — Fallback UI during lazy load
   - `<Routes>` — All route definitions

### Route Table

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `Home` | Landing page |
| `/product` | `Product` | Product hub with 6 module cards |
| `/product/tracing` | `Tracing` | Agent tracing sub-page |
| `/product/evals` | `Evals` | Automated evals sub-page |
| `/product/cost-latency` | `CostLatency` | Cost & latency analytics |
| `/product/alerts` | `Alerts` | Live alerts configuration |
| `/product/security` | `Security` | Security & compliance |
| `/product/integrations` | `Integrations` | 12+ connectors |
| `/pricing` | `Pricing` | Pricing overview |
| `/pricing/compare` | `PricingCompare` | Plan comparison |
| `/pricing/roi` | `PricingRoi` | ROI calculator |
| `/pricing/find-plan` | `PricingFindPlan` | Plan finder quiz |
| `/pricing/enterprise` | `PricingEnterprise` | Enterprise plan |
| `/resources` | `ResourcesIndex` | Docs/resources index |
| `/resources/changelog` | `ResourcesChangelog` | Changelog |
| `/resources/blog` | `ResourcesBlog` | Blog listing |
| `/resources/blog/:slug` | `ResourcesBlogPost` | Individual blog post |
| `/resources/docs` | `ResourcesDocs` | Docs index |
| `/resources/docs/:slug` | `ResourcesDocPage` | Individual doc page |
| `/demo` | `Demo` | Interactive demo |
| `/demo/sandbox` | `DemoSandbox` | Browser sandbox |
| `/demo/confirmed` | `DemoConfirmed` | Demo confirmation |
| `/about` | `About` | Company / team / values |
| `/customers` | `Customers` | Customer case studies |
| `/customers/:slug` | `CustomerDetail` | Individual case study |
| `/contact` | `Contact` | Contact form |
| `/legal/privacy` | `LegalPrivacy` | Privacy policy |
| `/legal/terms` | `LegalTerms` | Terms of service |
| `/legal/security` | `LegalSecurity` | Security overview |
| `*` | `NotFound` | 404 fallback |



---

## Design System

### Custom CSS (`src/index.css`)

- **Design tokens** defined in `@theme` block (colors, fonts)
- **`headline-display`** — Large display typography class (tight tracking, balanced wrapping)
- **`headline-serif-accent`** — Serif italic accent for emphasized words in headlines
- **Animations:**
  - `marquee-scroll` — Horizontal infinite marquee (34s)
  - `swirl-drift` — Gentle floating animation (60s)
- **Print styles** — Hides headers/footers on print

### Button Variants (`src/components/Button.tsx`)

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| `primary` | `#0B2FA8` (cobalt) | white | `#0B2FA8` | `#09268C` |
| `sand` | `#D9C4A8` (sand) | `#0B2FA8` | `#D9C4A8` | `#E2D0B7` |
| `secondary` | white | `#0B0B0B` | `#0B0B0B/10` | `#F7F6F4` |

All buttons include:
- Hover tilt effect (disabled with `prefers-reduced-motion`)
- Arrow icon that rotates/scale on hover
- Focus-visible outline for accessibility
- `Link` wrapper when `to` prop is provided, `<button>` otherwise

---

## Key Pages

### `/` — Home (`src/pages/Home.tsx`)
Landing page. Composes sections: `HeroSection`, `HeadlineSection`, `WhySightline`, `FeaturesSection`, `Testimonials`, `PricingTeaser`, `FaqSection`, `FinalCta`.

### `/product` — Product Hub (`src/pages/Product.tsx`)
Shows the "Six modules, one trace store" section with 6 motion cards (Tracing, Evals, Cost & Latency, Alerts, Security, Integrations). Each card links to its sub-page. Also renders `ArchitectureDiagram`, `AudienceTabs`, `BeforeAfterSlider`, `IntegrationGrid`, `SecurityStrip`.

### `/product/*` — Product Sub-pages (`src/pages/product/`)
Each sub-page uses `ProductPageTemplate` which renders a consistent layout:
1. **What It Is** — Title, body, chips, SVG diagram
2. **How It Works** — Numbered step grid (4 steps with progress scrubbing)
3. **Key Capabilities** — Capability cards
4. **Interactive Demo** — Embedded demo component
5. **Use Cases** — Problem/action/result cards
6. **Code Snippet** — Typewriter-effect code block (Python/TS/cURL)
7. **FAQ** — Accordion-style FAQ
8. **Related Modules** — Related product links
9. **Final CTA** — Request a demo band

Sub-pages: `Tracing.tsx`, `Evals.tsx`, `CostLatency.tsx`, `Alerts.tsx`, `Security.tsx`, `Integrations.tsx`

### `/about` — About (`src/pages/About.tsx`)
Company page with `MissionReveal`, `StoryTimeline`, Values grid, Team grid, "Company Numbers" stat section, `RolesList`, and a CTA band with "Try Sandbox" + "Contact Us" buttons.

### `/customers` & `/customers/:slug` — Customers
Customer case studies listing and individual case study detail pages.

### `/contact` — Contact (`src/pages/Contact.tsx`)
Contact form page.

### `/pricing/*` — Pricing
Pricing overview, comparison, ROI calculator, plan finder quiz, enterprise plan.

### `/resources/*` — Resources
Documentation, blog, changelog. Uses `DocsLayout` with left sidebar navigation and right "On this page" table of contents (both sticky on desktop).

### `/demo/*` — Demo
Interactive sandbox demo with path chooser, sandbox shell, scoring, booking wizard, calendar picker, and session checklist.



---

## Key Components

### Shared (`src/components/`)

| Component | File | Purpose |
|-----------|------|---------|
| `Button` | `Button.tsx` | Reusable CTA button (primary/sand/secondary) with hover tilt |
| `Navbar` | `Navbar.tsx` | Main navigation bar |
| `Footer` | `Footer.tsx` | Site footer |
| `PageHeader` | `PageHeader.tsx` | Section page header with tag + headline + subtitle |
| `SectionTag` | `SectionTag.tsx` | Small mono label above section headings |
| `RevealText` | `RevealText.tsx` | Scroll-reveal text animation |
| `HeroCanvas` | `HeroCanvas.tsx` | Animated SVG path canvas for hero |
| `LogoMarquee` | `LogoMarquee.tsx` | Infinite scrolling logo marquee |
| `ScrollProgress` | `ScrollProgress.tsx` | Top scroll progress indicator |
| `StatChip` | `StatChip.tsx` | Animated numeric stat counter |
| `NotFound` | `NotFound.tsx` | 404 page |
| `FloatingCursor` | `FloatingCursor.tsx` | Decorative floating cursor |

### Company Components (`src/components/company/`)

| Component | Purpose |
|-----------|---------|
| `MissionReveal` | Mission statement reveal animation |
| `StoryTimeline` | Vertical timeline of company milestones |
| `ValueCard` | Single company value card |
| `TeamCard` | Single team member card |
| `RolesList` | Open roles listing |
| `CaseStudyCard` / `CaseStudyTemplate` | Customer case study cards & template |
| `ContactCard` / `ContactForm` | Contact info & form |
| `HubClock` | Multi-timezone clock |
| `ApplyModal` | Job application modal |

### Product Components (`src/components/product/`)

| Component | Purpose |
|-----------|---------|
| `ProductPageTemplate` | Shared layout template for all product sub-pages |
| `ArchitectureDiagram` | SVG architecture diagram |
| `AudienceTabs` | Audience selector tabs |
| `BeforeAfterSlider` | Before/after comparison slider |
| `IntegrationGrid` | Integrations preview grid |
| `SecurityStrip` | Security features horizontal strip |
| `NavDropdown` / `ProductIcon` | Product navigation icons |
| `AgentTrace` | Trace visualization |

### Resource Components (`src/components/resources/`)

| Component | Purpose |
|-----------|---------|
| `DocsLayout` | Documentation page layout with sticky sidebars |
| `DocsSidebar` | Left navigation sidebar |
| `Toc` / `TocHeading` | Right "On this page" table of contents |
| `SearchBox` | Docs search (Cmd/Ctrl+K) |

### Demo Components (`src/components/demo/`)

Sandbox demo components: `SandboxShell`, `SandboxScore`, `PathChooser`, `BookingWizard`, `CalendarPicker`, `DemoForm`, `SandboxSidebar`, `SessionChecklist`, `SlotList`, `Steps`, `PrepChecklist`, `AgentRunTerminal`, `TourOverlay`.

### Dashboard Components (`src/components/dashboard/`)

Metrics, tables, charts, and log feeds for observability dashboards (`AgentDrawer`, `AgentTable`, `KpiCard`, `LogFeed`, `ModelDonut`, `Sparkline`, `StreamChart`, `WindowBar`).

---

## Sections (`src/sections/`)

Page-level composition blocks used primarily on the home page:

| Section | File | Purpose |
|---------|------|---------|
| `HeroSection` | `HeroSection.tsx` | Hero with CTA |
| `HeadlineSection` | `HeadlineSection.tsx` | Headline + demo button |
| `WhySightline` | `WhySightline.tsx` | Value proposition |
| `FeaturesSection` | `FeaturesSection.tsx` | Feature grid |
| `Testimonials` | `Testimonials.tsx` | Customer testimonials |
| `PricingTeaser` | `PricingTeaser.tsx` | Pricing preview |
| `FaqSection` | `FaqSection.tsx` | FAQ accordion |
| `FinalCta` | `FinalCta.tsx` | Final call-to-action band |
| `DashboardSection` | `DashboardSection.tsx` | Dashboard preview |
| `HowItWorks` | `HowItWorks.tsx` | Process explanation |

---

## Hooks (`src/hooks/`)

| Hook | File | Purpose |
|------|------|---------|
| `useReducedMotion` | `useReducedMotion.ts` | Detects `prefers-reduced-motion` media query |
| `useLenisGsap` | `useLenisGsap.ts` | Initializes Lenis smooth scroll + GSAP ScrollTrigger ticker |
| `useInView` | `useInView.ts` | IntersectionObserver hook for scroll-triggered animations |

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite --port=3000 --host=0.0.0.0` | Start dev server on port 3000 |
| `build` | `vite build` | Production build |
| `preview` | `vite preview` | Preview production build |
| `clean` | `rm -rf dist server.js` | Remove build output |
| `lint` | `tsc --noEmit` | TypeScript type check |

---

## Deployment

1. Run `npm run build` to generate the `dist/` folder.
2. Deploy the contents of `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, S3, etc.).
3. The app is a pure static SPA — no server required unless you add the optional Express backend.

---

## Development Notes

- **Motion preferences:** Components respect `prefers-reduced-motion`. Tilt effects, GSAP animations, and Lenis smooth scroll are disabled when reduced motion is enabled.
- **Lazy loading:** All sub-pages are code-split via `React.lazy()` with a `SubPageFallback` skeleton during load.
- **SEO:** Route meta titles/descriptions are synced to `<head>` via `RouteSync` on navigation.
- **Asset copying:** The Vite build copies `src/assets` to `dist/src/assets` so root-relative image URLs (e.g., generated images) continue working in production.
#   S i g h t l i n e  
 