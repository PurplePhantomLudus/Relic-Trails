let numExpediciones = 5;
let rondaActual = 1;
let turnoJugador = 1;
let nombres = ["", ""];
let puntuaciones = [[], []]; // Almacena puntos por ronda [J1][R1, R2, R3]

const configColores = [
    { n: 'Desierto', c: 'yellow' },
    { n: 'Neptuno', c: 'blue' },
    { n: 'Himalaya', c: 'white' },
    { n: 'Brasil', c: 'green' },
    { n: 'Volcanes', c: 'red' },
    { n: 'Moderno', c: 'purple' }
];

function seleccionarModo(n) {
    numExpediciones = n;
    document.getElementById('btn-5').classList.toggle('seleccionado', n === 5);
    document.getElementById('btn-6').classList.toggle('seleccionado', n === 6);
}

function iniciarPartida() {
    nombres = document.getElementById('nombre-j1').value || "Jugador 1";
    nombres[1] = document.getElementById('nombre-j2').value || "Jugador 2";
    
    document.getElementById('pantalla-inicio').classList.remove('activa');
    document.getElementById('pantalla-puntuacion').classList.add('activa');
    generarFormulario();
    actualizarCabecera();
}

function generarFormulario() {
    const contenedor = document.getElementById('contenedor-expediciones');
    contenedor.innerHTML = `
        <div style="display:grid; grid-template-columns: 100px 1fr 1fr; gap:8px; margin-bottom:5px; font-size:0.7rem; text-align:center; color:var(--gold)">
            <span>EXPEDICIÓN</span><span>SUMA CARTAS</span><span>Nº INV. / TOT.</span>
        </div>`;
    
    for (let i = 0; i < numExpediciones; i++) {
        const exp = configColores[i];
        contenedor.innerHTML += `
            <div class="expedicion-card ${exp.c}">
                <label>${exp.n}</label>
                <input type="number" class="val-suma" placeholder="0" min="0">
                <div style="display:flex; gap:4px">
                    <input type="number" class="val-inv" placeholder="0" min="0" max="3">
                    <input type="number" class="val-tot" placeholder="0" min="0">
                </div>
            </div>`;
    }
}

function guardarTurno() {
    let totalTurno = 0;
    const inputsSuma = document.querySelectorAll('.val-suma');
    const inputsInv = document.querySelectorAll('.val-inv');
    const inputsTot = document.querySelectorAll('.val-tot');

    inputsSuma.forEach((input, i) => {
        let suma = parseInt(input.value) || 0;
        let inv = parseInt(inputsInv[i].value) || 0;
        let tot = parseInt(inputsTot[i].value) || 0;

        if (tot > 0) { // Si hay cartas, se procesa la expedición
            let calculo = (suma - 20) * (1 + inv); // [Source 4]
            if (tot >= 8) calculo += 20; // Bono expedición larga
            totalTurno += calculo;
        }
    });

    puntuaciones[turnoJugador - 1].push(totalTurno);

    if (turnoJugador === 1) {
        turnoJugador = 2;
        generarFormulario(); // Limpiar inputs para el siguiente jugador
        actualizarCabecera();
    } else {
        if (rondaActual < 3) {
            rondaActual++;
            turnoJugador = 1;
            generarFormulario();
            actualizarCabecera();
        } else {
            mostrarFinal();
        }
    }
}

function actualizarCabecera() {
    document.getElementById('info-ronda').innerText = `Ronda ${rondaActual} / 3`;
    document.getElementById('info-turno').innerText = `Turno: ${nombres[turnoJugador - 1]}`;
    window.scrollTo(0,0);
}

function mostrarFinal() {
    document.getElementById('pantalla-puntuacion').classList.remove('activa');
    document.getElementById('pantalla-resultados').classList.add('activa');

    const sum1 = puntuaciones.reduce((a, b) => a + b, 0);
    const sum2 = puntuaciones[1].reduce((a, b) => a + b, 0);

    document.getElementById('ganador-texto').innerText = sum1 > sum2 ? `¡Victoria para ${nombres}!` : sum2 > sum1 ? `¡Victoria para ${nombres[1]}!` : "¡Empate Legendario!";

    let tabla = `
        <table class="tabla-resumen">
            <tr><th>Ronda</th><th>${nombres}</th><th>${nombres[1]}</th></tr>
            <tr><td>R1</td><td>${puntuaciones}</td><td>${puntuaciones[1]}</td></tr>
            <tr><td>R2</td><td>${puntuaciones[1]}</td><td>${puntuaciones[1]}</td></tr>
            <tr><td>R3</td><td>${puntuaciones[4]}</td><td>${puntuaciones[1][4]}</td></tr>
            <tr style="font-weight:bold; font-size:1.2rem; color:var(--gold)">
                <td>TOTAL</td><td>${sum1}</td><td>${sum2}</td>
            </tr>
        </table>`;
    document.getElementById('tabla-resultados').innerHTML = tabla;
}