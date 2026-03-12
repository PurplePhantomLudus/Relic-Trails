let jugadores = [];
let jugadorActual = 0;
let ronda = 1;
let expediciones = 5;

let totales = [0, 0];
let expedicionesJugador = {};

const colores = ["red", "blue", "green", "yellow", "white", "purple"];
const nombres = ["Volcán", "Océano", "Selva", "Desierto", "Hielo", "Misterio"];
const valores = ["W", "W", "W", 2, 3, 4, 5, 6, 7, 8, 9, 10];

document.addEventListener("DOMContentLoaded", () => {
    // Es mejor usar getElementById para evitar problemas de compatibilidad
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
    expedicionesJugador = {};
    for (let i = 0; i < expediciones; i++) {
        expedicionesJugador[i] = [];
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

        let puntos = calcular(expedicionesJugador[i]);
        score.innerText = "Puntos expedición: " + puntos;
        totalTurno += puntos;

        const play = document.createElement("div");
        play.className = "play-zone";

        // Muestra las cartas jugadas
        expedicionesJugador[i].forEach((c, index) => {
            const carta = document.createElement("div");
            carta.className = "card played";
            carta.style.backgroundImage = c === "W" ? "url(assets/cards/wager.png)" : "url(assets/cards/" + colores[i] + ".png)";
            carta.innerHTML = "<div class='cardValue'>" + c + "</div>";
            
            // Si el jugador se equivoca, puede hacer clic en la carta jugada para quitarla
            carta.onclick = () => quitarCarta(i, index);
            
            play.appendChild(carta);
        });

        const zona = document.createElement("div");
        zona.className = "cards";

        // Calcula qué cartas quedan disponibles
        let disponibles = [...valores];
        expedicionesJugador[i].forEach(jugada => {
            let idx = disponibles.indexOf(jugada);
            if (idx !== -1) disponibles.splice(idx, 1);
        });

        // Muestra las cartas disponibles
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
    let cartas = expedicionesJugador[exp];

    if (valor !== "W") {
        let numCards = cartas.filter(c => c !== "W");
        let ult = numCards.length > 0 ? numCards[numCards.length - 1] : null;
        
        // Convertimos a Number para evitar que "10" sea evaluado como menor que "9"
        if (ult && Number(valor) <= Number(ult)) {
            alert("Las cartas deben ir en orden creciente.");
            return;
        }
    } else {
        // Regla: No puedes jugar una apuesta si ya hay números
        if (cartas.some(c => c !== "W")) {
            alert("No puedes jugar un contrato de apuesta después de una carta numérica.");
            return;
        }
    }

    cartas.push(valor);
    renderizarTablero();
}

function quitarCarta(exp, index) {
    // Permite al jugador retirar una carta si se ha equivocado calculando
    expedicionesJugador[exp].splice(index, 1);
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
        if (expedicionesJugador[i].length > 0) {
            total += calcular(expedicionesJugador[i]);
        }
    }

    totales[jugadorActual] += total;

    if (jugadores.length === 2 && jugadorActual === 0) {
        jugadorActual = 1;
        resetRonda();
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

// Registro del Service Worker
if ("serviceWorker" in navigator) {
    // Cambiado para que apunte al nombre correcto de tu archivo ("sw.js")
    navigator.serviceWorker.register("sw.js");
}