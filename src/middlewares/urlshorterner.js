const dotenv = require("dotenv");
const express = require("express");
const router = express.Router();
const cors = require("cors");
// const mongoose = require("mongoose");
const shortid = require("shortid");
const Url = require("../Utils/Url");
const utils = require("../Utils/validate");
const logger = require("../Utils/logger");

// configure dotenv
dotenv.config();
const app = express();

// cors for cross-origin requests to the frontend application
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());

// Database connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     logger.warn(`Db Connected`);
//   })
//   .catch((err) => {
//     logger.error(err);
//   });

// get all saved URLs
router.get("/all", async (req, res) => {
  try {
    const data = await Url.find();
    res.json(data);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// URL shortener endpoint
router.post("/", async (req, res) => {
  logger.info(`HERE ${req.body.origUrl}`);
  const { origUrl } = req.body;
  const base = `http://localhost:3333/short`;

  // generate an id for the url
  const urlId = shortid.generate();
  // the url is validate
  if (utils.validateUrl(origUrl)) {
    try {
      // find in database if url is already existed or not
      let url = await Url.findOne({ origUrl });
      // if existed return the url
      if (url) {
        res.json(url);
      } else {
        // else create a new url Object to save it to database
        const shortUrl = `${base}/${urlId}`;

        url = new Url({
          origUrl,
          shortUrl,
          urlId,
          date: new Date(),
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      logger.error(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
});

// redirect endpoint
router.get("/:urlId", async (req, res) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });
    logger.info(url);
    if (url) {
      url.clicks++;
      url.save();
      return res.redirect(url.origUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    logger.error(err);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
