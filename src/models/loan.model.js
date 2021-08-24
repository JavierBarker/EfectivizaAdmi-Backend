'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoanSchema = Schema({

    idUser: {type: Schema.Types.ObjectId, ref: 'Users'},
    amount: {type: Number,required: true, default: 0},
    paymentDate: {type: Date, required: true},
    LoanDate: {type: Date, required: true, default: Date.now()},
    payment: {type: Number, default: 0 }

})

module.exports = mongoose.model('Loans', LoanSchema);