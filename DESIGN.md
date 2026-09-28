# EduVerse — Design Language (Level 2 — Agent-Ready)

Source: `G:\EduVerse\eduverse-logos\eduverse-light.svg:2` (71871 B) and `eduverse-dark.svg` (73002 B). 2000×2000, paper-maroon premium.

## 1. Tokens (Copy-Paste)
```json
{
  "color": {
    "bgLight": "#F5F1E8", "fgLight": "#7F1D1D",
    "bgDark": "#7F1D1D", "fgDark": "#F5F1E8",
    "border": "#E8DDD0", "borderDark": "#5A1A1A",
    "card": "#FFFBF5", "muted": "#8A6B6B"
  },
  "radius": { "sm": "8px", "md": "12px", "lg": "16px", "pill": "999px" },
  "space": { "xs":"8px","sm":"12px","md":"16px","lg":"24px","xl":"40px" },
  "font": {
    "displayEn": "Newsreader, serif", "displayAr": "Amiri, serif",
    "bodyEn": "Inter, sans-serif", "bodyAr": "IBM Plex Sans Arabic, sans-serif"
  },
  "shadow": { "card": "0 4px 16px rgba(127,29,29,0.08)" }
}
```
```css
:root { --bg:#F5F1E8; --fg:#7F1D1D; --border:#E8DDD0; --card:#FFFBF5; --muted:#8A6B6B; --radius-lg:16px; }
[data-theme="dark"] { --bg:#7F1D1D; --fg:#F5F1E8; --border:#5A1A1A; --card:#6B2020; }
```

## 2. Typography
- Display: `Newsreader 700` / `Amiri 700` for headings (academic). Body `Inter 400` 16/1.6. Contrast `#7F1D1D` on `#F5F1E8` = 9.2:1.

## 3. Logo Usage
- Watermark at 8% opacity in hero. Min 28px. Never recolor `#7F1D1D`. Keep C2PA.

## 4. Layout
- Max `1280px`, 24px gutters. Hero paper full-width with maroon headline + grade chips (outline 1.5px `#7F1D1D`). Lesson grid `3→2→1` at 1024/640, radius 16, shadow card.

## 5. Components

### 5.1 Grade Chip
```tsx
type Chip = { label:string, href:string, active?: boolean }
// border 1.5px #7F1D1D, radius pill, px 14 py 8, fg #7F1D1D bg transparent, active bg #7F1D1D fg #F5F1E8
```

### 5.2 Lesson Card
```tsx
type LessonCard = { slug:string, title:string, subject:string, grade:string, thumbnail?: string }
// border 1px var(--border), radius 16, bg var(--card), shadow card, pad 16
// Top: thumbnail 16:9 radius 12, badge grade pill #7F1D1D on #F5F1E8 top-left
// Title 16px 600 fg var(--fg), subject 12px muted
// Hover lift -2px, focus ring 2px #7F1D1D
```

### 5.3 Sponsor Slot (Phase 0 Empty)
```tsx
// dashed border 1.5px #E8DDD0, radius 12, pad 20, label "SPONSORED · Coming soon" 12px muted, centered
// Must render without error when sponsors table empty
```

### 5.4 Search Bar
```tsx
// sticky top 64px, bg var(--bg), border 1px var(--border), radius pill, px 16 py 10, icon left, placeholder "Search lessons… / ابحث…"
```

## 6. Motion
- Fade 200ms. No carousel.

## 7. Accessibility
- Tap 44px, focus ring 2px #7F1D1D, search `role="search"` + `aria-label`.

## 8. Assets
- Keep `eduverse-logos/` untouched. Do not hand-edit dense path.

## 9. Dark Mode
- Full inverse per logo, sync with EduCo. via localStorage.

## 10. Responsive
- Grade nav horizontal scroll on <768px (scroll snap). Cards 3→2→1. Search sticky.

## 11. Verification
- [ ] Lighthouse ≥95, no CLS, RTL mirror ok on `/ar`.
