require("dotenv").config();

const connectDB = require("./config/db");

const Company = require("./models/Company");
const FinancialData = require("./models/FinancialData");

const seed = async () => {
    await connectDB();

    await Company.deleteMany({});
    await FinancialData.deleteMany({});

    const company = await Company.create({
        name: "JBM Auto Limited",
        ticker: "JBMA",
        exchange: "NSE",
        sector: "Automobile",
        loanAmount: 1,
        loanUnit: "Crore",
        description:
            "Credit assessment for a proposed ₹1 crore working-capital loan.",
    });

    const source = {
        name: "Screener.in",
        type: "Secondary structured source",
        url: "https://www.screener.in/company/JBMA/consolidated/",
        confidence: "Medium",
    };

    await FinancialData.insertMany([
        {
            companyId: company._id,
            year: 2024,

            revenue: 5009,
            operatingProfit: 584,
            interest: 197,
            pbt: 246,
            netProfit: 194,

            borrowings: 2127,
            longTermBorrowings: 674,
            shortTermBorrowings: 1427,

            tradeReceivables: 670,
            inventory: 744,
            cash: 67,

            operatingCashFlow: 205,
            freeCashFlow: -19,

            debtorDays: 49,
            inventoryDays: 76,
            payableDays: 113,
            cashConversionCycle: 12,
            workingCapitalDays: -19,

            roce: 14,

            source,
        },

        {
            companyId: company._id,
            year: 2025,

            revenue: 5472,
            operatingProfit: 642,
            interest: 247,
            pbt: 273,
            netProfit: 215,

            borrowings: 2505,
            longTermBorrowings: 1199,
            shortTermBorrowings: 1282,

            tradeReceivables: 1007,
            inventory: 610,
            cash: 194,

            operatingCashFlow: 394,
            freeCashFlow: 281,

            debtorDays: 67,
            inventoryDays: 60,
            payableDays: 127,
            cashConversionCycle: 0,
            workingCapitalDays: 1,

            roce: 14,

            source,
        },

        {
            companyId: company._id,
            year: 2026,

            revenue: 6088,
            operatingProfit: 676,
            interest: 318,
            pbt: 310,
            netProfit: 238,

            borrowings: 3029,
            longTermBorrowings: 937,
            shortTermBorrowings: 2070,

            tradeReceivables: 2185,
            inventory: 518,
            cash: 130,

            operatingCashFlow: -60,
            freeCashFlow: -358,

            debtorDays: 131,
            inventoryDays: 46,
            payableDays: 150,
            cashConversionCycle: 26,
            workingCapitalDays: 21,

            roce: 15,

            source,
        },
    ]);

    console.log("JBM Auto data seeded successfully");

    process.exit();
};

seed();