import React, { Component } from 'react';
import Puzzle from './puzzle';

export default class PuzzleGame extends Component {
    constructor (difficulty, imgUrl) {
        super();
         this.difficulty = difficulty;
         this.img = new Image ();
         this.img.src = imgUrl;
         
        // this.puzzle = Puzzle(difficulty, img);
        // this.refs.canvas.width = this.puzzle.puzzleWidth;
        // this.refs.canvas.height = this.puzzle.puzzleHeight;
        // this.ctx = this.puzzle.stage;
    }

    componentDidMount () {
        console.log("this.refs", this.refs.canvas);
        this.puzzle = Puzzle (this.difficulty, this.img, this.refs.canvas);
    }

    render () {
        return (
            <canvas ref="canvas" id="canvas"/>
        );
    }
}