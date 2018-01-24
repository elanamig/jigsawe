
export const SET_ROOM_NAME = 'SET_ROOM_NAME';



export function setRoomName (room) {
    return {type: SET_ROOM_NAME, room};
}

export default function (state='', action) {
    switch (action.type){

        case SET_ROOM_NAME:
            return action.room;
        default: return state;
    }
}