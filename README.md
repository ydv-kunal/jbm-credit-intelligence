# Credit Intelligence Platform — JBM Auto Ltd.

An end-to-end automated business credit intelligence and underwriting dashboard built for evaluating corporate credit risk, working capital health, and debt service capacity for **JBM Auto Limited**.

---

## 1. Overview & Purpose

The **Credit Intelligence Platform** enables credit analysts and risk underwriters to perform facility-specific loan underwriting using consolidated financial data. 

The system evaluates reported 3-year financial performance (FY2024–FY2026), assesses liquidity, debt-servicing headroom, and working capital cycles, and generates a rule-based credit risk score and loan recommendation.

---

## 2. Key Features

- **Facility-Specific Credit Assessment**: Interactive loan parameters submission (Loan Amount, Purpose) returning an immediate risk score, decision recommendation, and confidence level.
- **Single Source of Truth**: Eliminates duplicate or conflicting metrics by displaying one primary facility assessment result.
- **Risk & Opportunity Financial Signals**: Highlights key financial signals (Revenue Growth, Profitability, Interest Coverage, Free Cash Flow, Working Capital) with status indicators and lending impact notes.
- **Expandable Calculation Methodology**: Collapsible derivation section displaying exact formulas, underlying financial input figures, and point deductions.
- **Evidence & Data Sources Provenance**: Data source attribution (`Screener.in`), confidence level, financial period covered, clickable external reference URL, and dataset reliability notes.
- **Resilient UI/UX**: Includes real-time client-side form validation, active loading indicators, anti-stale error banners on API failure, and empty dataset handling.

---

## 3. Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **HTTP Client**: Axios
- **Data Visualization**: Recharts (Line charts for 3-year revenue, operating profit, and net profit trends)
- **UI & Icons**: Lucide React
- **Styling**: Vanilla CSS with custom design tokens, modern typography, glassmorphism headers, and responsive layouts.

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Environment & Middleware**: CORS, Dotenv

---

## 4. Project Structure

```
jbm-credit-intelligence/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── LoanAssessment.jsx     # Loan input form with inline validation
│   │   ├── App.jsx                    # Primary credit intelligence dashboard
│   │   ├── App.css                    # Design system tokens, component & grid styles
│   │   └── main.jsx                   # React entry point
│   ├── .env.example                   # Frontend environment template
│   ├── package.json                   # Client dependencies and build scripts
│   └── vite.config.js                 # Vite bundling configuration
├── server/
│   ├── config/
│   │   └── db.js                      # MongoDB connection setup
│   ├── models/
│   │   ├── Company.js                 # Company profile Mongoose schema
│   │   └── FinancialData.js           # 3-year consolidated financials Mongoose schema
│   ├── routes/
│   │   └── creditRoutes.js            # /dashboard and /assess API routes
│   ├── services/
│   │   ├── calculationService.js      # Financial metric formulas & growth calculators
│   │   ├── riskService.js             # Risk factor scoring logic
│   │   └── decisionService.js         # Credit recommendation engine
│   ├── .env.example                   # Server environment template
│   ├── seed.js                        # Financial database seed script
│   ├── server.js                      # Express app entry point
│   └── package.json                   # Server dependencies
├── .gitignore                         # Root secrets & node_modules protection
└── README.md                          # Project documentation
```

---

## 5. Architecture & Request Flow

```
User (Browser)
     │
     ▼
React Frontend (App.jsx)
     │
     ├── GET  /api/credit/dashboard  ──► Express Route ──► MongoDB (Company & Financials)
     │                                                         │
     └── POST /api/credit/assess     ──► Express Route ────────┼──► calculationService
                                                               ├──► riskService
                                                               └──► decisionService
```

1. **Dashboard Load**: The React frontend sends a `GET` request to `/api/credit/dashboard` to fetch company background data, 3-year financial history, and metric trends.
2. **Facility Underwriting**: When the user enters a loan amount and purpose and clicks **Assess Credit**, the frontend sends a `POST` request to `/api/credit/assess`.
3. **Engine Evaluation**: The backend calculates financial growth rates, interest coverage, free cash flow, working capital turnover, applies risk penalties, and returns the final credit decision.

---

## 6. Setup & Installation

### Prerequisites
- **Node.js**: v18+ installed
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster connection URI

### Step 1: Clone Repository
```bash
git clone https://github.com/your-repo/jbm-credit-intelligence.git
cd jbm-credit-intelligence
```

### Step 2: Install Dependencies

**Server Dependencies**:
```bash
cd server
npm install
```

**Client Dependencies**:
```bash
cd ../client
npm install
```

---

## 7. Environment Variables

Create `.env` files in both `server/` and `client/` directories based on the templates provided.

### Server Environment (`server/.env`)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/credit_intelligence
```

### Client Environment (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5001
```

---

## 8. Running the Application

### Step 1: Seed the Database (Initial Setup)
```bash
cd server
npm run seed  # Or: node seed.js
```
*Expected Output*: `Company seeded`, `Financial data seeded`.

### Step 2: Start Backend Server
```bash
cd server
npm start     # Or: node server.js
```
*Expected Output*: `MongoDB connected`, `Server running on port 5001`.

### Step 3: Start Frontend Dev Server
In a new terminal window:
```bash
cd client
npm run dev
```
*Access Application*: Open `http://localhost:5173` in your web browser.

---

## 9. API Endpoints

### 1. `GET /api/credit/dashboard`
- **Purpose**: Fetches company background details, reported 3-year financial history, and baseline risk metrics.
- **Request Parameters**: None.
- **Response Summary**:
  ```json
  {
    "company": {
      "name": "JBM Auto Limited",
      "ticker": "JBMA",
      "exchange": "NSE/BSE",
      "sector": "Auto Components & Ancillaries",
      "loanAmount": 1,
      "loanUnit": "Crore"
    },
    "period": { "previousYear": 2025, "currentYear": 2026 },
    "financials": [ ... ],
    "metrics": { ... },
    "risk": { "score": 77, "riskLevel": "Moderate", "factors": [ ... ] },
    "decision": { "decision": "REVIEW", "confidence": "Medium" }
  }
  ```

### 2. `POST /api/credit/assess`
- **Purpose**: Evaluates a facility-specific credit assessment using submitted loan parameters against consolidated financial data.
- **Request Body**:
  ```json
  {
    "loanAmount": 1,
    "loanUnit": "Crore",
    "loanPurpose": "Working Capital"
  }
  ```
- **Response Summary**:
  ```json
  {
    "company": { "name": "JBM Auto Limited", "ticker": "JBMA" },
    "assessment": { "loanAmount": 1, "loanUnit": "Crore", "loanPurpose": "Working Capital" },
    "score": 65,
    "riskLevel": "Moderate",
    "decision": "APPROVE WITH CONDITIONS",
    "factors": [ ... ],
    "metrics": {
      "revenueGrowth": 11.26,
      "profitGrowth": 10.7,
      "interestCoverage": 2.13,
      "debtToRevenue": 0.31,
      "freeCashFlow": -358,
      "debtorDays": 131
    },
    "period": "FY2024-FY2026",
    "source": {
      "name": "Screener.in",
      "url": "https://www.screener.in/company/JBMA/consolidated/",
      "type": "Secondary structured source",
      "confidence": "Medium"
    }
  }
  ```

---

## 10. Credit Assessment Methodology

The scoring engine evaluates corporate creditworthiness starting from a baseline score of **100 points** and applying deductions based on credit risk thresholds:

### Financial Metrics & Formulas

| Metric | Formula | Scoring Rule / Penalty |
| :--- | :--- | :--- |
| **Revenue Growth** | `((Revenue_t - Revenue_{t-1}) / Revenue_{t-1}) * 100` | Growth > 5%: `0 pts penalty`<br>Growth ≤ 5%: `-15 pts penalty` |
| **Net Profit Growth** | `((Profit_t - Profit_{t-1}) / Profit_{t-1}) * 100` | Growth > 5%: `0 pts penalty`<br>Growth ≤ 5%: `-10 pts penalty` |
| **Interest Coverage** | `Operating Profit / Interest Expense` | Coverage ≥ 3.0x: `0 pts penalty`<br>Coverage 2.0x–3.0x: `-8 pts penalty`<br>Coverage < 2.0x: `-20 pts penalty` |
| **Free Cash Flow** | `Operating Cash Flow - Capex` | FCF ≥ 0: `0 pts penalty`<br>FCF < 0: `-15 pts penalty` |
| **Working Capital** | Collection Period (`Debtor Days`) | Debtor Days ≤ 90d: `0 pts penalty`<br>Debtor Days > 90d: `-12 pts penalty` |
| **Leverage** | `Borrowings / Revenue` | Debt/Revenue ≤ 50%: `0 pts penalty`<br>Debt/Revenue > 50%: `-10 pts penalty` |

### Score Thresholds & Recommendation Engine

$$Score = \max\left(0, \min\left(100, 100 - \sum \text{Penalties}\right)\right)$$

- **Score ≥ 80** $\rightarrow$ **Low Risk** $\rightarrow$ `APPROVE`
- **Score 60 – 79** $\rightarrow$ **Moderate Risk** $\rightarrow$ `APPROVE WITH CONDITIONS`
- **Score < 60** $\rightarrow$ **High Risk** $\rightarrow$ `DECLINE`

---

## 11. Data Source & Provenance

- **Data Source Name**: `Screener.in`
- **Source Type**: Secondary structured public filings
- **Entity Evaluated**: JBM Auto Limited (Consolidated Financial Statements)
- **Financial Period**: FY2024 – FY2026 (3 Reported Financial Years)
- **Source Reference URL**: [https://www.screener.in/company/JBMA/consolidated/](https://www.screener.in/company/JBMA/consolidated/)

---

## 12. Validation & Error Handling

- **Form Input Validation**: Blocks invalid, empty (`""`), negative (`< 0`), or zero (`0`) loan amounts and unselected loan purposes with real-time inline warning banners (`Please enter a valid loan amount greater than ₹0`).
- **State Resiliency**: On API failure or server connection loss, the frontend clears stale assessment state (`setAssessment(null)`) and renders an explicit inline error banner (`Unable to complete assessment. Please try again.`).
- **Empty Dataset State**: Displays an empty state screen if financial data is missing from MongoDB.

---

## 13. Important Assumptions & Limitations

1. **Secondary Data Source**: Assessment relies on reported 3-year consolidated public filings sourced from Screener.in.
2. **Automated Scope**: Qualitative promoter background checks, physical site visits, plant operations, and off-balance-sheet contingent liabilities are not evaluated by this rule-based automated model.
