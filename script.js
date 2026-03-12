let jugadores = [];
let jugadorActual = 0;
let ronda = 1;
let numExp = 5;
let totales = ;
let historial = [[], []];
let cartasMarcadas = {}; 
let cartasBloqueadas = {}; // Registro de cartas usadas en la ronda actual

const colores = ["red", "blue", "green", "yellow", "white", "purple"];
const nombres = ["Volcanes", "Neptuno", "Selva", "Desierto", "Himalaya", "Abismo"];
const valores = ["W1", "W2", "W3", 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 3 apuestas únicas [7]

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    document.getElementById("btnContinue").onclick = () => mostrar("setup");
    document.getElementById("btnStart").onclick = iniciarPartida;
    document.getElementById("btnFinishTurn").onclick = terminarTurno;
    document.getElementById("btnNextRound").onclick = siguienteRonda;
    document.getElementById("btnRestart").onclick = resetGame;
});

function saveGame() {
    const data = { jugadores, jugadorActual, ronda, numExp, totales, historial, cartasBloqueadas };
    localStorage.setItem("relicTrails_data", JSON.stringify(data));
}

function loadGame() {
    const saved = localStorage.getItem("relicTrails_data");
    if (saved) {
        const d = JSON.parse(saved);
        jugadores = d.jugadores; jugadorActual = d.jugadorActual;
        ronda = d.ronda; numExp = d.numExp; totales = d.totales;
        historial = d.historial; cartasBloqueadas = d.cartasBloqueadas;
        if (jugadores.length > 0) iniciarTurno();
    }
}

function resetGame() { localStorage.removeItem("relicTrails_data"); location.reload(); }

function iniciarPartida() {
    const j1 = document.getElementById("player1").value || "Explorador 1";
    const j2 = document.getElementById("player2").value || "Explorador 2";
    jugadores = [j1, j2];
    numExp = parseInt(document.getElementById("expeditions").value);
    totales = ; historial = [[], []]; ronda = 1;
    resetMazoRonda();
    iniciarTurno();
}

function resetMazoRonda() {
    cartasBloqueadas = {};
    for (let i = 0; i < 6; i++) { cartasBloqueadas[i] = []; }
}

function iniciarTurno() {
    cartasMarcadas = {};
    for (let i = 0; i < 6; i++) { cartasMarcadas[i] = []; }
    renderTablero();
    document.getElementById("roundTitle").innerText = `Ronda ${ronda} de 3`;
    document.getElementById("playerTurn").innerText = `Turno de: ${jugadores[jugadorActual]}`;
    saveGame();
    mostrar("game");
}

function renderTablero() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let i = 0; i < numExp; i++) {
        const expDiv = document.createElement("div");
        expDiv.className = `expedition ${colores[i]}`;
        expDiv.innerHTML = `<h3>${nombres[i]} <div class="scoreLive">PV: ${calcular(cartasMarcadas[i])}</div></h3><div class="cards-grid" id="grid-${i}"></div>`;
        board.appendChild(expDiv);

        valores.forEach(v => {
            const isTaken = jugadorActual === 1 && cartasBloqueadas[i].includes(v);
            const card = document.createElement("div");
            card.className = `card-container ${isTaken ? 'taken' : ''} ${cartasMarcadas[i].includes(v) ? 'selected' : ''}`;
            
            const imgPath = v.toString().startsWith("W") 
                ? `assets/cards/${colores[i]}/W.png` 
                : `assets/expeditions/${colores[i]}.png`;

            card.innerHTML = `<img src="${imgPath}" class="card-image"><div class="card-value">${v.toString().startsWith("W") ? "Apuesta" : v}</div>`;
            if (isTaken) card.innerHTML += `<div class="lock-icon">🔒</div>`;
            else card.onclick = () => toggleCarta(i, v);
            
            document.getElementById(`grid-${i}`).appendChild(card);
        });
    }
}

function toggleCarta(expIdx, valor) {
    const list = cartasMarcadas[expIdx];
    const idx = list.indexOf(valor);
    if (idx > -1) list.splice(idx, 1);
    else {
        if (!valor.toString().startsWith("W")) {
            const maxVal = Math.max(0, ...list.filter(c => !c.toString().startsWith("W")).map(Number));
            if (Number(valor) < maxVal) { alert("Las cartas deben ir en orden creciente [8]"); return; }
        } else if (list.some(c => !c.toString().startsWith("W"))) {
            alert("Las apuestas solo se juegan al inicio [8]"); return;
        }
        list.push(valor);
    }
    renderTablero();
}

function calcular(cartas) {
    if (cartas.length === 0) return 0;
    const inv = cartas.filter(c => c.toString().startsWith("W")).length;
    const suma = cartas.filter(c => !c.toString().startsWith("W")).reduce((a, b) => a + Number(b), 0);
    let pts = (suma - 20) * (inv + 1); // Fórmula oficial [2]
    if (cartas.length >= 8) pts += 20; // Bono exploración [2]
    return pts;
}

function terminarTurno() {
    let ptsTurno = 0;
    for (let i = 0; i < numExp; i++) {
        ptsTurno += calcular(cartasMarcadas[i]);
        if (jugadorActual === 0) cartasBloqueadas[i] = [...cartasMarcadas[i]]; // Bloqueo para el oponente
    }
    historial[jugadorActual][ronda - 1] = ptsTurno;
    totales[jugadorActual] += ptsTurno;
    
    if (jugadorActual === 0) { 
        jugadorActual = 1; iniciarTurno(); 
    } else { 
        mostrarResultadosRonda(); 
    }
}

function mostrarResultadosRonda() {
    let res = `<h2>Resultados Ronda ${ronda}</h2>`;
    jugadores.forEach((j, i) => res += `<p>${j}: ${historial[i][ronda-1]} PV (Total: ${totales[i]})</p>`);
    document.getElementById("roundScores").innerHTML = res;
    saveGame();
    mostrar("roundResult");
}

function siguienteRonda() {
    if (++ronda > 3) {
        let win = totales > totales[1] ? jugadores : (totales[1] > totales ? jugadores[1] : "Empate");
        document.getElementById("finalScores").innerHTML = `<h2>🏆 Ganador: ${win}</h2><p>${jugadores}: ${totales} PV</p><p>${jugadores[1]}: ${totales[1]} PV</p>`;
        mostrar("finalResult");
        localStorage.removeItem("relicTrails_data");
    } else {
        jugadorActual = (totales >= totales[1]) ? 0 : 1; // Comienza quien va ganando [2]
        resetMazoRonda(); iniciarTurno();
    }
}

function mostrar(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}