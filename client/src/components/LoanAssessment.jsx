import { useState } from "react";
import { AlertTriangle } from "lucide-react";

function LoanAssessment({ onAssess, loading, apiError }) {
    const [loanAmount, setLoanAmount] = useState(1);
    const [loanPurpose, setLoanPurpose] = useState("Working Capital");
    const [amountError, setAmountError] = useState("");
    const [purposeError, setPurposeError] = useState("");

    const validate = () => {
        let isValid = true;

        const numAmount = Number(loanAmount);
        if (loanAmount === "" || isNaN(numAmount) || numAmount <= 0) {
            setAmountError("Please enter a valid loan amount greater than ₹0.");
            isValid = false;
        } else {
            setAmountError("");
        }

        if (!loanPurpose || loanPurpose.trim() === "") {
            setPurposeError("Please select a valid loan purpose.");
            isValid = false;
        } else {
            setPurposeError("");
        }

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        onAssess({
            loanAmount: Number(loanAmount),
            loanUnit: "Crore",
            loanPurpose,
        });
    };

    const handleAmountChange = (e) => {
        const val = e.target.value;
        setLoanAmount(val);

        const numVal = Number(val);
        if (val === "" || isNaN(numVal) || numVal <= 0) {
            setAmountError("Please enter a valid loan amount greater than ₹0.");
        } else {
            setAmountError("");
        }
    };

    const handlePurposeChange = (e) => {
        const val = e.target.value;
        setLoanPurpose(val);

        if (!val || val.trim() === "") {
            setPurposeError("Please select a valid loan purpose.");
        } else {
            setPurposeError("");
        }
    };

    return (
        <section className="assessment-section">
            <div className="section-title">
                <div>
                    <h2>Credit Assessment</h2>
                    <p>
                        Evaluate a proposed loan using JBM Auto's financial performance
                    </p>
                </div>
            </div>

            {apiError && (
                <div className="assessment-api-error">
                    <AlertTriangle size={18} />
                    <span>{apiError}</span>
                </div>
            )}

            <form className="assessment-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label>Loan Amount</label>

                    <div className={`input-wrapper ${amountError ? "input-error" : ""}`}>
                        <span>₹</span>

                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={loanAmount}
                            onChange={handleAmountChange}
                            disabled={loading}
                            required
                        />

                        <span className="unit">Crore</span>
                    </div>

                    {amountError && (
                        <span className="field-error">
                            <AlertTriangle size={13} />
                            {amountError}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label>Loan Purpose</label>

                    <select
                        value={loanPurpose}
                        onChange={handlePurposeChange}
                        disabled={loading}
                        className={purposeError ? "select-error" : ""}
                    >
                        <option value="Working Capital">Working Capital</option>
                        <option value="Business Expansion">Business Expansion</option>
                        <option value="Capital Expenditure">Capital Expenditure</option>
                        <option value="Debt Refinancing">Debt Refinancing</option>
                    </select>

                    {purposeError && (
                        <span className="field-error">
                            <AlertTriangle size={13} />
                            {purposeError}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    className="assess-button"
                    disabled={loading || Boolean(amountError || purposeError)}
                >
                    {loading ? "Assessing..." : "Assess Credit"}
                </button>
            </form>
        </section>
    );
}

export default LoanAssessment;