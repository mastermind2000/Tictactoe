let origBoard;
let huPlayer='O';
let aiPlayer='X';
var mode = '0';
const win=[
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [0,3,6],
  [1,4,7],
  [2,4,6],
  [2,5,8]
];
const cells = document.querySelectorAll('.cell');


display();
function display(){
  document.querySelector('.selectlvl').style.display="block";
}
function selectlvl(lvl){
  //hide the div
  document.querySelector('.selectlvl').style.display="none";
  mode = lvl;
  startGame(mode);
  /*if(aiPlayer ==='O'){
    if(mode === '0'){
      turnEasy(randSpot(),aiPlayer);
    }
    else{
      turnEasy(bestSpot(),aiPlayer);
    }
  }*/
}
function selectsym(sym){
  //hide the div
  document.querySelector('.selectsym').style.display="none";
  huPlayer = sym;
  aiPlayer = sym === 'O'?'X':'O';
  if(aiPlayer ==='O'){
    turn(bestSpot(),aiPlayer);
  }

}

function startGame(lvl){
  document.querySelector('.endgame').style.display="none";
  document.querySelector('.endgame .text').innerText="";
  origBoard = Array.from(Array(9).keys());
  document.querySelector('.selectsym').style.display="block";
  //initialize the cells now
  for(let i = 0; i  < cells.length; i++){
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click',turnClick,false);
  }
}
/*function turnClickEasy(square){
  if(typeof origBoard[square.target.id] === 'number'){
    turnEasy(square.target.id,huPlayer);
    if(!checkTie()){
      turnEasy(randSpot(),aiPlayer);
    }
  }
}*/
function turnClick(square,lvl){
  //if the selected square is in the tic tac toe then change it
  console.log(lvl);
  if(typeof origBoard[square.target.id] === 'number'){
    turn(square.target.id,huPlayer);
    if(!checkTie()){
      if(lvl == '0'){
        turnEasy(randSpot(),aiPlayer);
      }
      else{
        turn(bestSpot(),aiPlayer);
      }
    }
  }
}
function turnEasy(squareId,player){
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
  checkTie();
}
function turn(squareId,player){
  //update the selected square;
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
  checkTie();
}
function checkWin(board,player){
  //store the moves of the players
  let played = board.reduce((a,e,i) => (e === player)?a.concat(i):a,[]);
  let gameWon = null;
  //check for every win combo if it matches you win else continue
  for(let [index,wincombo] of win.entries()){
    //if you find
    if(wincombo.every(elem => played.indexOf(elem) > -1)){
      gameWon = {index:index,player:player};
      break;
    }
  }
  return gameWon;
  //checkTie();
}
function gameOver(gameWon){
  //highlight the winning sequence
  for(let index of win[gameWon.index]){
    document.getElementById(index).style.backgroundColor=gameWon.player === huPlayer?"green":"red";
  }
  //remove all event listeners
  for(let i = 0; i < cells.length; i++){
    cells[i].removeEventListener('click',turnClick,false);
  }
  declareWinner(gameWon.player === huPlayer?"You Won":"You Lost");
}
function declareWinner(who){
  document.querySelector('.endgame').style.display="block";
  document.querySelector('.endgame .text').innerText = who;
}
function emptySquares(){
  //check if any square is empty or not
  return origBoard.filter(s => typeof s === 'number');
}
function randSpot(){
  return spot(origBoard,aiPlayer).index;
}
function bestSpot(){
  return minimax(origBoard,aiPlayer).index;
}
function checkTie(){
  if (emptySquares().length === 0){
      for (let i = 0; i < cells.length; i++) {
          cells[i].style.backgroundColor = "blue";
          cells[i].removeEventListener('click',turnClick, false);
      }
      declareWinner("Tie game");
      return true;
    } 
    return false;
}
function spot(origBoard,player){
  while(true){
    let i = Math.floor(Math.random()*9);
    if(typeof origBoard[i] === 'number'){
      return i;
    }
  }
}
function minimax(newBoard,player){
  let availSpots = emptySquares(newBoard);
  if(checkWin(newBoard,huPlayer)){
    return {score: -10};
  }
  else if(checkWin(newBoard,aiPlayer)){
    return {score: 10};
  }
  else if(availSpots.length === 0){
    return {score: 0};
  }
  var moves = [];
  for(let i = 0; i < availSpots.length; i++){
    var move = {};
    //choose
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    if(player === aiPlayer){
      move.score = minimax(newBoard,huPlayer).score;
    }
    else{
      move.score = minimax(newBoard,aiPlayer).score;
    }
    //dont choose
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  let bestMove, bestScore;
  if (player === aiPlayer) {
      bestScore = -1000;
      for(let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
      }
  } 
  else{
      bestScore = 1000;
      for(let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
      }
  }  
  return moves[bestMove];
}