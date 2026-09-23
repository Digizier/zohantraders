# ZOHAN TRADERS — Security, IT & Construction Solutions

> **Tagline**: Your Trusted Partner for Security, IT & Construction Solutions  
> **Headquarters**: Jampur Road, DG Khan, Pakistan  
> **Helpline**: +92333-8586852 | **Email**: traderszohan@gmail.com  
> **Federal NTN**: 7539474-3 | **Provincial STRN**: 3277876288512  

---

## 🏛️ About Zohan Traders
Established in 2017, **ZOHAN TRADERS** is a premier government and commercial supply and contracting partner in Pakistan. We specialize in enterprise security & surveillance, high-speed fiber IT infrastructure, civil construction materials, institutional office stationery, and corporate ergonomic furniture.

### 4 Core Divisions:
1. **ZOHAN E-SECURITY**: 4K ColorVu IP CCTV, Walkthrough Gates, Biometric Access Control, Fire Alarm Systems, Electric Fencing & Razor Wire.
2. **ZOHAN NETWORKS**: airMAX Wireless Bridges, Managed PoE Switches, Optical Fiber Distribution, CAT6/CAT7 Cabling.
3. **ZOHAN CONSTRUCTIONS**: First-Class Multani Clay Bricks, Interlocking Tuff Tiles, Ziarat Marble, Sanitaryware & Structural Timber.
4. **ZOHAN STATIONARY**: Corporate Box Paper (Double A, PaperOne), Archival Ledgers, Metal Desk Organizers.

---

## ⚡ Technical Architecture
- **Framework**: Next.js 15 (App Router)
- **Deployment Mode**: Pure Static Export (`output: 'export'`) optimized for Cloudflare Pages (Zero serverless execution costs, zero CPU quota limits).
- **Styling**: Tailwind CSS with custom Zohan branding tokens (Red `#E8001D`, Dark Navy `#0F172A`, Gold `#F59E0B`).
- **Resilient Data Layer**: Dual-tier client persistence engine with cross-tab reactive event hydration (`lib/db.ts`).
- **White-Label Standard**: 100% white-labeled enterprise portal.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Node.js 22+
- npm or pnpm

### 1. Installation
```bash
npm install
```

### 2. Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Control Panel**: [http://localhost:3000/admin](http://localhost:3000/admin) *(Default Master PIN: `admin123`)*

### 3. Production Build & Static Export
```bash
npm run build
```
Generates 88 pre-rendered static HTML routes in the `./out` directory.

### 4. Verification Suite
```bash
node scripts/verify-build.mjs
```

---

## ☁️ Cloudflare Pages Deployment

### Using Wrangler CLI:
```bash
npx wrangler pages deploy out/ --project-name=zohan-traders
```

### Using Cloudflare Pages Git Integration:
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Root directory**: `/`
