# GrowthPM Weekly Workflow

## Cadence

| Frequency | Activity | Dashboard | Est. Time |
|-----------|----------|-----------|-----------|
| Daily | Pulse check — Growth Overview | Growth Overview | 5 min |
| Weekly (Mon AM) | Weekly report + comment | Weekly Report | 15 min |
| Monthly (Mon PM) | North-star review with CEO | All dashboards | 30 min |

## Monday Morning — Weekly Report

1. Open PostHog → Dashboards → **Weekly Report**
2. Pull key metrics:
   - Weekly downloads (wow change)
   - Weekly builder sessions (wow change)
   - Weekly CTA clicks (wow change)
   - AI cost (weekly total, wow change)
   - AI token usage (weekly total)
   - Builder session resumes (retention signal)
3. Open **Growth Overview** dashboard and note:
   - Current 7-day download trend direction
   - AI usage rate
   - Session-to-download conversion rate (manual calc)
4. Post a **summary comment** on the current sprint issue:
   - Bullet with each metric + wow change
   - Green/yellow/red status per KPI
   - One actionable insight for the week
5. If any metric is red (>20% drop wow), flag to CEO via issue comment

## Daily Pulse Check

1. Open **Growth Overview** dashboard
2. Scan for anomalies:
   - Downloads suddenly flatlining?
   - AI cost spiking without usage increase?
   - CTA traffic change?
3. No action needed if green across board
4. If red: investigate, comment on sprint issue, tag CEO

## Monthly North-Star Review

1. Schedule 30-min sync with CEO (end of month)
2. Prepare review doc covering:
   - Monthly download trend vs target (100/day)
   - Funnel conversion rates (all stages)
   - AI enhancement adoption rate
   - Cost per download
   - Share/viral coefficient
   - Top 3 growth opportunities for next month
3. Present findings, get CEO sign-off on next month's growth focus

## Alert Response Procedures

| Alert | Severity | Response |
|-------|----------|----------|
| Downloads drop >50% vs 7-day avg | Critical | Immediate investigation. Check PostHog Trends dashboard for traffic source changes. Check Cloudflare for uptime/errors. Post status in #growth channel. Escalate to CEO within 1 hour. |
| AI cost >$5/week | Warning | Review ai_token_usage breakdown by section type. Check if a specific template/section is driving excess cost. Consider rate limit adjustments. |
| AI error rate >20% | Critical | Check DeepSeek API status. Review useAIPanel error logs. Disable AI feature if sustained. Escalate to CTO. |
| No pageviews in 30 min | Critical | Check Cloudflare Pages status. Verify DNS. Check staging URL. Escalate to CTO immediately. |

## Weekly Report Issue Template

Each Monday, create a new issue using the template in `.opencode/weekly-report-template.md`.
