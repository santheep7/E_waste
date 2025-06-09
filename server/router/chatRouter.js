const express = require('express');
const router = express.Router();
const chatbotController = require('../Controller/chatbotControl');

router.post('/chat', chatbotController.chatWithDialogflow);

module.exports = router;
