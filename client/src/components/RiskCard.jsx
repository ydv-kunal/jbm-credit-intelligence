const RiskCard = ({ risk }) => {
    const isRisk = risk.type === "RISK";

    return (
        <article
            className={`risk-card ${isRisk ? "risk" : "opportunity"
                }`}
        >
            <div className="risk-icon">
                {isRisk ? "!" : "✓"}
            </div>

            <div>
                <div className="risk-header">
                    <h3>{risk.title}</h3>

                    <span>
                        {risk.severity}
                    </span>
                </div>

                <p>{risk.explanation}</p>

                <small>
                    Metric: {risk.metric}
                </small>
            </div>
        </article>
    );
};

export default RiskCard;