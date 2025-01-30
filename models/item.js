const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    seller: {type: Schema.Types.ObjectId, ref:'User'},
    condition: {type: String, required: [true, 'content is required'],
            enum: ['New', 'Lightly Used', 'Used', 'Very Used', 'Extremely Used']
    },
    price: {type: Number, required: [true, 'price is required'], 
            min: [0.01, 'Item must be at least $0.01']
    },
    details: {type: String, required: [true, 'Details are required'],
            minLength: [10, 'The details should have at least 10 characters']
    },
    image: {type: String, required: [true, 'An image is required']},
    totalOffers: {type: Number, default: 0},
    highestOffer: {type: Number, default: 0},
    active: {type: Boolean, default: true},
});

module.exports = mongoose.model('Item', itemSchema);
