const gameBoard = (() =>{
    let array = [];
    let board = document.querySelector(".board");
    let arraySize = null;
    let freeSpaces =null;
    let r = document.documentElement;
    let boxStyle = "box";

    const createEmptyArray = (size) => {
        array = new Array(size);
        board.innerHTML = "";
        arraySize = size;
        freeSpaces  = arraySize * arraySize;
        r.style.setProperty("--board-divisions", size);
        for(let i = 0; i < size; i++){
            array[i] = new Array(size).fill(null);
        }
        fillBoard();
    };
    const fillBoard = () => {
        for(let i = 0; i < arraySize; i++){
            for(let j = 0; j < arraySize; j++){
                let newBox = document.createElement("div");
                newBox.classList.add(boxStyle);
                newBox.dataset.coords = `${i}-${j}`;
                setBoxEvents(newBox);
                board.appendChild(newBox);
            }
        }
    };
    const setIconByCoords = (xCoord, yCoord, icon) => {

        if(setIconOnBoard(xCoord,yCoord,icon) === Error) {return console.log("ERROR IN setIcon")}
        array[xCoord][yCoord] = icon;
    };
    const setIconOnBoard = (xCoord, yCoord, icon) => {
        freeSpaces--;
        let url;
        let deg;
        if(icon === "x"){ url = "./img/cross.svg"; deg = "520deg";}
        else if(icon === "o"){ url = "./img/circle.svg"; deg = "300deg"}
        else {return Error};
        let box = board.querySelector(`[data-coords="${xCoord}-${yCoord}"]`)
        r.style.setProperty("--hueDeg", deg);
        box.dataset.icon = icon;    
        box.style.backgroundImage= `url(${url})`;
    
    };

    const checkWinner = () =>{
        let winner = null;
        for(let i=0; i < arraySize; i++){
            if(array[i][0] !== null &&  array[i][0] == array[i][1] && array[i][0] == array[i][2]) {
                winner = array[i][0];
                return winner;
            }
        }

        for(let i=0; i < arraySize; i++){
            if(array[0][i] !== null &&  array[0][i] == array[1][i] && array[0][i] == array[2][i]) {
                winner = array[0][i];
                return winner;
            }
        }

        if(array[0][0] !== null && array[0][0] === array[1][1] && array[0][0] === array[2][2])
        {
            winner = array[0][0];
            return winner;
        }

        if(array[0][2] !== null && array[0][2] === array[1][1] && array[0][2] === array[2][0])
        {
            winner = array[0][2];
            return winner;
        }

        if(freeSpaces === 0) winner = "tie";


        return winner;
    };

    const setIconByElement = (element, icon) =>{
        let coords = getCoordsByElement(element);
        setIconByCoords(coords.x, coords.y, icon)
    };
    
    const getCoordsByElement = (element) =>{
        let dataCoords = element.dataset.coords;
        let array = dataCoords.split("-");
        let coords = {x:array[0],y:array[1]};
        return coords;
    };
    
    const setBoxEvents = (element) => {
        element.addEventListener("click",(e) =>{
            if(e.target.hasAttribute("data-icon")) return;
            gameController.onPlayerClick(e.target);
        });
        element.addEventListener("mouseenter", (e) =>{
            e.target.classList.add("hovered");
            if(e.target.hasAttribute("data-icon")) return;
            hoveredBox = e.target;
        });
        element.addEventListener("mouseleave", (e) =>{

            e.target.classList.remove("hovered");
        });
    }

    return{
        createEmptyArray,
        setIconByCoords,
        setIconByElement,
        checkWinner
    };
})();

const player = (playerName, icon) => {
    const makeMove = (element) =>{
        gameBoard.setIconByElement(element, icon);
    }
    return {
        playerName,
        icon,
        makeMove,
    }
}




const gameController = (() => {
    let currentPlayedId = 0;
    let gameOngoing = false;
    let playerArr = [];
    let winner = null;
    const startGame = () => {
        gameOngoing = true;
        playerArr.push(player("playe1", "x"));
        playerArr.push(player("player2", "o"));
        gameBoard.createEmptyArray(3);
    };
    const onPlayerClick = (element) =>{
        if (!gameOngoing) return;
        playerArr[currentPlayedId].makeMove(element);
        currentPlayedId = (currentPlayedId + 1) % playerArr.length;
        winner = gameBoard.checkWinner();
        if(winner !== null){
            gameOngoing = false;
        }
    }



    return{
        startGame,
        onPlayerClick
    };
})();

gameController.startGame();