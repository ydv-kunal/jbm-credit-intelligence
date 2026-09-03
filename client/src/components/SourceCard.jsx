const SourceCard = ({ financial }) => {
    return (
        <div className="source-card">

            <div>
                <strong>FY{financial.year}</strong>

                <p>
                    Financial data used in the credit assessment.
                </p>
            </div>

            <div>
                <span>
                    Source: {financial.source.name}
                </span>

                <span>
                    Type: {financial.source.type}
                </span>

                <span>
                    Confidence: {financial.source.confidence}
                </span>
            </div>

        </div>
    );
};

export default SourceCard;