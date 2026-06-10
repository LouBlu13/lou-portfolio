# Portfolio Design System — Design Tokens

## Overview
Lou Blumenthal portfolio extracted from 15 Figma designs across multiple breakpoints (16" MacBook Pro, 14" MacBook Pro, MacBook Air variants).

## Color Palette

### Backgrounds
- **Landing**: `#1a1517` (Dark Brown)
- **Work**: `#380009` (Dark Red)
- **About**: `#010080` (Deep Navy Blue)
- **Contact**: `#0b3e31` (Dark Teal/Green)

### Accent Colors
- **Light Grey**: `#82c8e4` (About page text)
- **Light Peach**: `#fea996` (Work page text)
- **Light Teal**: `#71e6cb` (Contact page highlights)
- **Secondary Grey**: `#1959b3` (About nav), `#9b1212` (Work nav), `#3ebb9e` (Contact nav)

### Interactive Colors
- **Red Circle**: `#cd1b17`
- **Blue Circle**: `#1959b3`
- **Green Circle**: `#0b3e31`
- **Teal Circle**: `#3ebb9e`

## Typography

### Font Family
- **Primary**: Inter (Regular 400, Black 900)

### Font Sizes
- **Extreme**: 48px (Contact "Let's connect" heading)
- **Big**: 24px (Navigation, card titles, section headings)
- **Regular**: 19px (Body copy, footer, timeline)
- **Display**: 62px (Landing page main title)

### Letter Spacing (Tracking)
- **Navigation**: 3.36px (0.14em)
- **Footer**: 2.66px (0.07em)
- **Body**: 0.76px (0.02em)
- **Work cards**: 0.96px (0.04em)

### Line Height
- **Standard**: 0.95 (95% of font size)

## Layout System

### Canvas Sizes
- **Landing**: 1440×1024px
- **Work**: 1440×900px
- **About**: 1440×720px
- **Contact**: 1440×720px

### Responsive Scaling
All pages scale proportionally to fit any viewport using CSS transform: scale()
- Base design width: 1440px
- Scales down to mobile, up to ultra-wide displays
- Maintains aspect ratio and visual hierarchy

### Spacing Values
- **Gap (large)**: 40px
- **Gap (medium)**: 20px
- **Gap (small)**: 12px
- **Padding (section)**: 80px (left), 60px (top/bottom)
- **Padding (card)**: 70px top, 18px left

## Components

### Navigation Bar
- Fixed position (top-left)
- Font size: 24px
- Letter spacing: 3.36px
- Text transform: UPPERCASE
- Active state: underline decoration

### Footer Strip
- Fixed position (bottom-left)
- Font size: 19px
- Letter spacing: 2.66px
- Two columns with 53.333px gap
- Text transform: UPPERCASE

### Circle Buttons (Landing)
- Width: 379px (responsive: clamp(200px, 30vw, 379px))
- Height: 479px (responsive: clamp(260px, 38vw, 479px))
- Hover animation: translateY(-10px), label fades in
- Border radius: 50%

### Work Cards (2×2 Grid)
- Grid gap: 80px (horizontal), 20px (vertical)
- Card height: 442px
- Hover effect: Opacity 85%, + icon grows

### Timeline (About)
- Dot size: 5px (border-radius: 50%)
- Vertical line width: 1px
- Spacing between items: 28px
- Line color: rgba(130, 200, 228, 0.3)

### Portrait Circles
- Size: 299×299px
- Border radius: 50%
- Blur effect: 10-18px on overlapping circle
- Opacity variations: 0.6–0.7 on blurred circles

### Contact Info Layout
- Two-column flex layout
- Gap: 20px between columns
- Labels (left): Light color (#71e6cb)
- Values (right): Secondary color (#3ebb9e)

## Decorative Elements

### Plus Icon (+)
- Vertical bar: 1px wide, 40px tall (50px on hover)
- Horizontal bar: 40px wide, 1px tall
- Color: #fea996 (Work), #82c8e4 (About), #71e6cb (Contact)

### Horizontal Divider
- Height: 1px
- Width: 1025px (Landing), 419px (cards)
- Color: rgba(255, 255, 255, 0.25) or rgba(accent, 0.4)

## Interaction States

### Links & Buttons
- Default: Color as per page
- Hover: Opacity 80%, slight lift animation
- Active: Text-decoration underline

### Cards
- Hover effect: Opacity 85%
- Expand animation: + icon vertical bar grows from 40px to 50px

### Circles (Landing)
- Hover: Translate up 10px
- Label animation: Fade in (opacity 0→1)
- Transition: 0.3s ease

## Responsive Behavior

### Viewport Scaling Strategy
- All pages scale proportionally using `transform: scale()`
- No breakpoints needed—continuous scaling from mobile to 4K
- Aspect ratios preserved exactly

### Text Sizing with clamp()
- Navigation: `clamp(14px, 1.6vw, 24px)`
- Landing title: `clamp(36px, 7vw, 62px)`
- Footer: `clamp(12px, 1.5vw, 19px)`

### Spacing with clamp()
- Gaps: `clamp(20px, 3vw, 40px)`
- Padding: `clamp(30px, 5vw, 60px)`
- Margins: `clamp(24px, 3vh, 40px)`

## Page Structure

### Landing (Home)
- Centered name + divider
- Three clickable circles (Red/Blue/Green)
- Page ID: `#landing`

### Work
- Left: "Some of my Work" eyebrow + 2×2 card grid
- Right: Two overlapping portrait circles
- Page ID: `#work`

### About
- Left: Resume timeline
- Center: Decorative circles
- Right: Bio text block
- Page ID: `#about`

### Contact
- Left: Portrait circles
- Right: "Let's connect" heading + contact details
- Page ID: `#contact`

## Figma Reference Notes

All 15 Figma nodes contain the same 4 pages at different viewport sizes:
- **100:712, 100:713, 100:714** — About page (Desktop 16", MacBook Pro 16", MacBook Air variants)
- **100:717, 100:718, 100:719** — Landing page (Desktop 16", 14", MacBook Air 4)
- **100:276, 100:278, 100:279** — Work page (Desktop 16", 14", MacBook Air)
- **100:550, 100:496, 100:604, 100:658** — Contact page (Desktop 16", 14", MacBook Air variants)
- **100:277, 100:330** — Additional Work page variants

The responsive design accommodates all these breakpoints seamlessly.

## Implementation Notes

1. **Color Tokens**: Update `:root` CSS variables for site-wide color changes
2. **Typography**: Adjust `--bigtext`, `--regulartext`, `--extremetext` to resize text
3. **Spacing**: Modify `clamp()` values for tighter/looser layouts
4. **Page Switching**: `showPage(id)` function in main.js controls visibility
5. **Scaling**: `scaleApp()` automatically adjusts design to viewport

