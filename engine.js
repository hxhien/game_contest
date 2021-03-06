var Game = new function() {                                                                  
  var boards = [];

  // Game Initialization
  this.initialize = function(canvasElementId, assets, sprite_data,callback) {
    this.canvas = document.getElementById(canvasElementId);
    this.width = this.canvas.width;
    this.height= this.canvas.height;
	
    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if(!this.ctx) { return alert("Please upgrade your browser to play"); }

    this.canvasMultiplier = 1;
    this.playerOffset = 10;

    //this.setupInput();

    this.setBoard(4,new TouchControls());

    this.loop(); 

    SpriteSheet.load(assets, sprite_data,callback);
  };

  // Handle Input
  var KEY_CODES = { 37:'left', 39:'right', 32 :'fire' };
  this.keys = {};

  this.setupInput = function() {
    window.addEventListener('keydown',function(e) {
      if(KEY_CODES[event.keyCode]) {
       Game.keys[KEY_CODES[event.keyCode]] = true;
       e.preventDefault();
      }
    },false);

    window.addEventListener('keyup',function(e) {
      if(KEY_CODES[event.keyCode]) {
       Game.keys[KEY_CODES[event.keyCode]] = false; 
       e.preventDefault();
      }
    },false);
  };

  // Game Loop
  this.loop = function() { 
    var dt = 30 / 1000;
    setTimeout(Game.loop,30);
    for(var i=0,len = boards.length;i<len;i++) {
      if(boards[i]) { 
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }

  };
  
  // Change an active game board
  this.setBoard = function(num,board) { boards[num] = board; };
  return this;

};


var SpriteSheet = new function() {
  this.map = { };
  this.images = {};
  this.callback = false;
  this.countLoaded = 0;
  this.nTotalFiles = 0;
  this.load = function(assets,spriteData,callback) { 
    this.map = spriteData;
	this.callback = callback;
	this.nTotalFiles = assets.length;
	for(var i = 0, key = '',len=assets.length; i < len; i++) {
		key = assets[i];
		this.images[key] = new Image();
		this.images[key].onload = function(){
			SpriteSheet.countLoaded++;
		};
		this.images[key].src = ['images/', key].join("");
    }
	setTimeout(function(){SpriteSheet.doCallback();},30);
  };

  this.doCallback = function(){
	if (SpriteSheet.countLoaded != SpriteSheet.nTotalFiles){
		setTimeout(function(){SpriteSheet.doCallback},30);
		return;
	}
	if (SpriteSheet.countLoaded == SpriteSheet.nTotalFiles){		
		SpriteSheet.callback();
	}
  }
  this.draw = function(ctx,sprite,x,y, ws, hs, frame) {
  //console.log(sprite);
    var s = this.map[sprite];
    if(!frame) frame = 0;
    ctx.drawImage(this.images[s.file],
                     s.sx + frame * s.w, 
                     s.sy, 
                     s.w, s.h, 
                     Math.floor(x), Math.floor(y),
                     ws, hs);
  };

  return this;
};

var TitleScreen = function TitleScreen(title,subtitle,callback) {
  var up = false;
  this.step = function(dt) {
    if(!Game.keys['fire']) up = true;
    if(up && Game.keys['fire'] && callback) callback();
  };

  this.draw = function(ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";

    ctx.font = "bold 40px bangers";
    ctx.fillText(title,Game.width/2,Game.height/2);

    ctx.font = "bold 20px bangers";
    ctx.fillText(subtitle,Game.width/2,Game.height/2 + 40);
  };

};


var GameBoard = function() {
  var board = this;

  // The current list of objects
  this.objects = [];
  this.cnt = {};

  // Add a new object to the object list
  this.add = function(obj) { 
    obj.board=this; 
    this.objects.push(obj); 
    this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
    return obj; 
  };

  // Mark an object for removal
  this.remove = function(obj) { 
    var idx = this.removed.indexOf(obj);
    if(idx == -1) {
      this.removed.push(obj); 
      return true;
    } else {
      return false;
    }
  };

  // Reset the list of removed objects
  this.resetRemoved = function() { this.removed = []; };

  // Removed an objects marked for removal from the list
  this.finalizeRemoved = function() {
    for(var i=0,len=this.removed.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed[i]);
      if(idx != -1) {
        this.cnt[this.removed[i].type]--;
        this.objects.splice(idx,1);
      }
    }
  };

  // Call the same method on all current objects 
  this.iterate = function(funcName) {
     var args = Array.prototype.slice.call(arguments,1);
     for(var i=0,len=this.objects.length;i<len;i++) {
       var obj = this.objects[i];
       obj[funcName].apply(obj,args);
     }
  };

  // Find the first object for which func is true
  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  // Call step on all objects and them delete
  // any object that have been marked for removal
  this.step = function(dt) { 
    this.resetRemoved();
    this.iterate('step',dt);
    this.finalizeRemoved();
  };

  // Draw all the objects
  this.draw= function(ctx) {
    this.iterate('draw',ctx);
  };

  // Check for a collision between the 
  // bounding rects of two objects
  this.overlap = function(o1,o2) {
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  // Find the first object that collides with obj
  // match against an optional type
  this.collide = function(obj,type) {
    return this.detect(function() {
      if(obj != this) {
       var col = (!type || this.type & type) && board.overlap(obj,this);
       return col ? this : false;
      }
    });
  };


};

var Sprite = function() { };

Sprite.prototype.setup = function(sprite,props) {
  this.sprite = sprite;
  this.ws = SpriteSheet.map[sprite].ws;
  this.hs = SpriteSheet.map[sprite].hs;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map[sprite].w;
  this.h =  SpriteSheet.map[sprite].h;
};

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
};

Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y, this.ws, this.hs,this.frame);
};

Sprite.prototype.hit = function(damage) {
  this.board.remove(this);
};


var Level = function(levelData,callback) {
  this.levelData = [];
  for(var i =0; i<levelData.length; i++) {
    this.levelData.push(Object.create(levelData[i]));
  }
  this.t = 0;
  this.callback = callback;
};

Level.prototype.step = function(dt) {
  var idx = 0, remove = [], curShip = null;

  // Update the current time offset
  this.t += dt * 1000;

  //   Start, End,  Gap, Type,   Override
  // [ 0,     4000, 500, 'step', { x: 100 } ]
  while((curShip = this.levelData[idx]) && 
        (curShip[0] < this.t + 2000)) {
    // Check if we've passed the end time 
    if(this.t > curShip[1]) {
      remove.push(curShip);
    } else if(curShip[0] < this.t) {
      // Get the enemy definition blueprint
      var enemy = enemies[curShip[3]],
          override = curShip[4];

      // Add a new enemy with the blueprint and override
      this.board.add(new Enemy(enemy,override));

      // Increment the start time by the gap
      curShip[0] += curShip[2];
    }
    idx++;
  }

  // Remove any objects from the levelData that have passed
  for(var i=0,len=remove.length;i<len;i++) {
    var remIdx = this.levelData.indexOf(remove[i]);
    if(remIdx != -1) this.levelData.splice(remIdx,1);
  }

  // If there are no more enemies on the board or in 
  // levelData, this level is done
  if(this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
    if(this.callback) this.callback();
  }

};

Level.prototype.draw = function(ctx) { };


var TouchControls = function() {
  this.draw = function(ctx) {
  
  };

  this.step = function(dt) { };

  this.trackTouchStart = function(e) {
	autoIncrementIdentifier ++;
    e.preventDefault();
	var touch;
	for(var i=0;i<e.targetTouches.length;i++) {
		touch = e.targetTouches[i];
		x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
		y = touch.pageY;
		x = getBasicPosition(x);
		y = getBasicPosition(y);
		touchBoard.add(new TouchAction(x, y, touch.identifier, autoIncrementIdentifier));
		//console.log(touchBoard);
	}
  };
  
  this.trackTouchEnd = function(e) {
    e.preventDefault();
	var touch;
	for(i=0;i<e.changedTouches.length;i++) {
		touch = e.changedTouches[i];
		//alert(touch.identifier);
		x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
		y = touch.pageY;
		x = getBasicPosition(x);
		y = getBasicPosition(y);
		for(var i = 0, nLen = touchBoard.objects.length; i < nLen; i++){
			var touchAction = touchBoard.objects[i];
			if (touchAction.identifier - touchAction.autoIdentifier  == touch.identifier){
				touchAction.toX = x;
				touchAction.toY = y;
				touchAction.dt = 0;
				break;
			}
		}
	}
  };
	
  Game.canvas.addEventListener('touchstart',this.trackTouchStart,true);
  Game.canvas.addEventListener('touchmove',this.trackTouchMove,true);
  Game.canvas.addEventListener('touchend',this.trackTouchEnd,true);
};


