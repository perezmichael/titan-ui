import { Shield, Users, GitBranch, CheckCircle2, XCircle, ArrowRight, BarChart2, ShieldCheck, Lightbulb, Brain, BookOpen, AlertTriangle } from 'lucide-react';

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return <section id={id} className="mb-16">{children}</section>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">{children}</h3>;
}

function ProCon({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-green-800 mb-3 uppercase tracking-wide flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Strengths</div>
        <ul className="space-y-2">
          {pros.map((p, i) => <li key={i} className="text-sm text-green-900 flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />{p}</li>)}
        </ul>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-red-800 mb-3 uppercase tracking-wide flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Gaps</div>
        <ul className="space-y-2">
          {cons.map((c, i) => <li key={i} className="text-sm text-red-900 flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />{c}</li>)}
        </ul>
      </div>
    </div>
  );
}

function PersonaCard({ initials, name, role, goal, pain }: { initials: string; name: string; role: string; goal: string; pain: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-[#455a4f] rounded-full flex items-center justify-center text-white text-sm font-medium">{initials}</div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">{role}</div>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Goal</span>
          <p className="text-xs text-gray-700 mt-0.5">{goal}</p>
        </div>
        <div>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Pain Point</span>
          <p className="text-xs text-gray-700 mt-0.5">{pain}</p>
        </div>
      </div>
    </div>
  );
}

function DecisionRow({ decision, reasoning }: { decision: string; reasoning: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="w-5 h-5 bg-[#455a4f] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle2 className="w-3 h-3 text-white" />
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{decision}</div>
        <div className="text-xs text-gray-500 mt-0.5">{reasoning}</div>
      </div>
    </div>
  );
}

export function Brief() {
  return (
    <div className="min-h-screen bg-[#f5f5f3]">
      {/* Header */}
      <div className="bg-[#455a4f] text-white">
        <div className="max-w-3xl mx-auto px-8 py-12">
          <div className="flex items-center gap-2 mb-4 text-green-300 text-xs font-medium uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            Titan AI · Design Brief
          </div>
          <h1 className="text-3xl font-bold mb-3">Explainability & Audit UI</h1>
          <p className="text-green-100 text-base max-w-2xl">
            A summary of our approach, the personas we designed for, what we learned from prior prototypes, and the reasoning behind every decision we made.
          </p>
          <div className="mt-6 flex items-center gap-6 text-sm text-green-200">
            <span>April 2026</span>
            <span>·</span>
            <span>Mike Perez · UX Design</span>
            <span>·</span>
            <span>Feature: Explainability v2</span>
          </div>
        </div>
      </div>

      {/* Nav anchor links */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-8">
          <div className="flex gap-6 overflow-x-auto py-3 text-xs font-medium text-gray-500">
            {['Context', 'Personas', 'The Story', 'Prior Work', 'Our Approach', 'Decisions', 'Oversight'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(' ', '-')}`} className="whitespace-nowrap hover:text-[#455a4f] transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-12">

        {/* Context */}
        <Section id="context">
          <H2>Why We Built This</H2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Banks using AI to assist with lending, compliance, and risk decisions face a hard problem: the AI needs to be helpful enough that bankers actually use it, but explainable enough that compliance officers, auditors, and regulators trust it. Most AI tools in this space get one side right and fail the other.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Our goal was to design an explainability layer that serves both audiences simultaneously — without making bankers feel like they're reading a machine learning paper, and without making compliance teams squint to find the audit trail they need.
          </p>
          <div className="bg-[#455a4f]/5 border border-[#455a4f]/20 rounded-lg p-4">
            <div className="text-xs font-semibold text-[#455a4f] mb-2 uppercase tracking-wide">The Core Design Tension</div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="text-center">
                <div className="font-medium">Banker</div>
                <div className="text-xs text-gray-500">Wants a clear answer fast</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 bg-white border border-gray-200 rounded px-3 py-2 text-center text-xs text-gray-600">
                Same UI, same response
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="text-center">
                <div className="font-medium">Compliance</div>
                <div className="text-xs text-gray-500">Needs the full audit trail</div>
              </div>
            </div>
          </div>
        </Section>

        {/* Personas */}
        <Section id="personas">
          <H2>The People We Designed For</H2>
          <p className="text-sm text-gray-600 mb-6">
            We grounded every decision in five real roles at a mid-size community bank (modeled on Axiom Bank, a composite of our target customer). Each person interacts with Titan AI differently and has different expectations of what "explainability" means.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <PersonaCard
              initials="MC"
              name="Marcus Chen"
              role="Relationship Manager"
              goal="Close deals quickly and keep clients happy — AI should surface insights, not slow him down"
              pain="Has to manually justify AI recommendations to credit committees without good tooling"
            />
            <PersonaCard
              initials="SL"
              name="Sandra Lee"
              role="BSA/AML Compliance Officer"
              goal="Ensure every AI-assisted decision has a complete, defensible audit trail for regulators"
              pain="AI outputs are black boxes — she can't tell examiners why the model flagged something"
            />
            <PersonaCard
              initials="DP"
              name="David Park"
              role="Credit Analyst"
              goal="Understand how the AI weighted financial factors so he can verify or challenge the output"
              pain="Can't see source documents the AI used — has to manually recheck every citation"
            />
            <PersonaCard
              initials="JW"
              name="Janet Wu"
              role="Third-Party Risk Manager"
              goal="Use AI to screen vendors faster while staying within SR 11-7 model risk guidelines"
              pain="No visibility into model drift or degradation — finds out about issues after the fact"
            />
            <PersonaCard
              initials="TB"
              name="Tom Barr"
              role="Chief Banking Officer (Demo User)"
              goal="See how Titan AI fits into the bank's day-to-day lending and compliance workflows"
              pain="Needs to explain AI adoption to the board and regulators without deep technical knowledge"
            />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <strong>Key insight:</strong> Marcus and Sandra need the same information but in opposite order. Marcus needs the answer first, then the evidence. Sandra needs the evidence first, then the conclusion. Our solution: progressive disclosure with section ordering tuned to the primary user (Marcus), and everything Sandra needs one click away.
          </div>
        </Section>

        {/* The Story */}
        <Section id="the-story">
          <H2>The Story We Used to Design</H2>
          <p className="text-sm text-gray-600 mb-4">
            Rather than design in the abstract, we role-played a realistic scenario at Axiom Bank to stress-test every screen against real human reactions.
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Scenario · Axiom Bank Commercial Loan Review</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Marcus</strong> is reviewing a $4.2M commercial loan for VFN Holdings Inc. He uses Titan AI to run a BSA/AML check. The AI returns a response with an "Assurance: Sufficient" badge. Marcus needs to understand what that means quickly — he has a client call in 10 minutes.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Sandra</strong> receives an audit notification for the same decision. She opens the full audit panel and needs to trace every source document, every inference, every confidence score — and export a report for the OCC examiner visiting next month.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>David</strong> disagrees with one of the AI's source citations. He wants to click into the specific document passage and verify it himself.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Janet</strong> is doing quarterly model risk review. She needs to see whether the compliance model has drifted since it was last retrained, and flag it to the model risk committee if so.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>The bank examiner</strong> doesn't have a Titan login — they receive a PDF export of the audit report. It needs to be human-readable without any AI context.
            </p>
          </div>
        </Section>

        {/* Prior Work */}
        <Section id="prior-work">
          <H2>What We Learned from Prior Prototypes</H2>
          <p className="text-sm text-gray-600 mb-6">
            Two prior design explorations informed our work. We reviewed both in depth before committing to our direction.
          </p>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">A</div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Anderson's Prototype</div>
                <div className="text-xs text-gray-500">Focused on explainability depth — Shapley values, LIME, counterfactuals, source grounding</div>
              </div>
            </div>
            <ProCon
              pros={[
                'Comprehensive explainability: source attribution, feature importance (Shapley), What If counterfactuals',
                'Grounded citations — every claim linked to a specific document passage',
                'What If analysis was novel and genuinely useful for understanding model sensitivity',
                'Strong foundation for compliance — nearly everything an auditor would want was present',
              ]}
              cons={[
                'Ordering was compliance-first, not banker-first — technical details appeared before the answer',
                'No visual hierarchy to help a busy RM find the answer quickly',
                '"Chain of Thought" label felt like ML jargon to non-technical users',
                'No overall execution summary — hard to understand what the AI actually did at a glance',
                'Interaction model was flat — everything open, no progressive disclosure',
              ]}
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-xs font-bold">M</div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Matheus's Execution Framework</div>
                <div className="text-xs text-gray-500">Focused on transparency into what the AI did — multi-phase execution with timing and tool use</div>
              </div>
            </div>
            <ProCon
              pros={[
                'Execution transparency: showed exactly which tools were called, in what order, with timing',
                'Phase-based structure made it clear the AI worked systematically rather than guessing',
                'Tool-level detail (web search, document retrieval, calculation) builds trust for technical reviewers',
                'Timing data useful for model risk — can detect latency degradation over time',
              ]}
              cons={[
                '"Wave" terminology was internal/ML jargon — not meaningful to bankers or compliance',
                'Execution detail belongs in a collapsed section for most users — too much cognitive load upfront',
                'No connection drawn between phases and the final answer — execution felt disconnected from conclusion',
                'Not designed for the banker workflow — would confuse an RM who just wants to know if the loan is clean',
              ]}
            />
          </div>
        </Section>

        {/* Our Approach */}
        <Section id="our-approach">
          <H2>What We Built and Why</H2>
          <p className="text-sm text-gray-600 mb-6">
            We synthesized both prototypes into a single design that serves all five personas. The guiding principle: <strong>progressive disclosure</strong> — the right amount of detail for each person, revealed in the right order.
          </p>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-4">
                <Brain className="w-5 h-5 text-[#455a4f] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Reasoning Steps (formerly "Chain of Thought")</div>
                  <p className="text-sm text-gray-600">We replaced Anderson's flat chain-of-thought with an icon-driven timeline — Shield (compliance check), Search (document retrieval), Book (policy review), Sparkles (synthesis). This mirrors the thinking animation already in the product, creating visual coherence. The rename from "Chain of Thought" to "Reasoning Steps" removes ML jargon and speaks the user's language.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                <Shield className="w-3.5 h-3.5 text-blue-500" /> Compliance Check
                <ArrowRight className="w-3 h-3" />
                <BookOpen className="w-3.5 h-3.5 text-green-500" /> Policy Review
                <ArrowRight className="w-3 h-3" />
                <Brain className="w-3.5 h-3.5 text-purple-500" /> Synthesis
                <ArrowRight className="w-3 h-3" />
                <CheckCircle2 className="w-3.5 h-3.5 text-[#455a4f]" /> Verdict
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <BarChart2 className="w-5 h-5 text-[#455a4f] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Section Ordering — Banker First</div>
                  <p className="text-sm text-gray-600 mb-3">We reordered Anderson's sections to surface the most banker-relevant information first, with compliance detail progressively revealed:</p>
                  <div className="space-y-1.5">
                    {[
                      { num: '1', label: 'Verdict + Assurance Badge', note: 'Open — the answer, front and center', who: 'Marcus' },
                      { num: '2', label: 'Reasoning Steps', note: 'Open — the "how" without the jargon', who: 'Marcus / David' },
                      { num: '3', label: 'Sources', note: 'Open — clickable citations for verification', who: 'David / Sandra' },
                      { num: '4', label: 'Claims', note: 'Open — specific assertions with confidence', who: 'Sandra' },
                      { num: '5', label: 'What If', note: 'Collapsed — counterfactual sensitivity analysis', who: 'David / Risk' },
                      { num: '6', label: 'Execution Record', note: 'Collapsed — phase-by-phase detail (Matheus)', who: 'Model Risk / Audit' },
                      { num: '7', label: 'Technical Details', note: 'Collapsed — Shapley values, model version, LIME', who: 'Sandra / Examiner' },
                    ].map(item => (
                      <div key={item.num} className="flex items-center gap-3 text-xs">
                        <span className="w-5 h-5 bg-gray-100 rounded-full text-center leading-5 text-gray-500 flex-shrink-0">{item.num}</span>
                        <span className="font-medium text-gray-800 w-36">{item.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.note.startsWith('Open') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.note}</span>
                        <span className="text-gray-400 ml-auto">{item.who}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-[#455a4f] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Execution Summary One-Liner</div>
                  <p className="text-sm text-gray-600">Rather than burying Matheus's phase detail inside a collapsed section, we pulled a one-sentence summary up into the Verdict section: <em>"Searched 3 documents across 4 phases in 1.0s."</em> This gives Marcus a glanceable signal of thoroughness without requiring him to dig into the execution record.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <GitBranch className="w-5 h-5 text-[#455a4f] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Push-In Audit Panel (No Modal)</div>
                  <p className="text-sm text-gray-600">Anderson's design used a modal/sheet for the audit panel. We replaced this with a push-in panel that slides in from the right and compresses the chat view — the same pattern used for the Thinking + Records dossier. This keeps the chat visible (Marcus can still see the conversation while Sandra reviews the audit), and the panel is drag-resizable so each user can configure their workspace.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#455a4f] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Waves → Phases</div>
                  <p className="text-sm text-gray-600">Matheus's internal terminology used "waves" and "W1/W2/W3" labels. We renamed these to "phases" and "P1/P2/P3" — industry-neutral language that a banker or auditor would understand without ML context. "Phases" also maps naturally to the kind of multi-step workflow language banks already use (e.g. "the underwriting process has 4 phases").</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Key Decisions */}
        <Section id="decisions">
          <H2>Key Design Decisions</H2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <DecisionRow
              decision="Assurance badge in the chat message, not just in the panel"
              reasoning="Bankers read the chat. If the signal lives only behind a click, Marcus never sees it. The badge needs to be in-line, with a clear label and a ChevronRight inviting him to learn more."
            />
            <DecisionRow
              decision="Full Report as a prominent button, not a text link"
              reasoning="Compliance users scan for actions. A text link looks like a footnote. A button communicates 'this is something you can do' — which is what Sandra needs to kick off her audit workflow."
            />
            <DecisionRow
              decision="X button far right, Full Report next to section title"
              reasoning="Follows standard panel conventions (close = top right). Putting Full Report next to the title makes the relationship between the panel and the report explicit — the panel is a preview of the report."
            />
            <DecisionRow
              decision="What If section derived from existing data, not separate input"
              reasoning="A manual What If tool adds friction. By deriving counterfactuals automatically from the sources, claims, and feature weights, the section is always populated and always relevant to the specific decision — not a generic calculator."
            />
            <DecisionRow
              decision="Oversight section in sidebar, not a separate URL"
              reasoning="Putting compliance audit and model health at separate URLs treats them as afterthoughts. A sidebar section signals that governance is a first-class product concern — on par with Agents and Connectors. It's also permission-gated in future: senior roles see it, everyone else doesn't."
            />
          </div>
        </Section>

        {/* Oversight */}
        <Section id="oversight">
          <H2>The Oversight Layer</H2>
          <p className="text-sm text-gray-600 mb-6">
            Individual explainability (the audit panel) is necessary but not sufficient. Janet and Sandra also need to monitor model behavior over time and across decisions. We added an Oversight section to the sidebar with two views — both permission-gated to senior roles.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-[#455a4f]" />
                <div className="text-sm font-semibold text-gray-900">Compliance Audit Log</div>
              </div>
              <p className="text-xs text-gray-600 mb-3">A filterable table of every AI-assisted decision with full provenance: who, what model, what assurance level, what outcome, and who signed off on human review.</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Filter by assurance level (Sufficient / Limited / Insufficient)</li>
                <li>• Search by record ID, user, action, or loan ID</li>
                <li>• Human review tracking per decision</li>
                <li>• CSV export for examiner submissions</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-[#455a4f]" />
                <div className="text-sm font-semibold text-gray-900">Model Health Dashboard</div>
              </div>
              <p className="text-xs text-gray-600 mb-3">An SR 11-7 aligned model risk dashboard showing accuracy trends, data drift, decisions per model, and compliance status — with active alerts when a model needs retraining.</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Per-model accuracy with 7-day sparkline</li>
                <li>• Data drift monitoring (Low / Moderate / High)</li>
                <li>• SR 11-7 approval status per model</li>
                <li>• Human override rate and override reason breakdown</li>
              </ul>
            </div>
          </div>
          <div className="bg-[#455a4f]/5 border border-[#455a4f]/20 rounded-lg p-4">
            <div className="text-xs font-semibold text-[#455a4f] mb-2">Why This Matters for Tom's Conversation with the Board</div>
            <p className="text-sm text-gray-700">
              When a bank board asks "how do we know the AI is working correctly?" — the answer can no longer be "trust us." The Model Health Dashboard gives the bank a defensible, SR 11-7 aligned answer: here is every model, its current accuracy, when it was last retrained, and what action we took when it degraded. That's the difference between AI adoption and AI governance.
            </p>
          </div>
        </Section>

        {/* Summary */}
        <Section id="summary">
          <H2>Summary</H2>
          <div className="bg-[#455a4f] text-white rounded-lg p-6">
            <p className="text-sm leading-relaxed mb-4">
              What we built is not just an explainability panel. It's a full governance layer: real-time reasoning for the banker, full audit trail for the compliance officer, source verification for the analyst, model monitoring for the risk manager, and a PDF-exportable report for the examiner.
            </p>
            <p className="text-sm leading-relaxed mb-4">
              We got there by combining the best of two prior prototypes — Anderson's depth of explainability, Matheus's execution transparency — and applying a banker-first information hierarchy with progressive disclosure so that no user sees more than they need.
            </p>
            <p className="text-sm leading-relaxed text-green-200">
              The result is a system that makes AI adoption safe enough for a regulated bank to actually do it.
            </p>
          </div>
        </Section>

      </div>

      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-3xl mx-auto px-8 py-6 flex items-center justify-between text-xs text-gray-400">
          <span>Titan Banking AI · Explainability v2 Design Brief · April 2026</span>
          <span>Internal — not for distribution</span>
        </div>
      </footer>
    </div>
  );
}
