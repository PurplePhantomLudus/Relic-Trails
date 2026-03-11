// Estado global de la aplicación con inicialización correcta
let players = [];
let currentPlayer = 0;
let round = 1;
let numExp = 5;
let totals = ; // Corregido: Inicializado como array
let roundScores = ; // Corregido: Inicializado como array

// Datos maestros basados en las fuentes [2]
const cardValues = ["W", "W", "W", 2, 3, 4, 5, 6, 7, 8, 9, 10];
const expNames = [
    "Arenas del Desierto", 
    "Reinos de Neptuno",   
    "Himalaya",            
    "Selva de Brasil",     
    "Míticos Volcanes",    
    "Abismo Púrpura"       
];
const expColors = ["yellow", "blue", "white", "green", "red", "purple"];

document.addEventListener("DOMContentLoaded", () => {
    // Vinculación de botones
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
    document.getElementById("roundTitle").innerText = "Ronda " + round;
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
            <div class="exp-header" style="display: flex; align-items: center; gap: 15px;">
                <img src="assets/expeditions/${expColors[i]}.png" 
                     style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid var(--gold); object-fit: cover;" 
                     alt="${expNames[i]}">
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

function calculateScore(selectedCards) {
    if (selectedCards.length === 0) return 0;

    const wagers = selectedCards.filter(c => c === "W").length;
    const numbersSum = selectedCards
        .filter(c => c !== "W")
        .reduce((a, b) => a + Number(b), 0);

    // Reglas oficiales: (Suma - 20) * (1 + Inversiones) [1]
    let score = (numbersSum - 20) * (wagers + 1);
    
    // Bono de +20 PV si hay 8 o más cartas [1]
    if (selectedCards.length >= 8) {
        score += 20;
    }

    return score;
}

function finishTurn() {
    let totalTurno = 0;
    document.querySelectorAll(".expedition").forEach(exp => {
        const selected = [...exp.querySelectorAll(".selected")].map(c => c.dataset.val);
        totalTurno += calculateScore(selected);
    });

    roundScores[currentPlayer] = totalTurno;

    if (currentPlayer === 0 && players.length > 1) {
        currentPlayer = 1;
        startTurn();
    } else {
        showRoundResult();
    }
}

function showRoundResult() {
    // Acumular totales correctamente
    totals += roundScores;
    if (players.length > 1) totals[2] += roundScores[2];

    let html = `<h3>Resumen Ronda ${round}</h3>`;
    html += `<p>${players}: <strong>${roundScores} PV</strong></p>`;
    if (players.length > 1) {
        html += `<p>${players[2]}: <strong>${roundScores[2]} PV</strong></p>`;
    }
    
    document.getElementById("roundScores").innerHTML = html;
    show("roundResult");
}

function nextRound() {
    if (round < 3) { // Según fuentes, se sugieren 3 rondas [1]
        round++;
        currentPlayer = 0;
        roundScores = ;
        startTurn();
    } else {
        showFinal();
    }
}

function showFinal() {
    let html = `<h2>Puntuación Final</h2>`;
    html += `<p>${players}: ${totals} PV</p>`;
    
    if (players.length > 1) {
        html += `<p>${players[2]}: ${totals[2]} PV</p>`;
        const winner = totals > totals[2] ? players : (totals[2] > totals ? players[2] : "Empate");
        html += `<div class="winner-box" style="color:var(--gold); font-size:1.5rem; margin-top:20px;">🏆 Gran Explorador: ${winner}</div>`;
    }
    
    document.getElementById("finalScores").innerHTML = html;
    show("finalResult");
}
