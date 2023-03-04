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
    const setIcon = (xCoord, yCoord, icon) => {
        if(setIconOnBoard(xCoord,yCoord,icon) === Error) {return console.log("ERROR IN setIcon")}
        array[xCoord][yCoord] = icon;
        console.table(array);
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
        setIcon,
    };
})();




const gameController = (() => {
    const onPlayerClick = (element) =>{
        console.log(element);
    }

    return{
        onPlayerClick
    };
})();

gameBoard.createEmptyArray(3);