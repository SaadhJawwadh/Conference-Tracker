# Conference Tracker Enhancement Plan

## Phase 1: Header Alignment & Full Responsiveness
1. **Header Layout Fix**: Redesign the header flexbox layout so the logo is on the left, immediately followed by the title/subtitle, and the controls (Fetch, Bookmark, Export, Theme) are on the right.
2. **Mobile Responsiveness**:
    - Update CSS media queries (`max-width: 768px`, `max-width: 480px`).
    - Make the header controls stack or compress elegantly on mobile.
    - Ensure the table and filters are responsive (e.g., horizontally scrollable table or card-based layout for mobile, responsive flex filters).
    - Check the footer to ensure it scales correctly and text does not overflow.

## Phase 2: Content Expansion (Sri Lanka & Journals)
1. **Add Sri Lanka Conferences**: Research and add upcoming computer science/AI conferences held in Sri Lanka to the curation list (e.g., SLAAI, ICIAfS, MERCon).
2. **Integrate Journals**:
    - Introduce a new "Type" column or badge (Conference vs. Journal) to the data model.
    - Add major AI/CS Journals (e.g., IEEE TPAMI, JMLR, AIJ).
    - Update the rating filters so users can filter by journal-specific rankings (e.g., Scimago Q-ratings, Impact Factor).

## Phase 3: Review & Release
1. Verify all UI changes using the browser subagent on various screen sizes.
2. Ensure no releases are made until explicit user approval is granted.
