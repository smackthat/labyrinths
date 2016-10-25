
//An array as a maze with one tile 10 pix.
//TODO: Maze drawing should be handled by a different function altogether. 
//Maze just generates the maze and creates a map for other objects to utilize.


$(document).ready(function() {
	
	var c = document.getElementById('screen');
    var ctx = c.getContext('2d');
	var pix = 10;	//Important! The size of each tile (careful with this)
	
	
	//The Maze class responible for generating the maze and storing it into an array.
	function Maze(height,width) {
		this.height = height;	//The height in tiles
		this.width = width;		//The width in tiles
		this.entry = {			//The entry tile to the maze
			x : 0,
			y : 2 + 2*Math.floor(Math.random()*9),
			parent: null,
			visited: false
			};
		this.exit = {
			x: width-1,
			y: 2 + 2*Math.floor(Math.random()*9),
			parent: this.last,
			visited: false
			};
		this.first = {		//The first tile adjacent to the starting tile on X-axis
			x: this.entry.x+1,
			y: this.entry.y,
			parent: null,
			visited: false
			};
		this.last = {		//The last tile adjacent to the exit tile on X-axis
			x: this.exit.x-1,
			y: this.exit.y,
			parent: null,
			visited: false
			};

			
		this.generate = function() {
			var array = [{}];
			var frontier = [{}];	//For storing the frontier during generation (Prim's algorithm)
			
			for (var i = 0; i < height; i++) {
				array[i] = new Array();
				for (var j = 0; j < width; j++) {
					var tile = {
						x: j,
						y: i,
						parent: null,
						visited: false
						
					};
					
					array[i][j] = tile;
				};
			};
			array[this.entry.y][this.entry.x] = this.entry;
			array[this.exit.y][this.exit.x] = this.exit;
			this.entry.visited = true;
			this.exit.visited = true;
			
			
			ctx.fillStyle = "crimson";
			ctx.fillRect(pix*this.entry.x,pix*this.entry.y,pix,pix);
			ctx.fillRect(pix*width-pix,pix*this.exit.y,pix,pix);

			setFrontier(this.first, array, frontier);	//Laying the basis for the generation
			
			/*TODO: Create variation to the candidate picking methods.
			*Example: var candid = frontier.pop();	
						-> creates a very straightforward, twisting maze (boring)
					  
					  var candid = frontier.shift();
					  frontier.splice(0,1);
					    -> creates a maze with empty spaces, erratic twists and long, boring corridors with dead-ends
						
					  
					  
			*/
			
			//Randomized maze generator - 4 different possibilities
			while(frontier.length > 0) {
				var index = Math.floor(Math.random() * frontier.length);	//Get a randomized index from the frontier
			
				switch(Math.floor(Math.random()*3)) {
					case 1:		//Straight line
						candid = frontier.pop();
						break;
					case 2:
						candid = frontier.shift();
						break;
					default:
						candid = frontier[index];	//And save the randomly picked object as a new tile
						frontier.splice(index,1);	
				};
				

			
				setFrontier(candid, array, frontier);
				
				
				var temp;
				//Finding the correct wall between the tile and its parent, making it a new tile
				if (candid.parent != null) {
				if (candid.x === candid.parent.x) {
					if (candid.y < candid.parent.y) {
						temp = array[candid.y+1][candid.x];
						}
					else {
						temp = array[candid.y-1][candid.x];
						}
					}
				else {
					if (candid.x < candid.parent.x) {
						temp = array[candid.y][candid.x+1];
						}
					else {
						temp = array[candid.y][candid.x-1];
						}
				}
				temp.visited = true;
				temp.parent = candid.parent;
				candid.parent = temp;
				setTimeout(function() {
					drawTile(temp.x,temp.y);
				},100);
				ctx.fillRect(pix*temp.x,pix*temp.y,pix,pix);
				}
				
				
				
			}
			
			//To make sure that the tile next to exit is a part of the maze
			if (this.last.visited === false) {
				this.last.visited === true;
				ctx.fillRect(pix*this.last.x,pix*this.last.y,pix,pix);
				}
			
		}
		
		//Draws one tile to a specific location (x,y)
		function drawTile(x,y) {
			ctx.fillRect(pix*x,pix*y,pix,pix);
		}
		
		//Sets the frontier tiles so that the tiles form a symmetric grid with spaces between them 
		function setFrontier(candid, array, frontier) {
			candid.visited = true;
			setTimeout(function() {
				drawTile(candid.x,candid.y);
			},2000);
			//ctx.fillRect(pix*candid.x,pix*candid.y,pix,pix);
			//Check the array place two tile up from the candidate tile and add it if not part of the maze yet.
			if (candid.y > 1) {		
					if (array[candid.y-2][candid.x].visited === false) {
						array[candid.y-2][candid.x].parent = candid;
						var temp1 = array[candid.y-2][candid.x];
						frontier.push(temp1);
					}
				}
			//Check the place two tiles down
			if (candid.y < height-2) {
				if (array[candid.y+2][candid.x].visited === false) {
					array[candid.y+2][candid.x].parent = candid;
					var temp2 = array[candid.y+2][candid.x];
					frontier.push(temp2);
					}
				}
			//Two tiles to the left
			if (candid.x > 1) {
				if (array[candid.y][candid.x-2].visited === false) {
					array[candid.y][candid.x-2].parent = candid;
					var temp3 = array[candid.y][candid.x-2];
					frontier.push(temp3);
					}
				}
			//Two tiles to the right
			if (candid.x < width-2) {
				if (array[candid.y][candid.x+2].visited === false) {
					array[candid.y][candid.x+2].parent = candid;
					var temp4 = array[candid.y][candid.x+2];
					frontier.push(temp4);
					}
				}
		}
		
	
	}
	
	
	
	var theMaze = new Maze(50,90);
	theMaze.generate();
	

});

	

