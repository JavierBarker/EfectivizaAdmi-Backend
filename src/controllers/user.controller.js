'use strict'

const User = require('../models/user.model');
const bcrypt = require("bcrypt-nodejs")

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


module.exports = {
    createAdmin
}