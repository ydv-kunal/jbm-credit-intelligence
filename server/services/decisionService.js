const generateDecision = (risk) => {
    if (risk.score >= 80) {
        return {
            decision: "APPROVE",
            confidence: "High",
            reason:
                "Financial performance, profitability, cash generation and repayment capacity indicate acceptable credit risk.",
        };
    }

    if (risk.score >= 60) {
        return {
            decision: "REVIEW",
            confidence: "Medium",
            reason:
                "The company demonstrates reasonable financial strength, but some risk factors require additional review.",
        };
    }

    return {
        decision: "DECLINE",
        confidence: "High",
        reason:
            "Financial and cash-flow indicators suggest elevated credit risk.",
    };
};

module.exports = {
    generateDecision,
};