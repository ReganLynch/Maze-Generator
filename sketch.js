
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
	cubeWidth = int(cubeSizeInput.value());
	//re-initialize the canvas
	window_Width = rows * 2 * cubeWidth + (2*cubeWidth);
	window_Height = cols * 2 * cubeWidth + (2*cubeWidth);

	canv = createCanvas(window_Width, window_Height);
	canv.position(200, 50);

	mazeIsComplete = false;
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
			loopTimes = 1000;
		}
		//set the framerate
		frameRate(fpsSlider.value());

		mazeLoop:
		for(i = 0; i < loopTimes; i++){
			var neighbours = getAllUnvisitedNeighboursOfCube(currentCube);

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
				generateStartAndEnd();
				mazeIsComplete = true;
				break mazeLoop;
			}
		}
	}
}

function generateStartAndEnd(){
	//get all valid top positions
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
	//now generate all valid bottom x positions
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
	rect(validXPosBottom[randInd], window_Height-cubeWidth*2, cubeWidth, cubeWidth);

}

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
function getAllUnvisitedNeighboursOfCube(cube){		//i, j is its row, col position in the cubes[][] array
	var i = cube.x;
	var j = cube.y;
	var neighbours = []

	if(i == 0 && j == 0){  //top left
		neighbours.push(cubes[i][j+1]);
		neighbours.push(cubes[i+1][j]);
	}else if(i == rows - 1 && j == 0){ // bottom left
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i][j+1]);
	}else if(i == 0 && j == cols - 1){	// top right
		neighbours.push(cubes[i][j-1]);
		neighbours.push(cubes[i+1][j]);
	}else if(i == rows - 1 && j == cols - 1){	//bottom right
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i][j-1]);
	}else if(i == 0){	//on top
		neighbours.push(cubes[i+1][j]);
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
		}else if(!neighbours[i].visited){
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
