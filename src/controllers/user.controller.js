'use strict'

const User = require('../models/user.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../services/jwt');

function createAdmin(){
    var modelUser = new User(); 

    modelUser.name = 'ADMIN';
    modelUser.lastname = 'ADMIN';
    modelUser.username = 'ADMIN_0';
    modelUser.rol = 'ROL_ADMIN';

    User.find( { $or: [
        { username: modelUser.username }
    ] } ).exec((err, userFound) => {
        if(err) return console.log("Error in the request")

        if(userFound && userFound.length >= 1){
            console.log(`User ${modelUser.username} already exists`)
        }else {
            bcrypt.hash('123456', null, null, (err, passEncrypted) =>{
                modelUser.password = passEncrypted

                modelUser.save((err, userSaved) =>{
                    if(err) return console.log('Error saving user', err)
                    if(userSaved){
                        console.log(userSaved);
                    }else {
                        return console.log('Register failed')
                    }
                })
            })
        }
    })
}

function login(req, res) {
    var params = req.body;
    User.findOne({ username: params.username}, (err, userFound)=>{
        if (err) return res.status(500).send({err,message: 'Error en la peticion'});

        if(userFound){
            bcrypt.compare(params.password, userFound.password, (err, passCorrect)=>{
                if (passCorrect) { 
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(userFound)
                        })
                    }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({userFound});
                    }
                }else{
                    return res.status(500).send({message: 'El Usuario no se ha podido identificar', err});
                }

            })
        }else{
            return res.status(500).send({message: 'El usuario no se ha podido ingresar'});
        }
    })
}


module.exports = {
    createAdmin,
    login
}