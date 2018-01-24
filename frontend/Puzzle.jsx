import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateGameStatus, updateBoardRemote} from './store';

class Puzzle extends Component {
    constructor (props) {
        super(props);

        this.difficulty = props.difficulty?props.difficulty:4;
         //bind all functions
         this.initPuzzle = this.initPuzzle.bind(this);
         this.createTitle = this.createTitle.bind(this);
         this.buildPieces = this.buildPieces.bind(this);
         this.shuffleArray = this.shuffleArray.bind(this);
         this.shufflePuzzle = this.shufflePuzzle.bind(this);
         this.onPuzzleClick = this.onPuzzleClick.bind(this);
         this.checkPieceClicked = this.checkPieceClicked.bind(this);
         this.updatePuzzle = this.updatePuzzle.bind(this);
         this.pieceDropped = this.pieceDropped.bind(this);
         this.resetPuzzleAndCheckWin = this.resetPuzzleAndCheckWin.bind(this);
         this.gameOver = this.gameOver.bind(this);
 
    }

    initPuzzle(){
        this.PUZZLE_DIFFICULTY = 4;
        this.PUZZLE_HOVER_TINT = '#009900';
        //this.Y_OFFSET = 250;

         //define all constants
         this.img = new Image ();
         this.valid = false;
         this.img.src = this.props.img;
         console.log("initialized img to", this.props.img);
         this.pieces;
         this.puzzleWidth;
         this.puzzleHeight;
         this.pieceWidth;
         this.pieceHeight;
         this.currentPiece;
         this.currentDropPiece;
         this.mouse;
 
         this.canvas = this.refs.canvas;
         this.img.onload =  () => {
             console.log("onload image called");
             this.pieceWidth = Math.floor(this.img.width / this.PUZZLE_DIFFICULTY)
             this.pieceHeight = Math.floor(this.img.height / this.PUZZLE_DIFFICULTY)
             this.puzzleWidth = this.pieceWidth * this.PUZZLE_DIFFICULTY;
             this.puzzleHeight = this.pieceHeight * this.PUZZLE_DIFFICULTY;
             this.stage = this.canvas.getContext('2d');
             this.canvas.width = this.puzzleWidth;
             this.canvas.height = this.puzzleHeight;
             this.canvas.style.border = "1px solid black";
 
             
            this.pieces = [];
            this.mouse = {x:0,y:0};
            this.currentPiece = null;
            this.currentDropPiece = null;
            this.stage.drawImage(this.img, 0, 0, this.puzzleWidth, this.puzzleHeight, 0, 0, this.puzzleWidth, this.puzzleHeight);
            //this.createTitle("Click to Start Puzzle");
            this.buildPieces();
         };


        
    }
    
    createTitle(msg){
        this.stage.fillStyle = "#000000";
        this.stage.globalAlpha = .4;
        this.stage.fillRect(100,this.puzzleHeight - 40,this.puzzleWidth - 200,40);
        this.stage.fillStyle = "#FFFFFF";
        this.stage.globalAlpha = 1;
        this.stage.textAlign = "center";
        this.stage.textBaseline = "middle";
        this.stage.font = "20px Arial";
        this.stage.fillText(msg,this.puzzleWidth / 2,this.puzzleHeight - 20);
    }

    buildPieces(){
        for(let i = 0, yPos = 0, xPos = 0;i < this.PUZZLE_DIFFICULTY * this.PUZZLE_DIFFICULTY;i++){
            const piece = {};
            piece.sx = xPos;
            piece.sy = yPos;
            piece.id = i;
            this.pieces.push(piece);
            xPos += this.pieceWidth;
            if(xPos >= this.puzzleWidth){
                xPos = 0;
                yPos += this.pieceHeight;
            }
        }
        if (this.props.status === 'start' || this.props.status === 'running') {
            console.log("catching up with shuffle!!!");
            this.shufflePuzzle();
        }
       // this.canvas.onmousedown = this.shufflePuzzle;
    }

    shufflePuzzle(){
        console.log('pieces', this.pieces);
        if (!this.pieces) return;
        this.valid = true;
        this.pieces = this.shuffleArray(this.pieces);
        this.stage.clearRect(0,0,this.puzzleWidth,this.puzzleHeight);
        for(let i = 0, xPos = 0, yPos = 0;i < this.pieces.length;i++){
            const piece = this.pieces[i];
            piece.xPos = xPos;
            piece.yPos = yPos;
            this.stage.drawImage(this.img, piece.sx, piece.sy, this.pieceWidth, this.pieceHeight, xPos, yPos, this.pieceWidth, this.pieceHeight);
            this.stage.strokeRect(xPos, yPos, this.pieceWidth,this.pieceHeight);
            xPos += this.pieceWidth;
            if(xPos >= this.puzzleWidth){
                xPos = 0;
                yPos += this.pieceHeight;
            }
        }
        this.canvas.onmousedown = this.onPuzzleClick;
    }

    shuffleArray(o){
        // for(let j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        // return o;
        console.log("shuffling array", o, this.props.board);
        return o.map ( (piece, i) => o[this.props.board[i]]); 
    }

    onPuzzleClick(e){
        // if(e.layerX || e.layerX == 0){
        //     this.mouse.x = e.layerX - this.canvas.offsetLeft;
        //     this.mouse.y = e.layerY - this.canvas.offsetTop;
        // }
        // else if(e.offsetX || e.offsetX == 0){
        //     this.mouse.x = e.offsetX - this.canvas.offsetLeft;
        //     this.mouse.y = e.offsetY - this.canvas.offsetTop;
        // }
        if (!this.valid) return;
        if(e.layerX || e.layerX == 0){
            this.mouse.x = e.layerX;
            this.mouse.y = e.layerY;
        }
        else if(e.offsetX || e.offsetX == 0){
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        }
        
        //this.mouse.y += this.Y_OFFSET;
        this.currentPiece = this.checkPieceClicked();
        if(this.currentPiece != null){
            this.stage.clearRect(this.currentPiece.xPos,this.currentPiece.yPos,this.pieceWidth,this.pieceHeight);
            this.stage.save();
            this.stage.globalAlpha = .9;
            this.stage.drawImage(this.img, this.currentPiece.sx, this.currentPiece.sy, this.pieceWidth, this.pieceHeight, this.mouse.x - (this.pieceWidth / 2), this.mouse.y - (this.pieceHeight / 2), this.pieceWidth, this.pieceHeight);
            this.stage.restore();
            this.canvas.onmousemove = this.updatePuzzle;
            this.canvas.onmouseup = this.pieceDropped;
        }
    }

    checkPieceClicked(){
        for(let i = 0;i < this.pieces.length;i++){
            const piece = this.pieces[i];
            //console.log('yPos: ',piece.yPos, 'mouse', this.mouse.y)
            if(this.mouse.x < piece.xPos || this.mouse.x > (piece.xPos + this.pieceWidth) || this.mouse.y  < piece.yPos || this.mouse.y > (piece.yPos + this.pieceHeight)){
                //PIECE NOT HIT
            }
            else{
                //console.log("match");
                return piece;
            }
        }
        return null;
    }

    updatePuzzle(e){
        this.currentDropPiece = null;
        // if(e.layerX || e.layerX == 0){
        //     this.mouse.x = e.layerX - this.canvas.offsetLeft;
        //     this.mouse.y = e.layerY - this.canvas.offsetTop;
        // }
        // else if(e.offsetX || e.offsetX == 0){
        //     this.mouse.x = e.offsetX - this.canvas.offsetLeft;
        //     this.mouse.y = e.offsetY - this.canvas.offsetTop;
        // }
        if(e.layerX || e.layerX == 0){
            this.mouse.x = e.layerX;
            this.mouse.y = e.layerY;
        }
        else if(e.offsetX || e.offsetX == 0){
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        }
        //this.mouse.y += this.Y_OFFSET;
        this.stage.clearRect(0,0,this.puzzleWidth,this.puzzleHeight);
        for(let i = 0;i < this.pieces.length;i++){
            const piece = this.pieces[i];
            //console.log('looking at', piece.yPos, 'current', this.currentPiece.yPos);
            if(piece == this.currentPiece){
                continue;
            }
            this.stage.drawImage(this.img, piece.sx, piece.sy, this.pieceWidth, this.pieceHeight, piece.xPos, piece.yPos, this.pieceWidth, this.pieceHeight);
            this.stage.strokeRect(piece.xPos, piece.yPos, this.pieceWidth,this.pieceHeight);
            if(this.currentDropPiece == null){
                if(this.mouse.x < piece.xPos || this.mouse.x > (piece.xPos + this.pieceWidth) || this.mouse.y < piece.yPos || this.mouse.y > (piece.yPos + this.pieceHeight)){
                    //NOT OVER
                }
                else{
                    this.currentDropPiece = piece;
                    this.stage.save();
                    this.stage.globalAlpha = .4;
                    this.stage.fillStyle = this.PUZZLE_HOVER_TINT;
                    this.stage.fillRect(this.currentDropPiece.xPos,this.currentDropPiece.yPos,this.pieceWidth, this.pieceHeight);
                    this.stage.restore();
                }
            }
        }
        this.stage.save();
        this.stage.globalAlpha = .6;
        this.stage.drawImage(this.img, this.currentPiece.sx, this.currentPiece.sy, this.pieceWidth, this.pieceHeight, this.mouse.x - (this.pieceWidth / 2), this.mouse.y - (this.pieceHeight / 2), this.pieceWidth, this.pieceHeight);
        this.stage.restore();
        this.stage.strokeRect( this.mouse.x - (this.pieceWidth / 2), this.mouse.y - (this.pieceHeight / 2), this.pieceWidth,this.pieceHeight);
    }

    pieceDropped(e){
        this.updatePiece();
        console.log("Triggering update in pieceDropped");
        this.props.pieceMoved(this.pieces);
    }

    updatePiece() {
        this.canvas.onmousemove = null;
        this.canvas.onmouseup = null;
        if(this.currentDropPiece != null){
            var tmp = {xPos:this.currentPiece.xPos,yPos:this.currentPiece.yPos, id:this.currentPiece.id};
            //console.log('current piece', tmp, 'dropPiece', {xPos:this.currentDropPiece.xPos, yPos:this.currentDropPiece.yPos}); 
            this.currentPiece.xPos = this.currentDropPiece.xPos;
            this.currentPiece.yPos = this.currentDropPiece.yPos;
            this.currentPiece.id = this.currentDropPiece.id;
            this.currentDropPiece.xPos = tmp.xPos;
            this.currentDropPiece.yPos = tmp.yPos;
            this.currentDropPiece.id = tmp.id;
        }
        this.resetPuzzleAndCheckWin();
    }

    resetPuzzleAndCheckWin(){
        this.currentDropPiece = null;
        this.stage.clearRect(0,0,this.puzzleWidth,this.puzzleHeight);
        let gameWin = true;
        for(let i = 0;i < this.pieces.length;i++){
            const piece = this.pieces[i];
            this.stage.drawImage(this.img, piece.sx, piece.sy, this.pieceWidth, this.pieceHeight, piece.xPos, piece.yPos, this.pieceWidth, this.pieceHeight);
            this.stage.strokeRect(piece.xPos, piece.yPos, this.pieceWidth,this.pieceHeight);
            if(piece.xPos != piece.sx || piece.yPos != piece.sy){
                gameWin = false;
            }
        }
        if(gameWin){
            setTimeout(this.gameOver,500);
        }
    }

    gameOver(){
        this.canvas.onmousedown = null;
        this.canvas.onmousemove = null;
        this.canvas.onmouseup = null;
        this.initPuzzle();
    }

    clear() {
        console.log("Clearing image");
        this.img = null;
    }

    componentDidMount () {

    }

    componentWillUpdate (props) {
        console.log("component will update to ", props.status);
        if (props.status === 'start') {
            console.log("calling shuffle");
            this.shufflePuzzle();
        } 
    }

    updateBoard (current, newBoard) {
        //find the pair that needs to be swapped
        const needUpdate = current.filter ( (piece, i) => newBoard[i] !== piece.id);
        this.currentPiece = needUpdate[0];
        this.currentDropPiece = needUpdate[1];
        this.updatePiece();
    }

    componentDidUpdate () {
        //this is triggered when the image is set in the Topbar component
        if (this.props.status === 'loaded') {
            console.log("initializing puzzle");
            this.initPuzzle ();
        } else if (this.props.status === 'start' ) {
            this.props.setGameStatusToRunning ();
        } else if (this.props.status === 'new') {
            this.clear();
        } else if (this.props.status === 'running' && this.pieces) {
            this.updateBoard (this.pieces, this.props.board);
        }
    }

    render () {
        console.log("Hit render with props", this.props);
        
            return (
                this.props.status!=='new' ?
                <div>
                    <canvas ref="canvas" id="canvas"/>
                </div>
                : null
            );
    }
}

const mapStateToProps = (state) => ({
    board: state.board,
    img: state.images.img,
    status: state.game
});

const mapDispatchToProps = dispatch => ({
    setGameStatusToRunning: () => dispatch (updateGameStatus('running')),
    pieceMoved: board => {
        const boardPos = board.map(piece => piece.id);
        dispatch (updateBoardRemote (boardPos));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Puzzle);