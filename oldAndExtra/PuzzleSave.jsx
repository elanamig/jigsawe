import React, { Component } from 'react';

export default class Puzzle extends Component {
    constructor (props) {
        super(props);
        this.imgUrl = props.imgUrl?props.imgUrl:'../dog.jpg';
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
        this.pieces = [];
        this.mouse = {x:0,y:0};
        this.currentPiece = null;
        this.currentDropPiece = null;
        this.stage.drawImage(this.img, 0, 0, this.puzzleWidth, this.puzzleHeight, 0, 0, this.puzzleWidth, this.puzzleHeight);
        this.createTitle("Click to Start Puzzle");
        this.buildPieces();
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
            this.pieces.push(piece);
            xPos += this.pieceWidth;
            if(xPos >= this.puzzleWidth){
                xPos = 0;
                yPos += this.pieceHeight;
            }
        }
        document.onmousedown = this.shufflePuzzle;
    }

    shufflePuzzle(){
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
        document.onmousedown = this.onPuzzleClick;
    }

    shuffleArray(o){
        for(let j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    onPuzzleClick(e){
        if(e.layerX || e.layerX == 0){
            this.mouse.x = e.layerX - this.canvas.offsetLeft;
            this.mouse.y = e.layerY - this.canvas.offsetTop;
        }
        else if(e.offsetX || e.offsetX == 0){
            this.mouse.x = e.offsetX - this.canvas.offsetLeft;
            this.mouse.y = e.offsetY - this.canvas.offsetTop;
        }
        this.currentPiece = this.checkPieceClicked();
        if(this.currentPiece != null){
            this.stage.clearRect(this.currentPiece.xPos,this.currentPiece.yPos,this.pieceWidth,this.pieceHeight);
            this.stage.save();
            this.stage.globalAlpha = .9;
            this.stage.drawImage(this.img, this.currentPiece.sx, this.currentPiece.sy, this.pieceWidth, this.pieceHeight, this.mouse.x - (this.pieceWidth / 2), this.mouse.y - (this.pieceHeight / 2), this.pieceWidth, this.pieceHeight);
            this.stage.restore();
            document.onmousemove = this.updatePuzzle;
            document.onmouseup = this.pieceDropped;
        }
    }

    checkPieceClicked(){
        for(let i = 0;i < this.pieces.length;i++){
            const piece = this.pieces[i];
            if(this.mouse.x < piece.xPos || this.mouse.x > (piece.xPos + this.pieceWidth) || this.mouse.y < piece.yPos || this.mouse.y > (piece.yPos + this.pieceHeight)){
                //PIECE NOT HIT
            }
            else{
                return piece;
            }
        }
        return null;
    }

    updatePuzzle(e){
        this.currentDropPiece = null;
        if(e.layerX || e.layerX == 0){
            this.mouse.x = e.layerX - this.canvas.offsetLeft;
            this.mouse.y = e.layerY - this.canvas.offsetTop;
        }
        else if(e.offsetX || e.offsetX == 0){
            this.mouse.x = e.offsetX - this.canvas.offsetLeft;
            this.mouse.y = e.offsetY - this.canvas.offsetTop;
        }
        this.stage.clearRect(0,0,this.puzzleWidth,this.puzzleHeight);
        for(let i = 0;i < this.pieces.length;i++){
            const piece = this.pieces[i];
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
        document.onmousemove = null;
        document.onmouseup = null;
        if(this.currentDropPiece != null){
            var tmp = {xPos:this.currentPiece.xPos,yPos:this.currentPiece.yPos};
            this.currentPiece.xPos = this.currentDropPiece.xPos;
            this.currentPiece.yPos = this.currentDropPiece.yPos;
            this.currentDropPiece.xPos = tmp.xPos;
            this.currentDropPiece.yPos = tmp.yPos;
        }
        this.resetPuzzleAndCheckWin();
    }

    resetPuzzleAndCheckWin(){
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
        document.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        this.initPuzzle();
    }


    componentDidMount () {
        console.log("this.refs", this.refs.canvas);
        
        this.img = new Image ();
        this.img.src = "../dog.jpg";
         
         this.PUZZLE_DIFFICULTY = 4;
         this.PUZZLE_HOVER_TINT = '#009900';
       
         //define all constants
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

             this.pieceWidth = Math.floor(this.img.width / this.PUZZLE_DIFFICULTY)
             this.pieceHeight = Math.floor(this.img.height / this.PUZZLE_DIFFICULTY)
             this.puzzleWidth = this.pieceWidth * this.PUZZLE_DIFFICULTY;
             this.puzzleHeight = this.pieceHeight * this.PUZZLE_DIFFICULTY;
             this.stage = this.canvas.getContext('2d');
             this.canvas.width = this.puzzleWidth;
             this.canvas.height = this.puzzleHeight;
             this.canvas.style.border = "1px solid black";
 
             this.initPuzzle();
         };

    }

    render () {
        return (
            <canvas ref="canvas" id="canvas"/>
        );
    }
}