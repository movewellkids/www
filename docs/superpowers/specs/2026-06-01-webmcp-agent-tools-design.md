# WebMCP Agent Tools — Design

**Date:** 2026-06-01
**Site:** movewellkids.co.uk (static Jekyll / GitHub Pages, no backend)

## Goal

Make the site's services, areas covered, pricing, and contact path directly
machine-callable by AI agents using the proposed [WebMCP](https://github.com/webmachinelearning/webmcp)
standard (`navigator.modelContext.registerTool`), instead of agents having to
infer everything from the DOM.

## Context & caveat

WebMCP is an early proposal; no mainstream browser ships it natively yet. This
work is forward-looking: it costs little, is feature-detected so it is inert
where unsupported, and activates automatically once browsers/agents support it.
The existing `llm.txt` already covers static knowledge for today's agents;
WebMCP adds the interactive/tool layer on top.

## Tools (5)

| Tool | Input | Returns |
|------|-------|---------|
| `list_services` | optional `ageGroup` ("infant" / "child-teen") or `keyword` | Service catalogue: name, plain-English summary, "also known as" terms |
| `find_condition` | `query` (e.g. "toe walking", "Sever's", "flat head") | Whether treated, which service it falls under, and detail |
| `get_pricing` | none | Session types/durations, £75–£120 fee range, ages 0–18, no GP referral needed |
| `check_coverage` | `area` (postcode or place name) | Whether home visits reach there + full covered list |
| `start_enquiry` | `name`, `email`, optional `childAge`, optional `service`, `message` | Composes a `mailto:hello@movewellkids.co.uk` draft (subject + body) and opens the email client; returns confirmation string |

## Architecture

- **One new file `webmcp.js`**, loaded `defer` on all pages. Single purpose:
  register tools. Does not touch `script.js`.
- **Feature-detect and no-op:** if `navigator.modelContext` is absent, do
  nothing. When present, register via `registerTool`, falling back to
  `provideContext({ tools })` to tolerate the spec's two shapes.
- **One data object as source of truth** (`services`, `pricing`, `coverage`,
  `contact`) at the top of the file, mirroring `llm.txt`. Hand-curated and
  hand-synced; no build step (overkill for this site). Clearly commented as the
  WebMCP data source.
- Tools are page-independent (same set everywhere), so an agent landing on any
  page gets the full set.

## Coverage matching

`check_coverage` normalises input and matches against known area names **and**
SE postcode districts (SE19, SE21, SE22, SE23, SE24, SE27). Outward-code match
(e.g. "SE23 3PQ" → SE23 → covered). Unknown input → "not in the standard area,
but you're welcome to email to ask."

## Contact behaviour

The live contact form is currently commented out (mailto is the live path), so
`start_enquiry` composes a pre-filled `mailto:` draft for the user to review and
send — keeping a human in the loop and matching current site behaviour. No
auto-submit.

## Out of scope

- No polyfill / third-party dependency.
- No automated test harness (per user).
- Not re-enabling the contact form.
- No changes to `llm.txt`, HTML content, or styling.
