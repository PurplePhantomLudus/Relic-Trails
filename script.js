let players=[]
let currentPlayer=0
let round=1
let expeditions=5

let totals=[0,0]

const colors=["red","blue","green","yellow","white","purple"]

const values=["W","W","W",2,3,4,5,6,7,8,9,10]

function show(id){

document.querySelectorAll(".screen")
.forEach(s=>s.classList.add("hidden"))

document.getElementById(id).classList.remove("hidden")

}

function showSetup(){

show("setup")

}

function startGame(){

players=[
document.getElementById("player1").value || "Jugador 1",
document.getElementById("player2").value || "Jugador 2"
]

expeditions=parseInt(document.getElementById("expeditions").value)

round=1
totals=[0,0]

startTurn()

}

function startTurn(){

renderBoard()

document.getElementById("roundTitle").innerText="Ronda "+round

document.getElementById("playerTurn").innerText=
"Turno de "+players[currentPlayer]

show("game")

}

function renderBoard(){

let board=document.getElementById("board")

board.innerHTML=""

for(let i=0;i<expeditions;i++){

let exp=document.createElement("div")

exp.className="expedition"

values.forEach(v=>{

let card=document.createElement("div")

card.className="card"

card.innerText=v

card.onclick=()=>card.classList.toggle("selected")

exp.appendChild(card)

})

board.appendChild(exp)

}

}

function calculateExpedition(cards){

let wagers=cards.filter(c=>c==="W").length

let numbers=cards
.filter(c=>c!=="W")
.reduce((a,b)=>a+Number(b),0)

let score=(numbers-20)*(wagers+1)

if(cards.length>=8) score+=20

return score

}

let roundScores=[0,0]

function finishTurn(){

let expeditions=document.querySelectorAll(".expedition")

let total=0

expeditions.forEach(exp=>{

let cards=[...exp.querySelectorAll(".selected")]
.map(c=>c.innerText)

if(cards.length>0){

total+=calculateExpedition(cards)

}

})

roundScores[currentPlayer]=total

if(players.length===2 && currentPlayer===0){

currentPlayer=1
startTurn()
return

}

showRoundResult()

}

function showRoundResult(){

totals[0]+=roundScores[0]
totals[1]+=roundScores[1]

let text=""

text+=players[0]+" : "+roundScores[0]+"<br>"

if(players.length===2){

text+=players[1]+" : "+roundScores[1]+"<br>"

}

document.getElementById("roundScores").innerHTML=text

show("roundResult")

}

function nextRound(){

round++

currentPlayer=0

roundScores=[0,0]

if(round>3){

showFinal()

return

}

startTurn()

}

function showFinal(){

let html=""

html+=players[0]+" : "+totals[0]+"<br>"

if(players.length===2){

html+=players[1]+" : "+totals[1]+"<br><br>"

let winner=

totals[0]>totals[1] ? players[0] : players[1]

html+="🏆 Ganador: "+winner

}

document.getElementById("finalScores").innerHTML=html

show("finalResult")

}

function restart(){

location.reload()

}

if("serviceWorker" in navigator){

navigator.serviceWorker.register("service-worker.js")

}