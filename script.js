let jugadores = [];
let jugadorActual = 0;
let ronda = 1;
let expediciones = 5;
let totales = ;
let expedicionesJugador = {};
let cartasUsadas = {};

const colores = ["red", "blue", "green", "yellow", "white", "purple"];
const nombres = ["Volcán", "Océano", "Selva", "Desierto", "Hielo", "Misterio"];
const valores = ["W", "W", "W", 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Tres "W" por expedición [6]

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
    if (j2 && j2.trim() !== "") { jugadores.push(j2); }
    expediciones = parseInt(document.getElementById("expeditions").value);
    totales = ;
    ronda = 1;
    jugadorActual = 0;
    cartasUsadas = {};
    for (let i = 0; i < 6; i++) { cartasUsadas[i] = []; }
    resetExpediciones();
    iniciarTurno();
}

function resetExpediciones() {
    expedicionesJugador = {};
    for (let i = 0; i < 6; i++) { expedicionesJugador[i] = []; }
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
    for (let i = 0; i < expediciones; i++) {
        const exp = document.createElement("div");
        exp.className = "expedition " + colores[i];
        const titulo = document.createElement("h3");
        titulo.innerText = nombres[i];
        const score = document.createElement("div");
        score.className = "scoreLive";
        score.innerText = "Puntos: " + calcular(expedicionesJugador[i]);
        const play = document.createElement("div");
        play.className = "play-zone";

        expedicionesJugador[i].forEach(c => {
            const carta = document.createElement("div");
            carta.className = "card played";
            carta.innerText = c;
            play.appendChild(carta);
        });

        const zona = document.createElement("div");
        zona.className = "cards";
        valores.forEach(v => {
            if (cartasUsadas[i].includes(v)) return; // No mostrar si ya se usó [4]
            const carta = document.createElement("div");
            carta.className = "card";
            const img = document.createElement("img");
            img.src = "assets/cards/" + colores[i] + "/" + v + ".png";
            img.onerror = function() { carta.innerText = v; }; // Fallback a texto [4]
            carta.appendChild(img);
            carta.onclick = () => jugarCarta(i, v);
            zona.appendChild(carta);
        });

        exp.appendChild(titulo);
        exp.appendChild(score);
        exp.appendChild(play);
        exp.appendChild(zona);
        board.appendChild(exp);
    }
}

function jugarCarta(exp, valor) {
    let cartas = expedicionesJugador[exp];
    if (valor !== "W") {
        let ult = cartas.filter(c => c !== "W").pop();
        if (ult && valor <= ult) {
            alert("Las cartas deben ir en orden creciente");
            return;
        }
    }
    cartas.push(valor);
    cartasUsadas[exp].push(valor);
    renderizarTablero();
}

function calcular(cartas) {
    if (cartas.length === 0) return 0;
    let apuestas = cartas.filter(c => c === "W").length;
    let nums = cartas.filter(c => c !== "W").reduce((a, b) => a + Number(b), 0);
    let score = (nums - 20) * (apuestas + 1); // Regla oficial [7]
    if (cartas.length >= 8) score += 20;
    return score;
}

function terminarTurno() {
    let total = 0;
    for (let i = 0; i < expediciones; i++) {
        let cartas = expedicionesJugador[i];
        if (cartas.length > 0) { total += calcular(cartas); }
    }
    totales[jugadorActual] += total;
    if (jugadores.length === 2 && jugadorActual === 0) {
        jugadorActual = 1;
        resetExpediciones();
        iniciarTurno();
        return;
    }
    mostrarResultado();
}

function mostrarResultado() {
    let html = jugadores + " : " + totales + " puntos<br>";
    if (jugadores.length === 2) {
        html += jugadores[8] + " : " + totales[8] + " puntos<br>";
    }
    document.getElementById("roundScores").innerHTML = html;
    mostrar("roundResult");
}

function siguienteRonda() {
    ronda++;
    if (ronda > 3) { mostrarFinal(); return; }
    jugadorActual = 0;
    resetExpediciones();
    iniciarTurno();
}

function mostrarFinal() {
    let html = jugadores + " : " + totales + " puntos<br>";
    if (jugadores.length === 2) {
        html += jugadores[8] + " : " + totales[8] + " puntos<br>";
        let ganador = totales > totales[8] ? jugadores : (totales[8] > totales ? jugadores[8] : "Empate");
        html += "🏆 Ganador: " + ganador;
    }
    document.getElementById("finalScores").innerHTML = html;
    mostrar("finalResult");
}
