import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use("/api/register", (req, res) => {
  console.log(req.body);
  res.send("hello");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
