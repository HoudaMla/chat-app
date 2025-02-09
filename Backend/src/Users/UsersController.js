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


const getOnlineUsers = (req, res, next) => {
    UserModel.find({ isOnline: true }) 
        .then(users => {
            if (!users || users.length === 0) {
                return res.status(404).json({
                    message: "No online users found",
                });
            }
            console.log(users);
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving online users",
                error: err
            });
            console.log(err);
        });
};
var getAllUsers =(req,res,next)=>{
    UserModel.find()
    .then(resultat=>{
        res.status(200).json(
            resultat
    )})
    .catch(err=>{
        res.status(404).json({
        massage :err 

    })})
};
var disconect = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to log out" });
        }
        
        UserModel.updateOne({ _id: req.user.id }, { isOnline: false })
            .then(() => {
                console.log("User is marked as offline");
                res.status(200).json({ message: "Logged out successfully" });
            })
            .catch((err) => {
                console.log("Error updating user status:", err);
                res.status(500).json({ message: "Error updating user status" });
            });
    });
};


module.exports = { createUserControllerFn, loginUserpControllerFn, getOnlineUsers, disconect, getAllUsers};