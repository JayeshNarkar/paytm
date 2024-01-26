// backend/index.js
const express = require("express");
const rootRouter = require("./routes/index");
const app = express();
const cors = require("cors");

app.use(cors());
app.use("/api/v1", rootRouter);

app.listen(3000);
