const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next) =>{
    let id = req.params.id;
    if(id.match(/^[0-9a-fA-F]{24}$/)) {
        if(req.params.offerId !== undefined) {
            let offerId = req.params.offerId;
            console.log(id);
            console.log(offerId);
            if(offerId.match(/^[0-9a-fA-F]{24}$/)) {
                next();
            } else {
                let err = new Error('Invalid offer id');
                err.status = 400;
                return next(err);
            }
        } else {
            next();
        }
    } else {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }
};

exports.validateSignUp = [
    body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty' ).notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})
];

exports.validateLogIn = [
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})
];

exports.validateItem = [
    body('title', 'title cannot be empty').notEmpty().trim().escape(),
    body('condition', 'condition cannot be empty').notEmpty().trim().escape().isIn(['New', 'Lightly Used', 'Used', 'Very Used', 'Extremely Used']),
    body('price', 'price cannot be empty').notEmpty().trim().escape().isCurrency(),
    body('details', 'details cannot be empty').notEmpty().trim().escape(),
    body('image', 'image cannot be empty').trim(),
];

exports.validateOffer = [body('amount', 'amount cannot be empty').notEmpty().trim().escape().isCurrency()];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};