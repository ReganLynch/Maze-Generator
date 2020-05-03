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

  this.highLight = function(){
    noStroke();
    fill(0, 0, 255);
    rect(this.cellPosX, this.cellPosY, this.w, this.w);
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
