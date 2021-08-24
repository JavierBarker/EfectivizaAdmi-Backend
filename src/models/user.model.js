'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({

    dpi: {type: String, required: true},
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    rol: {type: String, required: true}

})

module.exports = mongoose.model('Users', UserSchema);