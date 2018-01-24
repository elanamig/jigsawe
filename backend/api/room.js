'use strict'
const router = require('express').Router();
const roomManager = require('../roomManager') ();
module.exports = router;

router.get(':room', (req, res, next) => {
    roomManager.addToRoom(room);
    next();
});