// Estado global de la aplicación (Corregido)
let players = [];
let currentPlayer = 0;
let round = 1;
let numExp = 5;
let totals = ;      // Puntos totales acumulados
let roundScores = ; // Puntos de la ronda actual

// Datos basados en las fuentes [2]
const expNames = ["Arenas del Desierto", "Reinos de Neptuno", "Himalaya", "Selva de Brasil", "Míticos Volcanes", "Abismo Púrpura"];
const expColors = ["yellow", "blue", "white", "green", "red", "purple"];
const cardValues = ["W", "W", "W", 2, 3, 4, 5, 6, 7, 8, 9, 10];

document.addEventListener("DOMContentLoaded", () => {
    // Vinculación de botones con los IDs de tu index.html
    document.getElementById("btnContinue").onclick = () => show("setup");
    document.getElementById("btnStart").onclick = startGame;
    document.getElementById("btnFinishTurn").onclick = finishTurn;
    document.getElementById("btnNextRound").onclick = nextRound;
    document.getElementById("btnRestart").onclick = () => location.reload();
});

function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

function startGame() {
    const p1 = document.getElementById("player1").value || "Explorador 1";
    const p2 = document.getElementById("player2").value || "Explorador 2";
    players = [p1, p2];
    numExp = parseInt(document.getElementById("expeditions").value);
    round = 1;
    totals = ;
    startTurn();
}

function startTurn() {
    renderBoard();
    document.getElementById("roundTitle").innerText = "Ronda " + round + " de 3";
    document.getElementById("playerTurn").innerText = "Turno: " + players[currentPlayer];
    window.scrollTo(0, 0);
    show("game");
}

function renderBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let i = 0; i < numExp; i++) {
        const expDiv = document.createElement("div");
        expDiv.className = `expedition ${expColors[i]}`;
        expDiv.innerHTML = `
            <div class="exp-header" style="display: flex; align-items: center; gap: 15px; margin-bottom:10px;">
                <img src="assets/expeditions/${expColors[i]}.png" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #d4af37; object-fit: cover;">
                <strong>${expNames[i]}</strong>
            </div>`;
        const pool = document.createElement("div");
        pool.className = "card-pool";
        cardValues.forEach(v => {
            const c = document.createElement("div");
            c.className = "game-card";
            if (v === "W") {
                c.innerHTML = `<img src="assets/expeditions/wager.png" style="width: 70%;" alt="Inversión">`;
                c.dataset.val = "W";
            } else {
                c.innerText = v;
                c.dataset.val = v;
            }
            c.onclick = () => c.classList.toggle("selected");
            pool.appendChild(c);
        });
        expDiv.appendChild(pool);
        board.appendChild(expDiv);
    }
}

function calculateExpScore(selectedCards) {
    if (selectedCards.length === 0) return 0;
    const wagers = selectedCards.filter(c => c === "W").length;
    const sum = selectedCards.filter(c => c !== "W").reduce((a, b) => a + Number(b), 0);
    // Regla oficial: (Suma - 20) * (1 + Inversiones) [1]
    let score = (sum - 20) * (wagers + 1);
    // Regla oficial: Bono de 8+ cartas [1]
    if (selectedCards.length >= 8) score += 20;
    return score;
}

function finishTurn() {
    let total = 0;
    document.querySelectorAll(".expedition").forEach(exp => {
        const selected = [...exp.querySelectorAll(".selected")].map(c => c.dataset.val);
        total += calculateExpScore(selected);
    });
    roundScores[currentPlayer] = total;
    if (currentPlayer === 0) {
        currentPlayer = 1;
        startTurn();
    } else {
        showRoundResults();
    }
}

function showRoundResults() {
    totals += roundScores;
    totals[2] += roundScores[2];
    document.getElementById("roundScores").innerHTML = `
        <p>${players}: ${roundScores} PV</p>
        <p>${players[2]}: ${roundScores[2]} PV</p>`;
    show("roundResult");
}

function nextRound() {
    if (round < 3) {
        round++;
        currentPlayer = 0;
        roundScores = ;
        startTurn();
    } else {
        showFinal();
    }
}

function showFinal() {
    const winner = totals > totals[2] ? players : (totals[2] > totals ? players[2] : "Empate");
    document.getElementById("finalScores").innerHTML = `
        <h2>🏆 Ganador: ${winner}</h2>
        <p>${players}: ${totals} PV Totales</p>
        <p>${players[2]}: ${totals[2]} PV Totales</p>`;
    show("finalResult");
}
