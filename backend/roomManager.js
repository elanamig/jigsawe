function roomManager () {
    const rooms = {};
    let init = false;
    let roomManager;
    return (function () {
        if (!init) {
            roomManager = {
                initRoom: function (board, img, socket) {
                    const room = ""+new Date().getTime();
                    rooms[room] = {board, img};
                    roomManager.addToRoom(room, socket);
                    console.log('user', socket.id, 'joined room', room);
                },
                existsRoom: function (room) {
                    return rooms[room];
                },
                removeRoom: function (room) {
                    delete rooms[room];
                },
                addToRoom (room, socket) {
                    console.log("adding to room", room, rooms[room]);
                    if(roomManager.existsRoom(room)) {
                        const board = rooms[room].board;
                        const img = rooms[room].img;
                        socket.join(room);
                        socket.emit('start', {room, board, img})
                    }
                    else {
                        console.log ("room not found");
                    }
                },
                updateRoom (room, board, socket) {
                    if (roomManager.existsRoom(room) && board) {
                        rooms[room].board = board;
                        console.log("stored board in room Manager", board, room);
                        socket.broadcast.to(room).emit ('update', board);
                    }
                        
                }
    
            };
            init = true;
        }
        return roomManager;
    })();
}

module.exports = roomManager;
