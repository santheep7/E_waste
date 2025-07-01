const express = require('express');
const { createmessage } = require('../Controller/ContactControl');

const msgRoute =express.Router();
msgRoute.post('/createmsg',createmessage)
module.exports = msgRoute;