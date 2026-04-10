# TRUTH BOOK — VisaOS: The Immigration Operating System

> Living state document. Updated after every response.

---

## [Brand Identity]

### Name & Positioning
- **Platform Name**: VisaOS
- **Tagline**: The Immigration Operating System
- **Pillars**: Speed · Excellence · Care
- **Target Vibe**: Modern Legal-Tech — professional trust of a law firm + clean energy of a SV AI startup

### Color Palette
| Token | Hex | Purpose |
|-------|-----|---------|
| Background | `#FAF9F6` | Parchment white — reduces bureaucratic stress |
| Text Primary | `#1C1C1E` | Obsidian/dark charcoal — authority |
| CTA Black | `#000000` | Primary buttons |
| Gold | `#EE9B00` | "Strong Case" results, high-probability badges |
| Emerald | `#22C55E` | Success indicators, approval stats |
| Error Red | `#EF4444` | Validation errors |
| Info Blue | `#3B82F6` | Information badges |
| Border | `#E5E2DC` | Subtle warm borders |

### Typography
- **Headings**: Montserrat (Semi-bold, 600)
- **Body**: Inter (Regular, 400)
- **Mono**: JetBrains Mono

### UI Principles
- Rounded cards (12px radius)
- Minimalist thin-line icons
- Significant negative space ("premium, breathable")
- Zen Mode questionnaire (one centered card at a time)
- No dark mode — parchment-first
- No gradients on backgrounds, no neon glows

---

## [System State]

### Architecture
- **Frontend**: Next.js 15 (App Router, TypeScript) — `/frontend/`
- **Backend**: FastAPI 0.115+ (async, Pydantic v2) — `/backend/`
- **Shared Logic**: Python eligibility engine — `/shared/`
- **Database**: PostgreSQL 16 via Docker Compose
- **Auth**: JWT (HS256) + Argon2 password hashing
- **Styling**: Vanilla CSS (Alma-inspired warm parchment theme)

### Frontend Pages
| Route | Layout | Status |
|-------|--------|--------|
| / (Landing) | Hero + Features + Trust | ✅ Rebranded |
| /login | Split-screen auth | ✅ Rebranded |
| /register | Split-screen auth | ✅ Rebranded |
| /dashboard | CRM sidebar + stats | ✅ Rebranded |
| /dashboard/questionnaire | Zen Mode centered card | ✅ Rebranded |
| /dashboard/results | Score ring + criteria | ✅ Rebranded |
| /dashboard/documents | Upload + extraction | ✅ Rebranded |

### Endpoints (API v1)
| Method | Path | Status |
|--------|------|--------|
| POST | /api/v1/auth/register | ✅ |
| POST | /api/v1/auth/login | ✅ |
| GET | /api/v1/auth/me | ✅ |
| POST | /api/v1/auth/refresh | ✅ |
| POST | /api/v1/auth/logout | ✅ |
| POST | /api/v1/profiles/ | ✅ |
| GET | /api/v1/profiles/ | ✅ |
| GET | /api/v1/profiles/{id} | ✅ |
| PUT | /api/v1/profiles/{id}/step | ✅ |
| DELETE | /api/v1/profiles/{id} | ✅ |
| POST | /api/v1/eligibility/evaluate | ✅ |
| GET | /api/v1/eligibility/results/{id} | ✅ |
| POST | /api/v1/documents/upload | ✅ |
| GET | /api/v1/documents/ | ✅ |
| ALL | /api/v1/stripe/* | 🔒 Disabled |

---

## [Assets]

| Asset | Path | Description |
|-------|------|-------------|
| Logo SVG | `/public/logo-visaOS.svg` | Minimalist wordmark — black square mark + "VisaOS" |
| Hero Portrait | `/public/hero-founder.jpg` | Sunlit professional founder portrait |
| Trust Logos | `/public/trust-logos.svg` | Grayscale social proof strip |

---

## [Logic State]

### O-1A Evaluator (8 Criteria, 2026 Updates)
✅ Awards · ✅ Memberships · ✅ Published Material · ✅ Judging (Hackathons/OSS/Podcasts)
✅ Contributions · ✅ Authorship (Digital) · ✅ Critical Role · ✅ High Remuneration

### E-2 Evaluator
✅ Treaty Country · ✅ Proportionality (sliding scale) · ✅ Marginality (5yr plan) · ✅ Control & Direction

### LLC Self-Sponsorship (2026)
✅ Governance evaluation · ✅ Employer-employee check · ✅ US Agent alternative

---

## [Next Actions]
1. ✅ Brand refactor (VisaOS, Alma-inspired theme)
2. ✅ TRUTH_BOOK updated with brand guidelines
3. ✅ DESIGN.md updated with new identity
4. 🔄 Push to GitHub: github.com/saadhaniftaj/visaOS
