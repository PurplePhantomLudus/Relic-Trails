let jugadores = [];
let jugadorActual = 0;
let ronda = 1;
let expediciones = 5;

let totales = [0, 0];
// Ahora guardamos las cartas de los dos jugadores por separado
// Índice 0 para el Jugador 1, Índice 1 para el Jugador 2
let cartasJugadas = [{}, {}]; 

const colores = ["red", "blue", "green", "yellow", "white", "purple"];
const nombres = ["Volcán", "Océano", "Selva", "Desierto", "Hielo", "Misterio"];
const valores = ["W", "W", "W", 2, 3, 4, 5, 6, 7, 8, 9, 10];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnContinue").onclick = () => mostrar("setup");
    document.getElementById("btnStart").onclick = iniciarJuego;
    document.getElementById("btnFinishTurn").onclick = terminarTurno;
    document.getElementById("btnNextRound").onclick = siguienteRonda;
    document.getElementById("btnRestart").onclick = () => location.reload();
});

function mostrar(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

function iniciarJuego() {
    const j1 = document.getElementById("player1").value || "Jugador 1";
    const j2 = document.getElementById("player2").value;

    jugadores = [j1];
    if (j2.trim() !== "") jugadores.push(j2);

    expediciones = parseInt(document.getElementById("expeditions").value);
    totales = [0, 0];
    ronda = 1;
    jugadorActual = 0;

    resetRonda();
    iniciarTurno();
}

function resetRonda() {
    cartasJugadas = [{}, {}];
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < expediciones; i++) {
            cartasJugadas[j][i] = [];
        }
    }
}

function iniciarTurno() {
    renderizarTablero();
    document.getElementById("roundTitle").innerText = "Ronda " + ronda;
    document.getElementById("playerTurn").innerText = "Turno de " + jugadores[jugadorActual];
    mostrar("game");
}

function renderizarTablero() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    let totalTurno = 0;

    for (let i = 0; i < expediciones; i++) {
        const exp = document.createElement("div");
        exp.className = "expedition " + colores[i];

        const titulo = document.createElement("h3");
        titulo.innerText = nombres[i];

        const score = document.createElement("div");
        score.className = "scoreLive";

        let puntos = calcular(cartasJugadas[jugadorActual][i]);
        score.innerText = "Puntos expedición: " + puntos;
        totalTurno += puntos;

        const play = document.createElement("div");
        play.className = "play-zone";

        // Mostrar cartas en la expedición del jugador actual
        cartasJugadas[jugadorActual][i].forEach((c, index) => {
            const carta = document.createElement("div");
            carta.className = "card played";
            carta.style.backgroundImage = c === "W" ? "url(assets/cards/wager.png)" : "url(assets/cards/" + colores[i] + ".png)";
            carta.innerHTML = "<div class='cardValue'>" + c + "</div>";
            
            carta.onclick = () => quitarCarta(i, index);
            
            play.appendChild(carta);
        });

        const zona = document.createElement("div");
        zona.className = "cards";

        // REGLA CLAVE: Las cartas disponibles son la baraja menos las que tiene el J1 y el J2
        let disponibles = [...valores];
        
        // Restamos las del Jugador 1
        cartasJugadas[0][i].forEach(jugada => {
            let idx = disponibles.indexOf(jugada);
            if (idx !== -1) disponibles.splice(idx, 1);
        });
        
        // Restamos las del Jugador 2
        cartasJugadas[1][i].forEach(jugada => {
            let idx = disponibles.indexOf(jugada);
            if (idx !== -1) disponibles.splice(idx, 1);
        });

        // Mostrar las cartas que siguen libres en la baraja
        disponibles.forEach(v => {
            const carta = document.createElement("div");
            carta.className = "card";
            carta.style.backgroundImage = v === "W" ? "url(assets/cards/wager.png)" : "url(assets/cards/" + colores[i] + ".png)";
            
            const valor = document.createElement("div");
            valor.className = "cardValue";
            valor.innerText = v;
            
            carta.appendChild(valor);
            carta.onclick = () => jugarCarta(i, v);
            
            zona.appendChild(carta);
        });

        exp.appendChild(titulo);
        exp.appendChild(score);
        exp.appendChild(play);
        exp.appendChild(zona);
        board.appendChild(exp);
    }

    document.getElementById("totalLive").innerText = "Puntos turno actual: " + totalTurno;
}

function jugarCarta(exp, valor) {
    let cartas = cartasJugadas[jugadorActual][exp];

    if (valor !== "W") {
        let numCards = cartas.filter(c => c !== "W");
        let ult = numCards.length > 0 ? numCards[numCards.length - 1] : null;
        
        if (ult && Number(valor) <= Number(ult)) {
            alert("Las cartas deben ir en orden creciente.");
            return;
        }
    } else {
        if (cartas.some(c => c !== "W")) {
            alert("No puedes jugar un contrato de apuesta después de una carta numérica.");
            return;
        }
    }

    cartas.push(valor);
    renderizarTablero();
}

function quitarCarta(exp, index) {
    cartasJugadas[jugadorActual][exp].splice(index, 1);
    renderizarTablero();
}

function calcular(cartas) {
    if (cartas.length === 0) return 0;

    let apuestas = cartas.filter(c => c === "W").length;
    let nums = cartas.filter(c => c !== "W").reduce((a, b) => a + Number(b), 0);

    let score = (nums - 20) * (apuestas + 1);

    if (cartas.length >= 8) score += 20;

    return score;
}

function terminarTurno() {
    let total = 0;
    for (let i = 0; i < expediciones; i++) {
        if (cartasJugadas[jugadorActual][i].length > 0) {
            total += calcular(cartasJugadas[jugadorActual][i]);
        }
    }

    totales[jugadorActual] += total;

    // Pasamos al Jugador 2 pero NO reseteamos la ronda
    if (jugadores.length === 2 && jugadorActual === 0) {
        jugadorActual = 1;
        iniciarTurno();
        return;
    }

    mostrarResultado();
}

function mostrarResultado() {
    let html = jugadores[0] + " : " + totales[0] + " puntos<br>";
    if (jugadores.length === 2) {
        html += jugadores[1] + " : " + totales[1] + " puntos<br>";
    }
    document.getElementById("roundScores").innerHTML = html;
    mostrar("roundResult");
}

function siguienteRonda() {
    ronda++;
    if (ronda > 3) {
        mostrarFinal();
        return;
    }
    jugadorActual = 0;
    resetRonda();
    iniciarTurno();
}

function mostrarFinal() {
    let html = jugadores[0] + " : " + totales[0] + " puntos<br>";

    if (jugadores.length === 2) {
        html += jugadores[1] + " : " + totales[1] + " puntos<br><br>";
        let ganador;
        if (totales[0] > totales[1]) ganador = jugadores[0];
        else if (totales[1] > totales[0]) ganador = jugadores[1];
        else ganador = "Empate";
        
        html += "🏆 Gran Explorador: " + ganador;
    }

    document.getElementById("finalScores").innerHTML = html;
    mostrar("finalResult");
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}