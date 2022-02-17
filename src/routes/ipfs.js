const express = require("express")
const router = express.Router()
const Ipfs = require("../controllers/ipfs")

// router.post('/ipfs', Ipfs.uploadImage)
router.post('/create-nft-request', Ipfs.createNftRequest)
router.post('/create-nft', Ipfs.createNFT)
router.get('/nft/:account', Ipfs.getNftByAccount)

module.exports = router