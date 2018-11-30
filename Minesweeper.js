function check(x1, y1){
        return board[x1+y1*columns];
}

function checkInput(){
    col = document.getElementById("col").value;
    row = document.getElementById("row").value;
    mine = document.getElementById("mine").value;
    numCells = col * row;

    if (isNaN(col)||isNaN(row)||isNaN(mine)||
        col<8||row<8||col>40||row>30||mine<1||mine>(numCells)){
        document.getElementById('status').innerHTML='INVALID<br><br>Click here to restart'; //input is invalid
    } else {
        createMap(col, row, mine);
    }
}

function picture(index)        // This function returns the name of the image of the tile (uncovered/flag/question mark).
                        // To be more precise, it returns the last but four letter of the filename of the image.
                        // It would be more elegant if we created a separate array to indicate it, but I chose this clunky way to shorten the code a bit.
        {
        return tile[index].src.substr(tile[index].src.length-5,1);
        }
function createMap(cols, rows, mines)        // initialize the board
        {
        //this.cols = col;
        //this.rows = row;
        //this.mines = mine;
                
        document.getElementById('status').innerHTML=('Click on the tiles to reveal them');

        remaining = mines;        // The number of mines remaining to be found.
        tile=[];
        board=[];
        revealed=0;                // The number of revealed tiles.
        for (i=0;i<rows*columns;i++) // Create the tiles.
                {
                tile[i] =document.createElement('img');        // Each tile is an HTML image.
                tile[i].src="x.png";                        // Initial picture: uncovered tile.
                tile[i].style="position:absolute;height:30px; width: 30px";
                tile[i].style.top=50+Math.floor(i/columns)*30;        // Place the tile vertically
                tile[i].style.left=400+i%columns*30;                // and horizontally.
                tile[i].addEventListener('mousedown',click);        // Function 'click' will be executed when player clicks on a tile.
                tile[i].id=i;                                        // The id of the tile is its index.
                document.body.appendChild(tile[i]);                // Add the tile to the DOM.
                }
        // Place the mines:
        placed=0;
        do
                {
                i=Math.floor(Math.random()*columns*rows);        // Select a random tile.
                if (board[i]!='mine')        // Make sure the tile doesn't already have a mine.
                        {
                        board[i]='mine';        // Set the mine
                        placed++;        // and increase the count.
                        }        
                } while (placed<mines);        // Repeat until all mines are placed.
        
        for(var x=0;x<columns;x++)        // For each column
                for(y=0;y<rows+1;y++)        // and each row:
                        {
                        if(check(x,y)!='mine') //if the cell is not a mine:
                                {
                                board[x+y*columns]= // the value of the cell is the sum of mines in the eight neighboring tiles:
                                 ((check(x,y+1)=='mine')|0)        // down
                                +((check(x-1,y+1)=='mine')|0)        // down & left
                                +((check(x+1,y+1)=='mine')|0)        // down & right
                                +((check(x,y-1)=='mine')|0)        // up
                                +((check(x-1,y-1)=='mine')|0)        // up & left
                                +((check(x+1,y-1)=='mine')|0)        // up & right
                                +((check(x-1,y)=='mine')|0)        // left
                                +((check(x+1,y)=='mine')|0);        // right.
                                }
                        }
        }
function click(event)
        {
        var source = event.target;
                id=source.id;                        // The ID of the tile clicked by user.
        if(event.which==3)        // On right click:
                {
                switch(picture(id))
                        {
                        case 'x':tile[id].src='f.png';remaining--; break;         // If the tile is uncovered, set a flag.
                        case 'f':tile[id].src='q.png';remaining++; break;         // If it's a flag, set a question mark.
                        case 'q':tile[id].src='x.png';break;                        // If it's a question mark, set it to uncovered.
                        }
                event.preventDefault();
                }
        document.getElementById('status').innerHTML="Mines remaining: "+remaining;                // Update the count of remaining mines.
        if(event.which==1&&picture(id)!='f')        // On left click if the tile is not a flag:
                {
                if(board[id]=='mine')        // if the tile is a mine:
                        {
                        for (i=0;i<rows*columns;i++)
                                {
                                if(board[i]=='mine') tile[i].src="m.png";        // show all the mines,
                                if(board[i]!='mine'&&picture(i)=='f') tile[i].src="e.png";        // show a strike-through mine where flags were placed incorrectly.
                                }
                        document.getElementById('status').innerHTML='GAME OVER<br><br>Click here to restart';
                        }
                else
                        if(picture(id)=='x') reveal(id);        // otherwise reveal the tile.
                }
        if(revealed==rows*columns-mines)        // If all tiles revealed:
                {document.getElementById('status').innerHTML=`YOU WIN!<br><br>Click here to restart`;}        // you win!
        }
        
function reveal(index)        // Uncover the tile
        {
        if(board[index]!='mine'&&picture(index)=="x")        // If it's covered and not a mine:
                revealed++;                 // If it was uncovered, increase the count of revealed tiles.
                tile[index].src=board[index]+".png";        // Uncover the tile.
                var x=index%columns;        // Convert index into (x,y) coordinates.
                var y=Math.floor(index/columns);
                if(board[index]==0)        // If the value of the current tile is zero, check all the neighboring tiles:
                {
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
