# DESIGN.md — VisaOS: The Immigration Operating System

> Alma-inspired Modern Legal-Tech aesthetic. Professional trust meets Silicon Valley speed.

---

## 1. Visual Theme & Atmosphere
- **Mood**: Warm, trustworthy, premium — reduces bureaucratic stress
- **Density**: Low — maximum negative space, "breathable" premium experience
- **Philosophy**: "Zen Mode" — one focused element at a time, clean sightlines
- **Inspiration**: Alma.co's warm minimalism + modern legal-tech authority
- **Brand Pillars**: Speed, Excellence, Care

## 2. Color Palette & Roles

| Token | Hex | Role |
|-------|-----|------|
| `--bg-primary` | `#FAF9F6` | Page background — warm parchment white |
| `--bg-white` | `#FFFFFF` | Cards, elevated surfaces |
| `--bg-surface` | `#F5F3EF` | Secondary surfaces, sidebar |
| `--bg-muted` | `#EDEAE4` | Hover states, dividers |
| `--text-primary` | `#1C1C1E` | Headings, primary body text — obsidian authority |
| `--text-secondary` | `#6B7280` | Descriptions, labels |
| `--text-tertiary` | `#9CA3AF` | Hints, timestamps, placeholders |
| `--accent-black` | `#000000` | Primary CTAs, buttons |
| `--accent-gold` | `#EE9B00` | Strong case results, high-probability badges |
| `--accent-emerald` | `#22C55E` | Success, approval stats, "criterion met" |
| `--accent-red` | `#EF4444` | Errors, insufficient scores |
| `--accent-blue` | `#3B82F6` | Info badges, links |
| `--border` | `#E5E2DC` | Card borders, dividers |
| `--border-focus` | `#000000` | Input focus ring |

## 3. Typography Rules

| Element | Font | Weight | Size | Tracking |
|---------|------|--------|------|----------|
| H1 (Hero) | Montserrat | 600 | clamp(2.5rem, 5vw, 3.5rem) | -0.02em |
| H2 (Section) | Montserrat | 600 | 2rem | -0.015em |
| H3 (Card) | Montserrat | 600 | 1.25rem | -0.01em |
| Body | Inter | 400 | 1rem | 0 |
| Caption | Inter | 500 | 0.875rem | 0 |
| Label | Inter | 600 | 0.75rem | 0.05em (uppercase) |
| Mono | JetBrains Mono | 400 | 0.8rem | 0 |

## 4. Component Stylings

### Buttons
- **Primary**: `bg: #000`, `color: white`, `radius: 8px`, hover → `#1C1C1E`, subtle lift
- **Secondary**: `bg: transparent`, `border: 1.5px solid #E5E2DC`, `color: #1C1C1E`, hover fills muted
- **Ghost**: transparent, hover shows bg-muted
- **Gold Badge**: `bg: #EE9B00`, `color: white`, used for "Strong Case" indicators

### Cards
- `bg: #FFFFFF`, `border: 1px solid #E5E2DC`, `radius: 12px`, `padding: 32px`
- Elevated: `box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)`
- No neon, no glow — clean elevation only

### Inputs
- `bg: #FFFFFF`, `border: 1.5px solid #E5E2DC`, `radius: 8px`
- Focus: `border: #000`, `box-shadow: 0 0 0 3px rgba(0,0,0,0.06)`
- Generous padding (14px 16px)

## 5. Layout Principles
- **Spacing scale**: 4px base — 4, 8, 12, 16, 24, 32, 48, 64, 80, 120
- **Max content**: 1120px centered
- **Sidebar**: 280px, light surface with subtle border
- **Questionnaire**: "Zen Mode" — single centered card, max-width 640px
- **Negative space**: Minimum 80px between major sections

## 6. Depth & Elevation
- **Shadow xs**: `0 1px 2px rgba(0,0,0,0.04)` — inputs
- **Shadow sm**: `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)` — cards
- **Shadow md**: `0 4px 16px rgba(0,0,0,0.06)` — dropdowns
- **Shadow lg**: `0 8px 32px rgba(0,0,0,0.08)` — modals
- NO colored glows or neon effects

## 7. Do's and Don'ts
- ✅ Use maximum whitespace — let content breathe
- ✅ One focused element per viewport (Zen Mode)
- ✅ Warm, parchment backgrounds (#FAF9F6)
- ✅ Use gold (#EE9B00) sparingly for strong-case celebrations
- ✅ Rounded corners (12px cards, 8px inputs/buttons)
- ✅ Thin-line minimalist icons
- ❌ NO dark mode — parchment-first
- ❌ NO gradients on backgrounds
- ❌ NO neon glows or colored shadows
- ❌ NO heavy borders — always subtle (#E5E2DC)
- ❌ NO more than 2 colors per card

## 8. Responsive Behavior
- **Desktop**: 1120px+ — sidebar + content, generous spacing
- **Tablet**: 768-1024px — sidebar collapses, 2-column grids
- **Mobile**: <768px — single column, full-width cards, stacked nav

## 9. Agent Prompt Guide
When building UI for VisaOS:
- Background: `#FAF9F6` (warm parchment)
- Cards: `#FFFFFF` with `#E5E2DC` border, 12px radius
- Primary CTA: `#000000` button with white text
- Text: `#1C1C1E` primary, `#6B7280` secondary
- Fonts: Montserrat (headings, 600), Inter (body, 400)
- Success: `#22C55E`, Gold: `#EE9B00`, Error: `#EF4444`
- Max whitespace, zen-mode layouts, clean elevation shadows
