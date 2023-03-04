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
        let url;
        if(icon === "x"){ url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrLmn8laj168RZaCgTrVF7co0kql_YPVIduA&usqp=CAU";}
        else if(icon === "o"){ url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoWuEgC8RDM3VPl9EPhSzOGVAqS-1sKp_OZQ&usqp=CAU";}
        else {return Error};
        let box = board.querySelector(`[data-coords="${xCoord}-${yCoord}"]`)
        box.dataset.icon = icon;    
        box.style.backgroundImage= `url(${url})`;
        console.log(box);
    };

    const setIconByElement = (element, icon) =>{
        let coords = getCoordsByElement(element);
        setIconByCoords(coords.x, coords.y, icon)
    };
    
    const getCoordsByElement = (element) =>{
        console.log(element)
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
        setIconByElement
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


let john = player("john", "x");
let dog = player("dog", "o");
let playerArr = [john,dog]
gameBoard.createEmptyArray(3);

const gameController = (() => {
    let currentPlayedId = 0;
    let currentPlayer = null;
    const onPlayerClick = (element) =>{
        currentPlayer = playerArr[currentPlayedId];
        playerArr[currentPlayedId].makeMove(element);
        currentPlayedId = (currentPlayedId + 1) % playerArr.length;
    }
    return{
        onPlayerClick
    };
})();