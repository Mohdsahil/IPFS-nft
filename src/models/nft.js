const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const nftSchema = new Schema(
    {
        account: {
            type: String,
            default: null
        },
        nftLink: {
            type: String,
            default: null
        },
        nftMetaData: {
            type: String,
            default: null
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model("nft", nftSchema)