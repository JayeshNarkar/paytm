// backend/index.js
const express = require("express");
const rootRouter = require("./routes/index");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use("/api/v1", rootRouter);

app.get("/api", (req, res) => {
  res.send("Hello from api!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
