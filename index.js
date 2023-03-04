const gameBoard = (() =>{
    let array = [];
    let board = document.querySelector(".board");
    let arraySize = null;
    let r = document.documentElement;
    let boxStyle = "box";

    const createEmptyArray = (size) => {
        array = new Array(size);
        board.innerHTML = "";
        arraySize = size;
        r.style.setProperty("--board-divisions", size);
        for(let i = 0; i < size; i++){
            array[i] = new Array(size).fill(null);
        }
        fillBoard();
    };
    const setIcon = (xCoord, yCoord, icon) => {
        array[yCoord][xCoord] = icon;
    };
    const fillBoard = () => {
        for(let i = 0; i < arraySize*arraySize; i++){
            let newBox = document.createElement("div");
            newBox.classList.add(boxStyle);
            board.appendChild(newBox);
        }
    };


    return{
        createEmptyArray,
        setIcon
    };
})();

//gameBoard.createEmptyArray(3);