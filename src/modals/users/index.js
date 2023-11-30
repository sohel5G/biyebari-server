
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const users = new Schema({

    name: mongoose.Schema.Types.Mixed,
    email: mongoose.Schema.Types.Mixed

}, {
    strict: false,
});

const Users = mongoose.model('users', users);

module.exports = Users;


