const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const favoritesItems = new Schema({
    age: mongoose.Schema.Types.Mixed,
    birth: mongoose.Schema.Types.Mixed,
    email: mongoose.Schema.Types.Mixed,
    height: mongoose.Schema.Types.Mixed,
    img: mongoose.Schema.Types.Mixed,
    inches: mongoose.Schema.Types.Mixed,
    mobile: mongoose.Schema.Types.Mixed,
    mothersName: mongoose.Schema.Types.Mixed,
    name: mongoose.Schema.Types.Mixed,
    occupation: mongoose.Schema.Types.Mixed,
    race: mongoose.Schema.Types.Mixed,
    religion: mongoose.Schema.Types.Mixed,
    type: mongoose.Schema.Types.Mixed,
    weight: mongoose.Schema.Types.Mixed,
    permanentDivision: mongoose.Schema.Types.Mixed,
    presentDivision: mongoose.Schema.Types.Mixed,
    expectedPartnerAge: mongoose.Schema.Types.Mixed,
    expectedPartnerHeight: mongoose.Schema.Types.Mixed,
    expectedPartnerInches: mongoose.Schema.Types.Mixed,
    expectedPartnerWeight: mongoose.Schema.Types.Mixed,
    fathersName: mongoose.Schema.Types.Mixed,
    biodataId: mongoose.Schema.Types.Mixed,
    favMakerEmail: mongoose.Schema.Types.Mixed,
    biodataItemId: mongoose.Schema.Types.Mixed,

}, {
    strict: false,
});

const FavoritesItems = mongoose.model('favorites', favoritesItems);

module.exports = FavoritesItems;


