'use strict'

const express = require("express");
const userController = require('../controllers/user.controller');

var md_autentication = require('../middlewares/authenticated');

var api = express.Router();

api.post('/login',userController.login);
api.post('/createUser',md_autentication.ensureAuth,userController.createUser);
api.put('/editUser',md_autentication.ensureAuth,userController.editUser);
api.delete('/deleteUser',md_autentication.ensureAuth,userController.deleteUser);

module.exports = api;