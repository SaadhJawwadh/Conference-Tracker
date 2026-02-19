# Task: Table Header and Filter UI/UX Polishing

## Status: Starting

## Objective:
Merge the filter bar and table header into a single seamless component, remove unnecessary whitespace, and fix the sticky header issue where it overlaps/hides the first row of data.

## Implementation Plan:
1.  **Refine HTML structure**: Ensure `explorer-card` contains both `.filter-section` and `.table-scroll` with no intermediate wrappers that could cause gaps.
2.  **Consolidate Styles**:
    *   Set `.filter-section` and `.conference-table th` to have zero vertical margin/padding gaps between them.
    *   Ensure the sticky `thead` background is fully opaque.
    *   Adjust `z-index` values to ensure the site header stays on top, then the table header, then the table rows.
    *   Fix the `top` offset for the sticky `thead` to account for the dynamic site header height.
3.  **Fix Hiding Content Issue**:
    *   Investigate if `position: sticky` on `thead` is causing the first row to be hidden. This can happen if the `thead` is not properly contained or if there are conflicting styles.
    *   Ensure `border-collapse: separate` and `border-spacing: 0` are consistently applied.
4.  **Alignment Pass**:
    *   Verify and fix horizontal alignment between all `th` elements and their corresponding `td` elements.
    *   Ensure the bookmark star and text are properly padded.
5.  **Quality Assurance**: Use the browser subagent to verify the fix across light and dark modes and at different scroll positions.

## Done:
- Initial merging of component in previous steps.

## To Do:
- [ ] Refine CSS for seamless merging (remove gaps).
- [ ] Fix sticky overlap/hiding issue.
- [ ] Alignment verification.
- [ ] Final QA.
