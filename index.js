const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const urlcheckRouter = require("./routes/URLCheckRoutes");
require("dotenv").config();
const app = express();

mongoose
    .connect("mongodb://localhost:27017/bosta")
    .then(() => console.log("DB connection successful!"))
    .catch((err) => console.log("Error Connection to DB"));

// TODO: Emit an event To start processes for  all created checks

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/api/users", userRouter);
app.use("/api/checks", urlcheckRouter);

app.get("/welcome", (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
