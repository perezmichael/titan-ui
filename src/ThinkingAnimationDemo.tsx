import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RotateCcw } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type OptionId = 1 | 2 | 3 | 4 | 5;

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

const THINKING_COMPONENTS: Record<OptionId, () => JSX.Element> = {
  1: ThinkingOption1,
  2: ThinkingOption2,
  3: ThinkingOption3,
  4: ThinkingOption4,
  5: ThinkingOption5,
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
