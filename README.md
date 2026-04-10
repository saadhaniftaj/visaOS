# VisaOS — The Immigration Operating System

> AI-powered U.S. visa eligibility platform. Speed · Excellence · Care.

![VisaOS](frontend/public/hero-founder.jpg)

---

## Overview

VisaOS evaluates your **O-1A** extraordinary ability or **E-2** treaty investor visa eligibility using an AI-powered rule-based engine built on **2026 USCIS standards**. It scores every criterion, identifies evidence gaps, and provides actionable recommendations — so you know exactly where you stand before spending a dollar on legal fees.

## Architecture

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 15 (App Router, TypeScript) | Dashboard, Zen Mode Questionnaire, Results |
| **Backend** | FastAPI (Python, Pydantic v2) | REST API, JWT Auth, Profile Management |
| **Database** | PostgreSQL 16 (JSONB) | Versioned profiles, eligibility results |
| **Auth** | JWT (HS256) + Argon2 | Secure authentication |
| **Engine** | Python (`shared/engine/`) | O-1A & E-2 eligibility evaluation |
| **Design** | Vanilla CSS (Alma-inspired) | Warm parchment theme, Montserrat/Inter |

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker (for PostgreSQL)

### 1. Database
```bash
docker compose up -d
```

### 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

## Features

### O-1A Extraordinary Ability Engine
Evaluates all 8 USCIS criteria with **2026 digital updates**:
- ✅ Awards & prizes
- ✅ Selective memberships
- ✅ Published material about you
- ✅ **Judging** (hackathons, OSS PR reviews, podcast panels — 2026 update)
- ✅ Original contributions (patents, open-source, adoption metrics)
- ✅ **Scholarly authorship** (tech blogs with metrics count — 2026 update)
- ✅ Critical roles at distinguished organizations
- ✅ High remuneration (percentile-based)

### E-2 Treaty Investor Engine
- 📐 **Proportionality test** — inverted sliding scale ($80k-$300k+ range)
- 📊 **Marginality test** — 5-year hiring plan, revenue projections, US worker job creation
- 🌍 **Treaty country** verification (50+ countries)
- 🏛 **Control & direction** — ownership ≥ 50%, executive role

### LLC Self-Sponsorship (2026 Rule)
- Your own LLC can act as the visa petitioner
- Governance structure evaluation
- Employer-employee relationship check
- US Agent alternative recommendation

### Zen Mode Questionnaire
10-step dynamic questionnaire with:
- One focused card at a time (maximum whitespace)
- Conditional step visibility based on visa category
- Auto-save progress
- Step indicator with animated progress

### Document Intelligence
- Upload passports, resumes, and supporting documents
- Simulated Textract/Bedrock extraction (production-ready interface)
- Future S3 encryption support

## Brand Identity

| Element | Value |
|---------|-------|
| **Name** | VisaOS |
| **Tagline** | The Immigration Operating System |
| **Pillars** | Speed · Excellence · Care |
| **Background** | `#FAF9F6` (Parchment White) |
| **Text** | `#1C1C1E` (Obsidian) |
| **CTAs** | `#000000` (Black) |
| **Gold** | `#EE9B00` (Strong Case) |
| **Emerald** | `#22C55E` (Success) |
| **Headings** | Montserrat (600) |
| **Body** | Inter (400) |

## Project Structure

```
visaOS/
├── frontend/              # Next.js 15 App Router
│   ├── src/app/           # Pages (landing, auth, dashboard)
│   ├── src/lib/           # API client, constants
│   └── public/            # Assets (logo, hero, trust logos)
├── backend/               # FastAPI
│   └── app/
│       ├── routers/       # Auth, Profile, Eligibility, Documents, Stripe
│       ├── services/      # Auth, Eligibility orchestrator, Document
│       ├── models/        # SQLAlchemy ORM (User, Profile, Result, Document)
│       └── schemas/       # Pydantic v2 schemas
├── shared/                # Shared eligibility engine
│   ├── engine/            # O-1A, E-2, LLC evaluators
│   └── types/             # Visa types, criterion IDs
├── DESIGN.md              # Brand & design system spec
├── TRUTH_BOOK.md          # Living state document
├── docker-compose.yml     # PostgreSQL 16
└── README.md              # This file
```

## Legal Disclaimer

This platform provides **informational assessment only** and does not constitute legal advice. Immigration laws are complex and subject to change. USCIS adjudications are case-by-case. Always consult with a qualified immigration attorney before filing any visa petition.

---

**Built by [Vanguard Solutions](https://github.com/saadhaniftaj)** · © 2026
