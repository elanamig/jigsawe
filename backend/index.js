const path = require ('path');
const express = require ('express');
const bodyParser = require ('body-parser');
const morgan = require ('morgan'); //logging
const socketio = require('socket.io');
const {generateRoomId, prepareBoard} = require( './util');
const roomManager = require('./roomManager') ();
const {URL} = require ('url');
const PORT = process.env.PORT || 7777
//const db = require ('./db');

//1.  Sync the db
//db.sync ({force: false}).then(() => console.log('DB is synced'));

//1. Start the server
const app = express();

//2. Start client and monitor

//3.  setup middleware
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//4.  routes
app.use('/api', require ('./api'));

//5.  404 middleware
app.use ( (req, res, next) => {
    path.extname(req.path).length > 0 ? res.status(404).send('Not found') : next();
});

//6.  home page
app.use ('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

//7.  error handling middleware
app.use ((err, req, res, next) => {
    res.status (err.status || 500).send (err.message || 'Internal Server Error');
})

//8. start app
const server = app.listen (PORT, () => console.log("Server is up and running"));

//9 Set up io
//const roomState = {};
io = socketio(server);
io.on('connection', function (socket) {
    console.log(socket.id, 'connected');
  
    //socket.emit('load', inMemoryDrawHistory);
  
    // socket.on('draw', function (start, end, color) {
    //   inMemoryDrawHistory.push({ start, end, color });
    //   socket.broadcast.emit('draw', start, end, color);
    // });
  
    const url = new URL(socket.handshake.headers.referer);
    //console.log('ref', socket.handshake.headers.referer, 'url', url);
    //const room = url.substring(url.indexOf("room"))
    const room = url.searchParams.get('room');
    if (room) {
        roomManager.addToRoom (room, socket);
    }

    socket.on ('start',  img=> {
        console.log('Starting....', socket.id);
        if (!img) {
            img = './public/img/dog.jpg';
        }
        //put user in a room
        const board = prepareBoard (4);
        roomManager.initRoom(board, img, socket)
    });

    socket.on ('update', state => {
        console.log("got req to update from", socket.id);
        roomManager.updateRoom (state.room, state.board, socket);
    })

    socket.on('disconnect', function () {
      console.log('Goodbye, ', socket.id, ' :(');
    });
  });

//9 don't forget:
module.exports = app;