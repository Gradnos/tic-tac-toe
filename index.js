const gameBoard = (() =>{
    let array = [];
    const createEmptyArray = (size) => {
        array = new Array(size);
        for(let i = 0; i < size; i++){
            array[i] = new Array(size).fill(null);
        }
    };
    const setIcon = (xCoord, yCoord, icon) => {
        array[yCoord][xCoord] = icon;
    };


    return{
        createEmptyArray,
        setIcon
    };
})();

gameBoard.createEmptyArray(3);