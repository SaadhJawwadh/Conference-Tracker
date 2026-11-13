# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] - 2026-11-13

### 🎨 Classic Comic Book ("Sunday Funnies") Redesign
- **Newsprint & Halftone Theme**: Redesigned the UI in a Classic Comic Book aesthetic with warm newsprint cream (`#fffdf2`), Ben-Day halftone dot background, `3px` black ink borders, hard offset shadows, `Bangers` display typography, speech-bubble stat cards with a `ZAP!` urgent burst badge, and a matching **Midnight Comic Noir** dark mode.
- **Mobile Comic Cards**: On screens `≤ 768px`, conference rows transform into stacked comic-book cards with `data-label` badges and zero horizontal overflow.

### 🔄 Weekly High-Quality Data Pipeline & CI/CD
- **Multi-Source Weekly Sync**: Updated `fetch-and-deploy.yml` to run weekly (`0 0 * * 1`) and automatically trigger `deploy.yml` so GitHub Pages redeploys when `conferences.json` updates.
- **Strict Quality Gate & Deduplication**: Added `ccfddl` + WikiCFP (`https://`) fetching, cross-feed deduplication, and enrichment via `data/quality-lookup.json`, strictly keeping vetted venues (`CORE A*/A/B`, `Scimago Q1/Q2`, or `H-Index > 18`) plus `data/curated.json`.
- **Scoped Pages Artifact**: `deploy.yml` now stages only public web assets (`_site/`), excluding `.git/`, `scripts/`, and internal docs.

### ✨ Researcher Features, Security & ES Modules
- **Security & Reliability**: Fixed XSS vectors in Bookmarks/Notes, enforced `http:`/`https:` URL validation (`safeUrl`), cleared stale IndexedDB records on sync, and unified live deadline calculations.
- **New Productivity Tools**: Added **Hide Closed** (on by default), `H-Index > 18` / `CORE B` / `Unranked` filters, `.ics` & Google Calendar export per row, URL-synced filters, page-size selector (`20 / 50 / 100 / All`), JSON Bookmarks/Notes backup & restore, and full keyboard/ARIA accessibility.
- **Zero-Build ES Modules**: Refactored `app.js` into modular `js/*.js` files (`state.js`, `utils.js`, `calendar.js`, `filters.js`, `render.js`, `main.js`).

## [2.4.0] - 2026-03-02

### 🤖 Automated Data Pipeline
- **GitHub Actions Integration**: Migrated from client-side scraping to an automated backend pipeline. A Node.js scraper now runs daily on GitHub Actions to parse WikiCFP and build a static `conferences.json` artifact.
- **Improved Reliability & Privacy**: Client devices no longer make CORS proxy requests to external RSS feeds. The "Fetch Latest" button now securely downloads the pre-aggregated `conferences.json` directly from the hosting server.

### 📱 Responsive UI Overhaul
- **Mobile Card Layout**: Re-engineered the mobile and tablet views. On screens ≤900px, the traditional table transforms into vertically stacked "cards" with internal labels (SCORE, WHERE, DUE, SOURCE, LINK) for superior readability.
- **Desktop Table Accessibility**: Added `overflow-x: auto` to ensure all 7 columns (including Notes) are fully accessible on narrower desktop windows without clipping.
- **Sticky Header Fix**: Resolved an issue where the sticky table header lost its background opacity and overlapped improperly. The table header now perfectly tracks the top of its scroll container.
- **Header Geometry**: Adjusted top-level controls (Search, Add Custom, Fetch, Dark Mode) to intelligently wrap and center on mobile, preventing overlap.



### 🔢 Pagination & Academic Journals
- **Dynamic Pagination**: Implemented a robust paging system with 20 items per page, smooth scroll-to-top, and state preservation.
- **Academic Journals Integrated**: Added top-tier journals (TPAMI, JMLR, AIJ) to the baseline and introduced a "Type" filter.
- **Security Audit**: Implemented HTML sanitization across all renderer functions to prevent XSS from untrusted external data.
- **Mobile Fluidity**: Comprehensive CSS overhaul for mobile and tablet devices. The UI now wraps beautifully on all screen sizes (375px+).
- **Bug Fixes**: Corrected critical JavaScript syntax errors in the fetch logic and resolved HTML tag nesting issues.

## [2.2.0] - 2026-02-20

### 🎓 Favicon & Final Polish
- **Custom Favicon**: Designed and integrated a sleek custom SVG favicon featuring a minimalist scholar cap and target insignia.
- **Code Review**: Finalized rigorous code review processes confirming the stability of real-time WikiCFP syncing and IndexedDB persistence.

## [2.1.0] - 2026-02-19

### 🎨 Branding & UX Consistency
- **Creator Branding**: Added "Created by Saadh Jawwadh" and "vibe coded with Antigravity" to the footer and README.
- **Unified Sync Display**: Synchronized the "Last Synced" time formatting between the header and footer for absolute consistency.
- **Social Integration**: Integrated social media icons (GitHub, Twitter, LinkedIn) into the application footer.
- **Live Demo Link**: Updated official README with the live GitHub Pages demo URL.

## [2.0.0] - 2026-02-19

### 🚀 Major UI/UX Overhaul
- **Unified Explorer Card**: Integrated the filter bar and conference table into a single, cohesive component for a cleaner dashboard look.
- **Sticky Header System**: Fixed overlapping issues between the site header and table header. The table header now correctly sticks flush below the site header using dynamic CSS variables.
- **Compact Filter Layout**: Reorganized filters into a two-row structure, grouping search/actions and dropdowns/toggles to reduce vertical whitespace and improve responsiveness.
- **Premium Dark/Light Mode**: Implemented a stunning dark mode (default) and a clean light mode with persistent user preference using `localStorage`.
- **Micro-animations**: Added smooth transitions for theme toggling, table filtering, and skeleton loaders.

### ✨ New Functionality
- **Real-time Data Fetching**: Integrated WikiCFP RSS feeds to fetch the latest community-submitted conferences.
- **IndexedDB Persistence**: Local storage now caches fetched conferences, bookmarks, and user notes for offline-first usage.
- **Note System**: Users can now add, edit, and persist personal notes directly in conference table rows.
- **CSV Export**: Added the ability to export the current filtered view of conferences to a `.csv` file.

### 🐛 Bug Fixes & Refinement
- **Opaque Headers**: Ensured sticky headers are fully opaque to prevent content "bleed-through" during scrolling.
- **Column Consistency**: Added missing "Notes" column header for a complete table layout.
- **Performance**: Optimized re-rendering logic to handle larger datasets smoothly.
- **Responsiveness**: Improved mobile layout for the search bar and filter dropdowns.

[2.1.0]: https://github.com/SaadhJawwadh/Conference-Tracker/releases/tag/v2.1.0
[2.0.0]: https://github.com/SaadhJawwadh/Conference-Tracker/releases/tag/v2.0.0
