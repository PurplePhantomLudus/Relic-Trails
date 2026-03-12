let jugadores=[]
let jugadorActual=0
let ronda=1
let expediciones=5

let totales=[0,0]

let expedicionesJugador={}
let cartasBloqueadas={}

const colores=["red","blue","green","yellow","white","purple"]

const nombresExpedicion=[
"Volcán",
"Océano",
"Selva",
"Desierto",
"Hielo",
"Misterio"
]

const valores=["W","W","W",2,3,4,5,6,7,8,9,10]

document.addEventListener("DOMContentLoaded",()=>{

document.getElementById("btnContinue")
.addEventListener("click",()=>mostrar("setup"))

document.getElementById("btnStart")
.addEventListener("click",iniciarJuego)

document.getElementById("btnFinishTurn")
.addEventListener("click",terminarTurno)

document.getElementById("btnNextRound")
.addEventListener("click",siguienteRonda)

document.getElementById("btnRestart")
.addEventListener("click",reiniciar)

})

function mostrar(id){

document.querySelectorAll(".screen")
.forEach(s=>s.classList.add("hidden"))

document.getElementById(id).classList.remove("hidden")

}

function iniciarJuego(){

const j1=document.getElementById("player1").value || "Explorador 1"
const j2=document.getElementById("player2").value

jugadores=[j1]

if(j2.trim()!==""){
jugadores.push(j2)
}

expediciones=parseInt(
document.getElementById("expeditions").value
)

jugadorActual=0
ronda=1
totales=[0,0]

resetExpediciones()

iniciarTurno()

}

function resetExpediciones(){

expedicionesJugador={}
cartasBloqueadas={}

for(let i=0;i<expediciones;i++){

expedicionesJugador[i]=[]
cartasBloqueadas[i]=[]

}

}

function iniciarTurno(){

renderizarTablero()

document.getElementById("roundTitle").innerText=
"Ronda "+ronda

document.getElementById("playerTurn").innerText=
"Turno de "+jugadores[jugadorActual]

mostrar("game")

}

function renderizarTablero(){

const board=document.getElementById("board")
board.innerHTML=""

for(let i=0;i<expediciones;i++){

const exp=document.createElement("div")
exp.className="expedition "+colores[i]

const titulo=document.createElement("h3")
titulo.innerText=nombresExpedicion[i]

const zona=document.createElement("div")
zona.className="expedition-zone"

zona.dataset.index=i

zona.addEventListener("dragover",e=>e.preventDefault())

zona.addEventListener("drop",soltarCarta)

exp.appendChild(titulo)
exp.appendChild(zona)

board.appendChild(exp)

}

crearMano()

}

function crearMano(){

const board=document.getElementById("board")

const hand=document.createElement("div")
hand.className="hand"

valores.forEach(v=>{

for(let e=0;e<expediciones;e++){

if(cartasBloqueadas[e].includes(v)) continue

const carta=document.createElement("div")
carta.className="card"

carta.draggable=true

const img=document.createElement("img")

img.src=`assets/cards/${colores[e]}/${v}.png`

img.onerror=function(){
carta.innerText=v
}

carta.appendChild(img)

carta.dataset.valor=v
carta.dataset.expedicion=e

carta.addEventListener("dragstart",dragCarta)

hand.appendChild(carta)

}

})

board.appendChild(hand)

}

function dragCarta(e){

e.target.classList.add("dragging")

e.dataTransfer.setData(
"text",
JSON.stringify({
valor:e.target.dataset.valor,
exp:e.target.dataset.expedicion
})
)

}

function soltarCarta(e){

const data=JSON.parse(
e.dataTransfer.getData("text")
)

const expIndex=parseInt(e.currentTarget.dataset.index)

if(expIndex!=data.exp) return

const zona=e.currentTarget

const cartas=expedicionesJugador[expIndex]

let valor=data.valor

if(valor!=="W"){

valor=parseInt(valor)

let ultima=cartas.filter(c=>c!=="W").pop()

if(ultima && valor<=ultima){

alert("Las cartas deben ir en orden creciente")

return

}

}

cartas.push(valor)

cartasBloqueadas[expIndex].push(valor)

const carta=document.createElement("div")
carta.className="card played"

carta.innerText=valor

zona.appendChild(carta)

renderizarTablero()

}

function calcularExpedicion(cartas){

let apuestas=cartas.filter(c=>c==="W").length

let numeros=cartas
.filter(c=>c!=="W")
.reduce((a,b)=>a+Number(b),0)

let puntos=(numeros-20)*(apuestas+1)

if(cartas.length>=8){
puntos+=20
}

return puntos

}

function terminarTurno(){

let total=0

for(let i=0;i<expediciones;i++){

let cartas=expedicionesJugador[i]

if(cartas.length>0){

total+=calcularExpedicion(cartas)

}

}

totales[jugadorActual]+=total

if(jugadores.length===2 && jugadorActual===0){

jugadorActual=1
resetExpediciones()
iniciarTurno()
return

}

mostrarResultado()

}

function mostrarResultado(){

let html=""

html+=jugadores[0]+" : "+totales[0]+" puntos<br>"

if(jugadores.length===2){
html+=jugadores[1]+" : "+totales[1]+" puntos<br>"
}

document.getElementById("roundScores").innerHTML=html

mostrar("roundResult")

}

function siguienteRonda(){

ronda++

if(ronda>3){

mostrarFinal()

return

}

jugadorActual=0

resetExpediciones()

iniciarTurno()

}

function mostrarFinal(){

let html=""

html+=jugadores[0]+" : "+totales[0]+" puntos<br>"

if(jugadores.length===2){

html+=jugadores[1]+" : "+totales[1]+" puntos<br><br>"

let ganador

if(totales[0]>totales[1]) ganador=jugadores[0]
else if(totales[1]>totales[0]) ganador=jugadores[1]
else ganador="Empate"

html+="🏆 Gran Explorador: "+ganador

}

document.getElementById("finalScores").innerHTML=html

mostrar("finalResult")

}

function reiniciar(){
location.reload()
}

if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js")
}