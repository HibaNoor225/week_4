const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("home page");
});

router.get("/about", (req, res) => {
  res.send("About this page");
});

module.exports = router;
//