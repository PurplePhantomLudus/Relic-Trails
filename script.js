let jugadores = [];
let jugadorActual = 0;
let ronda = 1;
let expediciones = 5;
let totales = ;
let expedicionesJugador = {};
let cartasUsadas = {}; 

const colores = ["red", "blue", "green", "yellow", "white", "purple"];
const nombres = ["Volcán", "Océano", "Selva", "Desierto", "Hielo", "Misterio"];
// IDs únicos para que cada inversión sea una carta física distinta
const valores = ["W1", "W2", "W3", 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
    const j2 = document.getElementById("player2").value || "Jugador 2";
    jugadores = [j1, j2];
    expediciones = parseInt(document.getElementById("expeditions").value);
    totales = ;
    ronda = 1;
    jugadorActual = 0;
    limpiarMazoYExpediciones();
    iniciarTurno();
}

function limpiarMazoYExpediciones() {
    cartasUsadas = {};
    expedicionesJugador = {};
    for (let i = 0; i < 6; i++) {
        cartasUsadas[i] = [];
        expedicionesJugador[i] = [];
    }
}

function iniciarTurno() {
    renderizarTablero();
    document.getElementById("roundTitle").innerText = "Ronda " + ronda + " de 3";
    document.getElementById("playerTurn").innerText = "Turno de " + jugadores[jugadorActual];
    window.scrollTo(0, 0);
    mostrar("game");
}

function renderizarTablero() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let i = 0; i < expediciones; i++) {
        const exp = document.createElement("div");
        exp.className = "expedition " + colores[i];
        exp.innerHTML = `<h3>${nombres[i]}</h3><div class="scoreLive">Puntos: ${calcular(expedicionesJugador[i])}</div><div class="play-zone" id="play-${i}"></div><div class="cards" id="cards-${i}"></div>`;
        board.appendChild(exp);

        // Cartas ya jugadas en la zona de juego
        expedicionesJugador[i].forEach(v => {
            const carta = crearCartaVisual(colores[i], v, true);
            document.getElementById(`play-${i}`).appendChild(carta);
        });

        // Mazo disponible
        valores.forEach(v => {
            const yaUsada = cartasUsadas[i].includes(v);
            const carta = crearCartaVisual(colores[i], v, false, yaUsada);
            if (!yaUsada) {
                carta.onclick = () => jugarCarta(i, v);
            }
            document.getElementById(`cards-${i}`).appendChild(carta);
        });
    }
}

function crearCartaVisual(color, valor, esJugada, estaBloqueada = false) {
    const carta = document.createElement("div");
    carta.className = "card" + (esJugada ? " played" : "") + (estaBloqueada ? " taken" : "");
    
    const img = document.createElement("img");
    img.src = `assets/cards/${color}/${valor}.png`;
    img.onerror = () => { carta.innerText = valor.toString().startsWith("W") ? "Inv" : valor; };
    
    carta.appendChild(img);
    
    if (estaBloqueada) {
        const lock = document.createElement("div");
        lock.className = "lock-overlay";
        lock.innerHTML = "🔒"; // O una imagen assets/icons/lock.png
        carta.appendChild(lock);
    }
    return carta;
}

function jugarCarta(exp, valor) {
    let cartas = expedicionesJugador[exp];
    if (!valor.toString().startsWith("W")) {
        let ult = cartas.filter(c => !c.toString().startsWith("W")).pop();
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
    let apuestas = cartas.filter(c => c.toString().startsWith("W")).length;
    let nums = cartas.filter(c => !c.toString().startsWith("W")).reduce((a, b) => a + Number(b), 0);
    let score = (nums - 20) * (apuestas + 1); [4]
    if (cartas.length >= 8) score += 20; [4]
    return score;
}

function terminarTurno() {
    let totalTurno = 0;
    for (let i = 0; i < expediciones; i++) { totalTurno += calcular(expedicionesJugador[i]); }
    totales[jugadorActual] += totalTurno;

    if (jugadorActual === 0) {
        jugadorActual = 1;
        // Reiniciamos las expediciones visuales del P2, pero mantenemos cartasUsadas para el bloqueo
        for (let i = 0; i < 6; i++) { expedicionesJugador[i] = []; }
        iniciarTurno();
    } else {
        mostrarResultado();
    }
}

function siguienteRonda() {
    ronda++;
    if (ronda > 3) { mostrarFinal(); return; } [4]
    jugadorActual = 0;
    limpiarMazoYExpediciones(); // CORRECCIÓN: Ahora limpia todo para la nueva ronda
    iniciarTurno();
}

function mostrarResultado() {
    document.getElementById("roundScores").innerHTML = `<p>${jugadores}: ${totales} pts</p><p>${jugadores[6]}: ${totales[6]} pts</p>`;
    mostrar("roundResult");
}

function mostrarFinal() {
    let ganador = totales > totales[6] ? jugadores : (totales[6] > totales ? jugadores[6] : "Empate");
    document.getElementById("finalScores").innerHTML = `<h2>🏆 Ganador: ${ganador}</h2><p>${jugadores}: ${totales} pts</p><p>${jugadores[6]}: ${totales[6]} pts</p>`;
    mostrar("finalResult");
}
Estilos para el Bloqueo (style.css)
Añade esto a tu archivo para que el candado aparezca sobre la carta
:
.card.taken {
    opacity: 0.4;
    cursor: not-allowed;
    filter: grayscale(1);
    position: relative;
}

.lock-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    text-shadow: 0 0 10px black;
}