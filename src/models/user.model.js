'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({

    name: String,
    lastname: String,
    username: String,
    password: String,
    rol: String

})

module.exports = mongoose.model('Users', UserSchema);