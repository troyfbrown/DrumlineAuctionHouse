const express = require('express');
const controller = require('../controllers/itemController');
const offerRoutes = require('./offerRoutes');
const { upload } = require('../middleware/fileUpload');
const {isLoggedIn, isSeller} = require('../middleware/auth');
const {validateId, validateItem, validateResult} = require('../middleware/validator');

const router = express.Router();

//GET /items send all items to the user
router.get('/', controller.index);

//GET /items/new sends html form for creating a new item
router.get('/new', isLoggedIn, controller.new);

//POST /items create a new item
router.post('/', upload, isLoggedIn, validateItem, validateResult, controller.create);

//GET /items/:id send details of an item identified by id
router.get('/:id', validateId, controller.show);

//GET /items/:id/edit send html form for editing an existing item
router.get('/:id/edit', validateId, isLoggedIn, isSeller, controller.edit);

//PUT /items/:id update the item identified by id
router.put('/:id', validateId, isLoggedIn, isSeller, upload, validateItem, validateResult, controller.update);

//DELETE /items/:id delete the item identified by id
router.delete('/:id', validateId, isLoggedIn, isSeller, controller.delete);

//routes to embedded offer module
router.use('/:id/offer', offerRoutes);

//exports the router
module.exports = router;