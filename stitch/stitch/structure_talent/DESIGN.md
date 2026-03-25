```markdown
# Design System Documentation: The Precision Curator

## 1. Overview & Creative North Star
This design system moves beyond the "standard SaaS dashboard" to embrace a philosophy we call **The Precision Curator**. In the high-stakes world of recruitment, the UI must act as an authoritative but invisible assistant. 

The aesthetic is driven by **Editorial High-Contrast** and **Atmospheric Layering**. We reject the rigid, boxed-in layouts of traditional enterprise software. Instead, we use intentional asymmetry, expansive white space (using our `20` and `24` spacing tokens), and "floating" content blocks to create an experience that feels like a premium digital broadsheet. By shifting from structural lines to tonal depth, we ensure that the recruiter’s focus remains entirely on the human element: the candidate.

---

## 2. Colors & Surface Philosophy
Our palette is anchored in a deep, trustworthy `primary` (#3755c3), supported by a sophisticated range of blues and grays that provide professional gravitas without feeling cold.

### The "No-Line" Rule
**Sectioning must never be achieved through 1px solid borders.** To separate a sidebar from a main content area, use a background shift from `surface` (#f8f9ff) to `surface-container-low` (#eef4ff). Traditional borders create visual noise; tonal shifts create "breathing room."

### Surface Hierarchy & Nesting
Treat the UI as a physical desk of layered stationery. 
*   **Base Layer:** `surface` (#f8f9ff)
*   **Content Sections:** `surface-container-low` (#eef4ff)
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) – This creates a natural "pop" against the lower-tier backgrounds.
*   **High-Priority Overlays:** Use `surface-bright` for active states or focal points.

### The "Glass & Gradient" Rule
To elevate the brand above generic competitors, apply **Glassmorphism** to floating navigation bars or filter drawers. Use `surface-container` at 80% opacity with a `backdrop-blur` of 12px. 
*   **Signature CTA:** For primary action buttons, apply a subtle linear gradient from `primary` (#3755c3) to `on_primary_fixed_variant` (#3352c0) at 135 degrees. This adds a "weighted" feel that flat color lacks.

---

## 3. Typography: Editorial Authority
We utilize a dual-typeface system to balance character with readability.

*   **Display & Headlines (Manrope):** Used for candidate names, page titles, and large metrics. Manrope’s geometric nature provides a modern, high-end feel.
    *   *Example:* `display-md` (2.75rem) for "Welcome back, [Name]" headers.
*   **Body & Labels (Inter):** Used for all data-heavy contexts. Inter is optimized for legibility at small sizes.
    *   *Example:* `body-md` (0.875rem) with `on_surface_variant` (#416186) for candidate descriptions.

**The Hierarchy Rule:** Always pair a `headline-sm` with a `label-md` in `primary` color to create an "anchor" for the eye. Use extreme scale (e.g., `display-lg` next to `body-sm`) to define clear information importance.

---

## 4. Elevation & Depth
We define hierarchy through **Tonal Layering** and **Ambient Light**, not structural containers.

*   **The Layering Principle:** Place a `surface-container-lowest` card on top of a `surface-container-high` background. The subtle 4% difference in luminosity creates depth without the "clutter" of shadows.
*   **Ambient Shadows:** For "floating" elements like Modals or Profile Dropdowns, use a shadow with a 24px blur, 0% spread, and 6% opacity using the `on_surface` color (#0e3457). This mimics natural light.
*   **The "Ghost Border" Fallback:** If high-contrast accessibility is required, use the `outline-variant` (#94b4de) at 15% opacity. Never use 100% opaque borders.
*   **Soft Transitions:** All hover states on cards should involve a shift in surface tier (e.g., from `lowest` to `low`) rather than a color change or a heavy shadow.

---

## 5. Components

### Cards & Data Tables
*   **No Dividers:** Forbid the use of horizontal rules (`<hr>`). Separate candidate list items using `spacing-4` (0.9rem) of vertical white space or a subtle hover shift to `surface-container-highest`.
*   **Data Integrity:** Tables should use `surface-container-low` for headers and `surface` for rows. Align text to the top-left to maintain an editorial feel.

### Buttons
*   **Primary:** `primary` background, `on_primary` text. Use `rounded-md` (0.375rem). 
*   **Tertiary/Ghost:** No background or border. Use `primary` text weight 600. On hover, apply `surface-container-highest` background at 50% opacity.

### Professional Forms
*   **Inputs:** Use `surface-container-lowest` with a "Ghost Border" of `outline-variant` at 20%. 
*   **Focus State:** Shift the border to `primary` (#3755c3) and add a 2px "glow" using the `primary_container` color at 30% opacity.
*   **Labels:** Always use `label-md` in `on_surface_variant`. Place them 4px above the input field.

### Signature Component: The "Candidate Scorecard"
A custom component for this system. A layered card using `surface-container-lowest` that features a vertical `primary` accent bar (4px wide) on the left to denote "High Match" status. Use `display-sm` for the match percentage to create immediate visual impact.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `spacing-12` and `spacing-16` to create distinct "chapters" on a page.
*   **Do** use `surface-tint` for subtle accents, such as the active state indicator in the sidebar.
*   **Do** ensure all text on `primary` uses `on_primary` (#f8f7ff) for AA accessibility.

### Don’t:
*   **Don’t** use pure black (#000000) for text. Always use `on_surface` (#0e3457) to maintain the "Deep Blue" professional tone.
*   **Don’t** use heavy "Drop Shadows." They feel dated and "out-of-the-box."
*   **Don’t** use icons as the primary means of navigation without a `label-sm` accompaniment.
*   **Don’t** crowd the interface. If you feel a section is too small, double the spacing token (e.g., move from `spacing-4` to `spacing-8`).

---

## 7. Responsive Logic
On mobile devices, the "Tonal Layering" becomes even more critical. Since horizontal space is limited, use `surface-container-lowest` to distinguish interactive cards from the `surface` background, ensuring the user understands "tappable" areas without needing heavy buttons. Use `spacing-4` as the minimum gutter for all mobile layouts.```