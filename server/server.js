require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const creditRoutes = require("./routes/creditRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/credit", creditRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "JBM Credit Intelligence API",
        status: "running",
    });
});
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});