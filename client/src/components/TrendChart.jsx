import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const TrendChart = ({ financials }) => {
    const data = financials.map((item) => ({
        year: `FY${String(item.year).slice(-2)}`,
        revenue: item.revenue,
        borrowings: item.borrowings,
        operatingCashFlow: item.operatingCashFlow,
    }));

    return (
        <div className="chart-card">

            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="year" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                    />

                    <Line
                        type="monotone"
                        dataKey="borrowings"
                        name="Borrowings"
                    />

                    <Line
                        type="monotone"
                        dataKey="operatingCashFlow"
                        name="Operating Cash Flow"
                    />

                </LineChart>
            </ResponsiveContainer>

        </div>
    );
};

export default TrendChart;