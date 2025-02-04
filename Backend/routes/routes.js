var express = require('express');

var userController = require('../src/Users/UsersController');
var ChatController = require('../src/Messages/ChatController')
const router = express.Router();


router.route('/login').post(userController.loginUserpControllerFn);
router.route('/create').post(userController.createUserControllerFn);


router.route('/getchat').get(ChatController.getChat);
router.route('/chat').post(ChatController.createChat);


module.exports = router;
