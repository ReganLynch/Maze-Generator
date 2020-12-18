// ------------ this defines a cube object ------------------

function cube(x, y, w){
  this.x = x;
  this.y = y;
  this.w = w;

  this.cellPosX = (this.x * this.w * 2) + this.w
  this.cellPosY = (this.y * this.w * 2) + this.w

  this.visited = false;
  this.isCurrent = false;

  this.hasTop = true;
  this.hasBottom = true;
  this.hasLeft = true;
  this.hasRight = true;

  this.draw = function(){
    this.drawRect();
    this.drawWalls();
  }

  this.setCurrent = function(){
    this.isCurrent = true;
    this.visited = true;
  }

  this.drawRect = function(){
    noStroke();
    if (this.isCurrent){
      fill(255, 0, 0);
    }else if (this.visited){
      fill(255, 255, 255);
    }else{
      fill(0, 0, 0);
    }
    rect(this.cellPosX, this.cellPosY, this.w, this.w);
  }

  this.getNumRemainingWalls = function(num_cubes_x, num_cubes_y){
    wall_count = 0;
    if(this.hasTop && this.y != 0){
      wall_count += 1;
    }
    if(this.hasBottom && this.y != num_cubes_y - 1){
      wall_count += 1;
    }
    if(this.hasLeft && this.x != 0){
      wall_count += 1;
    }
    if(this.hasRight && this.x != num_cubes_x - 1){
      wall_count += 1;
    }
    return wall_count;
  }

  this.drawWalls = function(){
    noStroke();
    fill(0, 0, 0);
    //draw corners
    rect(this.cellPosX - this.w, this.cellPosY - this.w, this.w, this.w);
    rect(this.cellPosX + this.w, this.cellPosY + this.w, this.w, this.w);
    rect(this.cellPosX - this.w, this.cellPosY + this.w, this.w, this.w);
    rect(this.cellPosX + this.w, this.cellPosY - this.w, this.w, this.w);
    //draw sides
    if(this.hasTop){
      fill(0, 0, 0);
    }else{
      fill(255, 255, 255);
    }
    rect(this.cellPosX, this.cellPosY - this.w, this.w, this.w);
    if(this.hasBottom){
      fill(0, 0, 0);
    }else{
      fill(255, 255, 255);
    }
    rect(this.cellPosX, this.cellPosY + this.w, this.w, this.w);
    if(this.hasLeft){
      fill(0, 0, 0);
    }else{
      fill(255, 255, 255);
    }
    rect(this.cellPosX - this.w, this.cellPosY, this.w, this.w);
    if(this.hasRight){
      fill(0, 0, 0);
    }else{
      fill(255, 255, 255);
    }
    rect(this.cellPosX + this.w, this.cellPosY, this.w, this.w);
  }

}
