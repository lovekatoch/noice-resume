#!/usr/bin/env node

/**
 * PostHog Dashboard Setup — NoiceResume Growth Metrics
 *
 * Creates dashboards, funnels, retention insights, and weekly reports
 * for NoiceResume's growth tracking (see NOI-6 growth-metrics-framework.md).
 *
 * Usage:
 *   POSTHOG_API_KEY=phx_xxxx POSTHOG_PROJECT_ID=xxxx node scripts/setup-posthog-dashboards.mjs
 *
 * Environment:
 *   POSTHOG_API_KEY     - PostHog Personal API Key (Settings → Personal API Keys)
 *   POSTHOG_PROJECT_ID  - PostHog Project ID (Settings → Project → Project ID)
 *   POSTHOG_HOST        - Self-hosted address (default: https://app.posthog.com)
 */

const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://app.posthog.com';
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;

if (!POSTHOG_API_KEY || !PROJECT_ID) {
  console.error('Usage: POSTHOG_API_KEY=phx_xxxx POSTHOG_PROJECT_ID=xxxx node scripts/setup-posthog-dashboards.mjs');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${POSTHOG_API_KEY}`,
};

function api(method, path, body) {
  const url = `${POSTHOG_HOST}/api/projects/${PROJECT_ID}${path}`;
  return fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${method} ${path} → ${res.status}: ${text}`);
    }
    return res.json();
  });
}

// ── Insight definitions ────────────────────────────────────────────────

const INSIGHT_DEFS = [
  // ── Growth Overview: Trends ──
  {
    key: 'downloads_daily',
    name: 'Daily Resume Downloads',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{ id: 'resume_downloaded', type: 'events', order: 0 }],
    },
  },
  {
    key: 'sessions_daily',
    name: 'Daily Builder Sessions',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{ id: 'builder_session_started', type: 'events', order: 0 }],
    },
  },
  {
    key: 'cta_clicks_daily',
    name: 'Daily Landing CTA Clicks',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{ id: 'landing_cta_clicked', type: 'events', order: 0 }],
    },
  },
  {
    key: 'ai_usage_daily',
    name: 'Daily AI Enhancements Used',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{ id: 'ai_enhancement_used', type: 'events', order: 0 }],
    },
  },
  {
    key: 'shares_daily',
    name: 'Daily Shares Generated',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{ id: 'share_url_generated', type: 'events', order: 0 }],
    },
  },
  {
    key: 'ai_enhance_requested',
    name: 'Daily AI Enhancement Requests',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{ id: 'ai_enhance_requested', type: 'events', order: 0 }],
    },
  },
  {
    key: 'ai_cost_daily',
    name: 'Daily AI Cost (USD)',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{
        id: 'ai_token_usage',
        type: 'events',
        order: 0,
        math: 'sum',
        math_property: 'estimated_cost_usd',
        name: 'ai_token_usage',
      }],
    },
  },
  {
    key: 'imports_daily',
    name: 'Daily Resume Imports',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{ id: 'resume_uploaded', type: 'events', order: 0 }],
    },
  },
  {
    key: 'pwa_installs_daily',
    name: 'Daily PWA Installs',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{ id: 'pwa_installed', type: 'events', order: 0 }],
    },
  },
  {
    key: 'checkouts_daily',
    name: 'Daily Checkouts Completed',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{ id: 'checkout_completed', type: 'events', order: 0 }],
    },
  },
  {
    key: 'checkout_revenue_daily',
    name: 'Daily Revenue (USD)',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsLineGraph',
      interval: 'day',
      date_from: '-30d',
      events: [{
        id: 'checkout_completed',
        type: 'events',
        order: 0,
        math: 'sum',
        math_property: 'value',
        name: 'checkout_completed',
      }],
    },
  },

  // ── Funnels ──
  {
    key: 'funnel_main',
    name: 'Main Growth Funnel',
    filters: {
      insight: 'FUNNELS',
      funnel_viz_type: 'steps',
      funnel_order_type: 'strict',
      events: [
        { id: 'landing_cta_clicked', type: 'events', order: 0 },
        { id: 'builder_session_started', type: 'events', order: 1 },
        { id: 'first_section_added', type: 'events', order: 2 },
        { id: 'pdf_generation_started', type: 'events', order: 3 },
        { id: 'resume_downloaded', type: 'events', order: 4 },
      ],
      date_from: '-30d',
    },
  },
  {
    key: 'funnel_landing_to_builder',
    name: 'Landing → Builder Funnel',
    filters: {
      insight: 'FUNNELS',
      funnel_viz_type: 'steps',
      funnel_order_type: 'strict',
      events: [
        { id: '$pageview', type: 'events', order: 0, properties: [{ key: '$current_url', value: '/', operator: 'icontains', type: 'event' }] },
        { id: 'landing_cta_clicked', type: 'events', order: 1 },
        { id: 'builder_session_started', type: 'events', order: 2 },
      ],
      date_from: '-30d',
    },
  },
  {
    key: 'funnel_import',
    name: 'Import → Builder → Download Funnel',
    filters: {
      insight: 'FUNNELS',
      funnel_viz_type: 'steps',
      funnel_order_type: 'strict',
      events: [
        { id: 'resume_uploaded', type: 'events', order: 0 },
        { id: 'builder_session_started', type: 'events', order: 1 },
        { id: 'resume_downloaded', type: 'events', order: 2 },
      ],
      date_from: '-30d',
    },
  },
  {
    key: 'funnel_ai',
    name: 'AI Enhancement Funnel',
    filters: {
      insight: 'FUNNELS',
      funnel_viz_type: 'steps',
      funnel_order_type: 'strict',
      events: [
        { id: 'builder_session_started', type: 'events', order: 0 },
        { id: 'ai_enhance_requested', type: 'events', order: 1 },
        { id: 'ai_enhance_success', type: 'events', order: 2 },
        { id: 'ai_enhance_accepted', type: 'events', order: 3 },
        { id: 'resume_downloaded', type: 'events', order: 4 },
      ],
      date_from: '-30d',
    },
  },
  {
    key: 'funnel_download_to_share',
    name: 'Download → Share Funnel',
    filters: {
      insight: 'FUNNELS',
      funnel_viz_type: 'steps',
      funnel_order_type: 'strict',
      events: [
        { id: 'resume_downloaded', type: 'events', order: 0 },
        { id: 'share_url_generated', type: 'events', order: 1 },
        { id: 'share_link_copied', type: 'events', order: 2 },
      ],
      date_from: '-30d',
    },
  },
  {
    key: 'funnel_checkout',
    name: 'Checkout Funnel',
    filters: {
      insight: 'FUNNELS',
      funnel_viz_type: 'steps',
      funnel_order_type: 'strict',
      events: [
        { id: 'checkout_started', type: 'events', order: 0 },
        { id: 'checkout_completed', type: 'events', order: 1 },
      ],
      date_from: '-30d',
    },
  },

  // ── Retention ──
  {
    key: 'retention_weekly',
    name: 'Weekly Cohort Retention',
    filters: {
      insight: 'RETENTION',
      retention_type: 'retention_first_time',
      period: 'Week',
      date_from: '-90d',
      target_entity: { id: '$pageview', type: 'events', name: '$pageview' },
      returning_entity: { id: '$pageview', type: 'events', name: '$pageview' },
    },
  },
  {
    key: 'retention_builder',
    name: 'Builder Session Retention',
    filters: {
      insight: 'RETENTION',
      retention_type: 'retention_first_time',
      period: 'Week',
      date_from: '-90d',
      target_entity: { id: 'builder_session_started', type: 'events', name: 'builder_session_started' },
      returning_entity: { id: 'builder_session_resumed', type: 'events', name: 'builder_session_resumed' },
    },
  },
  {
    key: 'stickiness_downloads',
    name: 'Download Stickiness',
    filters: {
      insight: 'STICKINESS',
      display: 'ActionsBarChart',
      interval: 'day',
      date_from: '-30d',
      events: [{ id: 'resume_downloaded', type: 'events', order: 0 }],
    },
  },

  // ── Weekly Report metrics ──
  {
    key: 'downloads_weekly',
    name: 'Weekly Resume Downloads',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsBarChart',
      interval: 'week',
      date_from: '-90d',
      events: [{ id: 'resume_downloaded', type: 'events', order: 0 }],
    },
  },
  {
    key: 'sessions_weekly',
    name: 'Weekly Builder Sessions',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsBarChart',
      interval: 'week',
      date_from: '-90d',
      events: [{ id: 'builder_session_started', type: 'events', order: 0 }],
    },
  },
  {
    key: 'cta_clicks_weekly',
    name: 'Weekly Landing CTA Clicks',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsBarChart',
      interval: 'week',
      date_from: '-90d',
      events: [{ id: 'landing_cta_clicked', type: 'events', order: 0 }],
    },
  },
  {
    key: 'ai_cost_weekly',
    name: 'Weekly AI Cost (USD)',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsBarChart',
      interval: 'week',
      date_from: '-90d',
      events: [{
        id: 'ai_token_usage',
        type: 'events',
        order: 0,
        math: 'sum',
        math_property: 'estimated_cost_usd',
        name: 'ai_token_usage',
      }],
    },
  },
  {
    key: 'total_tokens_weekly',
    name: 'Weekly AI Token Usage',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsBarChart',
      interval: 'week',
      date_from: '-90d',
      events: [{
        id: 'ai_token_usage',
        type: 'events',
        order: 0,
        math: 'sum',
        math_property: 'total_tokens',
        name: 'ai_token_usage',
      }],
    },
  },
  {
    key: 'sessions_resumed_weekly',
    name: 'Weekly Builder Session Resumes',
    filters: {
      insight: 'TRENDS',
      display: 'ActionsBarChart',
      interval: 'week',
      date_from: '-90d',
      events: [{ id: 'builder_session_resumed', type: 'events', order: 0 }],
    },
  },
];

// ── Dashboard definitions ─────────────────────────────────────────────

const DASHBOARD_DEFS = [
  {
    name: 'Growth Overview',
    description: 'High-level growth metrics — CEO & CTO daily view. Covers acquisition, activation, and AI usage.',
    tags: ['growth', 'ceo', 'cto'],
    insight_keys: [
      'downloads_daily',
      'sessions_daily',
      'cta_clicks_daily',
      'ai_usage_daily',
      'shares_daily',
      'ai_cost_daily',
      'imports_daily',
      'pwa_installs_daily',
      'checkouts_daily',
      'checkout_revenue_daily',
    ],
  },
  {
    name: 'Funnels',
    description: 'Full conversion funnel analysis — from landing to download to share. Tracks every product stage.',
    tags: ['funnels', 'conversion', 'growth'],
    insight_keys: [
      'funnel_main',
      'funnel_landing_to_builder',
      'funnel_import',
      'funnel_ai',
      'funnel_download_to_share',
      'funnel_checkout',
    ],
  },
  {
    name: 'Retention & Engagement',
    description: 'Cohort retention and stickiness. Measures return visits, builder retention, and engagement depth.',
    tags: ['retention', 'engagement', 'product'],
    insight_keys: [
      'retention_weekly',
      'retention_builder',
      'stickiness_downloads',
      'sessions_daily',
      'sessions_resumed_weekly',
    ],
  },
  {
    name: 'Weekly Report',
    description: 'Week-over-week growth report — download trends, AI costs, session activity. Used for GrowthPM weekly sync.',
    tags: ['weekly', 'report', 'growthpm'],
    insight_keys: [
      'downloads_weekly',
      'sessions_weekly',
      'cta_clicks_weekly',
      'sessions_resumed_weekly',
      'ai_cost_weekly',
      'total_tokens_weekly',
      'funnel_main',
      'retention_weekly',
    ],
  },
];

// ── Main ───────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nNoiceResume — PostHog Dashboard Setup`);
  console.log(`Host: ${POSTHOG_HOST}`);
  console.log(`Project: ${PROJECT_ID}\n`);

  // 1. Create all insights
  const insights = {};
  for (const def of INSIGHT_DEFS) {
    console.log(`Creating insight: ${def.name}...`);
    try {
      const result = await api('POST', '/insights/', {
        name: def.name,
        filters: def.filters,
        description: `NoiceResume: ${def.name}`,
      });
      insights[def.key] = result;
      console.log(`  ✓ Created insight ID ${result.id}`);
    } catch (err) {
      console.error(`  ✗ Error creating insight "${def.name}": ${err.message}`);
    }
  }

  // 2. Create dashboards with tiles
  for (const dash of DASHBOARD_DEFS) {
    const tiles = dash.insight_keys
      .filter((key) => insights[key])
      .map((key) => ({ insight: insights[key].id }));

    if (tiles.length === 0) {
      console.log(`\nSkipping dashboard "${dash.name}": no insights were created`);
      continue;
    }

    console.log(`\nCreating dashboard: ${dash.name} (${tiles.length} tiles)...`);
    try {
      const result = await api('POST', '/dashboards/', {
        name: dash.name,
        description: dash.description,
        tags: dash.tags,
        tiles,
      });
      const dashboardUrl = `${POSTHOST_HOST}/dashboard/${result.id}`;
      console.log(`  ✓ Created dashboard ID ${result.id}`);
      console.log(`  → ${dashboardUrl}`);
    } catch (err) {
      console.error(`  ✗ Error creating dashboard "${dash.name}": ${err.message}`);
    }
  }

  // 3. Summary
  const created = Object.keys(insights).length;
  const failed = INSIGHT_DEFS.length - created;
  console.log(`\n── Setup complete ──`);
  console.log(`Insights created: ${created}${failed > 0 ? ` (${failed} failed)` : ''}`);
  console.log(`Dashboards: ${DASHBOARD_DEFS.length} configured`);
  console.log(`\nNext steps:`);
  console.log(`  1. Visit PostHog → Dashboards to arrange tile layouts`);
  console.log(`  2. Set up email/slack subscriptions for Weekly Report`);
  console.log(`  3. Create alerts on growth metrics (Downloads < target, AI cost spike)`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
