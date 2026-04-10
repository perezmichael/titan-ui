import type { AuditData } from './ChatMessage';

export const bsaAuditData: AuditData = {
  assuranceLevel: 'sufficient',
  assuranceDesc:
    'Titan has sufficient confidence to provide a direct answer. The response is grounded in your institution\'s BSA/AML policy documents, FinCEN guidance, and transaction data reviewed against established red-flag indicators.',
  model: 'titan-banking-v2.1',
  executionPlan: `TASK: Evaluate BSA/AML exposure for commercial account #847291
APPROACH:
  1. Retrieve institution BSA policy + FinCEN regulatory corpus
  2. Retrieve 90-day transaction history for account #847291
  3. Screen transactions against AML red-flag patterns in parallel
  4. Cross-reference beneficial ownership records
  5. Synthesize risk rating with supporting citations`,
  sources: [
    { num: 1, name: 'BSA/AML Compliance Policy v4.2 (Internal)' },
    { num: 2, name: 'FinCEN SAR Filing Requirements — 31 CFR 1020.320' },
    { num: 3, name: 'Account #847291 — 90-Day Transaction Ledger' },
    { num: 4, name: 'Beneficial Ownership Registry — Entity: Meridian Logistics LLC' },
    { num: 5, name: 'FFIEC BSA/AML Examination Manual (2023 Update)' },
  ],
  phases: [
    {
      name: 'Planning',
      description:
        'Titan decomposed the request, identified required data sources, and generated a structured retrieval and analysis plan.',
      parallel: false,
      durationMs: 312,
      steps: [
        {
          num: 1,
          tool: 'planner',
          description: 'Parse intent → classify as BSA/AML risk evaluation → emit retrieval plan',
          durationMs: 312,
          model: 'titan-banking-v2.1',
          output:
            'Intent: Evaluate BSA/AML risk for commercial account. Classification: Regulatory compliance query. Plan: 5-step retrieval and analysis pipeline emitted.',
          rawOutput: JSON.stringify(
            {
              intent: 'bsa_aml_risk_evaluation',
              account: '847291',
              steps: ['policy_retrieval', 'transaction_retrieval', 'pattern_screening', 'ownership_lookup', 'synthesis'],
            },
            null,
            2
          ),
        },
      ],
    },
    {
      name: 'Knowledge Retrieval',
      description:
        'Parallel retrieval of institution BSA policy, FinCEN regulations, and FFIEC examination manual from the knowledge base.',
      parallel: true,
      durationMs: 1840,
      steps: [
        {
          num: 2,
          tool: 'vector_search',
          description: 'Semantic search — BSA/AML policy corpus for structuring/smurfing red flags',
          durationMs: 920,
          docCount: 3,
          chunkCount: 14,
          output:
            'Retrieved 14 chunks across 3 documents covering: cash structuring thresholds, smurfing indicators, and SAR filing obligations.',
          sources: [
            { name: 'BSA/AML Compliance Policy v4.2', relevance: 94 },
            { name: 'FinCEN SAR Filing Requirements', relevance: 88 },
            { name: 'FFIEC BSA/AML Examination Manual', relevance: 76 },
          ],
          rawOutput: JSON.stringify(
            {
              query: 'cash structuring smurfing red flag indicators',
              top_k: 14,
              results: [
                { doc: 'BSA/AML Compliance Policy v4.2', chunk: 7, score: 0.94 },
                { doc: 'FinCEN SAR Filing Requirements', chunk: 3, score: 0.88 },
              ],
            },
            null,
            2
          ),
        },
        {
          num: 3,
          tool: 'sql_query',
          description: 'Pull 90-day transaction history for account #847291 with amounts, counterparties, and timestamps',
          durationMs: 1840,
          output:
            '47 transactions retrieved. Notable: 9 cash deposits ranging $8,500–$9,800 over 23 days. Multiple same-day splits detected.',
          sources: [
            { name: 'Account #847291 — Transaction Ledger', relevance: 100 },
          ],
          rawOutput: JSON.stringify(
            {
              query: 'SELECT * FROM transactions WHERE account_id = 847291 AND date >= NOW() - INTERVAL 90 DAY',
              rows_returned: 47,
              flagged_patterns: ['repeated_sub_10k_cash', 'same_day_split'],
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
        'Parallel screening of transactions against AML red-flag rules and lookup of beneficial ownership for linked entity.',
      parallel: true,
      durationMs: 2100,
      steps: [
        {
          num: 4,
          tool: 'rules_engine',
          description: 'Apply FinCEN structuring rules — flag transactions < $10K with frequency pattern',
          durationMs: 680,
          dependsOn: [3],
          output:
            'ALERT: 9 cash deposits between $8,500–$9,800 over 23 days match structuring pattern per 31 CFR 1020.320. Structuring risk: HIGH.',
          sources: [
            { name: 'FinCEN SAR Filing Requirements', relevance: 96 },
            { name: 'BSA/AML Compliance Policy v4.2', relevance: 91 },
          ],
          rawOutput: JSON.stringify(
            {
              rule: 'STRUCTURING_PATTERN_v3',
              triggered: true,
              deposits_flagged: 9,
              range: '$8,500–$9,800',
              window_days: 23,
              risk_level: 'HIGH',
            },
            null,
            2
          ),
        },
        {
          num: 5,
          tool: 'entity_lookup',
          description: 'Retrieve beneficial ownership for Meridian Logistics LLC linked to account #847291',
          durationMs: 2100,
          output:
            'Meridian Logistics LLC — sole beneficial owner: James R. Collier (SSN on file). No prior SAR history. Incorporation: Delaware, 2021.',
          sources: [
            { name: 'Beneficial Ownership Registry — Meridian Logistics LLC', relevance: 100 },
          ],
          rawOutput: JSON.stringify(
            {
              entity: 'Meridian Logistics LLC',
              beneficial_owner: 'James R. Collier',
              prior_sars: 0,
              state: 'DE',
              incorporated: '2021-03-14',
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
        'Titan synthesized all retrieved evidence into a risk rating, identified SAR filing obligation, and composed the final response with citations.',
      parallel: false,
      durationMs: 1450,
      steps: [
        {
          num: 6,
          tool: 'synthesizer',
          description: 'Aggregate risk signals → produce final risk rating, SAR recommendation, and cited response',
          durationMs: 1450,
          dependsOn: [4, 5],
          model: 'titan-banking-v2.1',
          output:
            'Risk rating: HIGH. Structuring pattern confirmed against FinCEN threshold. SAR filing recommended within 30 days per 31 CFR 1020.320. No prior SAR history for entity owner.',
          sources: [
            { name: 'BSA/AML Compliance Policy v4.2', relevance: 94 },
            { name: 'FinCEN SAR Filing Requirements', relevance: 96 },
            { name: 'FFIEC BSA/AML Examination Manual', relevance: 78 },
          ],
          rawOutput: JSON.stringify(
            {
              risk_rating: 'HIGH',
              sar_required: true,
              sar_deadline_days: 30,
              primary_indicator: 'cash_structuring',
              citations: [2, 1, 5],
              confidence_score: 0.93,
            },
            null,
            2
          ),
        },
      ],
    },
  ],
};
