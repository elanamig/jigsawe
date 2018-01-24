'use strict'
const apiRouter = require('express').Router()
module.exports = apiRouter;

apiRouter.use('/img', require('./img'));
//apiRouter.use('/room', require ('./room'));
apiRouter.use((req, res, next) => {
	res.status(404).send('Not found!');
});