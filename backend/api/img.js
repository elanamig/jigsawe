'use strict'
const router = require('express').Router();
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require ('fs'));
module.exports = router;

router.get ('/', (req, res, next) => {
    fs.readdirAsync ('./public/img')
    .then(data => {
        const urlArr = data.map(img=>`img/${img}`);
        res.send(urlArr);
    })
    .catch (err => {
        next (err);
    });
})