
var rows = 20
var cols = 20

var cubeWidth = 10

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
	cubes[0][0].setCurrent();
	cubes[0][0].draw();
	currentCube = cubes[0][0];
}

function draw() {
	var neighbours = getNeighborsOfCube(currentCube);
	if(neighbours.length > 0){
		var randInd = Math.floor(Math.random() * neighbours.length);
		var nextCube = neighbours[randInd];
		//2
		stack.push(currentCube);
		//3
		removeWall(currentCube, nextCube);
		//4
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
		console.log("maze is complete");
		noLoop();
	}
}

function removeWall(currCube, nextCube){
	if(currCube.y < nextCube.y){ //if above
		currCube.hasBottom = false;
		nextCube.hasTop = false;
	}else if(currCube.x > nextCube.x){ //if to right
		currCube.hasLeft = false;
		nextCube.hasRight = false;
	}else if(currCube.y > nextCube.y){ //if below
		currCube.hasTop = false;
		nextCube.hasBottom = false;
	}else{ //if to left
		currCube.hasRight = false;
		nextCube.hasLeft = false;
	}
}

//returns a list of all unvisited neighbours of a cube
function getNeighborsOfCube(cube){		//i, j is its row, col position in the cubes[][] array
	var i = cube.x / cubeWidth;
	var j = cube.y / cubeWidth;
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
	var newNeighbours = [];
	var insertInd = 0;
	for(var ind = 0; ind < neighbours.length; ind++){
		if(!neighbours[ind].visited){
			newNeighbours[insertInd] = neighbours[ind];
			insertInd += 1;
		}
	}
	return newNeighbours
}
