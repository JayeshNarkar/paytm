// backend/index.js
const express = require("express");
const rootRouter = require("./routes/index");
const app = express();

app.use("/api/v1", rootRouter);

app.listen(3000);
