const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const successStory = new Schema({
    selfName: mongoose.Schema.Types.Mixed,
    partnerName: mongoose.Schema.Types.Mixed,
    selfId: mongoose.Schema.Types.Mixed,
    partnerId: mongoose.Schema.Types.Mixed,
    date: mongoose.Schema.Types.Mixed,
    coupleImg: mongoose.Schema.Types.Mixed,
    review: mongoose.Schema.Types.Mixed,
    rating: mongoose.Schema.Types.Mixed,
}, {
    strict: false, 
});

const SuccessStory = mongoose.model('reviews', successStory);

module.exports = SuccessStory;


