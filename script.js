let jugadores=[]
let jugadorActual=0
let ronda=1
let expediciones=5

let totales=[0,0]

let expedicionesJugador={}
let cartasUsadas={}

const colores=["red","blue","green","yellow","white","purple"]

const nombres=[
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
.onclick=()=>mostrar("setup")

document.getElementById("btnStart")
.onclick=iniciarJuego

document.getElementById("btnFinishTurn")
.onclick=terminarTurno

document.getElementById("btnNextRound")
.onclick=siguienteRonda

document.getElementById("btnRestart")
.onclick=reiniciar

})

function mostrar(id){

document.querySelectorAll(".screen")
.forEach(s=>s.classList.add("hidden"))

document.getElementById(id).classList.remove("hidden")

}

function iniciarJuego(){

const j1=document.getElementById("player1").value || "Jugador 1"
const j2=document.getElementById("player2").value

jugadores=[j1]

if(j2.trim()!==""){
jugadores.push(j2)
}

expediciones=parseInt(
document.getElementById("expeditions").value
)

totales=[0,0]
ronda=1
jugadorActual=0

resetExpediciones()

iniciarTurno()

}

function resetExpediciones(){

expedicionesJugador={}
cartasUsadas={}

for(let i=0;i<expediciones;i++){

expedicionesJugador[i]=[]
cartasUsadas[i]=[]

}

}

function iniciarTurno(){

renderizarTablero()

document.getElementById("roundTitle").innerText="Ronda "+ronda
document.getElementById("playerTurn").innerText="Turno de "+jugadores[jugadorActual]

mostrar("game")

}

function renderizarTablero(){

const board=document.getElementById("board")

board.innerHTML=""

for(let i=0;i<expediciones;i++){

const exp=document.createElement("div")
exp.className="expedition "+colores[i]

const titulo=document.createElement("h3")
titulo.innerText=nombres[i]

const play=document.createElement("div")
play.className="play-zone"

expedicionesJugador[i].forEach(c=>{

const carta=document.createElement("div")
carta.className="card played"
carta.innerText=c

play.appendChild(carta)

})

const zona=document.createElement("div")
zona.className="cards"

valores.forEach(v=>{

if(cartasUsadas[i].includes(v)) return

const carta=document.createElement("div")
carta.className="card"

const img=document.createElement("img")

img.src="assets/cards/"+colores[i]+"/"+v+".png"

img.onerror=function(){
carta.innerText=v
}

carta.appendChild(img)

carta.onclick=()=>jugarCarta(i,v)

zona.appendChild(carta)

})

exp.appendChild(titulo)
exp.appendChild(play)
exp.appendChild(zona)

board.appendChild(exp)

}

}

function jugarCarta(exp,valor){

let cartas=expedicionesJugador[exp]

if(valor!=="W"){

let ult=cartas.filter(c=>c!=="W").pop()

if(ult && valor<=ult){

alert("Las cartas deben ir en orden creciente")

return

}

}

cartas.push(valor)
cartasUsadas[exp].push(valor)

renderizarTablero()

}

function calcular(cartas){

let apuestas=cartas.filter(c=>c==="W").length

let nums=cartas.filter(c=>c!=="W")
.reduce((a,b)=>a+Number(b),0)

let score=(nums-20)*(apuestas+1)

if(cartas.length>=8) score+=20

return score

}

function terminarTurno(){

let total=0

for(let i=0;i<expediciones;i++){

let cartas=expedicionesJugador[i]

if(cartas.length>0){

total+=calcular(cartas)

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