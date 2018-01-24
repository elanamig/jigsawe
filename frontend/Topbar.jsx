import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateGameStatus, fetchImages, setImage, startGameMulti } from './store';

class Topbar extends Component {
    constructor (props) {
        super (props);
        this.displayImages = this.displayImages.bind (this);
    }

    componentDidMount () {
        this.props.loadImages();
    }

    getRoomUrl (room) {
        return `http://localhost:7777/?room=${room}`;
    }

    copyToClipboard () {
        const roomElement = document.getElementById('room');
        roomElement.select();
        document.execCommand ("Copy");
    }
    render () {
        return (
            <div>
                <div>
                    <h2>Jigsawe! </h2>
                     <h4>Select an image below, start game, invite others (or not...), go!</h4>
                     
                </div>
                <div >    
                    { this.displayImages () }
                </div>
                <div>
                   
                    {
                       this.props.status && this.props.status !== 'new' && this.props.status !== 'loaded' && this.props.img.length?
                            <div>
                                <span>Invite friends <input id='room' width={70} value={this.getRoomUrl(this.props.room)} readOnly='true' /> <span onClick={this.copyToClipboard}>Copy </span></span>
                                <span onClick={this.props.restartGame}>ReStart</span>
                            </div>
                        :  <span onClick={this.props.startGame}>Start</span>
                    }
                </div>
            </div>
        )
    }

    displayImages (){
        const imgs = this.props.imgs;
        return (
            <div className='images'> 
                {imgs.map ( (img, i) =>  <img key={i} height={'120px'} onClick={this.props.status==='running'?null:this.props.setImage} src={`${img}`} /> )}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    room: state.room,
    img: state.images.img,
    imgs: state.images.imgs,
    status: state.game
});

const mapDispatchToProps = (dispatch) => ({
    // updateRoomName: event => {
    //     dispatch(setRoomName(event.target.value));
    // },

    loadImages: () => {
        dispatch(fetchImages());
    },
    setImage: e=> {
        const img = e.target.src;
        dispatch(setImage(img));
        dispatch(updateGameStatus ('loaded'));
    },
    startGame: e=> {
        dispatch(startGameMulti ());
    },
    restartGame: () => dispatch(updateGameStatus('new'))
        
});




export default connect (mapStateToProps, mapDispatchToProps) (Topbar);