'use strict'

const express = require("express");
const userController = require('../controllers/user.controller');

var md_autentication = require('../middlewares/authenticated');

var api = express.Router();

api.post('/login',userController.login);
api.post('/createUser',md_autentication.ensureAuth,userController.createUser);
api.put('/editUser/:idUser',md_autentication.ensureAuth,userController.editUser);
api.delete('/deleteUser/:idUser',md_autentication.ensureAuth,userController.deleteUser);
api.get('/getUsers', md_autentication.ensureAuth, userController.getUsers);
api.get('/getUserId/:idUser',md_autentication.ensureAuth,userController.getUserId);
api.get('/serchClientByUsername/:user', md_autentication.ensureAuth, userController.serchClientByUsername);
api.get('/getUser', md_autentication.ensureAuth, userController.getUser);
module.exports = api;