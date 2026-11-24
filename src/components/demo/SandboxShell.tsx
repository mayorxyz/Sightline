import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import {
  ArrowLeft,
  BellRing,
  Check,
  Compass,
  Play,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import {KPI_SPECS} from '../../lib/mockData';
import {
  INITIAL_SANDBOX_EVALS,
  SANDBOX_TRACES,
  SandboxActionId,
  SandboxEvalCase,
  SandboxTraceRun,
  TourStep,
} from '../../lib/demoContent';
import {useInView} from '../../hooks/useInView';
import {useLiveTicker} from '../../hooks/useLiveTicker';
import {useReducedMotion} from '../../hooks/useReducedMotion';
import {KpiCard} from '../dashboard/KpiCard';
import {StreamChart} from '../dashboard/StreamChart';
import {LogFeed} from '../dashboard/LogFeed';
import {EvalTable} from '../features/EvalTable';
import {CostChart} from '../features/CostChart';
import {RuleBuilder} from '../product/RuleBuilder';
import {SandboxSidebar, SandboxTab} from './SandboxSidebar';
import {TraceTable} from './TraceTable';
import {TracePanel} from './TracePanel';
import {SandboxScoreBanner, SandboxScoreChip} from './SandboxScore';
import {TourOverlay} from './TourOverlay';

const TOUR_STORAGE_KEY = 'oiq_sandbox_tour_v1';

type CostRange = '24h' | '7d' | '30d';
type CostGroupBy = 'Model' | 'Agent' | 'Team';

const COST_BREAKDOWN: Record<
  CostGroupBy,
  {label: string; share: number; spend24h: number; p95: string}[]
> = {
  Model: [
    {label: 'claude-sonnet', share: 44, spend24h: 184, p95: '1.62s'},
    {label: 'gpt-4.1', share: 38, spend24h: 159, p95: '2.18s'},
    {label: 'gemini-2.5', share: 18, spend24h: 75, p95: '0.94s'},
  ],
  Agent: [
    {label: 'Support-Triage', share: 41, spend24h: 171, p95: '1.42s'},
    {label: 'Code-Reviewer', share: 33, spend24h: 138, p95: '3.10s'},
    {label: 'Refund-Resolver', share: 17, spend24h: 71, p95: '2.91s'},
    {label: 'Lead-Enricher', share: 9, spend24h: 38, p95: '1.77s'},
  ],
  Team: [
    {label: 'Customer Ops', share: 48, spend24h: 201, p95: '1.58s'},
    {label: 'DevEx & Tooling', share: 34, spend24h: 142, p95: '2.84s'},
    {label: 'Growth AI', share: 18, spend24h: 75, p95: '1.36s'},
  ],
};

export const SandboxShell: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref: shellRef, inView} = useInView<HTMLDivElement>({threshold: 0.05, once: false});
  const {subscribe} = useLiveTicker(inView);

  const [activeTab, setActiveTab] = useState<SandboxTab>('overview');
  const [selectedRun, setSelectedRun] = useState<SandboxTraceRun | null>(SANDBOX_TRACES[0]);
  const [flaggedTraceIds, setFlaggedTraceIds] = useState<string[]>([]);

  const [evalCases, setEvalCases] = useState<SandboxEvalCase[]>(INITIAL_SANDBOX_EVALS);
  const [threshold, setThreshold] = useState<number>(0.85);
  const [evalRunning, setEvalRunning] = useState(false);
  const [resolvedCount, setResolvedCount] = useState<number>(INITIAL_SANDBOX_EVALS.length);

  const [costRange, setCostRange] = useState<CostRange>('24h');
  const [costGroupBy, setCostGroupBy] = useState<CostGroupBy>('Model');

  const [alertSpikes, setAlertSpikes] = useState<number>(0);
  const [bellRinging, setBellRinging] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [completedActions, setCompletedActions] = useState<SandboxActionId[]>([]);

  const [tourOpen, setTourOpen] = useState<boolean>(() => {
    try {
      const saved = sessionStorage.getItem(TOUR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {dismissed?: boolean};
        return !parsed.dismissed;
      }
    } catch {
      // ignore
    }
    return true;
  });
  const [tourStep, setTourStep] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem(TOUR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {step?: number};
        return typeof parsed.step === 'number' ? parsed.step : 0;
      }
    } catch {
      // ignore
    }
    return 0;
  });

  const markAction = useCallback((action: SandboxActionId) => {
    setCompletedActions((prev) => (prev.includes(action) ? prev : [...prev, action]));
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        TOUR_STORAGE_KEY,
        JSON.stringify({step: tourStep, dismissed: !tourOpen})
      );
    } catch {
      // ignore
    }
  }, [tourStep, tourOpen]);

  const handleCloseTour = useCallback((completed?: boolean) => {
    setTourOpen(false);
    if (completed) {
      setTourStep(0);
    }
  }, []);

  const handleEnsureTourTab = useCallback((tab: NonNullable<TourStep['tab']>) => {
    setActiveTab(tab);
  }, []);

  const handleSelectTab = (tab: SandboxTab) => {
    setActiveTab(tab);
    if (tab === 'overview') markAction('overview');
    if (tab === 'cost') markAction('check_cost');
  };

  const handleSelectTrace = (run: SandboxTraceRun) => {
    setSelectedRun(run);
    markAction('open_trace');
  };

  const handleFlagBad = (run: SandboxTraceRun) => {
    if (flaggedTraceIds.includes(run.id)) return;
    setFlaggedTraceIds((prev) => [...prev, run.id]);
    const newCase: SandboxEvalCase = {
      id: `flagged_${run.id}`,
      dataset: 'sandbox_flagged',
      agent: run.agent,
      scorer: 'Human Review Gate',
      score: run.status === 'fail' ? 0.38 : 0.64,
    };
    setEvalCases((prev) => [newCase, ...prev]);
    setResolvedCount((c) => c + 1);
    markAction('open_trace');
    showToast(`Flagged ${run.id} → added to Evals dataset`);
  };

  const handleRunEval = () => {
    if (evalRunning) return;
    setEvalRunning(true);
    setResolvedCount(0);
    markAction('run_eval');

    if (reducedMotion) {
      setResolvedCount(evalCases.length);
      setEvalRunning(false);
      showToast('Eval suite completed across all cases');
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setResolvedCount(current);
      if (current >= evalCases.length) {
        clearInterval(interval);
        setEvalRunning(false);
        showToast(`Eval suite finished (${evalCases.length} cases evaluated)`);
      }
    }, 260);
  };

  const handleSimulateSpike = () => {
    setAlertSpikes((c) => c + 1);
    markAction('set_alert');
    if (!reducedMotion) {
      setBellRinging(true);
      setTimeout(() => setBellRinging(false), 750);
    }
    showToast('Spike simulated: Refund-Resolver p95 > 3.2s routed to #ai-oncall');
  };

  const handleShareView = () => {
    const shareUrl = `https://app.Sightline.dev/sandbox?tab=${activeTab}&ref=demo`;
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    markAction('share_view');
    showToast('Copied sandbox snapshot URL to clipboard');
  };

  const handleReset = () => {
    setActiveTab('overview');
    setSelectedRun(SANDBOX_TRACES[0]);
    setFlaggedTraceIds([]);
    setEvalCases(INITIAL_SANDBOX_EVALS);
    setResolvedCount(INITIAL_SANDBOX_EVALS.length);
    setThreshold(0.85);
    setCostRange('24h');
    setCostGroupBy('Model');
    setAlertSpikes(0);
    setCompletedActions([]);
    setTourStep(0);
    setTourOpen(true);
    showToast('Sandbox reset to default synthetic state');
  };

  const evalPassRate = useMemo(() => {
    const activeCases = evalCases.slice(0, Math.max(1, resolvedCount));
    const passed = activeCases.filter((c) => c.score >= threshold).length;
    return ((passed / activeCases.length) * 100).toFixed(1);
  }, [evalCases, resolvedCount, threshold]);

  const rangeMultiplier = costRange === '24h' ? 1 : costRange === '7d' ? 7 : 30;
  const costBreakdownRows = COST_BREAKDOWN[costGroupBy];

  return (
    <div
      ref={shellRef}
      className="min-h-[calc(100vh-16px)] rounded-[28px] bg-[#0A1F6B] text-white flex flex-col overflow-hidden pb-16 md:pb-0"
    >
      <header className="border-b border-white/15 bg-[#06154D] px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/demo"
            className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-medium text-white/80 hover:text-white pr-2 border-r border-white/15"
          >
            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">Back</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-[2px] bg-[#0B2FA8] text-white font-mono text-[9px] sm:text-[11px] font-medium uppercase tracking-[0.06em]">
            Sandbox
          </span>

          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#D9C4A8]/15 border border-[#D9C4A8]/40 text-[#D9C4A8] font-mono text-[9px] sm:text-[10.5px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9C4A8]" />
            <span className="hidden sm:inline">Fake data</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <SandboxScoreChip completed={completedActions} />

          <button
            type="button"
            onClick={() => {
              setTourStep(0);
              setTourOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] border border-white/15 bg-white/5 hover:bg-white/12 font-mono text-[9px] sm:text-[11px] text-white/85 cursor-pointer"
          >
            <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D9C4A8]" />
            <span className="hidden sm:inline">Restart tour</span>
          </button>

          <button
            type="button"
            data-tour="tour-share"
            onClick={handleShareView}
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] border border-white/15 bg-white/5 hover:bg-white/12 font-mono text-[9px] sm:text-[11px] text-white/85 cursor-pointer"
          >
            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D9C4A8]" />
            <span className="hidden sm:inline">Share view</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] border border-white/15 bg-white/5 hover:bg-white/12 font-mono text-[9px] sm:text-[11px] text-white/85 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <motion.span
            animate={
              bellRinging && !reducedMotion
                ? {rotate: [0, -18, 18, -12, 10, 0]}
                : {rotate: 0}
            }
            transition={{duration: 0.6}}
            aria-label="Alert bell"
            className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] border ${
              alertSpikes > 0
                ? 'bg-red-500/20 border-red-400/50 text-red-200'
                : 'bg-white/5 border-white/15 text-white/75'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
          </motion.span>

          <Link
            to="/demo#book"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-[2px] bg-[#D9C4A8] hover:bg-white text-[#0A1F6B] text-[11px] sm:text-[12px] font-semibold transition-colors whitespace-nowrap"
          >
            Book a live demo
          </Link>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <SandboxSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          alertCount={alertSpikes}
        />

        <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="tab-overview"
                initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: -8}}
                transition={{duration: reducedMotion ? 0 : 0.22}}
                data-tour="tour-overview"
                className="flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-[22px] font-medium tracking-[-0.02em]">
                      Production Overview
                    </h1>
                    <p className="text-xs sm:text-[13px] text-white/65">
                      Live telemetry stream across 4 synthetic agent pipelines.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      markAction('overview');
                      showToast('Overview KPIs marked inspected');
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[2px] font-mono text-[10px] sm:text-[11px] border cursor-pointer transition-colors ${
                      completedActions.includes('overview')
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                        : 'bg-[#0B2FA8] border-white/25 text-white hover:bg-[#1940C7]'
                    }`}
                  >
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">
                      {completedActions.includes('overview')
                        ? 'KPIs inspected'
                        : 'Mark KPIs inspected'}
                    </span>
                  </button>
                </div>

                <div
                  onClick={() => markAction('overview')}
                  className="grid grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4"
                >
                  {KPI_SPECS.map((spec, idx) => (
                    <KpiCard
                      key={spec.id}
                      spec={spec}
                      inView={true}
                      delayIdx={idx}
                      subscribe={subscribe}
                    />
                  ))}
                  <StreamChart inView={true} delayIdx={4} subscribe={subscribe} />
                  <LogFeed inView={true} delayIdx={5} subscribe={subscribe} />
                </div>
              </motion.div>
            )}

            {activeTab === 'traces' && (
              <motion.div
                key="tab-traces"
                initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: -8}}
                transition={{duration: reducedMotion ? 0 : 0.22}}
                data-tour="tour-traces"
                className="flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h1 className="text-xl sm:text-[22px] font-medium tracking-[-0.02em]">Agent Traces</h1>
                    <p className="text-xs sm:text-[13px] text-white/65">
                      Inspect span waterfalls, replay execution steps, or flag failing runs into Evals.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 items-start">
                  <div className={selectedRun ? 'xl:col-span-7' : 'xl:col-span-12'}>
                    <TraceTable
                      runs={SANDBOX_TRACES}
                      selectedId={selectedRun?.id ?? null}
                      onSelectRun={handleSelectTrace}
                    />
                  </div>

                  {selectedRun && (
                    <div className="xl:col-span-5">
                      <TracePanel
                        run={selectedRun}
                        isFlagged={flaggedTraceIds.includes(selectedRun.id)}
                        onClose={() => setSelectedRun(null)}
                        onFlagBad={handleFlagBad}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'evals' && (
              <motion.div
                key="tab-evals"
                initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: -8}}
                transition={{duration: reducedMotion ? 0 : 0.22}}
                data-tour="tour-evals"
                className="flex flex-col gap-4 sm:gap-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-[22px] font-medium tracking-[-0.02em]">
                      Automated Eval Suite
                    </h1>
                    <p className="text-xs sm:text-[13px] text-white/65">
                      Adjust pass threshold or run all scorers across golden &amp; flagged cases.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunEval}
                    disabled={evalRunning}
                    className="inline-flex items-center gap-2 rounded-[2px] bg-[#D9C4A8] hover:bg-white text-[#0A1F6B] text-xs sm:text-[13px] font-semibold px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer disabled:opacity-70"
                  >
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                    <span>{evalRunning ? 'Running eval...' : 'Run eval'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                  <div className="lg:col-span-7 rounded-[6px] bg-white/5 border border-white/15 p-3 sm:p-5 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D9C4A8]" />
                        <label
                          htmlFor="eval-threshold-slider"
                          className="font-mono text-[11px] sm:text-[12px] text-white/85"
                        >
                          Pass threshold:{' '}
                          <span className="text-[#D9C4A8] font-semibold tabular-nums">
                            {threshold.toFixed(2)}
                          </span>
                        </label>
                        <input
                          id="eval-threshold-slider"
                          type="range"
                          min="0.50"
                          max="0.98"
                          step="0.02"
                          value={threshold}
                          onChange={(e) => setThreshold(Number(e.target.value))}
                          className="accent-[#D9C4A8] cursor-pointer w-24 sm:w-auto"
                        />
                      </div>

                      <div className="font-mono text-[12px] sm:text-[13px] tabular-nums">
                        Pass rate:{' '}
                        <span className="text-[#D9C4A8] font-semibold">{evalPassRate}%</span>
                      </div>
                    </div>

                    <div className="h-1.5 w-full rounded-[2px] bg-white/10 overflow-hidden">
                      <div
                        style={{
                          width: `${(resolvedCount / Math.max(1, evalCases.length)) * 100}%`,
                        }}
                        className="h-full bg-[#D9C4A8] transition-all duration-200"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      {evalCases.map((item, idx) => {
                        const resolved = idx < resolvedCount;
                        const pass = item.score >= threshold;
                        return (
                          <div
                            key={item.id}
                            className={`flex flex-wrap items-center justify-between gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-[4px] border font-mono text-[11px] sm:text-[12px] tabular-nums transition-opacity ${
                              !resolved
                                ? 'opacity-40 bg-white/[0.02] border-white/10'
                                : pass
                                  ? 'bg-white/[0.05] border-white/15'
                                  : 'bg-red-500/15 border-red-400/35'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-white font-medium truncate">{item.id}</span>
                              <span className="text-white/50 text-[10px] sm:text-[11px] hidden sm:inline">
                                {item.agent} · {item.scorer}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              <span className="text-white">
                                {resolved ? item.score.toFixed(2) : '--'}
                              </span>
                              <span
                                className={`px-1.5 sm:px-2 py-0.5 rounded-[2px] text-[9px] sm:text-[10.5px] ${
                                  !resolved
                                    ? 'bg-white/10 text-white/60'
                                    : pass
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-red-500/25 text-red-200'
                                }`}
                              >
                                {!resolved ? 'queued' : pass ? 'pass' : 'fail'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <EvalTable active={true} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'cost' && (
              <motion.div
                key="tab-cost"
                initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: -8}}
                transition={{duration: reducedMotion ? 0 : 0.22}}
                data-tour="tour-cost"
                className="flex flex-col gap-4 sm:gap-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-[22px] font-medium tracking-[-0.02em]">
                      Cost &amp; Latency Economics
                    </h1>
                    <p className="text-xs sm:text-[13px] text-white/65">
                      Slice token spend and p95 response times across models, agents, and teams.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex rounded-[3px] bg-white/5 border border-white/15 p-0.5">
                      {(['24h', '7d', '30d'] as CostRange[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setCostRange(r);
                            markAction('check_cost');
                          }}
                          className={`px-2 sm:px-2.5 py-1 rounded-[2px] font-mono text-[10px] sm:text-[11px] cursor-pointer ${
                            costRange === r ? 'bg-[#0B2FA8] text-white' : 'text-white/65'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>

                    <div className="inline-flex rounded-[3px] bg-white/5 border border-white/15 p-0.5">
                      {(['Model', 'Agent', 'Team'] as CostGroupBy[]).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setCostGroupBy(g);
                            markAction('check_cost');
                          }}
                          className={`px-2 sm:px-2.5 py-1 rounded-[2px] font-mono text-[10px] sm:text-[11px] cursor-pointer ${
                            costGroupBy === g
                              ? 'bg-[#D9C4A8] text-[#0A1F6B] font-semibold'
                              : 'text-white/65'
                          }`}
                        >
                          By {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                  <div className="lg:col-span-6 min-h-[220px] sm:min-h-[260px]">
                    <CostChart active={true} />
                  </div>

                  <div className="lg:col-span-6 rounded-[6px] bg-white/5 border border-white/15 p-3 sm:p-5 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.08em] text-[#D9C4A8]">
                        Spend by {costGroupBy} ({costRange})
                      </span>
                      <span className="font-mono text-[11px] sm:text-[12px] text-white tabular-nums">
                        Total ${(418 * rangeMultiplier).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {costBreakdownRows.map((row) => (
                        <div key={row.label} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-xs sm:text-[13px]">
                            <span className="font-medium text-white">{row.label}</span>
                            <span className="font-mono text-[11px] sm:text-[12px] text-[#D9C4A8] tabular-nums">
                              ${(row.spend24h * rangeMultiplier).toLocaleString()} · p95 {row.p95}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-[2px] bg-white/10 overflow-hidden">
                            <div
                              style={{width: `${row.share}%`}}
                              className="h-full bg-[#0B2FA8] transition-all duration-300"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'alerts' && (
              <motion.div
                key="tab-alerts"
                initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: -8}}
                transition={{duration: reducedMotion ? 0 : 0.22}}
                data-tour="tour-alerts"
                className="flex flex-col gap-4 sm:gap-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-[22px] font-medium tracking-[-0.02em]">Live Alert Rules</h1>
                    <p className="text-xs sm:text-[13px] text-white/65">
                      Build threshold rules or simulate a latency spike to test on-call routing.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulateSpike}
                    className="inline-flex items-center gap-2 rounded-[2px] bg-[#D9C4A8] hover:bg-white text-[#0A1F6B] text-xs sm:text-[13px] font-semibold px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Simulate spike</span>
                  </button>
                </div>

                <div onClick={() => markAction('set_alert')}>
                  <RuleBuilder />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <SandboxScoreBanner completedCount={completedActions.length} />
        </main>
      </div>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: 12}}
            transition={{duration: reducedMotion ? 0 : 0.2}}
            className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-40 rounded-[4px] bg-white text-[#0B0B0B] border border-[#0B2FA8]/30 px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xl flex items-center gap-2 sm:gap-2.5 text-xs sm:text-[13px] font-medium max-w-[90vw]"
          >
            <span className="w-2 h-2 rounded-full bg-[#0B2FA8] shrink-0" />
            <span className="truncate">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <TourOverlay
        open={tourOpen}
        stepIndex={tourStep}
        onStepIndexChange={setTourStep}
        onClose={handleCloseTour}
        onEnsureTab={handleEnsureTourTab}
      />
    </div>
  );
};