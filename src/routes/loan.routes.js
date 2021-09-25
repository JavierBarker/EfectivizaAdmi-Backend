'use strict';

const express = require("express");
const loanController = require('../controllers/loan.controller');

var md_autentication = require('../middlewares/authenticated');

var api = express.Router();

api.post('/createLoan/:idUser',md_autentication.ensureAuth,loanController.createLoan);
api.get('/getClientLoans/:idUser',md_autentication.ensureAuth, loanController.getClientLoans);
api.get('/getUserLoans',md_autentication.ensureAuth, loanController.getUserLoans);
api.get('/getLoans',md_autentication.ensureAuth, loanController.getLoans);
api.put('/editLoan/:idLoan',md_autentication.ensureAuth,loanController.editLoan);
api.get('/getLoan/:loanId',/*md_autentication.ensureAuth,*/loanController.getLoan);
api.get('/getLoanById/:loanId',md_autentication.ensureAuth,loanController.getLoanById);
api.delete('/deleteLoanById/:loanId', md_autentication.ensureAuth, loanController.deleteLoanById);
api.get('/deadlineForInstallmentUser/:idUser',md_autentication.ensureAuth, loanController.deadlineForInstallmentUser);
api.get('/deadlineForInstallment', md_autentication.ensureAuth, loanController.deadlineForInstallment);
module.exports = api;