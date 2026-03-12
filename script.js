let players=[]
let currentPlayer=0
let round=1
let expeditions=5

let totals=[0,0]
let roundScores=[0,0]

const expeditionColors=[
"red","blue","green","yellow","white","purple"
]

const expeditionNames=[
"Volcano","Ocean","Jungle","Desert","Ice","Mystic"
]

const values=["W","W","W",2,3,4,5,6,7,8,9,10]

document.addEventListener("DOMContentLoaded",()=>{

loadGame()

document.getElementById("btnContinue")
.addEventListener("click",()=>show("setup"))

document.getElementById("btnStart")
.addEventListener("click",startGame)

document.getElementById("btnFinishTurn")
.addEventListener("click",finishTurn)

document.getElementById("btnNextRound")
.addEventListener("click",nextRound)

document.getElementById("btnRestart")
.addEventListener("click",restart)

})

function show(id){
document.querySelectorAll(".screen")
.forEach(s=>s.classList.add("hidden"))

document.getElementById(id).classList.remove("hidden")
}

function startGame(){

const p1=document.getElementById("player1").value||"Explorer 1"
const p2=document.getElementById("player2").value

players=[p1]

if(p2.trim()!==""){
players.push(p2)
}

expeditions=parseInt(
document.getElementById("expeditions").value
)

round=1
totals=[0,0]
roundScores=[0,0]
currentPlayer=0

saveGame()

startTurn()

}

function startTurn(){

renderBoard()

document.getElementById("roundTitle").innerText=
"Round "+round

document.getElementById("playerTurn").innerText=
"Turn: "+players[currentPlayer]

show("game")

}

function renderBoard(){

const board=document.getElementById("board")

board.innerHTML=""

for(let i=0;i<expeditions;i++){

const exp=document.createElement("div")

exp.className="expedition "+expeditionColors[i]

const title=document.createElement("h3")
title.innerText=expeditionNames[i]

exp.appendChild(title)

const cardArea=document.createElement("div")
cardArea.className="cards"

values.forEach(v=>{

const card=document.createElement("div")
card.className="card"
card.innerText=v

card.addEventListener("click",()=>{
card.classList.toggle("selected")
})

cardArea.appendChild(card)

})

exp.appendChild(cardArea)

board.appendChild(exp)

}

}

function calculateExpedition(cards){

let wagers=cards.filter(c=>c==="W").length

let numbers=cards
.filter(c=>c!=="W")
.reduce((a,b)=>a+Number(b),0)

let score=(numbers-20)*(wagers+1)

if(cards.length>=8){
score+=20
}

return score

}

function finishTurn(){

if(!confirm("Finish selecting cards?")){
return
}

let expeditionEls=document.querySelectorAll(".cards")

let total=0

expeditionEls.forEach(exp=>{

let cards=[...exp.querySelectorAll(".selected")]
.map(c=>c.innerText)

if(cards.length>0){
total+=calculateExpedition(cards)
}

})

roundScores[currentPlayer]=total

if(players.length===2 && currentPlayer===0){

currentPlayer=1
saveGame()
startTurn()
return

}

showRoundResult()

}

function showRoundResult(){

totals[0]+=roundScores[0]

if(players.length===2){
totals[1]+=roundScores[1]
}

let html=""

html+=players[0]+" : "+roundScores[0]+"<br>"

if(players.length===2){
html+=players[1]+" : "+roundScores[1]+"<br>"
}

document.getElementById("roundScores").innerHTML=html

show("roundResult")

saveGame()

}

function nextRound(){

round++
roundScores=[0,0]
currentPlayer=0

if(round>3){
showFinal()
return
}

saveGame()

startTurn()

}

function showFinal(){

let html=""

html+=players[0]+" : "+totals[0]+"<br>"

if(players.length===2){

html+=players[1]+" : "+totals[1]+"<br><br>"

let winner

if(totals[0]>totals[1]) winner=players[0]
else if(totals[1]>totals[0]) winner=players[1]
else winner="Tie"

html+="🏆 Greatest Explorer: "+winner

}

document.getElementById("finalScores").innerHTML=html

show("finalResult")

localStorage.removeItem("relicTrailsGame")

}

function restart(){
localStorage.removeItem("relicTrailsGame")
location.reload()
}

function saveGame(){

const state={
players,
currentPlayer,
round,
totals,
roundScores,
expeditions
}

localStorage.setItem(
"relicTrailsGame",
JSON.stringify(state)
)

}

function loadGame(){

const saved=localStorage.getItem("relicTrailsGame")

if(!saved) return

const state=JSON.parse(saved)

players=state.players
currentPlayer=state.currentPlayer
round=state.round
totals=state.totals
roundScores=state.roundScores
expeditions=state.expeditions

startTurn()

}

if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js")
}

function startGame(){

const p1 = document.getElementById("player1").value || "Explorer 1"
const p2 = document.getElementById("player2").value

players = [p1]

if(p2.trim() !== ""){
players.push(p2)
}

expeditions = parseInt(
document.getElementById("expeditions").value
)

round = 1
currentPlayer = 0

totals = [0,0]
roundScores = [0,0]

startTurn()

}

function startTurn(){

renderBoard()

document.getElementById("roundTitle").innerText =
"Round " + round

document.getElementById("playerTurn").innerText =
"Turn: " + players[currentPlayer]

show("game")

}

function renderBoard(){

const board = document.getElementById("board")

board.innerHTML = ""

for(let i=0;i<expeditions;i++){

const exp = document.createElement("div")

exp.className = "expedition"

const title = document.createElement("h4")
title.innerText = expeditionNames[i]

exp.appendChild(title)

values.forEach(v=>{

const card = document.createElement("div")

card.className = "card"

card.innerText = v

card.addEventListener("click",()=>{
card.classList.toggle("selected")
})

exp.appendChild(card)

})

board.appendChild(exp)

}

}

function calculateExpedition(cards){

let wagers = cards.filter(c=>c==="W").length

let numbers = cards
.filter(c=>c!=="W")
.reduce((a,b)=>a + Number(b),0)

let score = (numbers - 20) * (wagers + 1)

if(cards.length >= 8){
score += 20
}

return score

}

function finishTurn(){

if(!confirm("Are you sure you finished selecting cards?")){
return
}

let expeditionEls =
document.querySelectorAll(".expedition")

let total = 0

let detailHTML = ""

expeditionEls.forEach((exp,i)=>{

let cards =
[...exp.querySelectorAll(".selected")]
.map(c=>c.innerText)

let score = 0

if(cards.length>0){
score = calculateExpedition(cards)
}

total += score

detailHTML +=
`<p>${expeditionNames[i]}: ${score}</p>`

})

roundScores[currentPlayer] = total

if(players.length===2 && currentPlayer===0){

currentPlayer = 1
startTurn()

return

}

showRoundResult(detailHTML)

}

function showRoundResult(details){

totals[0] += roundScores[0]

if(players.length===2){
totals[1] += roundScores[1]
}

let html = ""

html += `<h3>${players[0]}</h3>`
html += `<p>Round Score: ${roundScores[0]}</p>`

if(players.length===2){

html += `<h3>${players[1]}</h3>`
html += `<p>Round Score: ${roundScores[1]}</p>`

}

html += "<hr>"
html += details

document.getElementById("roundScores").innerHTML = html

show("roundResult")

}

function nextRound(){

round++

roundScores = [0,0]

currentPlayer = 0

if(round > 3){

showFinal()

return

}

startTurn()

}

function showFinal(){

let html = ""

html += `<p>${players[0]}: ${totals[0]}</p>`

if(players.length===2){

html += `<p>${players[1]}: ${totals[1]}</p>`

let winner

if(totals[0] > totals[1]){
winner = players[0]
}
else if(totals[1] > totals[0]){
winner = players[1]
}
else{
winner = "Tie"
}

html += `<h2>🏆 Greatest Explorer: ${winner}</h2>`

}

document.getElementById("finalScores").innerHTML = html

show("finalResult")

}

function restart(){

location.reload()

}

if("serviceWorker" in navigator){

navigator.serviceWorker.register("service-worker.js")

}
