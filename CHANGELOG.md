# Changelog

All notable changes to this project will be documented in this file.

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

[2.0.0]: https://github.com/your-username/conference-tracker/releases/tag/v2.0.0
