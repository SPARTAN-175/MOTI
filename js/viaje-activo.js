import { auth, db }
from "./firebase-config.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(

    auth,

    async(user)=>{

        if(!user) return;

        const usuarioDoc =
        await getDoc(

            doc(
                db,
                "usuarios",
                user.uid
            )

        );

        const usuario =
        usuarioDoc.data();

        if(!usuario.viajeActivo){

            window.location.href =
            "dashboard-conductor.html";

            return;

        }

        cargarViaje(
            usuario.viajeActivo
        );

    }

);

async function cargarViaje(id){

    const viajeDoc =
    await getDoc(

        doc(
            db,
            "solicitudes",
            id
        )

    );

    if(!viajeDoc.exists()) return;

    const viaje =
    viajeDoc.data();

    document.getElementById(
        "nombrePasajero"
    ).textContent =
    viaje.nombrePasajero;

    document.getElementById(
        "destinoViaje"
    ).textContent =
    viaje.destino;

    document.getElementById(
        "referenciaViaje"
    ).textContent =
    viaje.observaciones || "-";

    document.getElementById(
        "estadoViaje"
    ).textContent =
    "En camino al pasajero";

}
