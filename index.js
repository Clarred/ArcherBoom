
class Pontuation{
    constructor( name, point ){
        this.name = name;
        this.ponctuation = point;
    }
}

var PTS = {};
if ( localStorage.getItem( "rankPonctuation" ) == null ){
    localStorage.setItem( "rankPonctuation", '{"bestpontuation":0,"rankplayers":[]}' );
}
PTS = JSON.parse( localStorage.getItem( "rankPonctuation" ) );

function SavePonctuation( newPlayer, action="add" ){//Type Ponctuation

    if ( action.toLowerCase() == "sort" ){
        PTS.rankplayers = newPlayer;
    }else if ( action.toLowerCase() == "add" ){
        PTS.rankplayers.push( newPlayer );
    }

    localStorage.setItem( "rankPonctuation", JSON.stringify(PTS) );
}

function RemovePonctuactions(){

    localStorage.removeItem( "rankPonctuation" );
    localStorage.setItem( "rankPonctuation", '{"bestpontuation":0,"rankplayers":[]}' );

    PTS.rankplayers = [];
    PTS.bestpontuation = 0;
    UpdateRank();
}


function SortPontuaction(){

    let obj = PTS.rankplayers;    
    let sort = new Array(obj.length);
    let points; let name; let index;
    
    for ( var t = 0; t < sort.length; t++ ){//Pass to next Index Sort
        points = 0;
        for ( var r = 0; r < obj.length; r++ ){//Pass to Next Index Obj

            if ( obj[r].ponctuation >= points ){
                points = obj[r].ponctuation;
                name = obj[r].name;
                index = r;
            }

        }
        obj[index].ponctuation = 0;
        sort[t] = new Pontuation(name, points);

    }
    if ( sort[0].ponctuation > PTS.bestpontuation ){
        PTS.bestpontuation = sort[0].ponctuation;
    }

    return sort;

}
if ( PTS.rankplayers.length > 0 ){
    SavePonctuation( SortPontuaction(), "sort" );
}

//SavePonctuation( newplayer );
//

function getSidesOf( obj ){

    this.L = obj.position.x - obj._w/2;
    this.R = obj.position.x + obj._w/2;
    this.T = obj.position.y - obj._h/2;
    this.B = obj.position.y + obj._h/2;

}

var cnv = new Draws.InitCanvas(0, 0, "#028699");
cnv.updateMatrix();

var isPlaying = false;
var isRanking = false;

var interval = 1000;
var intervalLimit = 200;
var timeout;

var title = new Draws.Text("Archer Boom", "bold 100px Century Gothic", cnv.width/2, 90);
var sub = new Draws.Text("Beta", "bold 35px Century Gothic", cnv.width/2, 120);
var version = new Draws.Text("Version 2.2", "bold 15px Century Gothic", cnv.width/2+270, 120);

const P = "Pontuação: ";
var pontuation = new Draws.Text( P, "bold 25px Century Gothic", cnv.width/2, cnv.height/2 - cnv.height/6 );

//Insert Name
var username = new Draws.Square( cnv.width/2, cnv.height/2 - 80, 300, 35 );
username.color.fill = "#fff";
username.strokeIt();

username.selected = false;

username.selector = new Draws.Line([
    username.position.x, username.position.y-10,   username.position.x, username.position.y+10,
], false);

username.selector.line.type = "round";
function VerifySel(){
    if ( username.selected ){
        if ( username.selector.render ){
            username.selector.remove();
        }else{
            username.selector.Render();
        }
    }else{
        username.selector.remove();
    }
}

username.nameIn = [];
username.title = new Draws.Text( "Insira seu nome", "25px monospace", username.position.x, username.position.y+username._h/5 );
username.title.color.fill = "#808080";

username.hover = false;
username.sides = new getSidesOf( username );

var allowChar = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " "];
let len1 = allowChar.length;
for ( var a = 0; a < len1; a++ ){
    allowChar.push(allowChar[a].toUpperCase());
}
let l = [".", "_", "@", "!", "#", "$", "%", "&", "*", "(", ")"];
for ( var a = 0; a < l.length; a++ ){
    allowChar.push(l[a]);
}
for ( var a = 0; a <= 9; a++ ){
    allowChar.push(a.toString());
}

//text Selector
let mul = 0.7;
let maxx = 5;
var textSelect = new Draws.Line([
    (0+maxx)*mul, 0*mul,   (20+maxx)*mul, 0*mul,  (10+maxx)*mul, 0*mul,  (10+maxx)*mul, 30*mul,  (0+maxx)*mul, 30*mul,  (20+maxx)*mul, 30*mul
]);


//Start Button
var start = new Draws.Square(cnv.width/2, cnv.height/2, 125, 40);
start.color.fill = "#009acc";
start.strokeIt();
start.title = new Draws.Text("Começar", "bold 25px Century Gothic", start.position.x, start.position.y+start._h/5)

start.pass = false;
start.sides = new getSidesOf( start );

//Rank button
var rank = new Draws.Square(cnv.width/2, cnv.height/2 + 10 + 40, 125, 40);
rank.color.fill = "#009acc";
rank.strokeIt();
rank.title = new Draws.Text("Rank", "bold 25px Century Gothic", rank.position.x, rank.position.y+rank._h/5)

rank.pass = false;
rank.sides = new getSidesOf( rank );

//ImageBk of Computer to Ranking
var rankingBk = new Draws.ImageFill( "media/ranked.png", cnv.width/2, cnv.height/2, false );

rankingBk.Resize( 800, 800 );

//Exit Button from ranking menu
var exitbtn = new Draws.Square( 20+(125/2), cnv.height-20-(40/2), 125, 40, false );
exitbtn.color.fill = "#009acc";
exitbtn.strokeIt();
exitbtn.title = new Draws.Text( "Voltar", "bold 25px Century Gothic", exitbtn.position.x, exitbtn.position.y+exitbtn._h/5, false );

exitbtn.sides = new getSidesOf( exitbtn );

//Remove all Rank Button
var removeRank = new Draws.Square(rankingBk.position.x-rankingBk.ImageProperties.Rw/2.4, rankingBk.position.y+rankingBk.ImageProperties.Rh/5, 40, 40, false);
removeRank.color.fill = "#f20";
removeRank.strokeIt();

removeRank.excludeAll = false;

removeRank.sides = new getSidesOf( removeRank );

removeRank.title = new Draws.ImageFill( "media/trash.svg", removeRank.position.x, removeRank.position.y, false );
removeRank.title.Resize( 30, 30 );

//Excluse Rank - Box
var exRankBox = new Draws.Square( cnv.width/2, cnv.height/2, 400, 150, false );
exRankBox.color.fill = "#009acc";
exRankBox.strokeIt();

exRankBox.title = new Draws.Text( "Deseja excluir o ranking?", "bold 25px Century Gothic", exRankBox.position.x, exRankBox.position.y-exRankBox._h/6, false );

exRankBox.button1 = new Draws.Square( exRankBox.position.x + exRankBox._w/4, exRankBox.position.y + exRankBox._h/4, 70, 30, false );
exRankBox.button1.color.fill = "#009acc";
exRankBox.button1.strokeIt();
exRankBox.button1.title = new Draws.Text( "Sim", "bold 25px Century Gothic", exRankBox.button1.position.x, exRankBox.button1.position.y+exRankBox.button1._h/4, false );

exRankBox.button1.sides = new getSidesOf( exRankBox.button1 );

exRankBox.button2 = new Draws.Square( exRankBox.position.x - exRankBox._w/4, exRankBox.position.y + exRankBox._h/4, 70, 30, false );
exRankBox.button2.color.fill = "#009acc";
exRankBox.button2.strokeIt();
exRankBox.button2.title = new Draws.Text( "Nao", "bold 25px Century Gothic", exRankBox.button2.position.x, exRankBox.button2.position.y+exRankBox.button2._h/4, false );

exRankBox.button2.sides = new getSidesOf( exRankBox.button2 );

var mult = 1.6;
var pointer = new Draws.Line([
    0-20, 0,   10*mult-20, 10*mult,     5*mult-20, 10*mult,     0-20, 15*mult,  0-20, 0
]);
pointer.fillIt();
pointer.line.width = 3.5;
pointer.line.type = "round";
pointer.color.fill = "#50ccff";

var mouse = { x:0,y:0 };

//Exit Game
var exitgame = new Draws.Square( 20+(125/2), cnv.height-20-(40/2), 125, 40 );
exitgame.color.fill = "#009acc";
exitgame.strokeIt();
exitgame.title = new Draws.Text( "Sair", "bold 25px Century Gothic", exitgame.position.x, exitgame.position.y+exitgame._h/5 );

exitgame.confirm = false;
exitgame.sides = new getSidesOf( exitgame );

var exitBox = new Draws.Square( cnv.width/2, cnv.height/2, 400, 150, false );
exitBox.color.fill = "#009acc";
exitBox.strokeIt();

exitBox.title = new Draws.Text( "Deseja sair do jogo?", "bold 25px Century Gothic", exitBox.position.x, exitBox.position.y-exitBox._h/6, false );

exitBox.button1 = new Draws.Square( exitBox.position.x + exitBox._w/4, exitBox.position.y + exitBox._h/4, 70, 30, false );
exitBox.button1.color.fill = "#009acc";
exitBox.button1.strokeIt();
exitBox.button1.title = new Draws.Text( "Sim", "bold 25px Century Gothic", exitBox.button1.position.x, exitBox.button1.position.y+exitBox.button1._h/4, false );

exitBox.button1.sides = new getSidesOf( exitBox.button1 );

exitBox.button2 = new Draws.Square( exitBox.position.x - exitBox._w/4, exitBox.position.y + exitBox._h/4, 70, 30, false );
exitBox.button2.color.fill = "#009acc";
exitBox.button2.strokeIt();
exitBox.button2.title = new Draws.Text( "Nao", "bold 25px Century Gothic", exitBox.button2.position.x, exitBox.button2.position.y+exitBox.button2._h/4, false );

exitBox.button2.sides = new getSidesOf( exitBox.button2 );

var Buttons = [start, rank, exitbtn, exitgame, exitBox.button1, exitBox.button2, exRankBox.button1, exRankBox.button2 ];

class PlayerBuild{
    constructor ( x, y, color, missleColor ){
        this.cannon = new Draws.Square(x+20, y, 30, 20, false);
        this.bod = new Draws.Ball(x, y, 20, false);
        this.bar = new Draws.Square( 110, 20, 204, 24 , false);
        this.hpBar = new Draws.Square( 110, 20, 200, 20, false );
        this.hpInfo = new Draws.Text("Hp: 200", "bold 15px Century Gothic", 45, 25, false);
        this.ptsInfo = new Draws.Text("0", "bold 500px Century Gothic", x, y + y/2 );
        this.hpMax = 200;
        this.hp = 200;
        this.pts = 0;
        this.ang = 0;
        this.pointCharge = {};
        this.move = {
            up: false,
            left: false,
            right: false,
            down: false
        },
        this.release = {
            up: false,
            left: false,
            right: false,
            down: false
        },
        this.force = 0.5;
        this.vel = {
            x: 0,
            y: 0
        },
        this.limit = 10;
        this.name = "";

        this.bod.color.fill = ""
    }
}


var player = new PlayerBuild( cnv.width/2, cnv.height/2 );

var dam = 10;
player.colisionRetain = player.hpMax - ( ( (player.hp-dam) * player.hpBar._w)/(player.hp));

var missle = {
    obj: [],
    limit: 10,
    sizeLim: 5.5,
    vel: 5.8,
    angThrow: [],
    counter: [],
    limitDist: Math.sqrt( cnv.width**2, cnv.height**2 ), 
    damage: 40,
    restore: function ( i ){/*index*/
        this.obj[i].remove();

        this.obj.splice(i, 1);
        this.angThrow.splice(i, 1);
        this.counter.splice(i, 1);
    }
}
class createLineTable{
    constructor( times, pos, obj ){
        this.times = times;
        this.H = 25;

        this.lin = rankingBk.position.y-rankingBk.ImageProperties.Rh/4;
        this.positionName = pos;
        this.objP = obj;

        this.pos = new Draws.Square( rankingBk.position.x-rankingBk.ImageProperties.Rw/2.8, this.lin+(times * (5+this.H)), this.H, this.H, false )
        this.name = new Draws.Square( rankingBk.position.x-this.H/*-rankingBk.ImageProperties.Rw/2.8+rankingBk.ImageProperties.Rw/(2*2) + H*1.8*/, this.lin+(times * (5+this.H)), rankingBk.ImageProperties.Rw/2, this.H, false )
        this.score = new Draws.Square( rankingBk.position.x+rankingBk.ImageProperties.Rw/(2.8*1.05), this.lin+(times * (5+this.H)), 100, this.H, false )

        this.pos.color.fill = "#fff";
        this.name.color.fill = "#fff";
        this.score.color.fill = "#fff";

        this.pos.strokeIt();
        this.name.strokeIt();
        this.score.strokeIt();

        this.pos.title = new Draws.Text( this.positionName, "bold 20px Century Gothic", this.pos.position.x, this.pos.position.y+this.pos._h/4, false );
        this.name.title = new Draws.Text( this.objP.name, "bold 20px Century Gothic", this.name.position.x, this.name.position.y+this.pos._h/4, false );
        this.score.title = new Draws.Text( this.objP.ponctuation, "bold 20px Century Gothic", this.score.position.x, this.score.position.y+this.pos._h/4, false );

        this.OBJs = [this.pos, this.name, this.score];
    }

    removeAll(){
        this.pos.remove();
        this.name.remove();
        this.score.remove();
        this.pos.title.remove();
        this.name.title.remove();
        this.score.title.remove();
    }

    renderAll(){

        /*for ( var a = 0; a < this.OBJs.length; a++ ){
            if ( !this.OBJs[a].render ){
                //this.OBJ[a].Render();
                //
                this.OBJs[a].Render();
            }
            
           // Draws.InjectPositionRender( "F", this.OBJs[a], a );
        }*/
        for ( var t = 0; t < this.OBJs.length; t++ ){

            for ( var y = 0; y < 2; y++ ){

                let rend = this.OBJs[t];
                if ( y == 0 ){
                    Draws.InjectPositionRender( "F", rend );
                    rend.Render();
                }else{
                    Draws.InjectPositionRender( "F", rend.title );
                    rend.title.Render();
                }
                
            }

        }
        
    }

    updateValues(pos, obj){

        this.positionName = pos;
        this.objP = obj;

        let High = this.lin+(this.times * (5+this.H));

        this.pos.position.y = High;
        this.name.position.y = High;
        this.score.position.y = High;

        this.pos.title = new Draws.Text( this.positionName, "bold 20px Century Gothic", this.pos.position.x );
        this.pos.title.text = this.positionName;
        this.pos.title.position.y = High+this.pos._h/4;

        this.name.title.text = this.objP.name;
        this.name.title.position.y = High+this.name._h/4;

        this.score.title.text = this.objP.ponctuation;
        this.score.title.position.y = High+this.score._h/4;

        this.OBJs = [this.pos, this.name, this.score];
    }
}

var tableLines = [];
function createRanking(){

    let sz;
    if ( PTS.rankplayers.length >= 11 ){
        sz = 10;
    }else{
        sz = PTS.rankplayers.length;
    }

    for ( var i = -1; i < sz; i++ ){

        if ( i == -1 ){ 
            tableLines.push( new createLineTable( 0, "P", new Pontuation("Jogador", "Pts") ));
        }
        else{
            tableLines.push( new createLineTable( i+1, i+1, PTS.rankplayers[i]) );
        }
        
        //tableLines[tableLines.length-1].renderAll();
        /*let a = Object.keys(tableLines[tableLines.length-1]);
        for ( var t = 0; t < a.length; t++ ){

            for ( var y = 0; y < 2; y++ ){

                if ( y == 0 ){
                    Draws.InjectPositionRender( "F", tableLines[tableLines.length-1][ a[t] ] );
                }else{
                    Draws.InjectPositionRender( "F", tableLines[tableLines.length-1][ a[t] ].title );
                }
                
            }

        }*/

    }

}

function UpdateRank( player=null ){
    
    if ( tableLines.length <= 10 ){ 
        if ( player != null ){
            tableLines.push( new createLineTable( tableLines.length, tableLines.length, player ) );

            SavePonctuation( SortPontuaction(), "sort");

            for ( var i = 1; i < PTS.rankplayers.length+1; i++ ){
                tableLines[i].updateValues( i, new Pontuation( PTS.rankplayers[i-1].name, PTS.rankplayers[i-1].ponctuation ) );
            }

        }else{
            let len = tableLines.length;
            for ( var i = 1; i < len; i++ ){
                tableLines[1].removeAll();
                tableLines.splice( 1, 1 );
            }
        }
    }
    

}



class Enemie1{
    constructor(){

        let r = 20;

        function IFY( stat ){
            if ( stat ){
                posY = Random( -cnv.height/2, ( 3*cnv.height ) / 2 );
            }else{
                let nR = Random(1);
                if ( nR == 0 ){
                    posY = Random( -cnv.height/2, -r/2 );
                }else{
                    posY = Random( cnv.height + r/2, ( 3*cnv.height ) / 2 );
                }
            }
        }

        //Obj - Render
        let a = [Random(1), Random(1)];
        let posX, posY;
        if ( a[0] == 0 ){
            posX = Random( -cnv.width/2, cnv.width/2 );
            IFY( posX < 0 );   
        }else{
            posX = Random( cnv.width/2, ( 3 * cnv.width) / 2 );
            IFY( posX > cnv.width );
        }


        this.obj = (new Draws.Ball( posX, posY, r ) );
    
        this.obj.strokeIt();
        this.obj.color.fill = "#992120";
        this.obj.line.width = 5;
        
        let ang = getAngle( player.bod, this.obj );
        this.obj.rotate( ang );

        //Other Characteristics
        this.givenPts = 10;

        this.walked = 0;
        this.vel = 2;
        this.relativePos = new Draws.Vector2(this.obj.position.x, this.obj.position.y);

        
        
        this.hp = 100;
        this.damage = dam;
        this.attacked = false;
    }
}


var enemies = [];
var activeInterval = true;

var intervalToSetEnemies;


function Random( x, y=false ){
    let a = y==false ? Math.floor( Math.random( ) * ( x+1 ) ) : x + Math.floor( Math.random( ) * ( y-x+1 ) );
    return a;
}

var dirs = ["right", "left", "up", "down"];

player.cannon.origin.x += player.bod._r;
player.cannon.position.x -= player.bod._r;

function ToDeg(x){
    return Draws.RadToDeg(x);
}
function ToRad(x){
    return Draws.DegToRad(x);
}

function getAngle( obj1, obj2 ){

    let Ob1x;
    let Ob1y;

    if ( typeof obj1 != "object" ) {Ob1x = obj1[0]; Ob1y = obj1[1];}
    else if ( obj1.position == undefined ){Ob1x = obj1.x; Ob1y = obj1.y;}
    else {Ob1x = obj1.position.x;Ob1y = obj1.position.y;}

    let Ob2x = obj2.position.x;
    let Ob2y = obj2.position.y;

    let Ang = Math.atan( ( Math.abs( Ob2y - Ob1y ) ) / ( Math.abs( Ob2x - Ob1x ) ) );

    if ( Ob1x >= Ob2x && Ob1y < Ob2y ){//Quad I

        Ang = ToRad(360) - Ang;

    }else if ( Ob1x < Ob2x && Ob1y <= Ob2y ){//Quad II

        Ang = ToRad(180) + Ang;

    }else if ( Ob1x < Ob2x && Ob1y >= Ob2y ){//Quad III
        
        Ang = ToRad(180) - Ang;

    }else if ( Ob1x >= Ob2x && Ob1y > Ob2y ){//Quad IV

        Ang = Ang;

    }

    return Ang;

}

function Move( direction ){

    direction = direction.toLowerCase();
    let funcs = ["+x", "-x", "-y", "+y"];

    let idx = 0;

    if ( direction == dirs[0] ) {idx = 0;}
    else if ( direction == dirs[1] ) {idx = 1;}
    else if ( direction == dirs[2] ) {idx = 2;}
    else if ( direction == dirs[3] ) {idx = 3;}

    let opst = idx == 0 ? dirs[1] : idx == 1 ? dirs[0] : idx == 2 ? dirs[3] : dirs[2];
    let exef = funcs[idx];

    if ( player.move[direction] && !player.release[opst] ){

        if ( exef[0] == "+" ){

            if ( player.vel[exef[1]] < player.limit ){
                player.vel[exef[1]] += player.force;
            }else{
                player.vel[exef[1]] = player.limit;
            }

        }else if ( exef[0] == "-" ){

            if ( player.vel[exef[1]] > -player.limit ){
                player.vel[exef[1]] -= player.force;
            }else{
                player.vel[exef[1]] = -player.limit;
            }

        }
        
        player.bod.position[exef[1]] += player.vel[exef[1]];
        player.cannon.position[exef[1]] += player.vel[exef[1]];

    }
    if ( player.release[direction] ){

        if ( exef[0] == "+" ){

            if ( player.vel[exef[1]] > 0 ){
                player.vel[exef[1]] -= player.force;
            }else{
                player.vel[exef[1]] = 0;
                player.release[direction] = false;
            }

        }else{

            if ( player.vel[exef[1]] < 0 ){
                player.vel[exef[1]] += player.force;
            }else{
                player.vel[exef[1]] = 0;
                player.release[direction] = false;
            }
        }

        player.bod.position[exef[1]] += player.vel[exef[1]];
        player.cannon.position[exef[1]] += player.vel[exef[1]];

    }

}

function Remove( room ){
    if ( room.toLowerCase() == "menu" ){

        title.remove();sub.remove();version.remove();start.title.remove();
        start.remove();rank.remove();rank.title.remove();username.remove();username.title.remove();
        username.selector.remove();pontuation.remove();exitgame.remove();exitgame.title.remove();
        clearInterval( username.selector.timer );

    }else if ( room.toLowerCase() == "game" ){

        player.cannon.remove();player.bar.remove();player.bod.remove();
        player.hpBar.remove();player.hpInfo.remove();player.ptsInfo.remove();

    }else if ( room.toLowerCase() == "rank" ){
        
        for ( var i = 0; i < tableLines.length; i++ ){
            tableLines[i].removeAll();
        }
        rankingBk.remove();
        exitbtn.remove();
        exitbtn.title.remove();
        removeRank.remove();
        removeRank.title.remove();

    }else if ( room.toLowerCase() == "exitbox" ){

        exitBox.remove();
        exitBox.title.remove();
        exitBox.button1.remove();
        exitBox.button1.title.remove();
        exitBox.button2.remove();
        exitBox.button2.title.remove();

    }else if ( room.toLowerCase() == "exrank"){

        exRankBox.remove();
        exRankBox.title.remove();
        exRankBox.button1.remove();
        exRankBox.button1.title.remove();
        exRankBox.button2.remove();
        exRankBox.button2.title.remove();

    }
}

function Place( room ){
    if ( room.toLowerCase() == "menu" ){

        title.Render();sub.Render();version.Render();start.Render();
        start.title.Render();rank.Render();rank.title.Render();username.Render();
        username.title.Render();username.selector.Render();pontuation.Render();
        exitgame.Render();exitgame.title.Render();

    }else if ( room.toLowerCase() == "game" ){

        player.cannon.Render();player.bar.Render();player.bod.Render();
        player.hpBar.Render();player.hpInfo.Render();player.ptsInfo.Render();

    }else if ( room.toLowerCase() == "rank" ){
        if ( !rankingBk.render ){
            rankingBk.Render();
            exitbtn.Render();
            exitbtn.title.Render();
            removeRank.Render();
            removeRank.title.Render();

            
            Draws.InjectPositionRender( "F", rankingBk );
            Draws.InjectPositionRender( "F", exitbtn );
            Draws.InjectPositionRender( "F", exitbtn.title );
            Draws.InjectPositionRender( "F", removeRank );
            Draws.InjectPositionRender( "F", removeRank.title );

            for ( var i = 0 ; i < tableLines.length; i++ ){
                tableLines[i].renderAll();
            }
        }

    }else if ( room.toLowerCase() == "exitbox" ){

        exitBox.Render();
        exitBox.title.Render();
        exitBox.button1.Render();
        exitBox.button1.title.Render();
        exitBox.button2.Render();
        exitBox.button2.title.Render();

    }else if ( room.toLowerCase() == "exrank"){

        exRankBox.Render();
        exRankBox.title.Render();
        exRankBox.button1.Render();
        exRankBox.button1.title.Render();
        exRankBox.button2.Render();
        exRankBox.button2.title.Render();
        
    }
}

console.log("My work");

createRanking();

Animate();
function Animate(){
    requestAnimationFrame( Animate );

    Draws.ClearCanvas();
    cnv.CTX.textAlign = "center";
    Draws.Render();

    if ( isPlaying ){
        start.pass = false;

        if ( !player.bod.render ){

            Place("Game");
            Remove("Menu");
            Remove("Rank");

            player.bod.position.x = cnv.width/2;
            player.bod.position.y = cnv.height/2;
            player.cannon.position.x = cnv.width/2;
            player.cannon.position.y = cnv.height/2;

            player.pts = 0;
            activeInterval = true;
            interval = 1000;

            let y = enemies.length;
            for ( var i = 0; i < y; i++ ){
                enemies[0].obj.remove();
                enemies.splice( 0, 1 );
            }

            player.hp = player.hpMax;
            player.hpInfo.text = "Hp: "+ player.hp;
            player.hpBar.position.x = 110;
            player.hpBar._w = 200;

            player.bod.strokeIt();
            player.bod.line.width = 5;
            player.bod.color.fill = "#05cccc";

            /*player.cannon.origin.x += player.bod._r;
            player.cannon.position.x -= player.bod._r;*/

            player.ptsInfo.color.fill = "#fff";

            player.cannon.line.width = 5;
            player.cannon.color.fill = "#808080";
            player.cannon.strokeIt();

            let o = player.bar;
            o.color.fill = "#404040";
            o.strokeIt();
            //o.line.width = 1;

            o = player.hpBar;
            o.color.fill = player.bod.color.fill;

            o = player.hpInfo;
            o.color.fill = "#000";

        }

        Draws.InjectPositionRender( 0, player.ptsInfo );

        if ( activeInterval ){

            intervalToSetEnemies = setInterval( function (){

                enemies.push( new Enemie1() );
                
            }, interval);

            if ( interval > intervalLimit ){
                timeout = setTimeout(function (){
                    clearInterval(intervalToSetEnemies);
                    activeInterval = true;
                    interval -= 80;
                    
                }, 10000);
            }
            
            activeInterval = false;

        }

        player.ptsInfo.text = player.pts;

        player.ang = getAngle( mouse, player.cannon );
        player.bod.rotate( player.ang );
        player.cannon.rotate( player.ang );

        for ( var i = 0; i < dirs.length; i++ ){
            Move( dirs[i] );
        }

        //Missle
        for ( var m = 0; m < missle.obj.length; m++ ){
            if ( missle.counter[m] < missle.limitDist ){
                missle.obj[m].origin.x += missle.vel;
                
                if ( missle.obj[m]._r >= 4 ){
                    missle.obj[m]._r -= 0.06;
                }
                
                missle.obj[m].walked += missle.vel;

                missle.obj[m].relativePos.x = missle.obj[m].position.x + ( Math.cos(missle.obj[m].angle) * missle.obj[m].walked );
                missle.obj[m].relativePos.y = missle.obj[m].position.y + ( Math.sin(missle.obj[m].angle) * missle.obj[m].walked );

                missle.counter[m]+=missle.vel;
            }else{
                missle.restore( m );
            }

        }

        //Verify player possion at canvas
        let pl = player.bod.position;
        let bd = player.cannon.position;
        if ( pl.x >= cnv.width + player.bod._r*2 ){
            pl.x = 0;
            bd.x = 0;
        }else if ( pl.x <= - player.bod._r*2 ){
            pl.x = cnv.width;
            bd.x = cnv.width;
        }else if ( pl.y >= cnv.height + player.bod._r*2 ){
            pl.y = 0;
            bd.y = 0;
        }else if ( pl.y <= - player.bod._r*2 ){
            pl.y = cnv.height;
            bd.y = cnv.height;
        }

    }else{//Not Playing
        if (typeof intervalToSetEnemies == "number" ){//once
            clearInterval(intervalToSetEnemies);

            if ( !start.pass ){
                
                Place("Menu");
                start.pass = true;

            }    
            
        }

        if ( isRanking ){

            Remove("Menu");

            Place("Rank");

            if ( removeRank.excludeAll ){

                Place("exRank");

            }else{

                Remove("exRank");

            }

            if ( tableLines.length >= 2 ){
                tableLines[1].pos.color.fill = "#fcc749";
                tableLines[1].name.color.fill = "#fcc749";
                tableLines[1].score.color.fill = "#fcc749";
                if ( tableLines.length >= 3 ){
                    tableLines[2].pos.color.fill = "#9c9c9c";
                    tableLines[2].name.color.fill = "#9c9c9c";
                    tableLines[2].score.color.fill = "#9c9c9c";
                    if ( tableLines.length >= 4 ){
                        tableLines[3].pos.color.fill = "#cf9c6d";
                        tableLines[3].name.color.fill = "#cf9c6d";
                        tableLines[3].score.color.fill = "#cf9c6d";
                    }
                }
            }
            

        }else{//Menu principal

            if ( !start.render ){
                Place("Menu");
            }   
            Remove("Rank");

        }
        Remove("Game");

    }

    //Enemies
    for ( var i = 0; i < enemies.length; i++ ){
        enemies[i].obj.origin.x += enemies[i].vel;
        enemies[i].walked += enemies[i].vel;

        enemies[i].relativePos.x = enemies[i].obj.position.x + ( Math.cos(enemies[i].obj.angle) * enemies[i].walked );
        enemies[i].relativePos.y = enemies[i].obj.position.y + ( Math.sin(enemies[i].obj.angle) * enemies[i].walked );

        let DeltaX = Math.abs( enemies[i].relativePos.x - player.bod.position.x );
        let DeltaY = Math.abs( enemies[i].relativePos.y - player.bod.position.y );
        let Dist = Math.sqrt( DeltaX**2 + DeltaY**2 );

        if ( Dist < enemies[i].obj._r + player.bod._r && !enemies[i].attacked ){
            //------Colided------- Enemies x Player

            enemies[i].attacked = true;

            player.hp -= enemies[i].damage;
            player.hpBar._w -= player.colisionRetain;

            player.hpBar.position.x -= player.colisionRetain/2;

            player.hpInfo.text = "Hp: "+player.hp;

            player.bod.color.fill = "#052222";
            player.cannon.color.fill = "#101010";
            
            if ( typeof player.shaker != undefined ){
                clearInterval( player.shaker );
            }

            var cnt = 1;
            player.shaker = setInterval( function (){
                let s = Math.sin( ToRad( cnt ) );
                let c = Math.cos( ToRad( cnt ) );

                player.bod.position.x += s;
                player.bod.position.y += c;

                player.cannon.position.x += s;
                player.cannon.position.y += c;
                cnt+=20;
            }, 1 );

            setTimeout( function (){ player.bod.color.fill = "#05cccc"; player.cannon.color.fill = "#808080"; clearInterval(player.shaker); }, 200 );

            if ( player.hp <= 0 ){
                isPlaying = false;
                isRanking = false;
                clearTimeout( timeout );

                pontuation.text = P + player.pts;
                player.pointCharge = new Pontuation( player.name, player.pts )
                SavePonctuation( player.pointCharge );
                player.hp = player.hpMax;

                UpdateRank( player.pointCharge );
            }

        }
        if ( enemies[i].walked >= cnv.width*2 ){
            enemies[i].obj.remove();
            enemies.splice(0, 1);
        }
        //Missles Colision Enemies
        for ( var m = 0; m < missle.obj.length; m++ ){

            let Dx = Math.abs( enemies[i].relativePos.x - missle.obj[m].relativePos.x );
            let Dy = Math.abs( enemies[i].relativePos.y - missle.obj[m].relativePos.y );
            let D = Math.sqrt( Dx**2 + Dy**2 );

            if ( D < enemies[i].obj._r + missle.obj[m]._r && !missle.obj[m].attacked ){
                //-------Attacked----------
                missle.obj[m].attacked = true;
                enemies[i].hp -= missle.damage;

                missle.restore( m );

                if ( enemies[i].hp <= 0 ){

                    enemies[i].obj.remove();
                    enemies.splice(i, 1);

                    player.pts += enemies[i].givenPts;

                }
            }

        }
    }

    if ( username.hover && start.render ){
        textSelect.Render();
        pointer.remove();
        Draws.InjectPositionRender( "F", textSelect );
    }else{
        textSelect.remove();
        pointer.Render();   
        Draws.InjectPositionRender( "F", pointer );
    }

    if ( username.selected ){

        username.title.color.fill = "#000";
        username.title.text = username.nameIn.join("");

    }else{

        if ( username.nameIn.length == 0 ){
            username.title.color.fill = "#808080";
            username.title.text = "Insira seu nome";
        }

    }

    if ( exitgame.confirm ){

        Place("ExitBox");

    }else{

        Remove("ExitBox");

    }

}

window.addEventListener( "mousemove", function (e){
    cnv.CANVAS.style.cursor = "none";

    let Mx = e.offsetX;     mouse.x = e.offsetX;
    let My = e.offsetY;     mouse.y = e.offsetY;

    //Pointer
    pointer.position.x = Mx+pointer.size._w/2;
    pointer.position.y = My+pointer.size._h/2;

    textSelect.position.x = Mx+textSelect.size._w/16;
    textSelect.position.y = My+textSelect.size._h/16;

    for( var y = 0; y < Buttons.length; y++ ){
        let obj = Buttons[y];
        if ( Mx >= obj.sides.L && Mx <= obj.sides.R && My >= obj.sides.T && My <= obj.sides.B ){
            obj.color.fill = "#006799";
        }else{
            obj.color.fill = "#009acc"; 
        }
    }

    if ( Mx >= removeRank.sides.L && Mx <= removeRank.sides.R && My >= removeRank.sides.T && My <= removeRank.sides.B ){
        removeRank.color.fill = "#600";
    }else{
        removeRank.color.fill = "#a20"; 
    }

    if ( Mx >= username.sides.L && Mx <= username.sides.R && My >= username.sides.T && My <= username.sides.B ){
        username.hover = true;
    }else{
        username.hover = false;
    }
} );

window.addEventListener( "mousedown", function (e){

    let Mx = e.offsetX;
    let My = e.offsetY;

    if ( !isPlaying ){

        if ( Mx >= username.sides.L && Mx <= username.sides.R && My >= username.sides.T && My <= username.sides.B ){
            username.selected = true;
            username.selector.timer = setInterval( VerifySel, 700);
        }else{
            username.selected = false;
            clearInterval( username.selector.timer );
        }

        if ( !isRanking ){
            if ( Mx >= exitgame.sides.L && Mx <= exitgame.sides.R && My >= exitgame.sides.T && My <= exitgame.sides.B ){
                exitgame.confirm = true;
            }
        }else{
            if ( Mx >= removeRank.sides.L && Mx <= removeRank.sides.R && My >= removeRank.sides.T && My <= removeRank.sides.B ){
                removeRank.excludeAll = true;
            }
        }

        if ( removeRank.excludeAll ){
            if ( Mx >= exitBox.button2.sides.L && Mx <= exitBox.button2.sides.R && My >= exitBox.button2.sides.T && My <= exitBox.button2.sides.B ){
                removeRank.excludeAll = false;
            }
            if ( Mx >= exitBox.button1.sides.L && Mx <= exitBox.button1.sides.R && My >= exitBox.button1.sides.T && My <= exitBox.button1.sides.B ){
                RemovePonctuactions();
                removeRank.excludeAll = false;
            }
        }

        if ( exitgame.confirm ){
            if ( Mx >= exitBox.button2.sides.L && Mx <= exitBox.button2.sides.R && My >= exitBox.button2.sides.T && My <= exitBox.button2.sides.B ){
                exitgame.confirm = false;
            }

            if ( Mx >= exitBox.button1.sides.L && Mx <= exitBox.button1.sides.R && My >= exitBox.button1.sides.T && My <= exitBox.button1.sides.B ){
                window.top.close();
            }
        }

        if ( !exitgame.confirm && !removeRank.excludeAll ){
            if ( Mx >= start.sides.L && Mx <= start.sides.R && My >= start.sides.T && My <= start.sides.B && !isRanking){
                (function playGame(){isPlaying = true;
                username.selected = false;
                clearInterval( username.selector.timer );
                username.selector.remove();
                player.name = username.nameIn.join("");}())
            }
            if ( Mx >= rank.sides.L && Mx <= rank.sides.R && My >= rank.sides.T && My <= rank.sides.B ){
                isRanking = true;
            }
            if ( Mx >= exitbtn.sides.L && Mx <= exitbtn.sides.R && My >= exitbtn.sides.T && My <= exitbtn.sides.B ){
                isRanking = false;
            }
        }
    }

    

});

window.addEventListener( "mouseup", function (e){

    if ( missle.obj.length <= missle.limit && isPlaying ){

        if ( missle.obj.length == missle.limit ){
            missle.obj[0].remove();

            missle.obj.shift();
            missle.angThrow.shift();
            missle.counter.shift();

        }

        missle.angThrow.push(player.ang);
        missle.counter.push(0);
        missle.obj.push( new Draws.Ball( player.bod.position.x, player.bod.position.y, 10 ) );

        let inx = missle.angThrow.length-1;

        missle.obj[inx].attacked = false;
        missle.obj[inx].walked = 0;
        missle.obj[inx].relativePos = new Draws.Vector2( missle.obj[inx].position.x, missle.obj[inx].position.y );
        missle.obj[inx].rotate( missle.angThrow[inx] );

        missle.obj[inx].color.fill = "#50abdd";
        missle.obj[inx].line.width = 2;
        missle.obj[inx].strokeIt();

        Draws.InjectPositionRender( 0, missle.obj[inx] );
        
    }
    

})


window.addEventListener( "keydown", function (e){
    let key = e.key;
    
    if ( key.toUpperCase() == "W" ){
        player.move.up = true;
        player.move.down = false;
    }if ( key.toUpperCase() == "A"){
        player.move.left = true;
        player.move.right = false;
    }if ( key.toUpperCase() == "S" ){
        player.move.down = true;
        player.move.up = false;
    }if ( key.toUpperCase() == "D"){
        player.move.right = true;
        player.move.left = false;
    }

    /*if ( key == "T" ){ //Works
        window.top.close();
    }*/

    if ( username.selected ){

        let write = false;
        for ( var t = 0; t < allowChar.length; t++ ){

            if ( key.toUpperCase() == allowChar[t].toUpperCase() ){
                write = true;
                break;
            }

        }

        if ( write ){

            if ( username.nameIn.length < 20 ){
                username.nameIn.push( key );
                username.selector.position.x += 7.5;
            }
            

        }else{

            if ( key.toUpperCase() == "BACKSPACE" ){

                //username.nameIn.splice( username.nameIn.length-1, 1);
                if ( username.nameIn.length != 0 ){
                    username.nameIn.pop();
                    username.selector.position.x -= 7.5;
                }
                
            }else if ( key.toUpperCase() == "ENTER" ){

                //Start game;
                playGame();
            }

        }


    }else{

        clearInterval( username.selector.timer );
        username.selector.remove();

    }

} );

window.addEventListener( "keyup", function (e){
    let key = e.key.toUpperCase();

    if ( key == "W" ){
        player.move.up = false;
        if ( !player.move.down ){
            player.release.up = true;
        }
    }if ( key == "A"){
        player.move.left = false;
        if ( !player.move.right ){
            player.release.left = true;
        }
    }if ( key == "S" ){
        player.move.down = false;
        if ( !player.move.up ){
            player.release.down = true;
        }
    }if ( key == "D"){
        player.move.right = false;
        if ( !player.move.left ){
            player.release.right = true;
        }
    }

} );
