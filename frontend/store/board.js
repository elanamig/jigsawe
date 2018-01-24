export const UPDATE_BOARD_LOCAL = 'UPDATE_BOARD_LOCAL';
export const UPDATE_BOARD_REMOTE = 'UPDATE_BOARD_REMOTE';
export const GET_BOARD = 'GET_BOARD';

export function updateBoardRemote (board) {
    return {type: UPDATE_BOARD_REMOTE, board};
}

export function updateBoardLocal(board) {
    return {type: UPDATE_BOARD_LOCAL, board};
}

export default function (state = [], action) {
    switch (action.type) {
        case UPDATE_BOARD_LOCAL:
            return action.board;
    }
    return state;
}