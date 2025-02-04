var userModel = require('./UsersModel');
var key = '123456789trytryrtyr';
var encryptor = require('simple-encryptor')(key);

module.exports.createrespDBService = (UserDetails) => {
    return new Promise((resolve, reject) => {
        var UserModelData = new userModel({
            email: UserDetails.email,
            password: encryptor.encrypt(UserDetails.password),
            
        });
        UserModelData.save()
            .then((result) => {
                resolve(true);
            })
            .catch((error) => {
                reject(false);
            });
    });
};

module.exports.loginrespDBService = (UserDetails) => {
    return new Promise((resolve, reject) => {
        userModel.findOne({ email: UserDetails.email })
            .then((result) => {
                if (!result) {
                    reject({ status: false, msg: "Invalid User Details" });
                    return;
                }
                var decrypted = encryptor.decrypt(result.password);

                if (decrypted === UserDetails.password) {
                    resolve({ status: "ok", msg: "User Validated Successfully", data:{id:result._id} });
                    console.log(result._id);
                } else {
                    reject({ status: false, msg: "Invalid Password" });
                }
            })
            .catch((error) => {
                reject({ status: false, msg: "Error occurred while fetching User details" });
            });
    });
};

