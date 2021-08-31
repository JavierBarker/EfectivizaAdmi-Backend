'use strict';

const Loan = require('../models/loan.model');

function createLoan(req,res) {

    if(req.user.rol ==="ROL_ADMIN"){

        var loanModel = new Loan();
        var params = req.body;
        
        loanModel.idUser = params.idUser;
        loanModel.amount = params.amount;
        loanModel.paymentDate = params.paymentDate;
        loanModel.description = params.description;
        loanModel.typeLoan = params.typeLoan;

        loanModel.save((err,loanSaved)=>{

            if(err) return res.status(500).send({err, message: 'Error en la petición'});
            if(!loanSaved) return res.status(500).send({message: 'Error al guardar el prestamo'});
            return res.status(200).send({loanSaved});

        })

    }else{
        return res.status(500).send({message: 'No posee los permisos para realizar esta acción'});
    }

}

function getClientLoans(req,res){

    var idClient = req.params.idUser;

    Loan.find({idUser: idClient},(err,foundLoans)=>{

        if(err) return res.status(500).send({err, message: 'Error en la petición'});
        if(!foundLoans) return res.status(500).send({message: 'Error al guardar el prestamo'});
        return res.status(200).send({foundLoans});

    })

}

module.exports = {
    createLoan,
    getClientLoans
}