const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (error) => {
  console.log(error.name, error.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATA_BASE;

mongoose.connect(DB).then(() => {
  console.log("DB connection established");
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
