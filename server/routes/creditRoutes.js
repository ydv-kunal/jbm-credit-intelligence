const express = require("express");

const Company = require("../models/Company");
const FinancialData = require("../models/FinancialData");

const {
    calculateMetrics,
} = require("../services/calculationService");

const {
    calculateRisk,
} = require("../services/riskService");

const {
    generateDecision,
} = require("../services/decisionService");

const router = express.Router();

router.get("/dashboard", async (req, res) => {
    try {
        const company = await Company.findOne({
            ticker: "JBMA",
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
            });
        }

        const financialData = await FinancialData.find({
            companyId: company._id,
        }).sort({ year: 1 });

        if (financialData.length < 3) {
            return res.status(400).json({
                message: "Insufficient financial data",
            });
        }

        const previous = financialData[financialData.length - 2];
        const current = financialData[financialData.length - 1];

        const metrics = calculateMetrics(
            current,
            previous
        );

        const risk = calculateRisk(
            current,
            previous
        );

        const decision = generateDecision(risk);

        res.json({
            company: {
                name: company.name,
                ticker: company.ticker,
                exchange: company.exchange,
                sector: company.sector,
                loanAmount: company.loanAmount,
                loanUnit: company.loanUnit,
            },

            period: {
                previousYear: previous.year,
                currentYear: current.year,
            },

            financials: financialData,

            metrics,

            risk,

            decision,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to generate credit assessment",
            error: error.message,
        });
    }
});



router.post("/assess", async (req, res) => {
    try {
        const { loanAmount, loanPurpose } = req.body;

        if (!loanAmount || loanAmount <= 0) {
            return res.status(400).json({
                message: "Valid loan amount is required",
            });
        }

        const company = await Company.findOne({
            ticker: "JBMA",
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
            });
        }

        const financials = await FinancialData.find({
            companyId: company._id,
            year: { $in: [2024, 2025, 2026] },
        }).sort({ year: 1 });

        if (financials.length !== 3) {
            return res.status(400).json({
                message: "Three years of financial data required",
            });
        }

        const latest = financials[financials.length - 1];
        const previous = financials[financials.length - 2];

        const revenueGrowth =
            ((latest.revenue - previous.revenue) /
                previous.revenue) *
            100;

        const profitGrowth =
            ((latest.netProfit - previous.netProfit) /
                previous.netProfit) *
            100;

        const interestCoverage =
            latest.operatingProfit / latest.interest;

        const debtToRevenue =
            latest.borrowings / latest.revenue;

        let score = 100;

        const factors = [];

        // Revenue growth
        if (revenueGrowth > 5) {
            factors.push({
                factor: "Revenue Growth",
                status: "Positive",
                message: `Revenue grew ${revenueGrowth.toFixed(
                    1
                )}% year-over-year.`,
                value: `+${revenueGrowth.toFixed(1)}% YoY`,
                whyItMatters: "Strong revenue expansion demonstrates growing market demand and top-line capacity to absorb new debt obligations.",
            });
        } else {
            score -= 15;

            factors.push({
                factor: "Revenue Growth",
                status: "Risk",
                message: `Revenue growth is only ${revenueGrowth.toFixed(
                    1
                )}%.`,
                value: `${revenueGrowth.toFixed(1)}% YoY`,
                whyItMatters: "Declining or slow revenue growth signals potential market contraction or operational pressure, increasing credit risk.",
            });
        }

        // Profit growth
        if (profitGrowth > 5) {
            factors.push({
                factor: "Profit Growth",
                status: "Positive",
                message: `Net profit increased ${profitGrowth.toFixed(
                    1
                )}% year-over-year.`,
                value: `+${profitGrowth.toFixed(1)}% YoY`,
                whyItMatters: "Sustained profit growth strengthens internal capital generation and long-term debt repayment capacity.",
            });
        } else {
            score -= 10;

            factors.push({
                factor: "Profit Growth",
                status: "Risk",
                message: `Net profit growth is ${profitGrowth.toFixed(
                    1
                )}%.`,
                value: `${profitGrowth.toFixed(1)}% YoY`,
                whyItMatters: "Weak net profit growth reduces earnings buffers required to cushion against operational shocks.",
            });
        }

        // Interest coverage
        if (interestCoverage >= 3) {
            factors.push({
                factor: "Interest Coverage",
                status: "Positive",
                message: `${interestCoverage.toFixed(
                    2
                )}x interest coverage indicates comfortable debt servicing.`,
                value: `${interestCoverage.toFixed(2)}x Coverage`,
                whyItMatters: "Comfortable interest coverage (≥3.0x) indicates low risk of default on regular interest obligations.",
            });
        } else if (interestCoverage >= 2) {
            score -= 8;

            factors.push({
                factor: "Interest Coverage",
                status: "Moderate",
                message: `${interestCoverage.toFixed(
                    2
                )}x interest coverage provides limited headroom.`,
                value: `${interestCoverage.toFixed(2)}x Coverage`,
                whyItMatters: "Moderate interest coverage (2.0x–3.0x) offers adequate but tight headroom for servicing borrowing costs.",
            });
        } else {
            score -= 20;

            factors.push({
                factor: "Interest Coverage",
                status: "Risk",
                message: `${interestCoverage.toFixed(
                    2
                )}x interest coverage indicates higher debt-servicing pressure.`,
                value: `${interestCoverage.toFixed(2)}x Coverage`,
                whyItMatters: "Low interest coverage (<2.0x) highlights vulnerability to interest rate increases or earnings volatility.",
            });
        }

        // Free cash flow
        if (latest.freeCashFlow >= 0) {
            factors.push({
                factor: "Free Cash Flow",
                status: "Positive",
                message: `Free cash flow is ₹${latest.freeCashFlow} Cr.`,
                value: `₹${latest.freeCashFlow} Cr`,
                whyItMatters: "Positive free cash flow ensures organic cash generation for debt principal reduction without relying on refinancing.",
            });
        } else {
            score -= 15;

            factors.push({
                factor: "Free Cash Flow",
                status: "Risk",
                message: `Free cash flow is negative at ₹${latest.freeCashFlow} Cr.`,
                value: `₹${latest.freeCashFlow} Cr`,
                whyItMatters: "Negative free cash flow indicates capital expenditure exceeds cash generation, increasing reliance on external credit.",
            });
        }

        // Debtor days
        if (latest.debtorDays > 90) {
            score -= 12;

            factors.push({
                factor: "Working Capital",
                status: "Risk",
                message: `Debtor days increased to ${latest.debtorDays} days, indicating slower collections.`,
                value: `${latest.debtorDays} Debtor Days`,
                whyItMatters: "Extended collection periods (>90 days) tie up working capital liquidity and elevate customer credit risk.",
            });
        } else {
            factors.push({
                factor: "Working Capital",
                status: "Positive",
                message: `Debtor days are ${latest.debtorDays} days.`,
                value: `${latest.debtorDays} Debtor Days`,
                whyItMatters: "Efficient receivables collection (≤90 days) supports healthy working capital turnover.",
            });
        }

        // Debt
        if (debtToRevenue > 0.5) {
            score -= 10;

            factors.push({
                factor: "Borrowings",
                status: "Risk",
                message: `Borrowings are approximately ${(debtToRevenue * 100).toFixed(
                    1
                )}% of annual revenue.`,
                value: `${(debtToRevenue * 100).toFixed(1)}% Debt/Rev`,
                whyItMatters: "High debt-to-revenue ratio (>50%) indicates structural leverage that could strain debt service capacity.",
            });
        }

        score = Math.max(0, Math.min(100, score));

        let decision;

        if (score >= 80) {
            decision = "APPROVE";
        } else if (score >= 60) {
            decision = "APPROVE WITH CONDITIONS";
        } else {
            decision = "DECLINE";
        }

        const riskLevel =
            score >= 80
                ? "Low"
                : score >= 60
                    ? "Moderate"
                    : "High";

        res.json({
            company: {
                name: company.name,
                ticker: company.ticker,
                exchange: company.exchange,
                sector: company.sector,
            },

            assessment: {
                loanAmount,
                loanUnit: "Crore",
                loanPurpose,
            },

            score,

            riskLevel,

            decision,

            factors,

            metrics: {
                revenueGrowth: Number(revenueGrowth.toFixed(2)),
                profitGrowth: Number(profitGrowth.toFixed(2)),
                interestCoverage: Number(
                    interestCoverage.toFixed(2)
                ),
                debtToRevenue: Number(
                    debtToRevenue.toFixed(2)
                ),
                freeCashFlow: latest.freeCashFlow,
                debtorDays: latest.debtorDays,
            },

            period: "FY2024-FY2026",

            source: {
                name: "Screener.in",
                url: "https://www.screener.in/company/JBMA/consolidated/",
                type: "Secondary structured source",
                confidence: "Medium",
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Credit assessment failed",
        });
    }
});

module.exports = router;
