var socket = io();
var hand=[];
var table=[];
var id;
var images=[];
var imagesTable=[];
var myMove = false;
var odabir;
var img;
var trenutniIgrac;
var odbaceneKarte=0;
var rezultati=[0,0,0,0,0];
var brIgr=3;
var deck=40;
socket.on('message',function(data){
    console.log(data);
    brIgr=data.ply;
    deck=data.dck;
});
socket.on('identi',function(data){
    id=data.id;
    document.getElementById('player-id').innerHTML='Igrač '+id;
    for (var i=0;i<8;i++){
        images[i].classList.remove('hidden');
    }
});
socket.on('addToHand',function(data){
    hand.push(data.karta);
    //console.log(data.karta)
});
socket.on("begin",function(data){
    hand.sort(function(a,b){return Number(a)-Number(b)});
    draw();
});
socket.on('yourMove',function(data){
    trenutniIgrac=data.id;
    document.getElementById('current-player').innerHTML='Trenutni igrač: '+trenutniIgrac;
    if (data.id == id){
        myMove = true;
    }
    else{
        myMove = false;
    }
});
socket.on('putToTable', function(data){
    table.push(data.card);
    //console.log(data.karta)
});
socket.on('krajRunde', function(data){
    setTimeout(function(){
        for (var i=0;i<5;i++){
            imagesTable[i].classList.add('hidden');
        }
    },2000);
    table=[];
    myMove=false;
});
/*socket.on('noonesmove', function(data){
    myMove=false;
});*/
socket.on('gameOver',function(data){
    console.log('GameOver Data:')
    console.log(data)
    rezultati[data.id-1]+=parseInt(data.score);
    hand=[];
    for (var i=0;i<hand.length;i++){
        images[i].classList.remove('hidden');
    }
    odbaceneKarte=0;
});
socket.on('resetiraj',function(){
    hand=[];
    for (var i=0;i<table.length;i++){
        imagesTable[i].classList.add('hidden');
    }
    for (var i=0;i<hand.length;i++){
        images[i].classList.remove('hidden');
    }
    odbaceneKarte=0;
    table=[];
    myMove=false;
})
for(var i=0;i<12;i++){
    images.push(document.getElementById('k'+i));
}
for(var i=0;i<5;i++){
    imagesTable.push(document.getElementById('t'+i));
    imagesTable[i].classList.remove('hidden');
}
function draw(){
    for(var i=0;i<hand.length;i++){
        images[i].classList.remove('hidden');
        images[i].src='./img/'+hand[i][0]+'.jpg';
    }
    for(var i=0;i<table.length;i++){
        imagesTable[i].src='./img/'+table[i][0]+'.jpg';
        imagesTable[i].classList.remove('hidden');
    }
    for (var i=0;i<5;i++){
        document.getElementById('score'+(i+1)).innerHTML='Igrač '+(i+1)+':  '+parseInt(rezultati[i]/3)+' i '+rezultati[i]%3+' bele';
    }
    requestAnimationFrame(draw);
}
document.getElementById('reset').addEventListener('click',function(){
    socket.emit('reset',{});
});
document.getElementById('3pl').addEventListener('click',function(){
    socket.emit('createNew',{br:3});
});
document.getElementById('4pl').addEventListener('click',function(){
    socket.emit('createNew',{br:4});
});
document.getElementById('5pl').addEventListener('click',function(){
    socket.emit('createNew',{br:5});
});
images[0].addEventListener('click',function(){
    odabir=0;
    odaberi(odabir);
})
images[1].addEventListener('click',function(){
    odabir=1;
    odaberi(odabir);
})
images[2].addEventListener('click',function(){
    odabir=2;
    odaberi(odabir);
})
images[3].addEventListener('click',function(){
    odabir=3;
    odaberi(odabir);
})
images[4].addEventListener('click',function(){
    odabir=4;
    odaberi(odabir);
})
images[5].addEventListener('click',function(){
    odabir=5;
    odaberi(odabir);
})
images[6].addEventListener('click',function(){
    odabir=6;
    odaberi(odabir);
})
images[7].addEventListener('click',function(){
    odabir=7;
    odaberi(odabir);
})
images[8].addEventListener('click',function(){
    odabir=8;
    odaberi(odabir);
})
images[9].addEventListener('click',function(){
    odabir=9;
    odaberi(odabir);
})
images[10].addEventListener('click',function(){
    odabir=10;
    odaberi(odabir);
})
images[11].addEventListener('click',function(){
    odabir=11;
    odaberi(odabir);
})
function contains(karta,spil){
    for (var i=0;i<spil.length;i++){
        if (parseInt(karta/10)==parseInt(spil[i]/10)){
            return true;
        }
    }
    return false;
}
function odaberi(odabirKarte){
    if(!table[0]){
        if(myMove){
            myMove = false;
            socket.emit('chosenCard',{id:id,card:hand[odabir]});
            hand.splice(odabir,1);
            images[parseInt(deck/brIgr)-(odbaceneKarte+1)].classList.add('hidden');
            odbaceneKarte++;
        }
    }else if(contains(table[0],hand)){
        if(parseInt(table[0]/10)==parseInt(hand[odabir]/10)){
            if(myMove){
                myMove = false;
                socket.emit('chosenCard',{id:id,card:hand[odabir]});
                hand.splice(odabir,1);
                images[parseInt(deck/brIgr)-(odbaceneKarte+1)].classList.add('hidden');
                odbaceneKarte++;
            }
        }
    }else{
        if(myMove){
            myMove = false;
            socket.emit('chosenCard',{id:id,card:hand[odabir]});
            hand.splice(odabir,1);
            images[parseInt(deck/brIgr)-(odbaceneKarte+1)].classList.add('hidden');
            odbaceneKarte++;
        }
    }
}