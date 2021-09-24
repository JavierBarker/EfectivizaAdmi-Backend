'use strict';

const Loan = require('../models/loan.model');

function createLoan(req,res) {

    if(req.user.rol ==="ROL_ADMIN"){
        var idUser = req.params.idUser;
        var loanModel = new Loan();
        var params = req.body;
        
        loanModel.idUser = idUser;
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
        return res.status(200).send(foundLoans);

    })

}

function getUserLoans(req,res) {

    var userId = req.user.sub;

    Loan.find({idUser : userId},(err,foundLoans)=>{

        if(err) return res.status(500).send({err, message: 'Error en la petición'});
        if(!foundLoans) return res.status(500).send({message: 'Error al guardar el prestamo'});
        return res.status(200).send({foundLoans});

    })
    
}

function getLoan(req,res){

    var loanId = req.params.loanId;
    var loanGet = {
    };

    Loan.findById(loanId,(err,foundLoan)=>{

        if(err) return res.status(500).send({err, message: 'Error en la petición'});
        if(!foundLoan) return res.status(500).send({message: 'Error al encontrar el prestamo'});
        
        let restPayment = foundLoan.amount - foundLoan.payment;

        var months;
        var monthInterest
        var monthInterestPartial

        months = (foundLoan.paymentDate.getFullYear() - foundLoan.loanDate.getFullYear())*12;
        months += foundLoan.loanDate.getMonth();
        months -= foundLoan.paymentDate.getMonth();


        if(months <0){
            months = months*-1
        }else{
            months = months;
        }

        monthInterestPartial = foundLoan.amount*0.08
        monthInterest = months*foundLoan.amount*0.08;

        loanGet = {
            restPayment: restPayment,
            monthInterest: monthInterest,
            monthInterestPartial: monthInterestPartial,
            loan: foundLoan
        }

        return res.status(200).send({loanGet})


    })

}

function getLoans(req,res){

    if(req.user.rol === "ROL_ADMIN"){

        Loan.find((err,foundLoans)=>{

            if(err) return res.status(500).send({err, message: 'Error en la petición'});
            if(!foundLoans) return res.status(500).send({message: 'Error al guardar el prestamo'});
            return res.status(200).send({foundLoans});

        })

    }else{

        return res.status(500).send({message: 'No posee los permisos para realizar esta acción'})

    }

}

function editLoan(req,res){

    if(req.user.rol ==="ROL_ADMIN"){

        var idLoan = req.params.idLoan;
        var params = req.body;

        Loan.findByIdAndUpdate(idLoan,params,{new: true, useFindAndModify: false},(err,editedLoan)=>{

            if(err) return res.status(500).send({ message: 'Error en la petición'});
            if(!editedLoan) return res.status(500).send({ message: 'Error al editar el préstamo'});
            return res.status(200).send({ editedLoan })

        })

    }else{
        return res.status(200).send({message: 'No posee los permisos para realizar esta acción'})
    }

}

function getLoanById(req, res){
    if(req.user.rol ==="ROL_ADMIN"){
        var idLoan = req.params.loanId;
        Loan.findById(idLoan,(err,foundLoan)=>{
            if(err) return res.status(500).send({err, message: 'Error en la petición'});
            if(!foundLoan) return res.status(500).send({message: 'Error al encontrar el prestamo'});
            return res.status(200).send({ foundLoan })
        })
    }else{
        return res.status(200).send({message: 'No posee los permisos para realizar esta acción'})
    }
}


function deleteLoanById(req, res){
    if(req.user.rol ==="ROL_ADMIN"){

        var idLoan = req.params.loanId;

        Loan.findByIdAndDelete(idLoan,(err,deleteLoan)=>{

            if(err) return res.status(500).send({ message: 'Error en la petición'});
            if(!deleteLoan) return res.status(500).send({ message: 'Error al Eliminar el préstamo'});
            return res.status(200).send({ deleteLoan })

        })

    }else{
        return res.status(200).send({message: 'No posee los permisos para realizar esta acción'})
    }
}

function deadlineForInstallment(req, res){

    Loan.find((err, foundLoans)=>{
        var hoy = new Date(Date.now());
        hoy.setDate(hoy.getDate() + -1)
        
        var lateLoans = [{
            idUser: "",
            amount: 0,
            paymentDate: {type: Date},
            loanDate: {type: Date},
            payment: 0,
            description: {},
            canceled: {type: Boolean},
            typeLoan: "",
            countDays: 0,
            message: "",
            penalty: 0,
            monthInterest: 0
        }];
        
        for (let i = 0; i < foundLoans.length; i++) {
            if (hoy.getTime() > foundLoans[i].paymentDate.getTime() ) {
                
                if (foundLoans[i].canceled === false) {
                    lateLoans.push({
                        idUser: foundLoans[i]._id,
                        amount: foundLoans[i].amount,
                        paymentDate: foundLoans[i].paymentDate,
                        loanDate: foundLoans[i].loanDate,
                        payment: foundLoans[i].payment,
                        description: foundLoans[i].description,
                        canceled: foundLoans[i].canceled,
                        typeLoan: foundLoans[i].typeLoan,
                        countDays: 0
                    });
                }
            }   
        }
        
        var countDays = 0;
        for (let i = 0; i < lateLoans.length; i++) {
            var fechaini = new Date(lateLoans[i].paymentDate);
            var fechafin = new Date(hoy);
            var diasdif= fechafin.getTime()-fechaini.getTime();
            var countDays = Math.round(diasdif/(1000*60*60*24));
            lateLoans[i].countDays = countDays;
        }
        
        for (let i = 0; i < lateLoans.length; i++) {
            if (lateLoans[i].countDays > 10) {
                lateLoans[i].message = "La prenda que empeño se Desactivará";
                lateLoans[i].penalty = 10*0.0175*lateLoans[i].amount;

            }else{
                lateLoans[i].message = `La prenda se desactivará en ${10-lateLoans[i].countDays} días`;
                lateLoans[i].penalty = lateLoans[i].countDays*0.0175*lateLoans[i].amount;
            }
            
        }
        
        return res.status(200).send({ lateLoans })
    })
}

module.exports = {
    createLoan,
    getClientLoans,
    getUserLoans,
    getLoans,
    editLoan,
    getLoan,
    getLoanById,
    deleteLoanById,
    deadlineForInstallment
}