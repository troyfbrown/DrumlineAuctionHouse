const model = require('../models/offer');
const Item = require('../models/item');
const User = require('../models/user');

exports.index = (req, res, next) => {
    let id = req.params.id;
    model.find({offerItem: id})
    .populate('offerItem', 'title active')
    .populate('maker', 'firstName lastName')
    .then(offers => {
        res.render('./offer/index', { offers });
    })
    .catch(err=>next(err));
};

exports.create = (req, res, next) => {
    let offer = new model(req.body);
    offer.maker = req.session.user;
    offer.offerItem = req.params.id;
    Promise.all([offer.save(), Item.updateOne({ _id: req.params.id }, { $inc: {totalOffers: 1}}), Item.updateOne({ _id: req.params.id}, { $max: {highestOffer: offer.amount}})])
    .then( item => {
        req.flash('success', 'You have successfully created an offer');
        res.redirect('/items/' + offer.offerItem);
    })
    .catch(err => {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

exports.accept = (req, res, next) => {
    let id = req.params.id;
    let offerId = req.params.offerId;
    Promise.all([
        Item.updateOne({ _id: id }, {active: false}), 
        model.updateOne({ _id: offerId }, {status: 'accepted'}), 
        model.updateMany({offerItem: id, _id: { $ne: offerId}}, {status: 'rejected'}),
    ])
    .then(([itemUpdate, offerUpdate, otherOffersUpdate]) => {
        return model.find({ offerItem: id })
            .populate('offerItem', 'title active')
            .populate('maker', 'firstName lastName');
    })
    .then(offers => {
        res.render('./offer/index', { offers });
    })
    .catch( err => {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};