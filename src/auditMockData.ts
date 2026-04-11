import type { AuditData } from './ChatMessage';

export const bsaAuditData: AuditData = {
  assuranceLevel: 'sufficient',
  assuranceDesc:
    'Titan reviewed 90 days of transaction data, institution BSA policy, and FinCEN structuring rules. A clear pattern was identified with high confidence. SAR filing obligation confirmed against 31 CFR 1020.320.',
  model: 'titan-banking-v2.1',
  executionPlan: `TASK: BSA/AML exposure check — Meridian Logistics LLC (credit line renewal)
APPROACH:
  1. Retrieve institution BSA/AML policy + FinCEN regulatory corpus
  2. Pull 90-day transaction history for account #847291
  3. Screen transactions against structuring rules [parallel with step 2]
  4. Look up beneficial ownership for Meridian Logistics LLC [parallel]
  5. Synthesize risk rating, determine SAR obligation, compose response`,
  sources: [
    { num: 1, name: 'BSA/AML Compliance Policy v4.2 (Internal)' },
    { num: 2, name: 'FinCEN SAR Filing Requirements — 31 CFR 1020.320' },
    { num: 3, name: 'Account #847291 — 90-Day Transaction Ledger' },
    { num: 4, name: 'Beneficial Ownership Registry — Meridian Logistics LLC' },
    { num: 5, name: 'FFIEC BSA/AML Examination Manual (2023 Update)' },
  ],
  phases: [
    {
      name: 'Planning',
      description:
        'Titan parsed the request, identified it as a pre-approval BSA/AML exposure check, and generated a retrieval and analysis plan targeting transaction data and regulatory policy.',
      parallel: false,
      durationMs: 290,
      steps: [
        {
          num: 1,
          tool: 'planner',
          description: 'Classify request → pre-approval BSA/AML check → emit 4-step retrieval plan',
          durationMs: 290,
          model: 'titan-banking-v2.1',
          output:
            'Request classified as pre-approval BSA/AML exposure check for Meridian Logistics LLC. Plan: retrieve policy corpus + transaction history in parallel, run structuring rules + ownership lookup in parallel, then synthesize.',
          rawOutput: JSON.stringify(
            {
              intent: 'bsa_aml_exposure_check',
              context: 'credit_line_renewal',
              entity: 'Meridian Logistics LLC',
              account: '847291',
              pipeline: ['policy_retrieval', 'transaction_retrieval', 'pattern_screening', 'ownership_lookup', 'synthesis'],
            },
            null,
            2
          ),
        },
      ],
    },
    {
      name: 'Knowledge & Data Retrieval',
      description:
        'Parallel retrieval of BSA/AML policy documents from the knowledge base and 90-day transaction history from the core system.',
      parallel: true,
      durationMs: 1760,
      steps: [
        {
          num: 2,
          tool: 'knowledge_search',
          description: 'Semantic search — BSA/AML policy corpus for structuring thresholds and SAR filing obligations',
          durationMs: 870,
          docCount: 3,
          chunkCount: 14,
          output:
            'Retrieved 14 relevant chunks across 3 documents: cash structuring thresholds ($10K CTR trigger), sub-threshold pattern indicators, and SAR filing timeline requirements (30 days from detection).',
          sources: [
            { name: 'BSA/AML Compliance Policy v4.2', relevance: 94 },
            { name: 'FinCEN SAR Filing Requirements', relevance: 91 },
            { name: 'FFIEC BSA/AML Examination Manual', relevance: 76 },
          ],
          rawOutput: JSON.stringify(
            {
              query: 'cash structuring sub-threshold patterns SAR filing requirements',
              top_k: 14,
              results: [
                { doc: 'BSA/AML Compliance Policy v4.2', chunk: 7, score: 0.94 },
                { doc: 'FinCEN SAR Filing Requirements', chunk: 3, score: 0.91 },
                { doc: 'FFIEC BSA/AML Examination Manual', chunk: 11, score: 0.76 },
              ],
            },
            null,
            2
          ),
        },
        {
          num: 3,
          tool: 'transaction_lookup',
          description: 'Retrieve 90-day transaction history for account #847291 — amounts, counterparties, timestamps',
          durationMs: 1760,
          output:
            '47 transactions retrieved. 9 cash deposits identified ranging $8,500–$9,800 across a 23-day window. Multiple same-day split deposits detected. No CTR filings on record for this account.',
          sources: [
            { name: 'Account #847291 — 90-Day Transaction Ledger', relevance: 100 },
          ],
          rawOutput: JSON.stringify(
            {
              account_id: '847291',
              period_days: 90,
              total_transactions: 47,
              cash_deposits: 9,
              deposit_range: '$8,500–$9,800',
              window_days: 23,
              same_day_splits: true,
              ctr_filings: 0,
            },
            null,
            2
          ),
        },
      ],
    },
    {
      name: 'Pattern Screening & Ownership',
      description:
        'Parallel: structuring rules engine applied to flagged transactions, and beneficial ownership lookup for Meridian Logistics LLC.',
      parallel: true,
      durationMs: 1980,
      steps: [
        {
          num: 4,
          tool: 'rules_engine',
          description: 'Apply FinCEN structuring rules — score frequency, amount range, and split pattern against 31 CFR 1020.320',
          durationMs: 640,
          dependsOn: [3],
          output:
            '9 deposits ($8,500–$9,800) over 23 days exceed the frequency threshold for structuring under 31 CFR 1020.320. Pattern confidence: HIGH. Same-day splits reinforce intentionality. Structuring rule STRUCTURING_PATTERN_v3 triggered.',
          sources: [
            { name: 'FinCEN SAR Filing Requirements', relevance: 96 },
            { name: 'BSA/AML Compliance Policy v4.2', relevance: 91 },
          ],
          rawOutput: JSON.stringify(
            {
              rule: 'STRUCTURING_PATTERN_v3',
              triggered: true,
              deposits_flagged: 9,
              amount_range: '$8,500–$9,800',
              window_days: 23,
              same_day_splits: true,
              pattern_confidence: 'HIGH',
              regulation: '31 CFR 1020.320',
            },
            null,
            2
          ),
        },
        {
          num: 5,
          tool: 'entity_lookup',
          description: 'Retrieve beneficial ownership record for Meridian Logistics LLC from the CIP/ownership registry',
          durationMs: 1980,
          output:
            'Meridian Logistics LLC — Delaware incorporation, March 2021. Sole beneficial owner: James R. Collier (DOB and SSN on file, CIP complete). No prior SAR history. No watchlist matches.',
          sources: [
            { name: 'Beneficial Ownership Registry — Meridian Logistics LLC', relevance: 100 },
          ],
          rawOutput: JSON.stringify(
            {
              entity: 'Meridian Logistics LLC',
              state: 'DE',
              incorporated: '2021-03-14',
              beneficial_owner: 'James R. Collier',
              cip_status: 'complete',
              prior_sars: 0,
              watchlist_match: false,
            },
            null,
            2
          ),
        },
      ],
    },
    {
      name: 'Synthesis',
      description:
        'Aggregated all signals into a final risk rating, determined SAR filing obligation, and composed a response with inline citations.',
      parallel: false,
      durationMs: 1410,
      steps: [
        {
          num: 6,
          tool: 'synthesizer',
          description: 'Aggregate risk signals → final risk rating + SAR recommendation + cited response',
          durationMs: 1410,
          dependsOn: [4, 5],
          model: 'titan-banking-v2.1',
          output:
            'Risk rating: HIGH. Structuring pattern confirmed (9 deposits, $8,500–$9,800, 23-day window). SAR filing required within 30 days per 31 CFR 1020.320. Credit line approval should be paused pending compliance review. No prior SAR history or watchlist match — first detection for this entity.',
          sources: [
            { name: 'FinCEN SAR Filing Requirements', relevance: 96 },
            { name: 'BSA/AML Compliance Policy v4.2', relevance: 94 },
            { name: 'FFIEC BSA/AML Examination Manual', relevance: 78 },
          ],
          rawOutput: JSON.stringify(
            {
              risk_rating: 'HIGH',
              sar_required: true,
              sar_deadline_days: 30,
              primary_indicator: 'cash_structuring',
              approval_recommendation: 'pause_pending_compliance_review',
              citations: [2, 1, 5],
              confidence_score: 0.94,
            },
            null,
            2
          ),
        },
      ],
    },
  ],
};
