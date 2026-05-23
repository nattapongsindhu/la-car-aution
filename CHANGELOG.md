# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

---

## [0.1.0] — 2026-05-22

### Added
- Live OPG scraper API (`/api/scrape`) with SSRF allowlist and rate limiting (20 req/min)
- Hybrid HTML + plain-text vehicle ingestion parser
- 3-state risk engine: Clean / Standard / High Risk with DMV fee estimation
- localStorage persistence with SSR guard (`loadVehicles` / `saveVehicles`)
- Watchlist tab with persistent vehicle cards
- VIN History tab with Google Image search deep-link
- DMV Calculator tab
- Risk summary strip (Clean / Standard / High Risk counts above table)
- Make & model abbreviation dictionaries (MAKE_ABBREVIATIONS, MODEL_ABBREVIATIONS) covering 100+ LAPD/OPG police codes
- CHANGELOG.md (this file)
- Full make and model names rendered in table and watchlist (resolves TOYT → Toyota, HOND → Honda, etc.)
- Make filter dropdown with full names, deduplicated by resolved name
- Micro action badges: [DMV], [Miles] (iSeeCars), [Photos] (Google Images)
- Photo search URL includes year + full make + full model + VIN
- Running row index (No.) column in vehicle table
- Est. DMV Fee column in vehicle table
- Clear Data button to reset localStorage
- Zod schema validation for scraped vehicle data
- Vitest unit tests for risk engine (14 tests: `computeDmvFee` + `assessRisk`)
- GitHub Actions CI: typecheck → lint → test → audit → build
- CodeQL static analysis workflow
- Dependabot version updates
- GitHub issue templates (bug report, feature request)
- Pull request template
- Dark / light theme toggle (next-themes)
- Vercel production deployment config

### Changed
- Hero subtitle updated to "Vehicle Auctions Platform"
- Risk badges restyled to bordered pills with high-contrast text
- Rebrand: "LA Car Aution" → "LA Car Auctions" across all UI and metadata
- `shortDivision()` strips towing company suffixes from division names

### Fixed
- OPG make abbreviation bidirectional matching for Japanese brands
- DOMParser + localStorage SSR guard
- Plain-text parser hardened against tabs, spaces, and malformed rows
- Year parsed with `parseInt` to avoid NaN edge cases
- Node.js ≥ 20.9.0 enforced via `engines` field and Vercel config
- Removed reCAPTCHA bypass language from README (legal compliance)
- MIT license section added to README

### Security
- SSRF guard: OPG fetch restricted to `www.opgla.com` allowlist
- Rate limiter: 20 requests per minute per IP (in-process)
- Fetch timeout: 8 s abort controller
- Response size cap: 2 MB
- `noopener,noreferrer` on all external links

---

[Unreleased]: https://github.com/nattapongsindhu/la-car-auctions/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/nattapongsindhu/la-car-auctions/releases/tag/v0.1.0
