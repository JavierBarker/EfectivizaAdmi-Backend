'use strict'

const express = require("express");
const userController = require('../controllers/user.controller');

var md_autentication = require('../middlewares/authenticated');

var api = express.Router();

api.post('/login',userController.login);
api.get('/presionar',md_autentication.ensureAuth,userController.presionar)

module.exports = api;