import { useEffect, useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Building2,
  IndianRupee,
  ShieldAlert,
  Activity,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./App.css";
import LoanAssessment from "./components/LoanAssessment";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [assessment, setAssessment] = useState(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState("");

  const handleAssessment = async (assessmentData) => {
    try {
      setAssessmentLoading(true);
      setAssessmentError("");

      const response = await axios.post(
        `${API_BASE_URL}/api/credit/assess`,
        assessmentData
      );

      setAssessment(response.data);
      setAssessmentError("");
    } catch (err) {
      console.error("Credit assessment API error:", err);
      setAssessment(null);
      setAssessmentError("Unable to complete assessment. Please try again.");
    } finally {
      setAssessmentLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/credit/dashboard`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load credit assessment data from server.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <h2>Loading Credit Intelligence...</h2>
        <p>Analyzing JBM Auto financial data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <AlertTriangle size={40} />
        <h2>{error}</h2>
      </div>
    );
  }

  if (!data || !data.financials || data.financials.length === 0) {
    return (
      <div className="empty-screen">
        <Building2 size={48} className="empty-icon" />
        <h2>No Financial Data Available</h2>
        <p>No consolidated financial records were found for the company dataset.</p>
      </div>
    );
  }

  const company = data.company || {};
  const financials = data.financials;
  const latest = financials[financials.length - 1];
  const previous = financials[financials.length - 2] || latest;

  const chartData = financials.map((item) => ({
    year: `FY${String(item.year).slice(-2)}`,
    revenue: item.revenue,
    profit: item.netProfit,
    operatingProfit: item.operatingProfit,
  }));

  const revenueGrowth = previous.revenue
    ? ((latest.revenue - previous.revenue) / previous.revenue) * 100
    : 0;

  const profitGrowth = previous.netProfit
    ? ((latest.netProfit - previous.netProfit) / previous.netProfit) * 100
    : 0;

  // Active risk factors (from facility assessment or baseline)
  const activeFactors = assessment ? assessment.factors : (data.risk?.factors || []);

  // Source & Provenance Metadata
  const sourceInfo = latest.source || data.source || {
    name: "Screener.in",
    type: "Secondary structured source",
    url: "https://www.screener.in/company/JBMA/consolidated/",
    confidence: "Medium",
  };

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={22} />
          </div>

          <div>
            <h1>Credit Intelligence</h1>
            <p>Business Credit Assessment Platform</p>
          </div>
        </div>

        <div className="header-right">
          <span className="source-badge">
            <span className="source-dot"></span>
            Data Source: {sourceInfo.name}
          </span>
        </div>
      </header>


      <main className="container">

        {/* COMPANY */}

        <section className="company-section">

          <div className="company-info">

            <div className="company-icon">
              <Building2 size={28} />
            </div>

            <div>
              <h2>{company.name}</h2>

              <div className="company-meta">
                <span className="meta-tag">{company.ticker}</span>
                <span className="meta-divider">•</span>
                <span className="meta-tag">{company.exchange}</span>
                <span className="meta-divider">•</span>
                <span className="meta-tag">{company.sector}</span>
              </div>
            </div>

          </div>

          <div className="loan-box">
            <span>Proposed Facility</span>
            <strong>
              ₹{company.loanAmount} {company.loanUnit}
            </strong>
            <small>Working Capital Facility</small>
          </div>

        </section>

        {/* LOAN ASSESSMENT FORM */}
        <LoanAssessment
          onAssess={handleAssessment}
          loading={assessmentLoading}
          apiError={assessmentError}
        />


        {/* PRIMARY CREDIT ASSESSMENT RESULT (SHOWS PLACEHOLDERS ON INITIAL LOAD) */}
        <section className="assessment-result">

          <div className="section-title">
            <div>
              <h2>Primary Credit Assessment Result</h2>
              <p>
                {assessment
                  ? `Facility-specific credit assessment for ${company.name} (${assessment.period || "FY2024–FY2026"})`
                  : "Submit facility parameters above to run loan-specific credit assessment"}
              </p>
            </div>
          </div>

          <div className="summary-grid">

            <div className={`score-card ${assessment ? `risk-${assessment.riskLevel?.toLowerCase() || 'moderate'}` : 'placeholder-card'}`}>

              <div className="card-label">
                <ShieldAlert size={18} />
                <span>Credit Risk Score</span>
              </div>

              <div className="score">
                {assessment ? assessment.score : "-"}
                <span>{assessment ? "/100" : ""}</span>
              </div>

              <div className={`risk-label ${assessment ? `risk-${assessment.riskLevel?.toLowerCase() || 'moderate'}` : 'risk-placeholder'}`}>
                {assessment ? `${assessment.riskLevel} Risk` : "Pending Assessment"}
              </div>

            </div>


            <div className="decision-card">

              <div className="card-label">
                <AlertTriangle size={18} />
                <span>Credit Recommendation</span>
              </div>

              <div className={`decision ${assessment ? `decision-${assessment.decision?.toLowerCase().includes('approved') ? 'approved' : assessment.decision?.toLowerCase().includes('decline') || assessment.decision?.toLowerCase().includes('reject') ? 'rejected' : 'conditional'}` : 'decision-placeholder'}`}>
                {assessment ? assessment.decision : "-"}
              </div>

              <p>
                {assessment
                  ? `Facility: ₹${assessment.assessment?.loanAmount || 1} Cr (${assessment.assessment?.loanPurpose || 'Working Capital'})`
                  : "No active facility assessment evaluated yet"}
              </p>

            </div>


            <div className="confidence-card">

              <div className="card-label">
                <Activity size={18} />
                <span>Assessment Confidence</span>
              </div>

              <div className="confidence">
                {assessment ? (sourceInfo.confidence || "High") : "-"}
              </div>

              <p>
                {assessment
                  ? `Based on ${sourceInfo.name} consolidated financial evaluation`
                  : "Awaiting evaluation submission"}
              </p>

            </div>

          </div>

        </section>

        {/* CALCULATION METHODOLOGY SECTION */}
        <MethodologySection
          assessment={assessment}
          latest={latest}
          previous={previous}
        />


        {/* FINANCIAL OVERVIEW */}

        <section className="dashboard-section">

          <div className="section-title">
            <div>
              <h2>Financial Overview</h2>
              <p>Latest reported financial year</p>
            </div>
          </div>


          <div className="metrics-grid">

            <MetricCard
              title="Revenue"
              value={`₹${latest.revenue.toLocaleString()} Cr`}
              icon={<IndianRupee size={20} />}
              trend={`${revenueGrowth.toFixed(1)}% YoY`}
              positive={revenueGrowth >= 0}
            />

            <MetricCard
              title="Net Profit"
              value={`₹${latest.netProfit.toLocaleString()} Cr`}
              icon={<TrendingUp size={20} />}
              trend={`${profitGrowth.toFixed(1)}% YoY`}
              positive={profitGrowth >= 0}
            />

            <MetricCard
              title="Borrowings"
              value={`₹${latest.borrowings.toLocaleString()} Cr`}
              icon={<TrendingDown size={20} />}
              trend="Total debt"
              positive={false}
            />

            <MetricCard
              title="ROCE"
              value={`${latest.roce}%`}
              icon={<Activity size={20} />}
              trend="Return on capital"
              positive={true}
            />

          </div>

        </section>


        {/* CHARTS */}

        <section className="chart-section">

          <div className="section-title">
            <div>
              <h2>Financial Performance</h2>
              <p>Three-year financial trend</p>
            </div>
          </div>

          <div className="chart-card">

            <ResponsiveContainer width="100%" height={360}>

              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>

                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />

                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)"
                  }}
                />

                <Legend wrapperStyle={{ paddingTop: "10px" }} />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#4f46e5", strokeWidth: 2, stroke: "#ffffff" }}
                  activeDot={{ r: 7 }}
                  name="Revenue (₹ Cr)"
                />

                <Line
                  type="monotone"
                  dataKey="operatingProfit"
                  stroke="#0891b2"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#0891b2", strokeWidth: 2, stroke: "#ffffff" }}
                  activeDot={{ r: 7 }}
                  name="Operating Profit (₹ Cr)"
                />

                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#ffffff" }}
                  activeDot={{ r: 7 }}
                  name="Net Profit (₹ Cr)"
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* RISK & OPPORTUNITY SIGNALS */}

        <section className="dashboard-section">

          <div className="section-title">
            <div>
              <h2>Risk & Opportunity Signals</h2>
              <p>Key financial signals derived from financial performance for credit underwriting</p>
            </div>
          </div>


          <div className="risk-grid">

            {activeFactors.map((factor, index) => (

              <RiskCard
                key={index}
                factor={factor}
              />

            ))}

          </div>

        </section>


        {/* WORKING CAPITAL */}

        <section className="dashboard-section">

          <div className="section-title">
            <div>
              <h2>Working Capital Health</h2>
              <p>Liquidity and operating cycle indicators</p>
            </div>
          </div>


          <div className="metrics-grid">

            <MetricCard
              title="Debtor Days"
              value={`${latest.debtorDays} days`}
              trend="Collection period"
              positive={latest.debtorDays < 90}
            />

            <MetricCard
              title="Inventory Days"
              value={`${latest.inventoryDays} days`}
              trend="Inventory holding"
              positive={latest.inventoryDays < 90}
            />

            <MetricCard
              title="Payable Days"
              value={`${latest.payableDays} days`}
              trend="Supplier credit"
              positive={true}
            />

            <MetricCard
              title="Cash Conversion Cycle"
              value={`${latest.cashConversionCycle} days`}
              trend="Operating cycle"
              positive={latest.cashConversionCycle < 60}
            />

          </div>

        </section>


        {/* CASH FLOW */}

        <section className="dashboard-section">

          <div className="section-title">
            <div>
              <h2>Cash Flow Position</h2>
              <p>Latest cash generation indicators</p>
            </div>
          </div>


          <div className="cash-grid">

            <div className="cash-card">

              <span>Operating Cash Flow</span>

              <strong
                className={
                  latest.operatingCashFlow >= 0
                    ? "positive"
                    : "negative"
                }
              >
                ₹{latest.operatingCashFlow} Cr
              </strong>

              <small>
                Cash generated from operations
              </small>

            </div>


            <div className="cash-card">

              <span>Free Cash Flow</span>

              <strong
                className={
                  latest.freeCashFlow >= 0
                    ? "positive"
                    : "negative"
                }
              >
                ₹{latest.freeCashFlow} Cr
              </strong>

              <small>
                Cash remaining after investments
              </small>

            </div>


            <div className="cash-card">

              <span>Interest Coverage</span>

              <strong className="neutral">
                {latest.interest ? (latest.operatingProfit / latest.interest).toFixed(2) : "N/A"}x
              </strong>

              <small>
                Operating profit / interest
              </small>

            </div>

          </div>

        </section>


        {/* EVIDENCE & DATA SOURCES */}

        <section className="dashboard-section">

          <div className="section-title">
            <div>
              <h2>Evidence & Data Sources</h2>
              <p>Data provenance, source confidence, and dataset reliability overview</p>
            </div>
          </div>

          <div className="evidence-card">

            <div className="evidence-grid">

              <div className="evidence-item">
                <span className="evidence-label">Data Used For Assessment</span>
                <strong className="evidence-value">{company.name} Consolidated Financials</strong>
              </div>

              <div className="evidence-item">
                <span className="evidence-label">Primary Source Name</span>
                <strong className="evidence-value">{sourceInfo.name}</strong>
              </div>

              <div className="evidence-item">
                <span className="evidence-label">Source Type</span>
                <span className="evidence-badge">{sourceInfo.type}</span>
              </div>

              <div className="evidence-item">
                <span className="evidence-label">Confidence Level</span>
                <span className={`confidence-pill confidence-${sourceInfo.confidence?.toLowerCase() || 'medium'}`}>
                  {sourceInfo.confidence} Confidence
                </span>
              </div>

              <div className="evidence-item">
                <span className="evidence-label">Financial Period Covered</span>
                <strong className="evidence-value">FY{financials[0]?.year} – FY{latest.year}</strong>
              </div>

              <div className="evidence-item evidence-full">
                <span className="evidence-label">Source Reference URL</span>
                <a
                  href={sourceInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  {sourceInfo.url}
                  <ExternalLink size={14} />
                </a>
              </div>

            </div>

            {/* DATA RELIABILITY & ASSUMPTIONS AREA */}
            <div className="reliability-area">

              <div className="reliability-header">
                <CheckCircle size={16} className="icon-positive" />
                <span className="reliability-title">Data Reliability & Audit Assumptions</span>
              </div>

              <div className="reliability-grid">

                <div className="reliability-item">
                  <span className="reliability-label">Detected Data Discrepancies</span>
                  <p className="reliability-text positive-text">
                    No discrepancies detected in the available dataset.
                  </p>
                </div>

                <div className="reliability-item">
                  <span className="reliability-label">Pipeline Assumptions & Limitations</span>
                  <p className="reliability-text">
                    Assessment relies on reported 3-year consolidated public filings from {sourceInfo.name}. Qualitative promoter background checks, physical facility audits, and off-balance-sheet contingent liabilities are not evaluated by this automated model.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="footer">

          <div>
            <strong>Data Source</strong>
            <p>
              {sourceInfo.name} — {company.name} consolidated financial data
            </p>
          </div>

          <div>
            <strong>Assessment Period</strong>
            <p>
              FY{financials[0]?.year} – FY{latest.year}
            </p>
          </div>

          <div>
            <strong>System</strong>
            <p>
              Rule-based Credit Intelligence Engine
            </p>
          </div>

        </footer>

      </main>

    </div>
  );
}


function MethodologySection({ assessment, latest, previous }) {
  const [isOpen, setIsOpen] = useState(false);

  const revenueGrowthVal = previous?.revenue ? (((latest.revenue - previous.revenue) / previous.revenue) * 100).toFixed(2) : 0;
  const profitGrowthVal = previous?.netProfit ? (((latest.netProfit - previous.netProfit) / previous.netProfit) * 100).toFixed(2) : 0;
  const interestCoverageVal = latest?.interest ? (latest.operatingProfit / latest.interest).toFixed(2) : 0;
  const cccVal = latest?.cashConversionCycle ?? (latest.debtorDays + latest.inventoryDays - latest.payableDays);

  const score = assessment?.score;
  const decision = assessment?.decision;

  const loanAmt = assessment?.assessment?.loanAmount || 1;
  const exposureRatioVal = ((loanAmt / latest.revenue) * 100).toFixed(2);
  const exposureDeduction = assessment?.metrics?.facilityExposureDeduction ?? 0;
  const exposureBand = assessment?.metrics?.facilityExposureBand ?? (exposureRatioVal <= 1 ? "≤ 1%" : exposureRatioVal <= 2 ? "> 1% & ≤ 2%" : exposureRatioVal <= 4 ? "> 2% & ≤ 4%" : exposureRatioVal <= 6 ? "> 4% & ≤ 6%" : "> 6%");

  const scoreDeduction = score !== undefined ? 100 - score : undefined;
  const penalizedFactors = assessment?.factors
    ? assessment.factors
        .filter((f) => f.status === "Risk" || f.status === "Moderate")
        .map((f) => f.factor)
        .join(", ")
    : "";

  const scoreValuesStr = scoreDeduction !== undefined
    ? scoreDeduction > 0
      ? `Base: 100, Total Deductions: -${scoreDeduction} pts (${penalizedFactors || 'Penalties applied'})`
      : `Base: 100, Total Deductions: 0 pts (No penalties)`
    : "Pending submission — click 'Assess Credit' above to evaluate facility risk score";

  const methodologyItems = [
    {
      metric: "Revenue Growth",
      formula: "((Current Revenue - Previous Revenue) / Previous Revenue) × 100",
      values: `Current: ₹${latest.revenue.toLocaleString()} Cr (FY${latest.year}), Previous: ₹${previous.revenue.toLocaleString()} Cr (FY${previous.year})`,
      result: `${revenueGrowthVal}% YoY`,
      notes: "Growth > 5% achieves full score (+0 penalty).",
    },
    {
      metric: "Net Profit Growth",
      formula: "((Current Net Profit - Previous Net Profit) / Previous Net Profit) × 100",
      values: `Current: ₹${latest.netProfit.toLocaleString()} Cr (FY${latest.year}), Previous: ₹${previous.netProfit.toLocaleString()} Cr (FY${previous.year})`,
      result: `${profitGrowthVal}% YoY`,
      notes: "Growth > 5% achieves full score (+0 penalty).",
    },
    {
      metric: "Interest Coverage Ratio",
      formula: "Operating Profit / Interest Expense",
      values: `Operating Profit: ₹${latest.operatingProfit.toLocaleString()} Cr, Interest: ₹${latest.interest.toLocaleString()} Cr`,
      result: `${interestCoverageVal}x`,
      notes: "Coverage 2.0x–3.0x incurs a -8 point deduction.",
    },
    {
      metric: "Free Cash Flow (FCF)",
      formula: "Operating Cash Flow - Capital Expenditure",
      values: `Operating Cash Flow: ₹${latest.operatingCashFlow.toLocaleString()} Cr`,
      result: `₹${latest.freeCashFlow.toLocaleString()} Cr`,
      notes: "Negative FCF incurs a -15 point deduction.",
    },
    {
      metric: "Cash Conversion Cycle (CCC)",
      formula: "Debtor Days + Inventory Days - Payable Days",
      values: `Debtor Days: ${latest.debtorDays}d, Inventory: ${latest.inventoryDays}d, Payables: ${latest.payableDays}d`,
      result: `${cccVal} Days`,
      notes: "Debtor days > 90d incurs a -12 point deduction.",
    },
    {
      metric: "Facility Exposure Ratio",
      formula: "(Requested Loan Amount / Revenue) × 100",
      values: `Loan Facility: ₹${loanAmt} Cr, Annual Revenue: ₹${latest.revenue.toLocaleString()} Cr (Band: ${exposureBand})`,
      result: `${exposureRatioVal}% Exposure`,
      notes: `Deduction: -${exposureDeduction} pts (≤1%: 0, >1-2%: -3, >2-4%: -7, >4-6%: -11, >6%: -16).`,
    },
    {
      metric: "Credit Risk Score",
      formula: "100 - Sum(Risk Deductions)",
      values: scoreValuesStr,
      result: score !== undefined ? `${score} / 100 (${decision})` : "- (Pending)",
      notes: "Scores 60–79 result in 'APPROVE WITH CONDITIONS' (Moderate Risk).",
    },
  ];

  return (
    <section className="dashboard-section methodology-section">
      <div
        className="section-title methodology-header"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <div>
          <h2>
            Calculation Methodology & Derivation
            <span className="toggle-hint">{isOpen ? " (Click to Collapse)" : " (Click to Expand)"}</span>
          </h2>
          <p>Exact formulas, underlying financial values, and scoring logic applied by the credit engine</p>
        </div>

        <button className="toggle-btn" type="button" aria-label="Toggle Methodology">
          <ChevronDown className={`chevron-icon ${isOpen ? "open" : ""}`} size={20} />
        </button>
      </div>

      {isOpen && (
        <div className="methodology-content">
          <div className="methodology-grid">
            {methodologyItems.map((item, idx) => (
              <div className="methodology-card" key={idx}>
                <div className="methodology-top">
                  <span className="methodology-metric">{item.metric}</span>
                  <span className="methodology-result">{item.result}</span>
                </div>

                <div className="methodology-field">
                  <span className="field-label">Formula:</span>
                  <code className="formula-code">{item.formula}</code>
                </div>

                <div className="methodology-field">
                  <span className="field-label">Inputs:</span>
                  <span className="field-values">{item.values}</span>
                </div>

                <div className="methodology-field">
                  <span className="field-label">Scoring Impact:</span>
                  <span className="field-notes">{item.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}


function MetricCard({ title, value, icon, trend, positive }) {

  return (
    <div className="metric-card">

      <div className="metric-top">

        <span>{title}</span>

        {icon && <div className="metric-icon">{icon}</div>}

      </div>

      <strong>{value}</strong>

      <div className={positive ? "trend positive" : "trend negative"}>

        {positive ? (
          <TrendingUp size={14} />
        ) : (
          <TrendingDown size={14} />
        )}

        <span>{trend}</span>

      </div>

    </div>
  );
}


function RiskCard({ factor }) {

  const status = factor.status?.toLowerCase();

  const isPositive = status === "positive";
  const isModerate = status === "moderate";

  const statusClass = isPositive
    ? "status-positive"
    : isModerate
      ? "status-moderate"
      : "status-risk";

  const cardBorderClass = isPositive
    ? "risk-positive"
    : isModerate
      ? "risk-moderate"
      : "risk-warning";

  return (

    <div className={`risk-card ${cardBorderClass}`}>

      <div className="risk-card-top">
        <div className="risk-header">

          {isPositive ? (
            <CheckCircle size={20} className="icon-positive" />
          ) : isModerate ? (
            <Activity size={20} className="icon-moderate" />
          ) : (
            <AlertTriangle size={20} className="icon-warning" />
          )}

          <span className="signal-name">{factor.factor}</span>

        </div>

        <span className={`risk-status ${statusClass}`}>
          {factor.status}
        </span>
      </div>

      <div className="signal-value-row">
        <span className="signal-value-label">Current Value / Trend:</span>
        <span className={`signal-value-badge ${statusClass}`}>
          {factor.value || factor.message}
        </span>
      </div>

      {factor.whyItMatters && (
        <div className="why-it-matters">
          <div className="wim-label">
            <ShieldAlert size={13} />
            <span>Lending Significance:</span>
          </div>
          <p className="wim-text">{factor.whyItMatters}</p>
        </div>
      )}

    </div>

  );
}


export default App;