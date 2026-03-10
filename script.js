let numExpediciones = 5;
let rondaActual = 1;
let turnoJugador = 1; // 1 o 2
let nombres = ["", ""];
let puntuaciones = [[], []]; // [Jugador1Round1, J1R2, J1R3], [J2R1, J2R2, J2R3]

const colores = [
    { name: 'Amarillo', class: 'yellow' },
    { name: 'Azul', class: 'blue' },
    { name: 'Blanco', class: 'white' },
    { name: 'Verde', class: 'green' },
    { name: 'Rojo', class: 'red' },
    { name: 'Púrpura', class: 'purple' }
];

function seleccionarModo(n) {
    numExpediciones = n;
    document.getElementById('btn-5').classList.toggle('seleccionado', n === 5);
    document.getElementById('btn-6').classList.toggle('seleccionado', n === 6);
}

function iniciarPartida() {
    nombres = document.getElementById('nombre-j1').value || "Indy";
    nombres[1] = document.getElementById('nombre-j2').value || "Lara";
    cambiarPantalla('pantalla-puntuacion');
    generarInputs();
    actualizarInfoTurno();
}

function generarInputs() {
    const contenedor = document.getElementById('contenedor-expediciones');
    contenedor.innerHTML = `<div class="expedicion-row" style="background:none; font-size:12px">
        <span>Expedición</span><span>Suma Núm.</span><span>Inv. / Tot.</span>
    </div>`;
    
    for (let i = 0; i < numExpediciones; i++) {
        const col = colores[i];
        contenedor.innerHTML += `
            <div class="expedicion-row ${col.class}">
                <label>${col.name}</label>
                <input type="number" class="suma" placeholder="Suma" min="0">
                <div style="display:flex; gap:5px">
                    <input type="number" class="inv" placeholder="Inv (0-3)" min="0" max="3">
                    <input type="number" class="tot" placeholder="Tot. Cartas" min="0">
                </div>
            </div>`;
    }
}

function calcularPuntosTurno() {
    let totalTurno = 0;
    const sumas = document.querySelectorAll('.suma');
    const invs = document.querySelectorAll('.inv');
    const tots = document.querySelectorAll('.tot');

    sumas.forEach((input, i) => {
        let s = parseInt(input.value) || 0;
        let nInv = parseInt(invs[i].value) || 0;
        let nTot = parseInt(tots[i].value) || 0;

        if (nTot > 0) { // Solo si se inició la expedición [2]
            let puntosBase = s - 20; // Coste de expedición [1, 2]
            let subtotal = puntosBase * (1 + nInv); // Multiplicador [2]
            if (nTot >= 8) subtotal += 20; // Bono de expedición larga [2]
            totalTurno += subtotal;
        }
    });
    return totalTurno;
}

function guardarTurno() {
    puntuaciones[turnoJugador - 1].push(calcularPuntosTurno());

    if (turnoJugador === 1) {
        turnoJugador = 2;
        generarInputs(); // Limpiar para el segundo jugador
        actualizarInfoTurno();
    } else {
        if (rondaActual < 3) {
            rondaActual++;
            turnoJugador = 1;
            generarInputs();
            actualizarInfoTurno();
        } else {
            mostrarResultados();
        }
    }
}

function actualizarInfoTurno() {
    document.getElementById('info-ronda').innerText = `Ronda ${rondaActual} / 3`;
    document.getElementById('info-turno').innerText = `Turno de: ${nombres[turnoJugador - 1]}`;
    window.scrollTo(0,0);
}

function mostrarResultados() {
    cambiarPantalla('pantalla-resultados');
    const t1 = puntuaciones.reduce((a, b) => a + b, 0);
    const t2 = puntuaciones[1].reduce((a, b) => a + b, 0);
    
    document.getElementById('ganador-texto').innerText = t1 > t2 ? `¡Gana ${nombres}!` : t2 > t1 ? `¡Gana ${nombres[1]}!` : "¡Empate!";

    let html = `<table class="tabla-resumen">
        <tr><th>Ronda</th><th>${nombres}</th><th>${nombres[1]}</th></tr>
        <tr><td>1</td><td>${puntuaciones}</td><td>${puntuaciones[1]}</td></tr>
        <tr><td>2</td><td>${puntuaciones[1]}</td><td>${puntuaciones[1]}</td></tr>
        <tr><td>3</td><td>${puntuaciones[4]}</td><td>${puntuaciones[1][4]}</td></tr>
        <tr style="font-weight:bold; color:var(--yellow)"><td>TOTAL</td><td>${t1}</td><td>${t2}</td></tr>
    </table>`;
    document.getElementById('tabla-resultados').innerHTML = html;
}

function cambiarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
    document.getElementById(id).classList.add('activa');
}