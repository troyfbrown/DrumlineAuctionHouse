const express = require('express');
const controller = require('../controllers/offerController');
const {isLoggedIn, isSeller, isNotSeller} = require('../middleware/auth');
const {validateId, validateOffer} = require('../middleware/validator');

const router = express.Router({mergeParams: true});

//view all offers
router.get('/', validateId, isLoggedIn, isSeller, controller.index);

//create an offer
router.post('/', validateOffer, validateId, isLoggedIn, isNotSeller, controller.create);

//accept an offer
router.put('/:offerId', validateId, isLoggedIn, isSeller, controller.accept);

//exports the router
module.exports = router;