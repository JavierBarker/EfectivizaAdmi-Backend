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
                    if (params.getToken === true) {
                        return res.status(200).send({
                            token: jwt.createToken(userFound),
                            userFound: userFound
                        })
                    }else{
                        userFound.password = undefined;
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

function createUser(req,res){

    var userModel = new User();
    var params = req.body;

    if(req.user.rol === 'ROL_ADMIN'){

        userModel.dpi = params.dpi;
        userModel.name = params.name;
        userModel.lastname = params.lastname;
        userModel.username = params.username;
        userModel.password = params.password;
        userModel.rol = params.rol;

        User.find({$or:[
            {username: userModel.username},
            {dpi: userModel.dpi}
        ]}).exec((err,userFound)=>{

            if(userFound && userFound.length>=1){
                return res.status(500).send({message: 'El usuario ya ha sido registrado'});
            }else{

                bcrypt.hash(params.password,null,null,(err,passEncrypted)=>{

                    userModel.password = passEncrypted

                    userModel.save((err, userSaved)=>{

                        if(err) return res.status(500).send({ message: 'Error al guardar el usuario' })
    
                            if(userSaved){
                                res.status(200).send(userSaved)
                            }else {
                                res.status(404).send({ message: 'No se ha podido guardar el usuario' })
                            }

                    })

                })

            }

        })

    }else{

        return res.status(500).send({message: 'No posee los permisos para realizar esta acción'})

    }

}

function editUser(req,res){

    var idUser = req.params.idUser;
    var params = req.body;

    delete params.password;
    delete params.rol;

    if(req.user.rol === "ROL_ADMIN"){

        User.find({$or:[
            {username: params.username},
            {dpi: params.dpi}
        ]}).exec((err,userFound)=>{
    
            if(userFound && userFound.length>=1){
                return res.status(500).send({message: 'El usuario ya existe, comprueba el usuario o DPI'});
            }else{
                User.findByIdAndUpdate(idUser,params,{new: true, useFindAndModify: false},(err,editedUser)=>{
    
                    if(err) return res.status(500).send({message: 'Error en la petición'});
                    if(!editedUser) return res.status(500).send({message: 'No se ha podido editar el usuario'});
                    
                    return res.status(200).send({editedUser});
    
                })
            }
    
        })

    }else{
        return res.status(500).send({message: 'No posee los permisos para realizar esta acción'});
    }

}

function deleteUser(req,res){

    var idUser = params.idUser;

    if(req.user.rol === "ROL_ADMIN"){


        User.findByIdAndDelete(idUser,(err,deletedUser)=>{

            if(deletedUser.rol ==="ROL_ADMIN") return res.status(500).send({message: 'No se pueden eliminar otros administradores'})
            if(err) return res.status(500).send({message: 'Error en la petición'});
            if(!deletedUser) return res.status(500).send({message: 'No se pudo eliminar el usuario'});

            return res.status(200).send({deletedUser});

        })

    }else{

        return res.status(500).send({message: 'No posee los permisos para realizar esta acción'});

    }

}

function getUsers(req, res){
    if(req.user.rol === "ROL_ADMIN"){
        User.find((err, foundUsers) =>{
            if(err) return res.status(500).send({message: 'Error en la petición'});
            if(!foundUsers) return res.status(500).send({message: 'No se han podido traer los Usuarios'});
                    
            return res.status(200).send({foundUsers});
        })
    }else{
        return res.status(500).send({message: 'No posee los permisos para realizar esta acción'});
    }
}

module.exports = {
    createAdmin,
    login,
    createUser,
    editUser,
    deleteUser,
    getUsers
}