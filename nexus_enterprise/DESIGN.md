---
name: Nexus Enterprise
colors:
  surface: '#faf9ff'
  surface-dim: '#ccdaff'
  surface-bright: '#faf9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8ff'
  surface-container-highest: '#d8e2ff'
  on-surface: '#051a3e'
  on-surface-variant: '#434654'
  inverse-surface: '#1d3054'
  inverse-on-surface: '#edf0ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#535f73'
  on-secondary: '#ffffff'
  secondary-container: '#d4e0f8'
  on-secondary-container: '#576377'
  tertiary: '#432f9c'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b49b5'
  on-tertiary-container: '#d5ccff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#d7e3fb'
  secondary-fixed-dim: '#bbc7de'
  on-secondary-fixed: '#101c2d'
  on-secondary-fixed-variant: '#3b475b'
  tertiary-fixed: '#e5deff'
  tertiary-fixed-dim: '#c9bfff'
  on-tertiary-fixed: '#1a0063'
  on-tertiary-fixed-variant: '#4633a0'
  background: '#faf9ff'
  on-background: '#051a3e'
  surface-variant: '#d8e2ff'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin-desktop: 32px
  container-margin-mobile: 16px
  gutter: 24px
  sidebar-width: 280px
  navbar-height: 72px
---

## Brand & Style

The design system is engineered for a premium enterprise SaaS environment, balancing the rigorous structural requirements of productivity software with a sophisticated, ethereal aesthetic. The personality is professional, transparent, and high-performance.

The visual direction utilizes a **Light Glassmorphism** approach infused with **Modern Minimalism**. It draws from Material Design 3’s logic—specifically its use of surface containers and tonal palettes—but replaces heavy shadows with depth generated through backdrop blurs and semi-transparent layering. This creates an interface that feels lightweight and expansive, reducing the cognitive load typically associated with complex employee ecosystems.

Key visual pillars:
- **Optical Clarity:** High-legibility typography and generous negative space.
- **Layered Intelligence:** Using translucency to imply hierarchy and focus.
- **Precision:** Sharp alignment and consistent 8pt increments to signal enterprise-grade reliability.

## Colors

The palette is anchored by a deep **Primary Blue (#0052CC)**, chosen for its association with trust and institutional stability. The system supports both Light and Dark modes using a semantic mapping strategy.

- **Primary:** Used for high-emphasis actions, active states, and brand touchpoints.
- **Secondary/Tertiary:** Purple (#6554C0) is utilized for AI-driven features and specialized insights, while Green and Orange serve as status indicators (Success/Warning).
- **Glass Surfaces:** In light mode, surfaces use `rgba(255, 255, 255, 0.7)` with a 20px backdrop blur. In dark mode, surfaces shift to `rgba(22, 27, 34, 0.6)` with a similar blur.
- **Grays:** A neutral scale ranging from Ivory White to Deep Navy ensures text remains legible regardless of the background translucency.

## Typography

This design system leverages **Inter** for its exceptional readability in data-heavy SaaS environments and its neutral, systematic tone. 

- **Scale:** A tight typographic scale ensures hierarchy is maintained even in dense dashboards.
- **Weights:** Use Semi-Bold (600) for headlines and Medium (500) for UI labels to provide clear visual distinction without the "heaviness" of Bold (700) in most contexts.
- **Leading:** Generous line-height (1.5x for body text) is critical to maintaining the "Minimal" aesthetic and improving scanning speed.
- **Mobile:** On devices under 768px, display and headline sizes scale down by approximately 15% to accommodate smaller viewports while maintaining impact.

## Layout & Spacing

The layout is built on a rigid **8-point grid system**, ensuring every element from icons to container padding is a multiple of 8. 

- **Grid Model:** A 12-column fluid grid is used for the main content area. Sidebars are fixed-width (280px) to ensure navigation consistency, while the content area expands.
- **Sticky Elements:** The **Navbar** is fixed to the top of the viewport with a `z-index` of 1000 and a high-intensity backdrop blur (30px) to allow content to scroll underneath elegantly.
- **Sidebars:** The left-hand sidebar utilizes a "Rail" or "Full" state. The full state includes categories and labels, while the rail state (collapsed) shows only icons to maximize workspace.
- **Safe Zones:** Internal card padding is strictly 24px (space-3) for desktop and 16px (space-2) for mobile.

## Elevation & Depth

This design system avoids heavy drop shadows in favor of **Tonal Layering** and **Glassmorphism**. Depth is communicated through:

1.  **Level 0 (Background):** The lowest layer, using a subtle neutral tint.
2.  **Level 1 (Cards/Containers):** Surfaces with a 1px border (`rgba(255,255,255,0.1)`) and a subtle 4px blur shadow to lift them slightly off the background.
3.  **Level 2 (Modals/Popovers):** Higher blur intensity (20px) and a more pronounced shadow (`0 12px 24px rgba(0,0,0,0.08)`) to indicate focus.
4.  **Glass Effects:** Applied to Navbars, Sidebars, and Floating Action Buttons. Use `backdrop-filter: blur(20px)` combined with a semi-transparent fill. Ensure a 1px inner stroke is applied to the top and left edges to simulate light reflecting off a glass edge.

## Shapes

The shape language is "Rounded" to soften the enterprise feel and align with modern accessibility standards.

- **Base Radius:** 8px (0.5rem) for small components like buttons and inputs.
- **Container Radius:** 16px (1rem) for cards and main modules, creating a distinct "nested" look when smaller components are placed inside.
- **Large Radius:** 24px (1.5rem) for modal windows and AI Assistant bubbles.
- **Interactive States:** On hover, buttons do not change radius but may increase in scale (1.02x) to provide tactile feedback.

## Components

### Buttons & Inputs
- **Buttons:** Primary buttons use solid Primary Blue with white text. Secondary buttons use a glass-style fill (transparent with blur and border). 
- **Inputs:** Fields are 40px in height with a subtle background tint. On focus, the border transitions to Primary Blue with a 2px outer glow.

### Data & Tables
- **Tables:** No vertical borders. Use 1px horizontal dividers in a light gray. Row hover states use a 5% opacity primary blue tint.
- **Charts:** Use a custom palette for data visualization (Purple, Green, Blue, Orange). Lines should be slightly rounded with 2px stroke width.

### Navigation & UI
- **Avatars:** Strictly circular. Use a 2px white border when overlapping in a stack.
- **Badges:** Soft-tinted backgrounds (10% opacity of the status color) with high-contrast text.
- **Sticky Navbar:** Contains the search bar, notifications, and profile. Always has a `backdrop-filter`.

### AI Assistant (Nexus AI)
- **AI Bubbles:** Use a gradient border (Primary Blue to Tertiary Purple).
- **Input:** The AI chat input should be floating at the bottom center or within a sidebar, using a distinct glassmorphism style to separate it from standard data entry.
- **Animation:** Use subtle pulse effects on AI icons when processing.