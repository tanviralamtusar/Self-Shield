# Self-Shield — Design System

## Design Philosophy
Clean, trustworthy, and purposeful. The app communicates safety and control without anxiety. Modern card-based UI with calm tones. Nothing aggressive — this is a tool for discipline, not punishment.

---

## Color System (Notion-Inspired)

Based on `npx getdesign@latest add notion` design tokens.

### Light Mode
```
Background:        #FFFFFF
Surface:           #F7F6F3
Surface-Elevated:  #FFFFFF  (cards, sheets)
Border:            #E9E9E7
Border-Strong:     #C7C5BE

Text-Primary:      #1A1A1A
Text-Secondary:    #787774
Text-Muted:        #AFAFAC
Text-Inverse:      #FFFFFF

Accent-Primary:    #2D7FF9   (primary CTAs, toggle active)
Accent-Success:    #0F9B58   (blocked = protected)
Accent-Warning:    #D9730D   (caution states)
Accent-Danger:     #E03E3E   (breach attempts, tamper)
Accent-Purple:     #9065B0   (focus mode)
Accent-Blue-Light: #EEF4FD   (card highlights)

Block-Overlay-BG:  rgba(0,0,0,0.85)
Block-Overlay-Text:#FFFFFF
```

### Dark Mode
```
Background:        #191919
Surface:           #252525
Surface-Elevated:  #2F2F2F
Border:            #373737
Border-Strong:     #4A4A4A

Text-Primary:      #EBEBEB
Text-Secondary:    #9B9A97
Text-Muted:        #5E5E5C
Text-Inverse:      #1A1A1A

Accent-Primary:    #4F8EF7
Accent-Success:    #1DB974
Accent-Warning:    #E87C2B
Accent-Danger:     #F25F5F
Accent-Purple:     #B07FD1
Accent-Blue-Light: #1C2A3F
```

---

## Typography

Font stack: `"Inter", -apple-system, BlinkMacSystemFont, sans-serif`

On Android, system font (Roboto) with matching scales:

```
Display:    32sp / Bold    — Screen titles
Title:      24sp / SemiBold— Section headers
Heading:    20sp / SemiBold— Card titles
Body:       16sp / Regular — Primary content
Body-Small: 14sp / Regular — Secondary content
Caption:    12sp / Regular — Labels, metadata
Overline:   11sp / Medium  — Category tags, uppercase labels
Mono:       14sp / Mono    — Package names, hostnames, code
```

---

## Spacing System (8px base grid)
```
2xs:  4px
xs:   8px
sm:   12px
md:   16px
lg:   24px
xl:   32px
2xl:  40px
3xl:  48px
4xl:  64px
```

---

## Elevation / Shadows (Material 3 tonal)

```
Level 0: No shadow (flat)
Level 1: 0 1px 3px rgba(0,0,0,0.08)  — Cards
Level 2: 0 2px 8px rgba(0,0,0,0.12)  — Dialogs
Level 3: 0 4px 16px rgba(0,0,0,0.16) — Bottom sheets
```

---

## Corner Radius

```
sm:   4dp   — Chips, tags
md:   8dp   — Inputs, small cards
lg:   12dp  — Cards
xl:   16dp  — Sheets, dialogs
full: 50%   — Toggle switches, FABs
```

---

## Component Library

### Card
- Background: Surface-Elevated
- Border: 1dp Border
- Radius: lg (12dp)
- Padding: 16dp
- Shadow: Level 1

### Toggle Switch
- Active: Accent-Primary track, white thumb
- Inactive: Border track, Surface thumb
- Size: 51×31dp (standard Android)

### Block Overlay (Full Screen)
- Background: rgba(0,0,0,0.92)
- Icon: Shield icon, 64dp, white
- Title: 24sp Bold, white
- Subtitle: 16sp Regular, #AFAFAC
- CTA Button: Accent-Primary or "Request Override" (ghost)
- Quran/Dua text (during focus): 14sp italic, #9B9A97

### Status Chip
```
Protected  → green bg + white text
Blocked    → red bg + white text
Scheduled  → orange bg + white text
Active     → blue bg + white text
Inactive   → grey bg + grey text
```

### PIN Entry Screen
- 6 circular indicators
- Numeric keypad
- Biometric prompt button (if enabled)
- Background: Surface
- Indicators: filled = Accent-Primary, empty = Border

---

## Icon Set
- Use Material Symbols (Rounded variant)
- Size: 24dp standard, 20dp compact, 16dp inline
- Key icons used:
  - `shield` — main brand
  - `block` — blocking active
  - `vpn_lock` — VPN status
  - `timer` — timer blocking
  - `self_improvement` — focus mode
  - `warning` — tamper alerts
  - `lock` — PIN protected
  - `phone_android` — device
  - `bar_chart` — reports
  - `settings` — admin settings

---

## App Icon
- Shape: Rounded square (adaptive icon)
- Foreground: Shield outline + inner lock icon
- Background: Gradient #1B4FCC → #2D7FF9
- Design: To be finalized separately (Figma handoff)

---

## Motion & Animation
- Standard easing: `FastOutSlowIn` (Material default)
- Duration: 200ms for micro-interactions, 300ms for screen transitions
- Block overlay: fade in + scale from 0.95 → 1.0 (200ms)
- Card expand: 250ms height animation
- No decorative animations — purposeful only

---

## Accessibility (A11y)
- All interactive elements: min touch target 48×48dp
- Content descriptions on all icons
- Color contrast: 4.5:1 minimum (WCAG AA)
- Dynamic text size support
- Screen reader (TalkBack) tested for all critical flows
