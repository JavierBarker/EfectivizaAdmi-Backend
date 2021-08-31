'use strict';

const express = require("express");
const loanController = require('../controllers/loan.controller');

var md_autentication = require('../middlewares/authenticated');

var api = express.Router();

api.post('/createLoan',md_autentication.ensureAuth,loanController.createLoan);
api.get('/getClientLoans/:idUser',md_autentication.ensureAuth, loanController.getClientLoans);

module.exports = api;