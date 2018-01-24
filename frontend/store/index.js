import {createStore, applyMiddleware, combineReducers} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import socketMiddleware from './redux-socket';
import { composeWithDevTools } from 'redux-devtools-extension';
import io from 'socket.io-client';
import board from './board';
import room from './room';
import images from './img';
import game from './game';

const reducer = combineReducers ({board, room, images, game});
const socket = io (window.location.origin);
const store = createStore (reducer, composeWithDevTools(applyMiddleware(thunkMiddleware, createLogger(), socketMiddleware(socket))));

export default store;

export * from './room';
export * from './img';
export * from './game';
export * from './board';
