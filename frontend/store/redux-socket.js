import { UPDATE_GAME_STATUS, setImage, updateBoardLocal, UPDATE_BOARD_LOCAL, UPDATE_BOARD_REMOTE, setRoomName, START_GAME_MULTI, updateGameStatus } from './index';

export default socket => {
    socket.on ('connect', function () {
        console.log("Socket connected!");
    });

    return store => {
        //handle from server events
        //socket.on('updateBoard', board => store.dispatch(updateBoard(board)));
        socket.on('start', payload => {
            const room = payload.room;
            const board = payload.board;
            const img = payload.img;
            store.dispatch(setRoomName(room));
            store.dispatch(setImage(img));
            store.dispatch(updateBoardLocal(board));
            if (!store.getState().game.length) store.dispatch(updateGameStatus('loaded'));
            console.log("setting status to start");
            store.dispatch(updateGameStatus('start'));
        });

        socket.on('update', board =>  store.dispatch (updateBoardLocal(board)))
        
        return next => action => {
            switch (action.type) {
                case START_GAME_MULTI:
                   //handle TO SERVER events
                   if (store.getState().images.img)
                        socket.emit ('start', store.getState().images.img);
                    break;
                case UPDATE_GAME_STATUS:
                    if (action.status === 'new') {
                        store.dispatch (setImage (""));
                        //store.dispatch (updateGameStatus (null));
                    }
                    break;
                case UPDATE_BOARD_REMOTE:
                    socket.emit ('update', {room: store.getState().room, board: action.board});
                    break;
                
            }
            next (action);
        }
        
    }
}