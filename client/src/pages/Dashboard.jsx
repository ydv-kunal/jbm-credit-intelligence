import MetricCard from "../components/MetricCard";
import DecisionCard from "../components/DecisionCard";
import RiskCard from "../components/RiskCard";
import TrendChart from "../components/TrendChart";
import SourceCard from "../components/SourceCard";

const formatCr = (value) =>
    `₹${Number(value).toLocaleString("en-IN")} Cr`;

const Dashboard = ({ data }) => {
    const { company, financials, metrics, risks, decision } = data;

    const current = financials[financials.length - 1];

    return (
        <main className="dashboard">

            <header className="header">
                <div>
                    <p className="eyebrow">CREDIT INTELLIGENCE</p>

                    <h1>{company.name}</h1>

                    <p>
                        NSE: {company.ticker} · Proposed loan ₹1 Crore
                    </p>
                </div>
            </header>

            <DecisionCard decision={decision} />

            <section>
                <h2>Financial Health</h2>

                <div className="metric-grid">
                    <MetricCard
                        title="Revenue"
                        value={formatCr(current.revenue)}
                        subtitle="FY2026"
                    />

                    <MetricCard
                        title="Borrowings"
                        value={formatCr(current.borrowings)}
                        subtitle="FY2026"
                    />

                    <MetricCard
                        title="Operating Cash Flow"
                        value={formatCr(current.operatingCashFlow)}
                        subtitle="FY2026"
                    />

                    <MetricCard
                        title="Net Profit"
                        value={formatCr(current.netProfit)}
                        subtitle="FY2026"
                    />
                </div>
            </section>

            <section>
                <h2>Key Metrics</h2>

                <div className="metric-grid">

                    <MetricCard
                        title="Revenue Growth"
                        value={`${metrics.revenueGrowth}%`}
                    />

                    <MetricCard
                        title="Debt Growth"
                        value={`${metrics.debtGrowth}%`}
                    />

                    <MetricCard
                        title="Interest Coverage"
                        value={`${metrics.interestCoverage}x`}
                    />

                    <MetricCard
                        title="Debtor Days"
                        value={`${current.debtorDays} days`}
                    />

                    <MetricCard
                        title="OCF / PAT"
                        value={`${metrics.ocfToPat}x`}
                    />

                    <MetricCard
                        title="Borrowings / Operating Profit"
                        value={`${metrics.borrowingToOperatingProfit}x`}
                    />

                </div>
            </section>

            <section>
                <h2>Key Signals</h2>

                <div className="risk-list">
                    {risks.map((risk, index) => (
                        <RiskCard
                            key={index}
                            risk={risk}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2>Financial Trends</h2>

                <TrendChart financials={financials} />
            </section>

            <section>
                <h2>Evidence & Sources</h2>

                {financials.map((item) => (
                    <SourceCard
                        key={item.year}
                        financial={item}
                    />
                ))}
            </section>

        </main>
    );
};

export default Dashboard;