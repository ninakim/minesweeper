// var row = document.getElementById("row").value;
// var col = document.getElementById("col").value;
// var mines = document.getElementById("mine").value;
var cols, rows, mines, numCells;

function checkInput(){
    cols = document.getElementById("col").value;
    rows = document.getElementById("row").value;
    mines = document.getElementById("mine").value;
    numCells = cols * rows;

    if (isNaN(cols)||isNaN(rows)||isNaN(mines)||
        width<8||height<8||width>40||height>30||mines<1||mines>(numCells)){
            return; //input is invalid
    } else {
        createMap(cols, rows, mines);
    }
}


function checkMap(x, y){
    //for (i=0; i<)
    return board[x+y*col];
}

function setTimer(){

}
    
// Board Object
function createMap(col, row, mine){
    //cells = [];
    board = [];
    //cellsRevealed = 0;
    minesPlaced = 0;
    //smile = false;
    var cells = [];

    for (i=0;i<row*col;i++) // Create the tiles.
    {
    cells[i] =document.createElement('button');        // Each tile is an HTML image.
    //cells[i].src="x.png";                        // Initial picture: uncovered tile.
    cells[i].style="position:absolute;height:30px; width: 30px";
    cells[i].style.top=50+Math.floor(i/col)*30;        // Place the tile vertically
    cells[i].style.left=400+i%col*30;                // and horizontally.
    cells[i].addEventListener('mousedown',click);        // Function 'click' will be executed when player clicks on a tile.
    cells[i].id=i;                                        // The id of the tile is its index.
    document.body.appendChild(cells[i]);                // Add the tile to the DOM.
    }

    while (minesPlaced < mine){
        i = Math.floor(Math.random()*col*row);
        if (board[i]!='mine'){
            board[i] = 'mine';
            minesPlaced++;
        }
    }

    for (k=0; k<row; k++){
        for (l=0; l<col; l++){
            if (checkMap(l,k) != 'mine'){
                var sum;
                if (checkMap(l-1, k-1) == 'mine'){ //upper left corner
                    sum++;
                }
                if (checkMap(l, k-1) == 'mine'){ //upper middle
                    sum++;
                }
                if (checkMap(l+1, k-1) == 'mine'){ //upper right corner
                    sum++;
                }
                if (checkMap(l-1, k) == 'mine'){ //middle left
                    sum++;
                }
                if (checkMap(l+1, k) == 'mine'){ //middle right
                    sum++;
                }
                if (checkMap(l-1, k+1) == 'mine'){ //lower left corner
                    sum++;
                }
                if (checkMap(l, k+1) == 'mine'){ //lower middle
                    sum++;
                }
                if (checkMap(l+1, k+1) == 'mine'){ //lower right corner
                    sum++;
                }
                board[l+k*col] = sum;

            }
        }
    }
}

function click(event){
    id = event.target.id;

    if(event.which==3)        // On right click:
        {
        switch(picture(id)){
            case 'x':cells[id].src='f.png';remaining--; break;         // If the tile is uncovered, set a flag.
            case 'f':cells[id].src='q.png';remaining++; break;         // If it's a flag, set a question mark.
            case 'q':cells[id].src='x.png';break;                        // If it's a question mark, set it to uncovered.
        }
        event.preventDefault();
    }
    document.getElementById('status').innerHTML="Mines remaining: "+remaining;                // Update the count of remaining mines.
    if (event.which == 1 && picture(id)!='f'){ //left click
        if (board[id] == 'mine'){
            //gameover, show all mines
            for (i=0; i<mapSize; i++){
                if(board[i]=='mine') tile[i].src="m.png";
            }
            rows, cols, mines = 0;
            document.getElementById('status').innerHTML='GAME OVER<br><br>Click here to restart';
        } else if (board[id] != 'mine'){
            reveal(id);
        }
    }

    if (cellsRevealed == minesPlaced){
        rows, cols, mines = 0;
        document.getElementById('status').innerHTML=`YOU WIN!<br><br>Click here to restart`;
    }
}

function reveal(id){
    if(board[id]!='mine' && picture(index)=="x"){
        cellsRevealed++;
        tile[index].src=board[index]+".png";        // Uncover the tile.

        var x=index%columns;        // Convert index into (x,y) coordinates.
        var y=Math.floor(index/columns);
        if(board[index]==0){        // If the value of the current tile is zero, check all the neighboring tiles:
            if(x>0&&picture(index-1)=="x")        reveal(index-1);                                        // left
            if(x<(columns-1)&&picture(+index+1)=="x") reveal(+index+1);                                // right
            if(y<(rows-1)&&picture(+index+columns)=="x") reveal(+index+columns);                        // down
            if(y>0&&picture(index-columns)=="x") reveal(index-columns);                                // up
            if(x>0&&y>0&&picture(index-columns-1)=="x") reveal(index-columns-1);                        // up & left
            if(x<(columns-1)&&y<(rows-1)&&picture(+index+columns+1)=="x") reveal(+index+columns+1);        // down & right
            if(x>0&&y<(rows-1)&&y<(rows-1)&&picture(+index+columns-1)=="x") reveal(+index+columns-1);                // down & left
            if(x<(columns-1)&&y>0&&y<(rows-1)&&picture(+index-columns+1)=="x") reveal(+index-columns+1);                // up & right
        }
    }
}
