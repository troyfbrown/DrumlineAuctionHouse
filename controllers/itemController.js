const multer = require('multer');
const model = require('../models/item');
const Offer = require('../models/offer');

exports.index = (req, res, next) => {
    if (typeof req.query.search !== 'undefined') {
        let searchWord = req.query.search;
        model.find({$or: [{title: new RegExp(searchWord, 'i')}, {details: new RegExp(searchWord, 'i')}]})
        .then(items => {
            res.render('./item/index', {items});
        })
        .catch(err=>next(err));
    } else {
        model.find()
        .then(items => {
            res.render('./item/index', {items});
        })
        .catch(err=>next(err));
    }
};

exports.new = (req, res) => {
    res.render('./item/new');
};

exports.create = (req, res) => {
    let item = new model(req.body);
    item.image = item.image = '/images/' + req.file.filename;
    item.seller = req.session.user;
    item.save()
    .then(item => {
        req.flash('success', 'You have successfully created a new item');
        res.redirect('/items');
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate('seller', 'firstName lastName')
    .then(item => {
        if(item) {
            return res.render('./item/show', {item});
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));  
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(item => {
        if(item) {
             return res.render('./item/edit', {item});
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
    
};

exports.update = (req, res, next) => {
    let item = req.body;
    item.image = '/images/' + req.file.filename;
    let id = req.params.id;
    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item => {
        if(item) {
            req.flash('success', 'You have successfully edited this item');
            res.redirect('/items/' + id);
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    Promise.all([Offer.deleteMany({ offerItem: id }), model.findByIdAndDelete(id, {useFindAndModify: false})])
    .then(([offersDeletionResult, item])=> {
        if(item){
            req.flash('success', 'You have successfully deleted the item');
            res.redirect('/items');
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};