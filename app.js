/* ===============================
   SALDO (localStorage)
=============================== */
if (!localStorage.getItem("saldo")) {
    localStorage.setItem("saldo", 50000);
}

function obtenerSaldo() {
    return Number(localStorage.getItem("saldo"));
}

function guardarSaldo(nuevoSaldo) {
    localStorage.setItem("saldo", nuevoSaldo);
}

/* ===============================
   TRANSACCIONES (localStorage)
=============================== */
if (!localStorage.getItem("transacciones")) {
    localStorage.setItem("transacciones", JSON.stringify([]));
}

function agregarTransaccion(texto) {
    const transacciones = JSON.parse(localStorage.getItem("transacciones"));
    transacciones.push(texto);
    localStorage.setItem("transacciones", JSON.stringify(transacciones));
}

/* ===============================
   LOGIN
=============================== */
function validarLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    if (email === "test@alke.cl" && pass === "1234") {
        window.location.replace("menu.html");
    } else {
        alert("Credenciales incorrectas");
    }
}

/* ===============================
   DEPÓSITO (jQuery)
=============================== */
$("#formDeposito").submit(function (e) {
    e.preventDefault();

    const monto = Number($("#monto").val());

    if (monto <= 0) {
        $("#mensaje").text("Ingrese un monto válido").css("color", "red");
        return;
    }

    const nuevoSaldo = obtenerSaldo() + monto;
    guardarSaldo(nuevoSaldo);
    agregarTransaccion("Depósito $" + monto.toLocaleString());

    $("#mensaje")
        .text("Depósito exitoso. Saldo: $" + nuevoSaldo.toLocaleString())
        .css("color", "green");

    $("#monto").val("");
});

/* ===============================
   TRANSFERENCIA
=============================== */
function enviarDinero() {
    const contacto = $("#contacto").val();
    const monto = Number($("#monto").val());
    const saldoActual = obtenerSaldo();

    if (!contacto || monto <= 0) {
        alert("Complete los datos correctamente");
        return;
    }

    if (monto > saldoActual) {
        alert("Saldo insuficiente");
        return;
    }

    guardarSaldo(saldoActual - monto);
    agregarTransaccion(`Envío $${monto.toLocaleString()} a ${contacto}`);

    alert(`Transferencia enviada a ${contacto}`);
}

/* ===============================
   TRANSACCIONES (render)
=============================== */
const lista = document.getElementById("listaTransacciones");

if (lista) {
    const transacciones = JSON.parse(localStorage.getItem("transacciones"));

    transacciones.forEach(t => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = t;
        lista.appendChild(li);
    });
}

/* ===============================
   jQuery UI / UX
=============================== */
$(document).ready(function () {

    // Mostrar saldo en menú
    if ($("#saldoTexto").length) {
        $("#saldoTexto").text("$" + obtenerSaldo().toLocaleString());
    }

    // Mostrar / ocultar saldo
    $("#verSaldo").click(function () {
        $("#saldo").slideToggle();
    });

    // Autocompletar contactos (simple)
    const contactos = ["Juan Pérez", "María Soto", "Carlos Díaz", "Ana López"];

    $("#contacto").on("keyup", function () {
        let valor = $(this).val().toLowerCase();
        let coincidencias = contactos.filter(c =>
            c.toLowerCase().includes(valor)
        );

        console.log("Sugerencias:", coincidencias);
    });

});
