'use strict'

//Variables Globales
const express = require("express");
const app = express();

const bodyParser = require("body-parser")
const cors = require("cors")

const userController = require('./src/controllers/user.controller');

//IMPORTACION DE RUTAS
const user_route = require('./src/routes/user.routes');

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

//CABECERAS
app.use(cors());

app.use('/api',user_route);

userController.createAdmin();
//Exportar
module.exports = app;