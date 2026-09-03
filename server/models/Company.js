const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        ticker: {
            type: String,
            required: true,
        },

        exchange: {
            type: String,
            default: "NSE",
        },

        sector: {
            type: String,
        },

        loanAmount: {
            type: Number,
            default: 1,
        },

        loanUnit: {
            type: String,
            default: "Crore",
        },

        description: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Company", companySchema);