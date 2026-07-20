# ManuVerse – Smart Factory Platform

> An enterprise-grade Industry 4.0 manufacturing management platform built with Next.js, React, and TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

ManuVerse digitizes end-to-end factory operations — from production planning and machine monitoring to quality control, inventory management, and dispatch tracking. It's designed to give plant managers a single dashboard view of their entire manufacturing ecosystem.

**Built for:** Manufacturing companies, factory operators, and industrial engineering teams.

## Features

- **Dashboard** — Real-time KPIs, OEE trends, machine status grid, and production charts
- **Production** — Production plans and work order management with progress tracking
- **Machine Monitoring** — Live machine status with OEE metrics (grid/list views)
- **Maintenance** — Preventive, corrective, and emergency work order management
- **Inventory** — Stock tracking with reorder alerts and ABC classification
- **Warehouse** — Zone-based storage management with capacity visualization
- **Quality** — Inspection tracking (incoming, in-process, final) and NCR management
- **Orders** — Customer order pipeline with stage-wise status tracking
- **Dispatch** — Shipment tracking with proof of delivery management
- **Employees** — Workforce management, shift scheduling, and skill matrix
- **Suppliers** — Vendor ratings, lead time tracking, and PO management
- **Analytics** — Revenue trends, production efficiency, and utilization charts
- **Reports** — 10 report types with PDF/Excel/CSV export options
- **Settings** — Platform configuration (general, security, notifications, system)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Vanilla CSS (custom design system) |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Inter + Outfit (Google Fonts) |
| State Management | React Context API |
| Build Tool | Turbopack |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# clone the repo
git clone https://github.com/your-username/manuverse.git
cd manuverse

# install dependencies
npm install

# start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Login Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@manuverse.com | Admin@123 | Super Admin |

Any email works with password `Admin@123` (will login as Plant Manager).

## Project Structure

```
src/
├── app/
│   ├── globals.css              # design system (2200+ lines)
│   ├── layout.tsx               # root layout
│   ├── providers.tsx            # client-side context providers
│   ├── page.tsx                 # login page
│   └── dashboard/
│       ├── layout.tsx           # sidebar + header layout
│       ├── page.tsx             # main dashboard
│       ├── production/          # production planning
│       ├── machines/            # machine monitoring
│       ├── maintenance/         # maintenance management
│       ├── inventory/           # inventory management
│       ├── warehouse/           # warehouse zones
│       ├── quality/             # quality assurance
│       ├── orders/              # order management
│       ├── dispatch/            # dispatch tracking
│       ├── employees/           # workforce management
│       ├── suppliers/           # supplier management
│       ├── analytics/           # data analytics
│       ├── reports/             # report generation
│       └── settings/            # platform settings
├── context/
│   └── AuthContext.tsx           # authentication state
└── data/
    └── mockData.ts              # mock factory data
```

## Design Decisions

- **Pure CSS** — No CSS frameworks (Tailwind, Bootstrap etc). Custom design tokens for full control over the dark-theme glassmorphism aesthetic.
- **App Router** — Using Next.js 16 App Router with server components where possible.
- **Mock Data** — Frontend-first approach. All data is mocked for demo purposes. Backend integration points are clearly marked with `// TODO` comments.
- **Inline Styles** — Module pages use inline styles to keep component files self-contained and avoid CSS class name conflicts across 14 modules.

## Roadmap

- [ ] Backend API integration (Spring Boot / Node.js)
- [ ] Role-based access control (RBAC)
- [ ] Real-time WebSocket updates for machine telemetry
- [ ] PDF report generation
- [ ] Mobile responsive improvements
- [ ] Dark/Light theme toggle
- [ ] Docker deployment setup

## Author

**Rohit Jha**  
[GitHub](https://github.com/your-username) • [LinkedIn](https://linkedin.com/in/your-profile)

## License

This project is licensed under the MIT License.
