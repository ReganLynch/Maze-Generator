// ------------ this defines a cube object ------------------

var rectWidth = 1;

function cube(x, y, w, h){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;

  this.visited = false;
  this.isCurrent = false;

  this.hasTop = true;
  this.hasRight = true;
  this.hasBottom = true;
  this.hasLeft = true;

  this.draw = function(){
    this.drawRect();
    this.drawSides();
  }

  this.setCurrent = function(){
    this.isCurrent = true;
    this.visited = true;
  }

  this.drawRect = function(){
    noStroke();
    if (this.isCurrent){
      fill(50, 200, 50);
    }else if (this.visited){
      fill(200, 120, 250);
    }else{
      fill(50, 100, 200);
    }
    rect(this.x, this.y, this.w, this.h);
  }

  this.drawSides = function(){
    noStroke();
    if(this.hasTop){
      fill(255)
      rect(this.x, this.y, this.w, rectWidth);
    }
    if(this.hasRight){
      fill(255)
      rect(this.x + this.w - rectWidth, this.y, rectWidth, this.h);
    }
    if(this.hasBottom){
      fill(255)
      rect(this.x, this.y + this.h - rectWidth, this.w, rectWidth);
    }
    if(this.hasLeft){
      fill(255)
      rect(this.x, this.y, rectWidth, this.h);
    }
  }
}
