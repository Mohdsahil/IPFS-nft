const express = require('express');
const router = express.Router();

const Ipfs = require("./ipfs")

router.use("/", Ipfs)

module.exports = router;
