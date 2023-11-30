const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const requests = new Schema({

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
    isPro: mongoose.Schema.Types.Mixed,
    requesterEmail: mongoose.Schema.Types.Mixed,
    requesterName: mongoose.Schema.Types.Mixed,
    requesterBiodataId: mongoose.Schema.Types.Mixed,
    request: mongoose.Schema.Types.Mixed,
    biodataItemId: mongoose.Schema.Types.Mixed,
    payed: mongoose.Schema.Types.Mixed,


}, {
    strict: false,
});

const Requests = mongoose.model('requests', requests);

module.exports = Requests;


