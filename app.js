var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/',express.static(__dirname + '/client'));
app.use('/client/img',express.static(__dirname + '/client/img'));
serv.listen(2000);
console.log('Server started!')
//----------------------------------------------------------------------
var curPlayer = Math.floor(Math.random()*5);
var socketList = [];
var playerList = [];
var table = [];
var playerOrder = [];
var broj=[1,2,3,4,5];
var deck = [];
var brRundi = 8;
var uvjet = true;
//----------------------------------------------------------------------
for (var i=0;i<40;i++){             //kreiramo spil od 40 karata
    deck.push(i);
}
//console.log(deck);
for(var i=0;i<40;i++){
    var temp=deck.pop();
    deck.splice(Math.floor(Math.random()*39),0,temp);
}
//console.log(deck);
function Player(id){
    this.id=id;
    this.hand=[];
    this.grave=[];
    this.points;
}
//--------------------------------------------------------------------------
var io = require('socket.io')(serv,{});
                                                 //cekamo spajanje 5 igraca
io.sockets.on('connection',function(socket){
    if(playerList.length<5){
        socket.id=broj.shift();
        console.log('socket connection id: '+socket.id);
        socketList.push(socket);
        playerList.push(new Player(socket.id));
        socket.emit('identi',{id:socket.id});
        socket.on('disconnect',function(){
            playerList.splice(socket.id,1);
            broj.push(socket.id);
        })
        socket.on('chosenCard',function(data){
            table.push(data.card);              //primamo kartu od igraca te stavljamo na stol
            playerOrder.push(data.id);          //zapisivamo i id igraca
            curPlayer++;                        //slijedeci igrac moze igrati
        });   
    }
    console.log('playerlist length: '+playerList.length);
});
//----------------------------------------------------------------------------
setInterval(function(){
//while(uvjet){
    if (playerList.length===5){     //kad se spoji 5 igraca pocinje igra
        while(deck.length!=0){         //stavljamo karte u ruke svih igraca
            for (var i in socketList){
                var socket=socketList[i];
                socket.emit('addToHand',{karta:deck.splice(0,1)})
            }
        }
        io.sockets.emit("begin",{});                                 //saljemo za pocetak draw funkcije
        socketList[curPlayer%5].emit('yourMove',{id:curPlayer%5+1});       //odradivamo tko igra
        console.log('trenutni igrac: '+(curPlayer%5+1))
        for (var i in socketList){              //saljemo svima podatke o svim kartama na stolu
            var socket=socketList[i];
            socket.emit('tableView',{table:table,id:playerOrder});
        }
        if(table.length==5 && brRundi!=0){      //kada ss stol napuni a nije kraj igre
            var indexOfWinner = function(table1){   //provjeravamo koja je najveca karta
                var maxim = 0;
                var pos = 0;
                console.log(table1);
                for(var i=0;i<table1.length;i++){       
                    if(table1[i]%10>maxim%10 && Math.floor(table1[i]/10)==Math.floor(table1[0]/10)){
                        maxim = table1[i];          //trazimo najvecu kartu
                        pos = i;                    //oznacavamo poziciju najvece karte
                    }
                }
                console.log(maxim);
                return pos;                         //vracamo poziciju
            };
            pozicija = indexOfWinner(table);
            for (var i=0;i<table.length;i++){
                playerList[playerOrder[pozicija]-1].grave.push(table[i]);      //igrac koji je bacio najvecu kartu uzima sve karte sa stola
            }
            if (brRundi==1){                              
                playerList[playerOrder[pozicija]-1].grave.push(3);
            }
            console.log('player')
            console.log();
            console.log('dobio je igrac: '+(playerList[playerOrder[pozicija]-1].id));
            console.log();
            for (var i=0;i<playerList.length;i++){
                var suma = 0;
                for (var j = 0; j < playerList[i].grave.length; j++) {
                    if(playerList[i].grave[j]%10==7){
                        suma+=3;
                    }
                    else if(playerList[i].grave[j]%10<=9 && playerList[i].grave[j]%10>=4){
                        suma+=1;
                    }
                }
                playerList[i].points = suma;            //racunamo bodove skupljenih karata
            }
            table = [];                                 //micemo karte sa stola
            curPlayer = playerList[playerOrder[pozicija]-1].id-1;          //igrac koji je kupio karte zapocinje slijedecu rundu
            playerOrder = [];                           
            brRundi--;
        }
        if (brRundi==0){                                //kad su sve karte potrosene
            for(var i=0;i<5;i++){
                io.sockets.emit('gameOver',{id:playerList[i],score:playerList[i].points});  //posalji igracima rezultate
            }
            for (var i=0;i<40;i++){          //igra pocinje ispocetka
                deck.push(i);
            }
            console.log(deck);
            for(var i=0;i<40;i++){
                var temp=deck.pop();
                deck.splice(Math.floor(Math.random()*39),0,temp);
            }
            table = [];
            playerOrder = [];
            brRundi = 8;
        }
    }
    else{
        io.sockets.emit('message',{msg:'Waiting for players'});
    }
//}
},2000)





