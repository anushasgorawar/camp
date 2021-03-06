const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn,validateCampground,isAuthor }=require('../middleware.js')
const multer = require('multer');
const {storage} = require('../cloudinary');
var upload = multer({storage})

const campground= require('../controllers/campgrounds')

router.route('/')
	.get(catchAsync(campground.index))
	.post(isLoggedIn,upload.array('image'),validateCampground, catchAsync(campground.createNewCampground)) 
	
router.get('/addnew',isLoggedIn,campground.renderNewForm)
 
router.route('/:id')
	.get(catchAsync(campground.show))
	.put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campground.update))
	.delete(isLoggedIn,isAuthor,catchAsync(campground.delete))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.updateForm))

module.exports = router;