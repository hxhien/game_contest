var assets = ['common.png', 'monsters.png', 'bg.png', 'enemy.png'];
var sprites = {
 coin: { file : 'common.png', sx: 0, sy: 0, w: 53, h: 51, frames: 1 },
 deck: { file : 'common.png', sx: 0, sy: 51, w: 646, h: 128, frames: 1 },
 fight_tap: {file : 'common.png', sx: 0, sy: 179, w: 178, h: 160, frames: 1, ws : 89, hs : 80 },
 gift_coin: {file : 'common.png', sx: 0, sy: 339, w: 106, h: 112, frames: 1 },
 gift_nut: {file : 'common.png', sx: 0, sy: 451, w: 130, h: 112, frames: 1 },
 hole: {file : 'common.png', sx: 0, sy: 563, w: 333, h: 103, frames: 1, ws: 333, hs: 103 },
 hole_on: {file : 'common.png', sx: 0, sy: 666, w: 360, h: 150, frames: 1 },
 HP_bar_BG: {file : 'common.png', sx: 0, sy: 816, w: 135, h: 26, frames: 1 },
 avatar_bg: {file : 'common.png', sx: 0, sy: 842, w: 80, h: 80, frames: 1 },
 shake_star: {file : 'common.png', sx: 0, sy: 1485, w: 25, h: 25, frames: 1, ws : 12, hs: 12 },
 battle_bg: {file : 'bg.png', sx: 0, sy: 0, w: 960, h: 640, frames: 1, ws : 480, hs : 320},
 enemy: {file : 'enemy.png', sx: 0, sy: 0, w: 119, h: 119, frames: 1, ws : 119, hs: 119 },
 /*
 gift_nut: {file : 'common.png', sx: 0, sy: 451, w: 130, h: 112, frames: 1 },
 gift_nut: {file : 'common.png', sx: 0, sy: 451, w: 130, h: 112, frames: 1 },
 */
};

/*

.sprite.hole { background-position: 0px -563px; width: 333px; height: 103px;  } 
.sprite.hole_on { background-position: 0px -666px; width: 360px; height: 150px;  } 
.sprite.HP_bar_BG { background-position: 0px -816px; width: 135px; height: 26px;  } 
.sprite.avatar_bg { background-position: 0px -842px; width: 80px; height: 80px;  } 
.sprite.menu_on { background-position: 0px -922px; width: 120px; height: 100px;  } 
.sprite.menu_off { background-position: 0px -1022px; width: 120px; height: 100px;  } 
.sprite.back_on { background-position: 0px -1122px; width: 120px; height: 100px;  } 
.sprite.back_off { background-position: 0px -1222px; width: 88px; height: 62px;  } 
.sprite.shake_line { background-position: 0px -1284px; width: 162px; height: 52px;  } 
.sprite.slice { background-position: 0px -1336px; width: 196px; height: 99px;  } 
.sprite.hammer { background-position: 0px -1435px; width: 60px; height: 50px;  } 
.sprite.shake_star { background-position: 0px -1485px; width: 25px; height: 25px;  } 
.sprite.blood_round_left { background-position: 0px -1510px; width: 6px; height: 15px;  } 
.sprite.blood_round_right { background-position: 0px -1525px; width: 6px; height: 15px;  } 
.sprite.blood_straight { background-position: 0px -1540px; width: 2px; height: 15px;  } 
.sprite.clock_bg_half_left { background-position: 0px -1555px; width: 19px; height: 39px;  } 
.sprite.clock_bg_half_right { background-position: 0px -1594px; width: 19px; height: 39px;  } 
.sprite.clock_pointing { background-position: 0px -1633px; width: 20px; height: 20px;  } 
.sprite.clock_yellow_half_left { background-position: 0px -1653px; width: 17px; height: 35px;  } 
.sprite.clock_yellow_half_right { background-position: 0px -1688px; width: 17px; height: 35px;  } 

*/

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;
	
var	OBJECT_ENEMY = 1;

var listHole = [{x: 20, y: 220}, {x: 270, y:220}, 
				{x: 10, y: 170}, {x: 150, y : 170},	{x: 300, y: 170}, 
				{x: 80, y: 135}, {x: 280, y: 135}];
var holeBoard;
var listTouchTarget = [{hole_id : 0, start : 500, time : 1000, type : OBJECT_ENEMY},
					   {hole_id : 1, start : 2000, time : 1000, type : OBJECT_ENEMY},
					   {hole_id : 2, start : 3000, time : 1000, type : OBJECT_ENEMY},
					   {hole_id : 3, start : 4000, time : 1000, type : OBJECT_ENEMY},
					   {hole_id : 4, start : 5000, time : 1000, type : OBJECT_ENEMY},
					   {hole_id : 5, start : 6000, time : 1000, type : OBJECT_ENEMY},
					   {hole_id : 6, start : 7000, time : 1000, type : OBJECT_ENEMY}
					  ];
var targetBoard;
var canvasScale = 1;

function hideURLbar() {
	if (window.location.hash.indexOf('#') == -1) {
		window.scrollTo(0, 1);
	}
}
			
var startGame = function() {
  var scaleX = window.innerWidth/480;
  var scaleY = window.innerHeight/320;
  canvasScale = scaleX > scaleY ?  scaleY : scaleX;
  $("#container").css("zoom", canvasScale);
  setTimeout(hideURLbar, 0);

  Game.setBoard(0, new Bg());
  holeBoard = new GameBoard();
  for (var i = 0, nLen = listHole.length; i < nLen; i++){
	holeBoard.add(new Hole(listHole[i].x, listHole[i].y));
  }
  Game.setBoard(1, holeBoard);
  
  targetBoard = new GameBoard();
  for (var i = 0, nLen = listTouchTarget.length; i < nLen; i++){
	targetBoard.add(new TouchTarget(listTouchTarget[i]));
  }
  Game.setBoard(2, targetBoard);
  
  touchBoard = new GameBoard();
  Game.setBoard(3, touchBoard);
  
  
  /*
  Game.setBoard(1,new Starfield(50,0.6,100));
  Game.setBoard(2,new Starfield(100,1.0,50));
  Game.setBoard(3,new TitleScreen("Alien Invasion", 
                                  "Press fire to start playing",
                                  playGame));
  */
};

var playGame = function() {
  var board = new GameBoard();
  board.add(new PlayerShip());
  board.add(new Level(level1,winGame));
  Game.setBoard(3,board);
};

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press fire to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press fire to play again",
                                  playGame));
};

window.addEventListener("load", function() {
  Game.initialize("game", assets, sprites, startGame);
});


var Bg = function() {
  this.setup('battle_bg', { frame: 0 });
};

Bg.prototype = new Sprite();

Bg.prototype.step = function(dt) {
	this.x = 0;
	this.y = 0;
	/*
	  this.frame++;
	  if(this.frame >= 12) {
		this.board.remove(this);
	  }
  */
};

var Hole = function(x,y) {
  var scale = (y * 0.5)/220;
  this.setup('hole', { frame: 0, scale : scale, ws : 333 * scale, hs: 103 * scale});
  this.scale = scale;
  this.x = x;
  this.y = y; 
};

Hole.prototype = new Sprite();

Hole.prototype.step = function(dt) {

}

var TouchTarget = function(touchTarget){
	this.touchTarget = touchTarget;
	this.dt = 0;
	this.isVisible = false;
	this.setup('enemy', { frame: 0 });
}

TouchTarget.prototype = new Sprite();

TouchTarget.prototype.step = function(dt) {
	this.dt += (dt * 1000);
	if (this.dt >= this.touchTarget.start && this.dt <= (this.touchTarget.start + this.touchTarget.time)){
		this.isVisible = true;
	}else{
		this.isVisible = false;
	}
}

TouchTarget.prototype.draw = function(ctx) {
	if (this.isVisible){
		var holeObj = holeBoard.objects[this.touchTarget.hole_id];
		this.x = holeObj.x;
		this.y = holeObj.y;
		this.ws = this.w * holeObj.scale;
		this.hs = this.h * holeObj.scale;
		this.x += 130 * holeObj.scale;//(holeObj.ws - this.ws)/2;
		this.y -= 50 * holeObj.scale;//(holeObj.hs - this.hs)/2;
		SpriteSheet.draw(ctx,this.sprite,this.x,this.y, this.ws, this.hs,this.frame);
	}
};

var PlayerShip = function() { 
  this.setup('ship', { vx: 0, reloadTime: 0.25, maxVel: 200 });

  this.reload = this.reloadTime;
  this.x = Game.width/2 - this.w / 2;
  this.y = Game.height - Game.playerOffset - this.h;

  this.step = function(dt) {
    if(Game.keys['left']) { this.vx = -this.maxVel; }
    else if(Game.keys['right']) { this.vx = this.maxVel; }
    else { this.vx = 0; }

    this.x += this.vx * dt;

    if(this.x < 0) { this.x = 0; }
    else if(this.x > Game.width - this.w) { 
      this.x = Game.width - this.w;
    }

    this.reload-=dt;
    if(Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
      this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
    }
  };
};

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
};


var PlayerMissile = function(x,y) {
  this.setup('missile',{ vy: -700, damage: 10 });
  this.x = x - this.w/2;
  this.y = y - this.h; 
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_ENEMY);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y < -this.h) { 
      this.board.remove(this); 
  }
};


var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
};

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0 };

Enemy.prototype.step = function(dt) {
  this.t += dt;

  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

  this.x += this.vx * dt;
  this.y += this.vy * dt;

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }
};

Enemy.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }
};

var TouchWrong = function(centerX,centerY) {
  this.setup('shake_star', { frame: 0 });
  this.x = centerX - this.ws/2;
  this.y = centerY - this.hs/2;
  this.dt = 0;
};

TouchWrong.prototype = new Sprite();

TouchWrong.prototype.step = function(dt) {
  this.dt += dt;
  //console.log(this.dt);
  if(this.dt >= 0.3) {
    this.board.remove(this);
  }
};

var Explosion = function(centerX,centerY) {
  this.setup('shake_star', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame++;
  if(this.frame >= 12) {
    this.board.remove(this);
  }
};

var getBasicPosition = function(pos){
	return parseInt(pos / canvasScale, 10);
};

function log(str){
	$("#log").html(str + "<br/>" + $("#log").html());
}