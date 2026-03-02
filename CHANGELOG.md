# Changelog

All notable changes to this project will be documented in this file.

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
