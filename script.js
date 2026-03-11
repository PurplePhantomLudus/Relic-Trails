let players = [], currentPlayer = 0, round = 1, numExp = 5;
let totals = , roundScores = ;

const cardValues = ["W", "W", "W", 2, 3, 4, 5, 6, 7, 8, 9, 10];
const expNames = ["Arenas del Desierto", "Reinos de Neptuno", "Himalaya", "Selva de Brasil", "Míticos Volcanes", "Abismo Púrpura"];
const expColors = ["yellow", "blue", "white", "green", "red", "purple"];

document.addEventListener("DOMContentLoaded", () => {
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
    const p2 = document.getElementById("player2").value;
    players = [p1]; if (p2.trim() !== "") players.push(p2);
    numExp = parseInt(document.getElementById("expeditions").value);
    startTurn();
}

function startTurn() {
    renderBoard();
    document.getElementById("roundTitle").innerText = `Ronda ${round} de 3`;
    document.getElementById("playerTurn").innerText = `Turno de: ${players[currentPlayer]}`;
    window.scrollTo(0,0);
    show("game");
}

function renderBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let i = 0; i < numExp; i++) {
        const expDiv = document.createElement("div");
        expDiv.className = `expedition ${expColors[i]}`;
        expDiv.innerHTML = `
            <div class="exp-header">
                <img src="assets/expeditions/${expColors[i]}.png" class="exp-icon">
                <strong>${expNames[i]}</strong>
            </div>`;
        
        const pool = document.createElement("div");
        pool.className = "card-pool";
        cardValues.forEach(v => {
            const c = document.createElement("div");
            c.className = "game-card";
            if (v === "W") {
                c.innerHTML = `<img src="assets/expeditions/wager.png" class="wager-img">`;
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

function calculateExp(cards) {
    if (cards.length === 0) return 0;
    const wagers = cards.filter(c => c === "W").length;
    const sum = cards.filter(c => c !== "W").reduce((a, b) => a + Number(b), 0);
    let score = (sum - 20) * (wagers + 1); // Regla: (Suma-20)*(Inv+1) [2]
    if (cards.length >= 8) score += 20; // Regla: Bono +20 PV [2]
    return score;
}

function finishTurn() {
    let total = 0;
    document.querySelectorAll(".expedition").forEach(exp => {
        const selected = [...exp.querySelectorAll(".selected")].map(c => c.dataset.val);
        total += calculateExp(selected);
    });
    roundScores[currentPlayer] = total;
    if (players.length === 2 && currentPlayer === 0) {
        currentPlayer = 1; startTurn();
    } else { showRoundResults(); }
}

function showRoundResults() {
    totals += roundScores;
    if (players.length === 2) totals[1] += roundScores[1];
    let html = `<p>${players}: ${roundScores} PV</p>`;
    if (players.length === 2) html += `<p>${players[1]}: ${roundScores[1]} PV</p>`;
    document.getElementById("roundScores").innerHTML = html;
    show("roundResult");
}

function nextRound() {
    if (round < 3) { round++; currentPlayer = 0; startTurn(); } else { showFinal(); }
}

function showFinal() {
    let html = `<h2>Puntuación Final</h2><p>${players}: ${totals} PV</p>`;
    if (players.length === 2) {
        html += `<p>${players[1]}: ${totals[1]} PV</p>`;
        const win = totals > totals[1] ? players : players[1];
        html += `<h2 style="color:var(--gold)">🏆 Ganador: ${win}</h2>`;
    }
    document.getElementById("finalScores").innerHTML = html;
    show("finalResult");
}
