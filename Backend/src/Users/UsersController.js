var UserService = require('./UsersService');
const bcrypt = require('bcrypt');
var UserModel = require('../Users/UsersModel');

var createUserControllerFn = async (req, res) => 
{
    try
    {
    console.log(req.body);
    var status = await UserService.createrespDBService(req.body);
    console.log(status);


    if (status) {
        res.send({ "status": true, "message": "user created successfully" });
    } else {
        res.send({ "status": false, "message": "Error creating user" });
    }
}
catch(err)
{
    console.log(err);
}
}

var loginUserpControllerFn = async (req, res) => {
    var result = null;
    try {
        result = await UserService.loginrespDBService(req.body);
        if (result.status) {
            console.log(result,"hhhhh")
            res.send({ "status": result.status, "message": result.msg ,"data":result.data});
        } else {
            res.send({ "status": false, "message": result.msg });
        }

    } catch (error) {
        console.log(error);
        res.send({ "status": false, "message": error.msg });
    }
}
module.exports = { createUserControllerFn, loginUserpControllerFn};