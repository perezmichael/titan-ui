import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RotateCcw } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type OptionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const OPTIONS: { id: OptionId; name: string; description: string }[] = [
  { id: 1, name: 'Sequential Steps',  description: 'Steps build up with checkmarks as each stage completes' },
  { id: 2, name: 'Animated Pill',     description: 'Single pill with text crossfading through stages' },
  { id: 3, name: 'Source Gathering',  description: 'Source chips appear one-by-one before the response' },
  { id: 4, name: 'Typing + Context',  description: 'Classic dots with a rotating context label beneath' },
  { id: 5, name: 'Minimal Pulse',     description: 'Ultra-subtle — three pulsing dots, no text' },
  { id: 6, name: 'Morphing Logo',     description: 'Layered shapes rotating at different speeds — Claude-style' },
  { id: 7, name: 'Titan + Shimmer',  description: 'Titan logo with gradient arc spinner, shimmer sweep on text' },
  { id: 8, name: 'Titan + Typewriter', description: 'Titan logo with gradient arc spinner, chars fade in dark as they type' },
];

const STEPS = [
  'Validating message for PII',
  'Searching portfolio records',
  'Referencing KB documents',
  'Generating response',
];

const SOURCES = [
  { label: 'VFN Holdings — Q4 2025 Financials', type: 'doc' },
  { label: 'Axiom Commercial Lending Policy',   type: 'kb' },
  { label: 'GH3 Cler SNU — Credit Agreement',  type: 'doc' },
];

const PILL_LABELS = [
  'Validating for PII…',
  'Searching 6 portfolio records…',
  'Referencing 3 KB documents…',
  'Drafting response…',
];

const CONTEXT_LABELS = [
  'Validating message for PII',
  'Searching portfolio records',
  'Referencing knowledge base',
  'Drafting response',
];

const MOCK_RESPONSE = 'Found **2 loans** with maturities in the next 90 days: GH3 Cler SNU (matures Apr 12, 2026) and Retail Plaza Holdings (matures May 3, 2026). Both are flagged for renewal review.';

function renderText(text: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

// ─── Option 1: Sequential Steps ───────────────────────────────────────────────

function ThinkingOption1() {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    setVisibleSteps(0);
    setCompletedSteps(0);
    let step = 0;
    const show = setInterval(() => {
      step++;
      setVisibleSteps(step);
      if (step >= STEPS.length) clearInterval(show);
    }, 600);

    let done = 0;
    const complete = setInterval(() => {
      done++;
      setCompletedSteps(done);
      if (done >= STEPS.length - 1) clearInterval(complete);
    }, 1000);

    return () => { clearInterval(show); clearInterval(complete); };
  }, []);

  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 space-y-2 min-w-[260px]">
        {STEPS.slice(0, visibleSteps).map((step, i) => {
          const done = i < completedSteps;
          const active = i === visibleSteps - 1 && !done;
          return (
            <div
              key={step}
              className={`flex items-center gap-2.5 transition-all duration-300 ${
                i < visibleSteps ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                done ? 'bg-[#455a4f]' : active ? 'border-2 border-[#455a4f]' : 'border-2 border-gray-300'
              }`}>
                {done && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {active && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#455a4f] animate-pulse" />
                )}
              </div>
              <span className={`text-sm transition-colors duration-300 ${done ? 'text-gray-400 line-through' : active ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Option 2: Animated Pill ──────────────────────────────────────────────────

function ThinkingOption2() {
  const [labelIndex, setLabelIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setLabelIndex(0);
    setFading(false);
    let i = 0;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        i = (i + 1) % PILL_LABELS.length;
        setLabelIndex(i);
        setFading(false);
      }, 200);
      if (i >= PILL_LABELS.length - 1) clearInterval(interval);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
        <div className="w-3.5 h-3.5 border-2 border-[#455a4f] border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <span
          className="text-sm text-gray-700 transition-opacity duration-200 whitespace-nowrap"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {PILL_LABELS[labelIndex]}
        </span>
      </div>
    </div>
  );
}

// ─── Option 3: Source Gathering ───────────────────────────────────────────────

function ThinkingOption3() {
  const [visibleSources, setVisibleSources] = useState(0);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    setVisibleSources(0);
    setShowLabel(false);
    setTimeout(() => setShowLabel(true), 100);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleSources(i);
      if (i >= SOURCES.length) clearInterval(interval);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex flex-col gap-2">
        {showLabel && (
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Gathering sources
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          {SOURCES.slice(0, visibleSources).map((source, i) => (
            <div
              key={source.label}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 animate-in fade-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${source.type === 'doc' ? 'bg-amber-400' : 'bg-blue-400'}`} />
              {source.label}
            </div>
          ))}
          {visibleSources < SOURCES.length && (
            <div className="flex items-center gap-2 px-3 py-1.5">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Option 4: Typing + Context ───────────────────────────────────────────────

function ThinkingOption4() {
  const [labelIndex, setLabelIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setLabelIndex(0);
    setFading(false);
    let i = 0;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        i = Math.min(i + 1, CONTEXT_LABELS.length - 1);
        setLabelIndex(i);
        setFading(false);
      }, 200);
      if (i >= CONTEXT_LABELS.length - 1) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 px-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <span
          className="text-xs text-gray-400 transition-opacity duration-200 px-1"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {CONTEXT_LABELS[labelIndex]}
        </span>
      </div>
    </div>
  );
}

// ─── Option 5: Minimal Pulse ──────────────────────────────────────────────────

function ThinkingOption5() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex items-center gap-1.5 py-2.5 px-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#455a4f]/40 animate-pulse"
            style={{ animationDelay: `${i * 200}ms`, animationDuration: '1.2s' }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Option 6: Morphing Logo ──────────────────────────────────────────────────

function ThinkingOption6() {
  return (
    <div className="flex gap-3 items-start">
      {/* Animated logo mark */}
      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            @keyframes titan-spin-slow   { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
            @keyframes titan-spin-mid    { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
            @keyframes titan-spin-fast   { from { transform: rotate(45deg);  } to { transform: rotate(405deg);  } }
            @keyframes titan-breathe     { 0%, 100% { opacity: 0.9; } 50% { opacity: 0.4; } }
            .titan-l1 { transform-origin: 14px 14px; animation: titan-spin-slow  4s  linear infinite; }
            .titan-l2 { transform-origin: 14px 14px; animation: titan-spin-mid   3s  linear infinite; }
            .titan-l3 { transform-origin: 14px 14px; animation: titan-spin-fast  2s  linear infinite; }
            .titan-l4 { transform-origin: 14px 14px; animation: titan-breathe    1.8s ease-in-out infinite; }
          `}</style>
          {/* Layer 1 — outer diamond, slow clockwise */}
          <g className="titan-l1">
            <path d="M14 2L26 14L14 26L2 14Z" fill="#455a4f" fillOpacity="0.18" />
          </g>
          {/* Layer 2 — slightly smaller, counter-clockwise */}
          <g className="titan-l2">
            <path d="M14 5L23 14L14 23L5 14Z" fill="#455a4f" fillOpacity="0.28" />
          </g>
          {/* Layer 3 — smaller rotated square */}
          <g className="titan-l3">
            <rect x="8.5" y="8.5" width="11" height="11" rx="1.5" fill="#455a4f" fillOpacity="0.38" />
          </g>
          {/* Layer 4 — center dot, breathing */}
          <g className="titan-l4">
            <circle cx="14" cy="14" r="3.5" fill="#455a4f" fillOpacity="0.9" />
          </g>
        </svg>
      </div>

      {/* Fading label */}
      <div className="flex items-center gap-2 py-1.5">
        <span
          className="text-sm text-gray-500"
          style={{ animation: 'titan-breathe 1.8s ease-in-out infinite' }}
        >
          Thinking…
        </span>
      </div>
    </div>
  );
}

// ─── Shared: Titan logo + Gemini-style gradient arc ──────────────────────────

const TITAN_PATH = "M47.2423 71.4809L34.4963 58.7302C32.6352 56.86 33.2539 57.4793 31.7433 55.9716C14.6419 38.8588 11.7307 37.4185 11.7307 30.5882C11.7317 23.3304 17.5941 17.6895 24.6098 17.6892C31.1319 17.6892 33.976 21.7116 38.9795 26.7223L47.2461 18.4502C41.5612 12.7615 36.1899 6.00011 24.6098 6.00011C10.9317 6.00042 0.000739855 17.1042 0 30.5692C0 42.1253 6.79117 47.5434 12.4798 53.2358L12.5026 53.2167C27.7218 68.5006 21.6839 62.4498 38.9757 79.753L47.2423 71.4809ZM87.5299 53.2167C93.2148 47.5281 99.9717 42.1488 99.9717 30.5844C99.9742 8.56382 73.2786 -2.08453 57.9958 13.1992L26.2715 44.9446L34.5039 53.2129L66.2625 21.4714C74.3184 13.4114 88.2586 19.0372 88.26 30.5844C88.26 37.1225 84.2823 39.9222 79.2632 44.9446L87.5299 53.2167ZM75.3885 105.981C97.2753 105.981 108.216 79.4607 92.7735 64.0078L61.0226 32.2358L52.7598 40.5079L65.4982 53.2205C66.4132 54.1401 67.1959 54.9156 68.255 55.9754L68.2512 55.9792C79.9164 67.656 76.2804 64.0138 84.5183 72.2571C89.4984 77.2912 89.4986 85.4795 84.5107 90.5174C79.6319 95.4017 71.1332 95.3981 66.2625 90.5174L61.0188 85.2665L52.7522 93.5386C58.4563 99.2388 63.8207 105.981 75.3885 105.981ZM24.6098 106C37.5954 106 40.3064 100.475 73.7572 67.0024L65.4868 58.7378C31.2883 92.9512 31.712 94.292 24.6098 94.292C13.1508 94.2916 7.44711 80.3578 15.4876 72.2419L20.7275 66.9947L12.4798 58.7416L7.22096 64.0078C-8.26441 79.5034 2.88298 106 24.6098 106Z";

function TitanSpinnerIcon() {
  return (
    <div className="relative w-9 h-9 flex-shrink-0">
      {/* Gradient spinning arc */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#455a4f" stopOpacity="0" />
            <stop offset="100%" stopColor="#455a4f" stopOpacity="1" />
          </linearGradient>
        </defs>
        <style>{`
          @keyframes titan-arc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .titan-arc { transform-origin: 18px 18px; animation: titan-arc-spin 1.1s linear infinite; }
        `}</style>
        <g className="titan-arc">
          {/* Full ring base — very faint */}
          <circle cx="18" cy="18" r="16" stroke="#455a4f" strokeOpacity="0.12" strokeWidth="2" fill="none" />
          {/* Gradient arc — 270° sweep using stroke-dasharray */}
          <circle
            cx="18" cy="18" r="16"
            stroke="url(#arcGrad)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="75 26"
            strokeDashoffset="0"
          />
        </g>
      </svg>
      {/* Titan logo centered */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <svg viewBox="0 0 106 106" fill="none" className="w-full h-full">
          <path d={TITAN_PATH} fill="#FF6E3C" />
        </svg>
      </div>
    </div>
  );
}

// ─── Option 7: Titan + Shimmer text ──────────────────────────────────────────

function ThinkingOption7() {
  const [labelIndex, setLabelIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setLabelIndex(0);
    setFading(false);
    let i = 0;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        i = Math.min(i + 1, CONTEXT_LABELS.length - 1);
        setLabelIndex(i);
        setFading(false);
      }, 250);
      if (i >= CONTEXT_LABELS.length - 1) clearInterval(interval);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <TitanSpinnerIcon />
      <style>{`
        @keyframes shimmer-sweep {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg,
            #9ca3af 0%,
            #9ca3af 35%,
            #111827 50%,
            #9ca3af 65%,
            #9ca3af 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-sweep 1.8s linear infinite;
        }
      `}</style>
      <span
        className="text-sm font-medium shimmer-text transition-opacity duration-250"
        style={{ opacity: fading ? 0 : 1 }}
      >
        {CONTEXT_LABELS[labelIndex]}
      </span>
    </div>
  );
}

// ─── Option 8: Titan + Typewriter fade ───────────────────────────────────────

function ThinkingOption8() {
  const [labelIndex, setLabelIndex] = useState(0);
  const [displayed, setDisplayed] = useState(0);

  const currentLabel = CONTEXT_LABELS[labelIndex];

  // Advance labels
  useEffect(() => {
    setLabelIndex(0);
    setDisplayed(0);
    let i = 0;
    const interval = setInterval(() => {
      i = Math.min(i + 1, CONTEXT_LABELS.length - 1);
      setLabelIndex(i);
      setDisplayed(0);
      if (i >= CONTEXT_LABELS.length - 1) clearInterval(interval);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // Type out characters
  useEffect(() => {
    setDisplayed(0);
    let ch = 0;
    const t = setInterval(() => {
      ch++;
      setDisplayed(ch);
      if (ch >= currentLabel.length) clearInterval(t);
    }, 38);
    return () => clearInterval(t);
  }, [labelIndex, currentLabel]);

  return (
    <div className="flex items-center gap-3">
      <TitanSpinnerIcon />
      <style>{`
        @keyframes char-arrive {
          from { opacity: 0.2; color: #d1d5db; }
          to   { opacity: 1;   color: #111827; }
        }
        .char-arrive { animation: char-arrive 0.25s ease forwards; }
      `}</style>
      <span className="text-sm font-medium" aria-live="polite">
        {currentLabel.split('').map((char, i) => (
          <span
            key={`${labelIndex}-${i}`}
            className="char-arrive"
            style={{
              animationDelay: `${i * 38}ms`,
              opacity: i < displayed ? 1 : 0,
              color: '#111827',
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  );
}

const THINKING_COMPONENTS: Record<OptionId, () => JSX.Element> = {
  1: ThinkingOption1,
  2: ThinkingOption2,
  3: ThinkingOption3,
  4: ThinkingOption4,
  5: ThinkingOption5,
  6: ThinkingOption6,
  7: ThinkingOption7,
  8: ThinkingOption8,
};

// ─── Mock Chat ────────────────────────────────────────────────────────────────

function MockChat({ optionId }: { optionId: OptionId }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [thinkingKey, setThinkingKey] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  // Reset chat when option changes
  useEffect(() => {
    setMessages([]);
    setThinking(false);
    setInput('');
  }, [optionId]);

  const send = (query?: string) => {
    const q = query ?? input;
    if (!q.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: q }]);
    setThinking(true);
    setThinkingKey(k => k + 1);
    setTimeout(() => {
      setThinking(false);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: MOCK_RESPONSE }]);
    }, 3500);
  };

  const ThinkingComponent = THINKING_COMPONENTS[optionId];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 && !thinking && (
          <div className="h-full flex flex-col items-center justify-center text-center pb-8">
            <div className="w-10 h-10 rounded-xl bg-[#455a4f] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Send a message to see the animation</p>
            <p className="text-xs text-gray-400 mb-6">Or try one of these</p>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {[
                'Which loans have maturities in the next 90 days?',
                'How many deals are for data centers in Arizona?',
              ].map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-4 py-2.5 text-sm text-left bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] text-sm rounded-2xl px-4 py-2.5 leading-relaxed ${
              msg.role === 'user'
                ? 'bg-white border border-gray-200 text-gray-900 rounded-tr-sm'
                : 'bg-gray-50 border border-gray-200 text-gray-900 rounded-tl-sm'
            }`}>
              {renderText(msg.content)}
            </div>
          </div>
        ))}

        {thinking && <ThinkingComponent key={thinkingKey} />}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-gray-400 transition-colors">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder="Ask anything about your portfolio…"
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || thinking}
            className="w-7 h-7 bg-[#455a4f] text-white rounded-lg flex items-center justify-center hover:bg-[#3a4a42] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Demo ────────────────────────────────────────────────────────────────

export function ThinkingAnimationDemo() {
  const [activeOption, setActiveOption] = useState<OptionId>(1);
  const [chatKey, setChatKey] = useState(0);

  const currentOption = OPTIONS.find(o => o.id === activeOption)!;

  const switchOption = (id: OptionId) => {
    setActiveOption(id);
    setChatKey(k => k + 1);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-base font-medium text-gray-900">Thinking Animation — Design Review</h1>
              <p className="text-xs text-gray-500 mt-0.5">Send a message in the chat below to preview each animation</p>
            </div>
            <button
              onClick={() => setChatKey(k => k + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset chat
            </button>
          </div>

          {/* Option switcher */}
          <div className="flex items-stretch gap-2">
            {OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => switchOption(opt.id)}
                className={`flex-1 text-left px-3 py-2.5 rounded-xl border transition-all ${
                  activeOption === opt.id
                    ? 'bg-[#455a4f] border-[#455a4f] text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`text-xs font-semibold mb-0.5 ${activeOption === opt.id ? 'text-white/70' : 'text-gray-400'}`}>
                  Option {opt.id}
                </div>
                <div className={`text-xs font-medium leading-tight ${activeOption === opt.id ? 'text-white' : 'text-gray-800'}`}>
                  {opt.name}
                </div>
              </button>
            ))}
          </div>

          {/* Active option description */}
          <p className="text-xs text-gray-500 mt-2.5 pl-0.5">
            <span className="font-medium text-gray-700">{currentOption.name}:</span> {currentOption.description}
          </p>
        </div>
      </div>

      {/* Chat preview */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full">
          <MockChat key={`${activeOption}-${chatKey}`} optionId={activeOption} />
        </div>
      </div>
    </div>
  );
}
