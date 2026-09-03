const DecisionCard = ({ decision }) => {
    const { score, decision: result, confidence, conditions } = decision;

    return (
        <section className="decision-card">

            <div>
                <p className="eyebrow">
                    CREDIT DECISION
                </p>

                <h2>{result}</h2>

                <p>
                    Confidence: <strong>{confidence}</strong>
                </p>
            </div>

            <div className="score">
                <strong>{score}</strong>
                <span>/100</span>
            </div>

            {conditions.length > 0 && (
                <div className="conditions">

                    <h3>Recommended Conditions</h3>

                    <ul>
                        {conditions.map((condition, index) => (
                            <li key={index}>
                                {condition}
                            </li>
                        ))}
                    </ul>

                </div>
            )}

        </section>
    );
};

export default DecisionCard;