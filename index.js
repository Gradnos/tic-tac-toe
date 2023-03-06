
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


    const checkWinnerBoard = (array , freeSpaces) =>{
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

    let count;

    const getAiMove = () =>{

        count = 0;
        let BoardClone = [];
        let thisIcon = "o";

        for (let i = 0; i < array.length; i++) BoardClone[i] = array[i].slice();

        let bestScore = Infinity;
        let bestmove;


        let freeBoardSpaces = freeArraySpaces(BoardClone);
        freeBoardSpaces.forEach(space => {
            BoardClone[space[0]][space[1]] = thisIcon;
            let score = minmax(BoardClone, 0, false);
            console.log(`${space[0]};${space[1]} --- score : ${score}`);
           // console.log(`${space[0]} / ${space[1]} -- ${score}`);
            if(score < bestScore){

                bestScore = score;
                bestmove = [space[0], space[1]];
            }
            BoardClone[space[0]][space[1]] = null;
        });


        return bestmove;

    }

    const minmax = (board, depth, isMaxing ) =>{
        let string = "";
        for(k = 0; k<= depth; k++){
            string+= "_";
        }
        

        let freeBoardSpaces = freeArraySpaces(board);
        let winner = checkWinnerBoard(board , freeBoardSpaces.length);
        let thisIcon;
        let bestScore;

        if(winner!==null){
            count++;
            if(winner === "tie") return 0;
            if(winner === "x") return 10 - depth;
            if(winner === "o") return -10 + depth;
        }



        if(isMaxing) {
            thisIcon = "o"
            bestScore = (Infinity);
        }
        else {
            thisIcon = "x";
            bestScore = -Infinity;
        }
        

        freeBoardSpaces.forEach(space => {
            board[space[0]][space[1]] = thisIcon;
            let score = minmax(board, depth+1, !isMaxing);
            if (depth === 0) console.log(`-----${space[0]}/${space[1]}  ---   ${score}`);
            if(isMaxing){
                bestScore = Math.min(score, bestScore);
            } else{
                bestScore = Math.max(score, bestScore);
            }

            board[space[0]][space[1]] = null;
        });



        return bestScore;

    };

    const freeArraySpaces = (array) =>{
        let freeSpaces = [];
        for(i=0; i< array.length; i++){
            for(j=0; j< array[i].length; j++){
                if(array[i][j] === null) freeSpaces.push([i,j]);
            }
        }
        
        return freeSpaces;
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
        checkWinner,
        getAiMove
    };
})();

const player = (playerName, icon) => {
    let score = 0;

    const makeMove = (element) =>{
        gameBoard.setIconByElement(element, icon);
    };

    const makeAiMove = () =>{
        let move = gameBoard.getAiMove();
        gameBoard.setIconByCoords(move[0], move[1], icon);
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
        makeMove,
        makeAiMove
    }
}




const gameController = (() => {
    let currentPlayerId;
    let matchOngoing = false;
    let playerArr;
    let winner;
    let pvp = false;
    
    let newMatchButton = document.querySelector(".newMatch");
    let gameChoices = document.querySelectorAll(".choice");

    const startGame = () => {
        playerArr = [];
        playerArr.push(player("playe1", "x"));
        playerArr.push(player("player2", "o"));
        startMatch();
    };
    const onPlayerClick = (element) =>{
        if (!matchOngoing) return;
        playerArr[currentPlayerId].makeMove(element);
        currentPlayerId = (currentPlayerId + 1) % playerArr.length;
        winner = gameBoard.checkWinner();
        if(winner !== null){
            finishMatch(winner);
            return;
        }


        if(!pvp && playerArr[currentPlayerId].playerName === "player2"){
            playerArr[currentPlayerId].makeAiMove();
            currentPlayerId = (currentPlayerId + 1) % playerArr.length;
            winner = gameBoard.checkWinner();
            if(winner !== null){
                finishMatch(winner);
                return;
            }
        }
    }

    const startMatch = () => {
        newMatchButton.classList.add("hidden");
        matchOngoing = true;
        currentPlayerId = 0;
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
        newMatchButton.classList.remove("hidden");
    };

    gameChoices.forEach(element => {
        element.addEventListener("click", e =>{
            if(e.target.classList.contains("selected")) return;
            gameChoices.forEach(choice =>{
                if(choice !== e.target) choice.classList.remove("selected");
            });
            e.target.classList.add("selected");
            if(e.target.dataset.mode === "pvp") pvp = true;
            else pvp = false;

            startGame();
        });
    });


    return{
        startGame,
        onPlayerClick,
        startMatch
    };
})();

gameController.startGame();