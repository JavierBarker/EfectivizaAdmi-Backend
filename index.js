'use strict'

const mongoose = require("mongoose")
const app = require('./app')

mongoose.Promise = global.Promise;
const URL = 'mongodb+srv://root:root@efectivizaadmi.zaf0o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect( URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(()=>{
    console.log('se encuentra conectado a la base de datos');

    app.listen(process.env.PORT || 3000, function (){
        console.log('El servidor esta corriendo en el puerto: 3000');
    })

}).catch(err => console.log(err))