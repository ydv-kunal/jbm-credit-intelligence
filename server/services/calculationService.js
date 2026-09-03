const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;

    return Number((((current - previous) / previous) * 100).toFixed(2));
};

const calculateInterestCoverage = (operatingProfit, interest) => {
    if (!interest || interest === 0) return 0;

    return Number((operatingProfit / interest).toFixed(2));
};

const calculateDebtToProfit = (borrowings, operatingProfit) => {
    if (!operatingProfit || operatingProfit === 0) return 0;

    return Number((borrowings / operatingProfit).toFixed(2));
};

const calculateProfitMargin = (netProfit, revenue) => {
    if (!revenue || revenue === 0) return 0;

    return Number(((netProfit / revenue) * 100).toFixed(2));
};

const calculateOperatingMargin = (operatingProfit, revenue) => {
    if (!revenue || revenue === 0) return 0;

    return Number(((operatingProfit / revenue) * 100).toFixed(2));
};

const calculateMetrics = (current, previous) => {
    return {
        revenueGrowth: calculateGrowth(
            current.revenue,
            previous.revenue
        ),

        profitGrowth: calculateGrowth(
            current.netProfit,
            previous.netProfit
        ),

        operatingProfitGrowth: calculateGrowth(
            current.operatingProfit,
            previous.operatingProfit
        ),

        profitMargin: calculateProfitMargin(
            current.netProfit,
            current.revenue
        ),

        operatingMargin: calculateOperatingMargin(
            current.operatingProfit,
            current.revenue
        ),

        interestCoverage: calculateInterestCoverage(
            current.operatingProfit,
            current.interest
        ),

        debtToOperatingProfit: calculateDebtToProfit(
            current.borrowings,
            current.operatingProfit
        ),

        freeCashFlow: current.freeCashFlow,

        operatingCashFlow: current.operatingCashFlow,

        cashConversionCycle: current.cashConversionCycle,

        debtorDays: current.debtorDays,

        inventoryDays: current.inventoryDays,

        payableDays: current.payableDays,

        roce: current.roce,
    };
};

module.exports = {
    calculateGrowth,
    calculateInterestCoverage,
    calculateDebtToProfit,
    calculateProfitMargin,
    calculateOperatingMargin,
    calculateMetrics,
};