// backend/index.js
const express = require("express");
const rootRouter = require("./routes/index");
const app = express();
const cors = require("cors");

app.use(cors());
app.use("/v1", rootRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
