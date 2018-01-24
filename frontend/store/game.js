export const START_GAME_MULTI = 'START_GAME_MULTI';
export const UPDATE_GAME_STATUS = 'UPDATE_GAME_STATUS';

export function startGameMulti () {
    return {type: START_GAME_MULTI, status: 'pending'};
}

export function updateGameStatus (status) {
    return {type: UPDATE_GAME_STATUS, status}
}
export default function (state='', action) {
    //start game actions don't update the state, their payload is used in the redux-socket only to 
    //forward image to the server
    switch (action.type){
        case UPDATE_GAME_STATUS: 
        case START_GAME_MULTI:
            return action.status;
        default: return state;
    }
}