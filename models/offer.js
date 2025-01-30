const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    maker: {type: Schema.Types.ObjectId, ref:'User'},
    offerItem: {type: Schema.Types.ObjectId, ref:'Item'},
    amount: {type: Number, required: [true, 'amount is required'], 
        min: [0.01, 'Amount must be at least 0.01']
    },
    status: {type: String, required: [true, 'status is required'],
        enum: ['pending', 'rejected', 'accepted'], 
        default: 'pending'
    }
});

module.exports = mongoose.model('Offer', offerSchema);