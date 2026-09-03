const MetricCard = ({ title, value, subtitle }) => {
    return (
        <div className="metric-card">
            <p>{title}</p>
            <h3>{value}</h3>

            {subtitle && (
                <span>{subtitle}</span>
            )}
        </div>
    );
};

export default MetricCard;