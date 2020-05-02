
var cubeWidth = 20 

var rows = 10
var cols = 10

var window_Width = rows * cubeWidth
var window_Height = cols * cubeWidth

var cubes = []
var stack = []
var currentCube;

function setup() {
	createCanvas(window_Width, window_Height);
	frameRate(30);
	for(var i = 0; i < rows; i++){
		cubes[i] = []
		for(var j = 0; j < cols; j++){
				cubes[i][j] = new cube(i*cubeWidth, j*cubeWidth, cubeWidth, cubeWidth);
				cubes[i][j].draw()
		}
	}
	cubes[1][1].setCurrent();
	cubes[1][1].draw();
	currentCube = cubes[1][1];
}

function draw() {
	var neighbours = getValidNeighboursOfCube(currentCube);
	if(neighbours.length > 0){
		var randInd = Math.floor(Math.random() * neighbours.length);
		var nextCube = neighbours[randInd];
		//2
		stack.push(currentCube);
		//3
		currentCube.isCurrent = false;
		currentCube.draw()
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
		console.log("maze is complete");
		noLoop();
	}
}

//returns a list of all valid Neighbours of a cube
function getValidNeighboursOfCube(cube){
	var validNeighbours = [];
	var allCubeNeighbours = getAllNeighboursOfCube(cube);
	//if a Neighbour of the current cube
	for(var i = 0; i < allCubeNeighbours.length; i++){
		//check that we havent been to this neighbour
		if(!allCubeNeighbours[i].visited){
			neighboursOfNeighbor = getAllNeighboursOfCube(allCubeNeighbours[i]);
			//count the number of visited neighbours of the current neighbour
			var currNeighbourNumVisitedNeighbours = 0;
			for(var j = 0; j < neighboursOfNeighbor.length; j++){
				if(neighboursOfNeighbor[j].visited){
					currNeighbourNumVisitedNeighbours++;
				}
			}
			//
			if(currNeighbourNumVisitedNeighbours < 2){
				validNeighbours.push(allCubeNeighbours[i]);
			}
		}
	}
	return validNeighbours;
}

//returns a list of all Neighbours of a cube
function getAllNeighboursOfCube(cube){		//i, j is its row, col position in the cubes[][] array
	var i = cube.x / cubeWidth;
	var j = cube.y / cubeWidth;
	var neighbours = []

	if(i == 1 && j == 1){  //top left
		neighbours.push(cubes[i][j+1]);
		neighbours.push(cubes[i+1][j]);
	}else if(i == rows - 2 && j == 1){ // bottom left
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i][j+1]);
	}else if(i == 1 && j == cols - 2){	// top right
		neighbours.push(cubes[i][j-1]);
		neighbours.push(cubes[i+1][j]);
	}else if(i == rows - 2 && j == cols - 2){	//bottom right
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i][j-1]);
	}else if(i == 1){	//on top
		neighbours.push(cubes[i+1][j]);
		neighbours.push(cubes[i][j+1]);
		neighbours.push(cubes[i][j-1]);
	}else if(j == cols - 2){	//on right
		neighbours.push(cubes[i][j-1]);
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i+1][j]);
	}else if(i == rows - 2){ // on bottom
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i][j+1]);
		neighbours.push(cubes[i][j-1]);
	}else if(j == 1){ //on left
		neighbours.push(cubes[i][j+1]);
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i+1][j]);
	}else{ // in center
		neighbours.push(cubes[i+1][j]);
		neighbours.push(cubes[i-1][j]);
		neighbours.push(cubes[i][j+1]);
		neighbours.push(cubes[i][j-1]);
	}
	return neighbours
}
