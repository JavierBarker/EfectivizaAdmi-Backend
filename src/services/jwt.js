'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = 'Secret_Efectiviza'

exports.createToken = function (user) {
    var payload ={
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        rol: user.rol,
        iat: moment().unix(),
        exp: moment().day(10,'days').unix()
    }

    return jwt.encode(payload,secret)

}