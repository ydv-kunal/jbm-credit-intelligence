const calculateRisk = (current, previous) => {
    let score = 0;

    const factors = [];

    // 1. Revenue growth
    const revenueGrowth =
        ((current.revenue - previous.revenue) / previous.revenue) * 100;

    if (revenueGrowth > 10) {
        score += 20;
        factors.push({
            factor: "Revenue Growth",
            status: "Positive",
            message: `Revenue grew by ${revenueGrowth.toFixed(1)}%`,
            value: `+${revenueGrowth.toFixed(1)}% YoY`,
            whyItMatters: "Strong revenue expansion demonstrates growing market demand and top-line capacity to absorb new debt obligations.",
        });
    } else if (revenueGrowth > 0) {
        score += 12;
        factors.push({
            factor: "Revenue Growth",
            status: "Moderate",
            message: `Revenue grew by ${revenueGrowth.toFixed(1)}%`,
            value: `+${revenueGrowth.toFixed(1)}% YoY`,
            whyItMatters: "Moderate top-line growth provides steady cash flow support, though expansion rate is modest.",
        });
    } else {
        score += 5;
        factors.push({
            factor: "Revenue Growth",
            status: "Negative",
            message: "Revenue declined",
            value: `${revenueGrowth.toFixed(1)}% YoY`,
            whyItMatters: "Declining revenue signals potential market contraction or operational pressure, increasing credit risk.",
        });
    }

    // 2. Profitability
    const netProfitChange = current.netProfit - previous.netProfit;
    const profitGrowthPct = previous.netProfit !== 0 
        ? ((netProfitChange / Math.abs(previous.netProfit)) * 100).toFixed(1) 
        : "N/A";

    if (current.netProfit > previous.netProfit) {
        score += 20;

        factors.push({
            factor: "Profitability",
            status: "Positive",
            message: "Net profit increased year-over-year",
            value: `₹${current.netProfit} Cr (+${profitGrowthPct}%)`,
            whyItMatters: "Sustained net profit growth strengthens internal capital generation and debt repayment capacity.",
        });
    } else {
        score += 5;

        factors.push({
            factor: "Profitability",
            status: "Negative",
            message: "Net profit declined year-over-year",
            value: `₹${current.netProfit} Cr (${profitGrowthPct}%)`,
            whyItMatters: "Declining net profitability reduces earnings buffers required to cushion against unexpected operational shocks.",
        });
    }

    // 3. Interest coverage
    const interestCoverage =
        current.operatingProfit / current.interest;

    if (interestCoverage >= 3) {
        score += 20;

        factors.push({
            factor: "Interest Coverage",
            status: "Positive",
            message: `${interestCoverage.toFixed(2)}x interest coverage`,
            value: `${interestCoverage.toFixed(2)}x Coverage`,
            whyItMatters: "Comfortable interest coverage (≥3.0x) indicates low risk of default on regular interest obligations.",
        });
    } else if (interestCoverage >= 2) {
        score += 12;

        factors.push({
            factor: "Interest Coverage",
            status: "Moderate",
            message: `${interestCoverage.toFixed(2)}x interest coverage`,
            value: `${interestCoverage.toFixed(2)}x Coverage`,
            whyItMatters: "Moderate interest coverage (2.0x–3.0x) offers adequate but tight headroom for servicing borrowing costs.",
        });
    } else {
        score += 5;

        factors.push({
            factor: "Interest Coverage",
            status: "Risk",
            message: `${interestCoverage.toFixed(2)}x interest coverage`,
            value: `${interestCoverage.toFixed(2)}x Coverage`,
            whyItMatters: "Low interest coverage (<2.0x) highlights vulnerability to interest rate increases or earnings volatility.",
        });
    }

    // 4. Free cash flow
    if (current.freeCashFlow > 0) {
        score += 20;

        factors.push({
            factor: "Free Cash Flow",
            status: "Positive",
            message: "Company generated positive free cash flow",
            value: `₹${current.freeCashFlow} Cr`,
            whyItMatters: "Positive free cash flow ensures organic cash generation for debt principal reduction without relying on refinancing.",
        });
    } else {
        score += 5;

        factors.push({
            factor: "Free Cash Flow",
            status: "Risk",
            message: "Company reported negative free cash flow",
            value: `₹${current.freeCashFlow} Cr`,
            whyItMatters: "Negative free cash flow indicates capital expenditure exceeds cash generation, increasing reliance on external credit.",
        });
    }

    // 5. Working capital
    if (current.cashConversionCycle <= 30) {
        score += 20;

        factors.push({
            factor: "Working Capital",
            status: "Positive",
            message: `Cash conversion cycle is ${current.cashConversionCycle} days`,
            value: `${current.cashConversionCycle} Days Cycle`,
            whyItMatters: "Efficient working capital cycle (≤30 days) minimizes capital lock-up and enhances short-term liquidity.",
        });
    } else {
        score += 10;

        factors.push({
            factor: "Working Capital",
            status: "Moderate",
            message: `Cash conversion cycle is ${current.cashConversionCycle} days`,
            value: `${current.cashConversionCycle} Days Cycle`,
            whyItMatters: "Extended working capital cycle (>30 days) ties up liquidity in inventory and receivables, requiring working capital funding.",
        });
    }

    let riskLevel;

    if (score >= 80) {
        riskLevel = "Low";
    } else if (score >= 60) {
        riskLevel = "Moderate";
    } else {
        riskLevel = "High";
    }

    return {
        score,
        riskLevel,
        factors,
    };
};

module.exports = {
    calculateRisk,
};