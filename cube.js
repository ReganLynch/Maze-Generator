// ------------ this defines a cube object ------------------

function cube(x, y, w, h){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;

  this.visited = false;
  this.isCurrent = false;

  //check if this cube is on a border
  if(this.x == 0 || this.y == 0 || this.x == width - this.w || this.y == height - this.h){
    this.visited = true
  }

  this.draw = function(){
    this.drawRect();
    // this.drawSides();
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
      //if its on a border
      if(this.x == 0 || this.y == 0 || this.x == width - this.w || this.y == height - this.h){
        fill(0, 0, 0);
      }else{
        fill(255, 255, 255);
      }
    }else{
      fill(0, 0, 0);
    }
    rect(this.x, this.y, this.w, this.h);
  }

}
