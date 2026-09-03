const mongoose = require("mongoose");

const financialDataSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },

        year: {
            type: Number,
            required: true,
        },

        revenue: Number,
        operatingProfit: Number,
        interest: Number,
        pbt: Number,
        netProfit: Number,

        borrowings: Number,
        longTermBorrowings: Number,
        shortTermBorrowings: Number,

        tradeReceivables: Number,
        inventory: Number,
        cash: Number,

        operatingCashFlow: Number,
        freeCashFlow: Number,

        debtorDays: Number,
        inventoryDays: Number,
        payableDays: Number,
        cashConversionCycle: Number,
        workingCapitalDays: Number,

        roce: Number,

        // Source/provenance information
        source: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
        // source: { name: String, type: String, url: String, confidence: String,
    },
    {
        timestamps: true,
    }
);

financialDataSchema.index(
    { companyId: 1, year: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "FinancialData",
    financialDataSchema
);