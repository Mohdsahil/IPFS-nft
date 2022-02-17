const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const itemTransactionSchema = new Schema(
    {
        account: {
            type: String,
            default: null
        },
        txHash: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("item-transactions", itemTransactionSchema)