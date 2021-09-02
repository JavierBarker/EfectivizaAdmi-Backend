'use strict';

const express = require("express");
const loanController = require('../controllers/loan.controller');

var md_autentication = require('../middlewares/authenticated');

var api = express.Router();

api.post('/createLoan',md_autentication.ensureAuth,loanController.createLoan);
api.get('/getClientLoans/:idUser',md_autentication.ensureAuth, loanController.getClientLoans);
api.get('/getUserLoans',md_autentication.ensureAuth, loanController.getUserLoans);
api.get('/getLoans',md_autentication.ensureAuth, loanController.getLoans);
api.put('/editLoan/:idLoan',md_autentication.ensureAuth,loanController.editLoan);

module.exports = api;