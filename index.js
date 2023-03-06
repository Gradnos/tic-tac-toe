/*  <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tilt+Warp&display=swap" rel="stylesheet"> */


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
                newBox.draggable = false;
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
        let deg = "520deg";
        if(icon === "x"){ url = "./img/cross.svg";}
        else if(icon === "o"){ url = "./img/circle.svg";}
        else {return Error};
        let box = board.querySelector(`[data-coords="${xCoord}-${yCoord}"]`)
        r.style.setProperty("--hueDeg", deg);
        box.dataset.icon = icon;    
        box.style.backgroundImage= `url(${url})`;
    
    };
    const addWinningStyle = (...elements) =>{
        elements.forEach(element => {
            element.classList.add("winning-line");
        });
    };

    const getElementByCoords = (x,y) =>{
        return board.querySelector(`[data-coords="${x}-${y}"]`)
    }

    const checkWinner = () =>{
        let winner = null;
        for(let i=0; i < arraySize; i++){
            if(array[i][0] !== null &&  array[i][0] == array[i][1] && array[i][0] == array[i][2]) {
                addWinningStyle(getElementByCoords(i,0), getElementByCoords(i,1), getElementByCoords(i,2));
                winner = array[i][0];
                return winner;
            }
        }

        for(let i=0; i < arraySize; i++){
            if(array[0][i] !== null &&  array[0][i] == array[1][i] && array[0][i] == array[2][i]) {
                addWinningStyle(getElementByCoords(0,i), getElementByCoords(1,i), getElementByCoords(2,i));
                winner = array[0][i];
                return winner;
            }
        }

        if(array[0][0] !== null && array[0][0] === array[1][1] && array[0][0] === array[2][2])
        {
            addWinningStyle(getElementByCoords(0,0), getElementByCoords(1,1), getElementByCoords(2,2));
            winner = array[0][0];
            return winner;
        }

        if(array[0][2] !== null && array[0][2] === array[1][1] && array[0][2] === array[2][0])
        {
            addWinningStyle(getElementByCoords(0,2), getElementByCoords(1,1), getElementByCoords(2,0));
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
    let score = 0;

    const makeMove = (element) =>{
        gameBoard.setIconByElement(element, icon);
    };
    const resetScore = ()=>{
        score = 0;
        displayScore();
    };
    const scoreAdd = (num) =>{
        score += num;
        displayScore();
    }
    const displayScore = () =>{
        let scoreDisplay = document.querySelector(`.score-${icon}`);
        scoreDisplay.innerText = `${icon.toUpperCase()} : ${score}`;
    }

    displayScore();
    return {
        playerName,
        icon,
        resetScore,
        scoreAdd,
        makeMove
    }
}




const gameController = (() => {
    let currentPlayedId;
    let matchOngoing = false;
    let playerArr;
    let winner;
    const startGame = () => {
        playerArr = [];
        playerArr.push(player("playe1", "x"));
        playerArr.push(player("player2", "o"));
        startMatch();
    };
    const onPlayerClick = (element) =>{
        if (!matchOngoing) return;
        playerArr[currentPlayedId].makeMove(element);
        currentPlayedId = (currentPlayedId + 1) % playerArr.length;
        winner = gameBoard.checkWinner();
        if(winner !== null){
            finishMatch(winner);
        }
    }
    const startMatch = () => {
        matchOngoing = true;
        currentPlayedId = 0;
        gameBoard.createEmptyArray(3);
    }

    const finishMatch = (winnerIcon) =>{
        matchOngoing = false;
        let winner;
        if (winnerIcon !== "tie"){
            playerArr.forEach(player => {
                if (player.icon === winnerIcon){
                    winner = player;
                    winner.scoreAdd(1);
                }
            });
        } else {
            winner = "tie";
        }
    };

    return{
        startGame,
        onPlayerClick
    };
})();

gameController.startGame();