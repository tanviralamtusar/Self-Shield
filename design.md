# Self-Shield — Design System

## Brand Identity
- **App Name:** Self-Shield
- **Tagline:** "Guard Your Digital Life"
- **Platform:** Android (min SDK 21 / Android 5.0)
- **Distribution:** APK + Google Play Store + GitHub (Open Source)

## Color Scheme (Notion-inspired)
### Light Mode
- Background:       #FFFFFF
- Surface:          #F7F6F3
- Surface Elevated: #EFEEEA
- Border:           #E9E9E7
- Text Primary:     #1A1A1A
- Text Secondary:   #6B6B6B
- Text Muted:       #9B9B9B
- Accent Primary:   #2F80ED (Shield Blue)
- Accent Success:   #0F9D58 (Blocked Green)
- Accent Warning:   #F4B400 (Timer Orange)
- Accent Danger:    #DB4437 (Tamper Red)
- Accent Purple:    #7B68EE (Focus Mode)

### Dark Mode
- Background:       #191919
- Surface:          #252525
- Surface Elevated: #2F2F2F
- Border:           #383838
- Text Primary:     #FFFFFE
- Text Secondary:   #A0A0A0
- Text Muted:       #616161
- Accent Primary:   #4A9EFF
- Accent Success:   #34C759
- Accent Warning:   #FFD60A
- Accent Danger:    #FF453A
- Accent Purple:    #9D8FFF

## Typography
- **Font Family:** Inter (Google Fonts)
- **Display:**     32sp / Bold
- **Heading 1:**   24sp / SemiBold
- **Heading 2:**   20sp / SemiBold
- **Heading 3:**   17sp / Medium
- **Body:**        15sp / Regular
- **Caption:**     13sp / Regular
- **Label:**       11sp / Medium / Letter-spaced

## Spacing System (8px grid)
- xs:   4dp
- sm:   8dp
- md:   16dp
- lg:   24dp
- xl:   32dp
- xxl:  48dp

## Corner Radius
- Small:  8dp  (chips, badges)
- Medium: 12dp (cards)
- Large:  16dp (bottom sheets)
- XLarge: 24dp (dialogs)
- Full:   999dp (toggles, pills)

## Elevation / Shadow
- Level 1: 0dp  (flat cards)
- Level 2: 2dp  (interactive cards)
- Level 3: 8dp  (bottom sheets)
- Level 4: 16dp (dialogs/modals)

## Icon System
- Library: Material Symbols (Rounded)
- Size: 20dp / 24dp / 32dp
- Weight: 400
- Fill: context-dependent (filled = active)

## Component Library

### Cards
- Background: Surface color
- Border: 1dp Border color
- Radius: 12dp
- Padding: 16dp
- Shadow: Level 1

### Toggle Switch
- ON:  Accent Primary background
- OFF: Border color background
- Thumb: White circle
- Animate: 200ms ease

### Buttons
- Primary:   Accent Primary bg, white text, 12dp radius
- Secondary: Surface bg, border, primary text
- Danger:    Accent Danger bg, white text
- Ghost:     Transparent, primary text
- Height:    48dp (touch target)

### Bottom Sheets
- Radius: 24dp top corners
- Handle: 4dp x 32dp, Border color
- Drag-to-dismiss: enabled

### Blocking Overlay
- Full screen
- Background: #000000 CC (80% black)
- Center card: Surface Elevated
- Shield icon: 64dp, Accent Primary
- Message: Heading 2
- Admin contact button: Secondary style

### Status Bar
- Use edge-to-edge
- Status bar color: transparent over background

## Animation
- Duration Short:  150ms
- Duration Medium: 300ms
- Duration Long:   500ms
- Easing: FastOutSlowIn (Material)
- Block overlay entrance: scale 0.8→1.0 + fade

## Accessibility
- Min touch target: 48dp x 48dp
- Content descriptions on all icons
- High contrast mode supported
- Font scaling: up to 1.3x supported