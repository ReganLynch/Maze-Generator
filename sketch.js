
var window_Width;
var window_Height;

var cubes = []
var stack = []
var currentCube;

var fpsSlider;
const maxFPS = 60;

var rowsInput;
var rows;
var colsInput;
var cols;
var cubeSizeInput;
var cubeWidth;

var saveButton;
var generateNewMazeButton;

var canv;
var mazeIsComplete;

function setup() {
	//create the row number input
	rowsHeader = createElement('caption', '# Rows:');
	rowsHeader.position(80, 50);
	rowsInput = createInput('10');
	rowsInput.size(70, 15);
	rowsInput.position(70, 70);

	//create the column number input
	colsHeader = createElement('caption', '# Cols:');
	colsHeader.position(80, 100);
	colsInput = createInput('10');
	colsInput.size(70, 15);
	colsInput.position(70, 120);

	//create the column number input
	sizeHeader = createElement('caption', 'Cube Size (pixels)');
	sizeHeader.position(50, 150);
	cubeSizeInput = createInput('20');
	cubeSizeInput.size(70, 15);
	cubeSizeInput.position(70, 170);

	//create the generate maze button
	generateNewMazeButton = createButton('Generate New Maze');
  generateNewMazeButton.position(40, 220);
  generateNewMazeButton.mousePressed(generateNewCubes);

	//create the fps slider
	pfsHeader = createElement('caption', 'Speed');
	pfsHeader.position(80, 300);
	fpsSlider = createSlider(1, maxFPS, 5, 1);
	fpsSlider.style('width', '100px');
	fpsSlider.position(50, 320);

	//create the save button
	saveButton = createButton('Save Maze');
  saveButton.position(60, 380);
  saveButton.mousePressed(saveMaze);

	//initialize the cubes of the maze
	generateNewCubes();
}

//initializes the cubes of this maze
function generateNewCubes(){
	//get the number of rows, columns and the size of the cubes of the maze
	cols = int(rowsInput.value());
	rows = int(colsInput.value());

	if(cols < 0){
		cols = abs(cols);
	}
	if(rows < 0){
		rows = abs(rows);
	}
	if(cols == 0){
		cols = 1;
	}
	if(rows == 0){
		rows = 1;
	}

	rowsInput.value(cols);
	colsInput.value(rows);

	cubeWidth = int(cubeSizeInput.value());
	//re-initialize the canvas
	window_Width = rows * 2 * cubeWidth + (cubeWidth);
	window_Height = cols * 2 * cubeWidth + (cubeWidth);

	console.log('CANVAS DIMS: ', window_Width, window_Height);

	canv = createCanvas(window_Width, window_Height);
	canv.position(200, 50);

	mazeIsComplete = false;
	//reset cubes
	cubes = []
	//reset stack
	stack = []
	for(var i = 0; i < rows; i++){
		cubes[i] = []
		for(var j = 0; j < cols; j++){
				cubes[i][j] = new cube(i, j, cubeWidth);
				cubes[i][j].draw()
		}
	}

	//select a random x start point
	randx = Math.floor(Math.random() * rows);
	//select a random y start point
	randy = Math.floor(Math.random() * cols);
	cubes[randx][randy].setCurrent();
	cubes[randx][randy].draw();
	currentCube = cubes[randx][randy];
}

function draw() {
	if(!mazeIsComplete){
		//need to check if the framerate is maxed out
		loopTimes = 1;
		if(fpsSlider.value() == maxFPS){
			//if framerate is maxed out, dont display the maze generation
			loopTimes = 10000;
		}
		//set the framerate
		frameRate(fpsSlider.value());

		mazeLoop:
		for(i = 0; i < loopTimes; i++){
			var neighbours = getAllNeighboursOfCube(currentCube, true);

			if(neighbours.length > 0){
				var randInd = Math.floor(Math.random() * neighbours.length);
				var nextCube = neighbours[randInd];
				//2
				stack.push(currentCube);
				//remove wall between current cube and next cube
				removeWall(currentCube, nextCube);
				//3
				currentCube.isCurrent = false;
				currentCube.draw();
				nextCube.setCurrent();
				currentCube = nextCube;
				currentCube.draw();
			}else if (stack.length > 0){
				//part 2
				currentCube.isCurrent = false;
				currentCube.draw();
				currentCube = stack.pop();
				currentCube.setCurrent();
				currentCube.draw();
			}else{
				//draw the current cube normally
				currentCube.isCurrent = false;
				currentCube.draw();
				//generate a start and end point
				generateWallBreaks();
				generateStartAndEnd();
				mazeIsComplete = true;
				break mazeLoop;
			}
		}
	}
}

function generateStartAndEnd(){
	//get all valid start
	if(Math.random() <= 0.5){
		//when creating start pos on top
		validXPosTop = []
		for(i = 0; i < rows; i++){
			validXPosTop.push(cubes[i][0].cellPosX);
			if(!cubes[i][0].hasRight){
				validXPosTop.push(cubes[i][0].cellPosX + cubeWidth);
			}
		}
		//select a random top spot
		randInd = Math.floor(Math.random() * validXPosTop.length);
		noStroke();
		fill(255, 255, 255);
		rect(validXPosTop[randInd], 0, cubeWidth, cubeWidth);
	//when creating start pos on left
	}else{
		validYPosLeftSide = []
		for(i = 0; i < cols; i++){
			validYPosLeftSide.push(cubes[0][i].cellPosY);
			if(!cubes[0][i].hasBottom){
				validYPosLeftSide.push(cubes[0][i].cellPosY + cubeWidth);
			}
		}
		//select a random top spot
		randInd = Math.floor(Math.random() * validYPosLeftSide.length);
		noStroke();
		fill(255, 255, 255);
		rect(0, validYPosLeftSide[randInd], cubeWidth, cubeWidth);
	}

	//-----------------
	//now generate all valid bottom x positions
	if(Math.random() <= 0.5){
		//when creating end position on bottom
		validXPosBottom = []
		for(i = 0; i < rows; i++){
			validXPosBottom.push(cubes[i][cols-1].cellPosX);
			if(!cubes[i][cols-1].hasRight){
				validXPosBottom.push(cubes[i][cols-1].cellPosX + cubeWidth);
			}
		}
		//select a random xpos on bottom
		randInd = Math.floor(Math.random() * validXPosBottom.length);
		noStroke();
		fill(255, 255, 255);
		rect(validXPosBottom[randInd], window_Height-cubeWidth, cubeWidth, cubeWidth);
	//when creating end position on the right side
	}else{
		validYPosRight = []
		for(i = 0; i < cols; i++){
			validYPosRight.push(cubes[rows-1][i].cellPosY);
			if(!cubes[rows-1][i].hasBottom){
				validYPosRight.push(cubes[rows-1][i].cellPosY + cubeWidth);
			}
		}
		//select a random xpos on bottom
		randInd = Math.floor(Math.random() * validYPosRight.length);
		noStroke();
		fill(255, 255, 255);
		rect( window_Width-cubeWidth, validYPosRight[randInd], cubeWidth, cubeWidth);
	}
}

// TODO: ONLY BREAK WALLS THAT DONT CREATE SINGLE TILES
//generates breaks in walls, after the inital maze has been created.
//	this is done to generate alternate paths to solving the maze.
//		the algorithm used to generate the initial maze only gives one path from start to end.
function generateWallBreaks(){
	for(i = 0; i < rows; i++){
		for(j = 0; j < cols; j++){
			//only if this cube has 2 or more walls remaining
			if(cubes[i][j].getNumRemainingWalls(rows, cols) >= 2){
				//check if we should destroy any walls, based on wall-break-rate (30%)
				if(Math.random() <= 0.3){
					//get list of all neighbours
					neighbours = getAllNeighboursOfCube(cubes[i][j], false);
					//randomly select on of the neighbours
					selectedNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
					//while is not a wall between the current cube and the selected neighbour
					while(!wallExists(cubes[i][j], selectedNeighbour)){
						//re-select the neighbour until there is a wall between the two neighbours
						selectedNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
					}
					//remove the wall between the two neighbours
					removeWall(cubes[i][j], selectedNeighbour);
					//redraw the current cube and the selected neighbour
					cubes[i][j].draw();
					selectedNeighbour.draw();
				}
			}
		}
	}
}

//returns whether or not there is a wall between two cubes
function wallExists(cube1, cube2){
	//check the 4 scenarios
	//	cube2 is above cube1
	if(cube1.x == cube2.x && cube1.y == cube2.y + 1){
		return cube1.hasTop && cube2.hasBottom
	// cube2 is below cube2
	}else if(cube1.x == cube2.x && cube1.y == cube2.y - 1){
		return cube1.hasBottom && cube2.hasTop
	//cube2 is to the left of cube1
	}else if(cube1.x == cube2.x + 1 && cube1.y == cube2.y){
		return cube1.hasLeft && cube2.hasRight
	//cube2 is to the right of cube1
	}else if(cube1.x == cube2.x - 1 && cube1.y == cube2.y){
		return cube1.hasRight && cube2.hasLeft
	}
	return false;
}

//removes a wall between two cubes
function removeWall(currCube, nextCube){
	//find out the remative positions of the cubes to eachother
	if(currCube.x == nextCube.x - 1){ //if next is to the right
		currCube.hasRight = false;
		nextCube.hasLeft = false;
	}else if(currCube.x == nextCube.x + 1){	//if next cube is to the left
		currCube.hasLeft = false;
		nextCube.hasRight = false;
	}else if (currCube.y == nextCube.y + 1){ //if next cube is on top
		currCube.hasTop = false;
		nextCube.hasBottom = false;
	}else{ //if next cube is on bottom
		currCube.hasBottom = false;
		nextCube.hasTop = false;
	}
}

//returns a list of all Neighbours of a cube
function getAllNeighboursOfCube(cube, onlyUnvisited){		//i, j is its row, col position in the cubes[][] array
	var i = cube.x;
	var j = cube.y;
	var neighbours = []

	//getting neighbours
	if(i == 0 && j == 0){  //top left

		if(cols > 1){
			neighbours.push(cubes[i][j+1]);
		}
		if(rows > 1){
			neighbours.push(cubes[i+1][j]);
		}

	}else if(i == rows - 1 && j == 0){ // bottom left
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i][j+1]);
	}else if(i == 0 && j == cols - 1){	// top right
		neighbours.push(cubes[i][j-1]);

		if(rows > 1){
		neighbours.push(cubes[i+1][j]);
		}

	}else if(i == rows - 1 && j == cols - 1){	//bottom right
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i][j-1]);
	}else if(i == 0){	//on top

		if(rows > 1){
			neighbours.push(cubes[i+1][j]);
		}

		neighbours.push(cubes[i][j+1]);
		neighbours.push(cubes[i][j-1]);
	}else if(j == cols - 1){	//on right
		neighbours.push(cubes[i][j-1]);
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i+1][j]);
	}else if(i == rows - 1){ // on bottom
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i][j+1]);
		neighbours.push(cubes[i][j-1]);
	}else if(j == 0){ //on left
		neighbours.push(cubes[i][j+1]);
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i+1][j]);

	}else{ // in center
		neighbours.push(cubes[i+1][j]);
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i][j+1]);
		neighbours.push(cubes[i][j-1]);
	}

	//return only the unvisited neighbours
	newNeighbours = []
	for(var i = 0; i < neighbours.length; i++){
		if(neighbours[i] === undefined){
			//do nothing
		}else if(!neighbours[i].visited || !onlyUnvisited){
			newNeighbours.push(neighbours[i]);
		}
	}
	return newNeighbours
}

//saves the maze
function saveMaze(){
	if(mazeIsComplete){
		save(canv, 'maze.bmp');
	}
}
