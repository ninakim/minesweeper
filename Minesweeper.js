function checkMap(x, y){
        return board[x+y*cols];
}

function picture(index)        // This function returns the name of the image of the tile (uncovered/flag/question mark).
                        // To be more precise, it returns the last but four letter of the filename of the image.
                        // It would be more elegant if we created a separate array to indicate it, but I chose this clunky way to shorten the code a bit.
        {
        return tile[index].src.substr(tile[index].src.length-5,1);
        }

function startGame(){
        cols = document.getElementById("col").value;
        rows = document.getElementById("row").value;
        mines = document.getElementById("mine").value;
        numCells = cols * rows;

        if (isNaN(cols)||isNaN(rows)||isNaN(mines)||
                cols<8||rows<8||cols>40||rows>30||mines<1||mines>(numCells)){
                document.getElementById('status').innerHTML='INVALID<br><br>Click here to restart'; //input is invalid
        }
                
        document.getElementById('status').innerHTML=('Click on the tiles to reveal them');

        remaining = mines;        // The number of mines remaining to be found.
        tile=[];
        board=[];
        revealed=0;                // The number of revealed tiles.
        for (i=0;i<rows*cols;i++) // Create the tiles.
                {
                tile[i] =document.createElement('button');        // Each tile is an HTML image.
                tile[i].src="x.png";                        // Initial picture: uncovered tile.
                tile[i].style="position:absolute;height:30px; width: 30px";
                tile[i].style.top=50+Math.floor(i/cols)*30;        // Place the tile vertically
                tile[i].style.left=400+i%cols*30;                // and horizontally.
                tile[i].addEventListener('mousedown',click);        // Function 'click' will be executed when player clicks on a tile.
                tile[i].id=i;                                        // The id of the tile is its index.
                document.body.appendChild(tile[i]);                // Add the tile to the DOM.
                }
        // Place the mines:
        placed=0;
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
                        for (i=0;i<rows*cols;i++)
                                {
                                if(board[i]=='mine') tile[i].src="m.png";        // show all the mines,
                                if(board[i]!='mine'&&picture(i)=='f') tile[i].src="e.png";        // show a strike-through mine where flags were placed incorrectly.
                                }
                        document.getElementById('status').innerHTML='GAME OVER<br><br>Click here to restart';
                        }
                else
                        if(picture(id)=='x') reveal(id);        // otherwise reveal the tile.
                }
        if(revealed==rows*cols-mines)        // If all tiles revealed:
                {document.getElementById('status').innerHTML=`YOU WIN!<br><br>Click here to restart`;}        // you win!
        }
        
function reveal(index)        // Uncover the tile
        {
        if(board[index]!='mine'&&picture(index)=="x")        // If it's covered and not a mine:
                revealed++;                 // If it was uncovered, increase the count of revealed tiles.
                tile[index].src=board[index]+".png";        // Uncover the tile.
                var x=index%cols;        // Convert index into (x,y) coordinates.
                var y=Math.floor(index/cols);
                if(board[index]==0)        // If the value of the current tile is zero, check all the neighboring tiles:
                {
                if(x>0&&picture(index-1)=="x")        reveal(index-1);                                        // left
                if(x<(cols-1)&&picture(+index+1)=="x") reveal(+index+1);                                // right
                if(y<(rows-1)&&picture(+index+cols)=="x") reveal(+index+cols);                        // down
                if(y>0&&picture(index-cols)=="x") reveal(index-cols);                                // up
        
                if(x>0&&y>0&&picture(index-cols-1)=="x") reveal(index-cols-1);                        // up & left
                if(x<(cols-1)&&y<(rows-1)&&picture(+index+cols+1)=="x") reveal(+index+cols+1);        // down & right
                if(x>0&&y<(rows-1)&&y<(rows-1)&&picture(+index+cols-1)=="x") reveal(+index+cols-1);                // down & left
                if(x<(cols-1)&&y>0&&y<(rows-1)&&picture(+index-cols+1)=="x") reveal(+index-cols+1);                // up & right
                
                }
        }      
