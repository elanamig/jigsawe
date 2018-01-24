import axios from 'axios';
import { SET_ROOM_NAME } from "./index";


export const LOAD_IMAGES = 'LOAD_IMAGES';
export const SET_IMAGE = 'SET_IMAGE';

export function loadImages (images) {
    return {type: LOAD_IMAGES, images};
}

export function setImage (image) {
    return {type: SET_IMAGE, image};
}

export function fetchImages () {
    return dispatch => {
        axios.get('/api/img')
        .then(res => res.data)
        .then(res => dispatch (loadImages(res)))
        .catch (err => console.err);
    }
}

const initState = {
    img: '',
    imgs: []
}

export default function (state = initState, action) {
    switch (action.type) {
        case LOAD_IMAGES:
            return {...state, imgs: action.images};
        case SET_IMAGE:
            return {...state, img: action.image};
        default: return state;
    }
}