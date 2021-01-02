const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// accessible to any
app.use(cors());

// Body Parser middleware to handle raw JSON files
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
const route = require("./routes/app");
app.use("/paypal", route); // routes; only one route

// default display
app.use("/", (req, res, next) => {
  res.send("PayPal API Integration . . .");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});

// when invalid routes are entered
app.use(async (req, res) => {
  res.status(404).send(`Route is no where to be found.`);
});

module.exports = app;
