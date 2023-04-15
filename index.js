const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const logger = require("./src/Utils/logger");
const mongoose = require("mongoose");

// Middlewares
const shorterner = require("./src/middlewares/urlshorterner");

// configure dotenv
dotenv.config();
const app = express();

// cors for cross-origin requests to the frontend application
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// Middleawares
app.use("/short", shorterner);

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.warn(`Db Connected`);
  })
  .catch((err) => {
    logger.error(err);
  });

app.get("/", (req, res) => {
  res.send("Work in progress");
});

// Port Listenning on 3333
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  logger.warn(`Server is running at PORT ${PORT}`);
});
