const gameBoard = (() =>{
    let array = [];
    let board = document.querySelector(".board");
    let arraySize = null;
    let r = document.documentElement;
    let boxStyle = "box";
    let hoveredBox = null;

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
                newBox.dataset.coordY = i;
                newBox.dataset.coordX = j;
                setMouseHoverFunction(newBox);
                board.appendChild(newBox);
            }
        }
    };
    const setIcon = (xCoord, yCoord, icon) => {
        array[yCoord][xCoord] = icon;
        setIconOnBoard(xCoord,yCoord,icon);
    };
    const setIconOnBoard = (xCoord, yCoord, icon) => {
        let url;
        if(icon === "x"){ url = "";}
        else if(icon === "o"){ url = "";}
        

        setIconOnBoard(xCoord,yCoord,icon);
    };
    
    const setMouseHoverFunction = (element) => {
        element.addEventListener("mouseenter", (e) =>{
            hoveredBox = e.target;
            e.target.classList.add("hovered");
        });
        element.addEventListener("mouseleave", (e) =>{
            e.target.classList.remove("hovered");
        });
    }
    const getHoveredBox = () =>{
        return hoveredBox;
    }


    return{
        createEmptyArray,
        setIcon,
        getHoveredBox
    };
})();




const gameController = (() => {

})();

//gameBoard.createEmptyArray(3);