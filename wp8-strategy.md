# NoiceResume — Windows Phone 8 Metro Theme Strategy

## Design Pillars

### 1. Flat & Square (Zero Radius)
- Every surface is a perfect square or rectangle
- No rounded corners anywhere (unlike every modern design system)
- No shadows, no gradients, no 3D effects
- Only flat blocks of color

### 2. Live Tile Grid
- The homepage AND editor are built around tile grids
- Tile sizes: 1×1 (small), 2×2 (medium), 2×1 (wide)
- Tile types: solid color, dual-tone, typography-only
- Tiles can be rearranged (draggable)
- Landing page: each feature/step is a tile

### 3. Content Before Chrome
- Massive typography as primary visual element
- Segoe UI light at 40–72px for titles
- Content is the decoration — no decorative graphics
- Sparse, generous whitespace

### 4. Accent Color System
- User picks ONE accent color (like WP8 settings)
- Applied globally: backgrounds, text highlights, tile fills
- Default accent palette: Cyan (#00AFF0), Magenta (#E5007D), Lime (#A2C139), Orange (#F37720), Pink (#E3008C), Green (#008A00), Blue (#0078D4), Purple (#881798)

### 5. Panoramic Navigation
- Horizontal scrolling sections (hub pattern)
- Dots indicator at bottom for current section
- Subtle parallax between background layers
- "…” overflow for more content

### 6. Typography as UI
- Titles in ALL CAPS or lowercase
- Section headers: 22px bold uppercase
- Primary text: Segoe UI Light
- Secondary text: Segoe UI Semibold
- Bullet points are simple dashes —

### 7. Status Bar
- Transparent, integrated with background
- White text on dark, black text on light
- Minimal — just time + battery

---

## Page-by-Page Strategy

### Landing Page (/)
```
[Status Bar — transparent white]
[Brand Tile — 2×2 cyan tile "Noice" "Resume" stacked]
[Tagline Tile — 2×1 white text on dark "Your Story." "Your Resume."]
[CTA — "Get Started" solid tile]
[Features Tiles — 3 tiles in a row]
  TILE 1: solid color tile, icon + "iPhone Native"
  TILE 2: solid color tile, icon + "Pro Templates"
  TILE 3: solid color tile, icon + "ATS-Friendly"
[Templates Tile Grid — 2×2, each tile a template preview]
[Bottom app bar — dots + back/forward]
```

### Editor (/builder)
```
[Top: App bar with back button + "NoiceResume" + accent dot]
[Main: Tile-based form sections]
  SECTION TILE: "WORK EXPERIENCE" (bold uppercase header)
    → Each entry = sub-tile with field rows
    → White fields on dark tile, or dark text on light tile
  SECTION TILE: "EDUCATION"
  SECTION TILE: "SKILLS"
  SECTION TILE: "PERSONAL INFO"
[Right/Next panel: Live preview tile — directly shows rendered resume as a tile]
[Bottom: App bar with layout dots + accept/save]
```

### Preview
```
[Full-screen tile showing rendered resume]
[Bottom app bar: Export PDF, Share, Back]
```

---

## Color Palette

### Dark Mode (Recommended — the classic WP8 feel)
| Role | Color |
|------|-------|
| Background | #121212 (near-black) |
| Surface | #1C1C1C (dark tile bg) |
| Tile Surface | Accent color (varies) |
| Card Surface | #2A2A2A (lighter dark) |
| Primary Text | #FFFFFF |
| Secondary Text | rgba(255,255,255,0.6) |
| Accent | User-selectable from palette |

### Light Mode
| Role | Color |
|------|-------|
| Background | #FFFFFF |
| Surface | #F0F0F0 |
| Tile Surface | Accent color |
| Card Surface | #E5E5E5 |
| Primary Text | #1A1A1A |
| Secondary Text | rgba(0,0,0,0.6) |
| Accent | User-selectable from palette |

---

## Typography System

| Role | Font | Size | Weight | Case |
|------|------|------|--------|------|
| Hero / Display | Segoe UI Light | 72px | 300 | Normal |
| Section Header | Segoe UI | 22px | 700 | UPPERCASE |
| Tile Title | Segoe UI Light | 28px | 300 | Normal |
| Card Title | Segoe UI | 16px | 600 | Normal |
| Body | Segoe UI | 14px | 400 | Normal |
| Metadata | Segoe UI | 11px | 600 | Normal |
| Button | Segoe UI | 14px | 600 | lowercase |
| App Bar | Segoe UI | 10px | 600 | UPPERCASE |

**Substitute fonts for web (Segoe UI isn't free on web):**
- Primary: `'Segoe UI', 'Segoe UI Variable Display', system-ui, -apple-system, sans-serif`
- Fallback: SF Pro Text / Inter are acceptable but lose the Metro character
- **Best open alternative**: System UI font stack — WP8's feel comes from weight/case/space, not just the font face

---

## Component Specs

### Tile
```
┌──────────────────────┐
│                       │
│         ICON          │
│                       │
│   Tile Title Text     │
│                       │
└──────────────────────┘
```
- No border radius
- No shadow
- Solid background color (accent or surface)
- Optional: Dual-tone (top 60% accent, bottom 40% dark)
- Padding: 16px internal
- Title: bottom-left aligned

### App Bar
```
[ ← ] [ ● ● ○ ● ] [ ✔ ]
```
- Fixed bottom
- Background: transparent or dark semi-transparent
- Controls: back, page dots, action button
- Labels in uppercase, 10px

### Section Headers
```
WORK EXPERIENCE ⏎
━━━━━━━━━━━━━━━━━
```
- Bold uppercase, letter-spacing 1px
- Thin 1px line underneath (accent or white)
- No icon, no badge — just text

### Buttons
```
┌──────────────┐
│  get started │
└──────────────┘
```
- Solid tile-shaped button
- Accent or dark background
- White text
- lowercase (true to WP8)
- No border radius, no shadow, no hover lift

### Input Field
```
┌─────────────────────────┐
│                         │
│  Full Name              │
│                         │
├─────────────────────────┤
│                         │
│  Love Katoch            │
│                         │
└─────────────────────────┘
```
- Label above field (uppercase, 11px bold)
- Field: white on dark bg (or dark on light bg)
- No border radius
- Bottom border: accent color on focus
- Flat, no shadow

---

## Implementation Plan

### Phase 1 — Landing Page (1 session)
1. Create WP8 design system CSS (variables for colors, typography, spacing)
2. Rebuild Hero as tile grid
3. Features as solid accent tiles
4. Templates as 2×2 tile grid
5. Bottom app bar with dots
6. Accent color picker in settings

### Phase 2 — Editor (1 session)
1. Rebuild ResumeForm sections as tiles
2. Each section = a large tile with sub-tiles for entries
3. Remove all rounded corners, shadows, gradients
4. Add Add/Remove tile controls
5. Preview panel as a tile alongside editor

### Phase 3 — Preview & Polish (1 session)
1. Preview as full-screen tile
2. Export PDF tile button
3. Animations: tile flip / slide transitions
4. Accent color persistence
5. Dark/light mode toggle

---

## File Structure

```
src/
├── app/
│   ├── globals.css              ← WP8 CSS variables
│   ├── layout.tsx               ← Segoe UI font setup
│   ├── page.tsx                 ← Landing (unchanged structure, new design)
│   └── resume-builder/
│       └── page.tsx             ← Editor (tile-based form)
├── components/
│   ├── wp8/
│   │   ├── Tile.tsx             ← Reusable tile component
│   │   ├── AppBar.tsx           ← Bottom app bar
│   │   ├── TileGrid.tsx         ← Grid layout for tiles
│   │   └── AccentPicker.tsx     ← Color accent selector
│   └── ...
```

---

## One-Sentence Summary

> Windows Phone 8 Metro design for NoiceResume: flat square tiles, massive Segoe UI typography, a single accent color, zero rounded corners — the resume builder as a live tile dashboard.
