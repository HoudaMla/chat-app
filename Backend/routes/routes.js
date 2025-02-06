var express = require('express');

var userController = require('../src/Users/UsersController');
var ChatController = require('../src/Messages/ChatController')
const router = express.Router();


router.route('/login').post(userController.loginUserpControllerFn);
router.route('/create').post(userController.createUserControllerFn);

router.route('/onlineuser').get(userController.getOnlineUsers);
router.route('/logout').post(userController.disconect);  

// router.route('/connected').get(userController.getConnectedUsers);


router.route('/:user1/:user2').get(ChatController.getChat);

// router.route('/chat').post(ChatController.createChat);

// router.route('/chat').get(ChatController.getMessages);



module.exports = router;
