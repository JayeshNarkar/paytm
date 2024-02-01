// backend/index.js
const express = require("express");
const rootRouter = require("./routes/index");
const app = express();
const port = process.env.PORT || 3000;

app.use("/api/v1", rootRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
