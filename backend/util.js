function generateRoomId () {
    return ""+new Date().getTime();
}

function prepareBoard (difficulty) {
    const imgIds = new Array (difficulty*difficulty);
    for (let i = 0; i<imgIds.length; i++) {
        imgIds[i] = i;
    }
    shuffleArray (imgIds);
    return imgIds;
}

function shuffleArray (o){
    for(let j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

module.exports = {
    generateRoomId, prepareBoard
}