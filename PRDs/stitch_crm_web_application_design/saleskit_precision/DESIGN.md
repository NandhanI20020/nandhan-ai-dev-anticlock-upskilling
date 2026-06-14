---
name: SalesKit Precision
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#3d4a40'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#6d7a6f'
  outline-variant: '#bccabd'
  surface-tint: '#006d3f'
  primary: '#006a3e'
  on-primary: '#ffffff'
  primary-container: '#00864f'
  on-primary-container: '#f6fff5'
  inverse-primary: '#63dd97'
  secondary: '#56579c'
  on-secondary: '#ffffff'
  secondary-container: '#b1b2fd'
  on-secondary-container: '#414285'
  tertiary: '#a13742'
  on-tertiary: '#ffffff'
  tertiary-container: '#c04f59'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#80fab1'
  primary-fixed-dim: '#63dd97'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#00522e'
  secondary-fixed: '#e1dfff'
  secondary-fixed-dim: '#c1c1ff'
  on-secondary-fixed: '#111055'
  on-secondary-fixed-variant: '#3e3f82'
  tertiary-fixed: '#ffdada'
  tertiary-fixed-dim: '#ffb3b5'
  on-tertiary-fixed: '#40000b'
  on-tertiary-fixed-variant: '#84222e'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  sidebar-active: '#6F6EE8'
  primary-hover: '#088A52'
  danger: '#E15A51'
  warning: '#F59E0B'
  rotten: '#FB923C'
  won: '#16A34A'
  lost: '#DC2626'
  surface-subtle: '#F5F5F5'
  border: '#E5E5E5'
  banner: '#F0EFFF'
  link: '#226FCA'
typography:
  headline-h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-h2:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  headline-h3:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  meta-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  badge-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  headline-h1-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  gap-xs: 4px
  gap-sm: 8px
  gap-md: 12px
  gap-lg: 16px
  section: 24px
  margin-page: 32px
  sidebar-width: 60px
  subnav-width: 220px
  kanban-col-min: 220px
  kanban-col-max: 260px
---

## Brand & Style

This design system is engineered for high-performance sales environments where data density and speed of execution are paramount. The aesthetic is **Corporate / Modern**, leaning heavily into a functionalist "Pipedrive-like" interface that prioritizes clarity over decoration. 

The brand personality is authoritative and reliable, utilizing a deep navy "chrome" to frame a clean, white workspace. It employs high-contrast status accents to direct a salesperson’s attention to what matters most: closing deals and addressing "rotten" or overdue leads. The interface avoids unnecessary flourishes, focusing instead on a rigid 4px grid and clear information hierarchy to reduce cognitive load during intensive CRM workflows.

## Colors

The palette is divided into three functional tiers:
1.  **Structure (Chrome):** The sidebar uses a deep Navy (`#2C2D6F`) to create a distinct boundary for global navigation, with a vibrant Lavender (`#6F6EE8`) indicating the active state.
2.  **Action (Interactive):** Emerald Green (`#0A9E5F`) is reserved for primary success-path actions, such as adding a deal or marking a lead as "Won."
3.  **Status (Utility):** A high-visibility status system uses Red, Amber, and a unique "Rotten" Orange (`#FB923C`) to flag deal health. Neutral grays handle the heavy lifting of borders and secondary metadata to keep the focus on actionable data.

## Typography

This design system uses **Inter** exclusively to ensure maximum legibility at small sizes. Hierarchy is established through weight (700 for titles, 600 for headers) and color (muted grays for metadata). 

The scale is intentionally compact (11px–24px) to support data-heavy views like Kanban boards and tables. All caps are rarely used, except in specific badge or small label contexts to differentiate them from interactive body text.

## Layout & Spacing

The system follows a strict **4px base unit**. Layouts are primarily **fluid within fixed constraints**:
- **Navigation:** A fixed 60px icon-only sidebar expands into a 220px sub-navigation in complex modules.
- **Grid Strategy:** Dashboard and list views use a fluid grid. Detail views employ a 45/55 split for core data vs. activity feeds.
- **Responsive Reflow:** On tablet, Kanban columns shrink to 180px and horizontal scrolling is enabled. On mobile, the split-view detail panel stacks vertically, and the sidebar transforms into a bottom navigation bar.

## Elevation & Depth

The design system uses a minimalist approach to depth, relying on **tonal layers** and **subtle shadows**:
- **Base Layer:** Pure White (`#FFFFFF`) for primary surfaces and cards.
- **Subtle Layer:** Off-white (`#F5F5F5`) for container backgrounds (like Kanban columns) and table hover states.
- **Card Shadows:** A soft, low-opacity 4px blur shadow is used for default cards. On hover, this shadow deepens to provide tactile feedback.
- **Drag & Drop:** Interactive cards during drag operations use a deeper shadow, 0.8 opacity, and a 2° rotation to simulate physical movement above the grid.
- **Focus States:** A 2px solid Lavender (`#6F6EE8`) outline is applied to all interactive elements on focus.

## Shapes

The system uses **Soft (0.25rem / 4px)** roundedness as the primary standard for all structural elements including cards, buttons, and form inputs. This ensures a professional, clean look that isn't overly "bubbly."

**Exceptions:**
- **Status Pills/Badges:** These use a fully rounded "pill" shape to distinguish them as non-button status indicators.
- **Sidebar Active States:** Rounded rectangles with a 4px radius.
- **Stage Progress:** A custom chevron-cut shape for the pipeline progress bar to indicate directionality.

## Components

### Kanban Cards
Cards must include a 4px left-border accent for "Rotten" or "Overdue" status. Internal padding is strictly 12px (`--gap-md`). Metadata (deal value, owner) should use the `meta-sm` token.

### Data Tables
Tables use a flat design with 1px borders (`#E5E5E5`). Rows use the `surface-subtle` color on hover. Action icons (Lucide-React) are sized to 18px within rows to maintain data density.

### Buttons
- **Primary:** Emerald Green background, white text.
- **Secondary:** White background, 1px border (`#E5E5E5`), navy text.
- **Danger:** Red background (`#E15A51`), white text.
Buttons have a fixed height of 36px for standard and 32px for compact views.

### Input Fields
Inputs use a 1px border, 4px radius, and `label-md` for floating or top-aligned labels. The active state uses the lavender focus ring.

### Activity Feed
The activity feed uses a 45/55 split in detail panels. Each activity entry is separated by a 1px divider, with icon indicators (Phone, Mail, Check) set to 20px.

### Chevron Stage Bar
A specialized component for deal pipelines. Each segment is a chevron shape. The "Active" stage is Emerald Green, "Completed" stages are a lighter tint of green, and "Future" stages are gray.