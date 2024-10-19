const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.status(500).json({ error: "We are sorry, but something went wrong" });
});

module.exports = router;
