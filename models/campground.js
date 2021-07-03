const mongoose= require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail')
.get(function(){
    return this.url.replace('/upload','/upload/w_200')}
)
ImageSchema.virtual('index')
.get(function(){
    return this.url.replace('/upload','/upload/c_fill,w_400,h_270')}
)
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    // price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}" style="font-family:sans-serif" >${this.title}</a><strong>
    <p style="margin:0px">${this.description.substring(0, 20)}...</p>`
});

CampgroundSchema.post('findOneAndDelete',async function(camp){
    if(camp){
        await Review.deleteMany({_id : {$in: camp.reviews}})
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema)