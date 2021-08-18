'use strict'

const mongoose = require("mongoose")
const app = require('./app')

mongoose.Promise = global.Promise;
const URL = 'mongodb://localhost:27017/GoldenLionDB';

mongoose.connect( URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(()=>{
    console.log('se encuentra conectado a la base de datos');

    app.listen(3000, function (){
        console.log('El servidor esta corriendo en el puerto: 3000');
    })

}).catch(err => console.log(err))