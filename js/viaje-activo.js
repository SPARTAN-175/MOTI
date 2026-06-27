let viajeActual =
null;

let viajeId =
null;

import { auth, db }
from "./firebase-config.js";

import {
    doc,
    getDoc,
    updateDoc
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

   viajeId = id;
    
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

    viajeActual =
    viaje;

}

document
.getElementById(
    "btnAccion"
)
.addEventListener(

    btnAccion.addEventListener(

"click",

ejecutarAccion

);
async function ejecutarAccion(){

    switch(viajeActual.estado){

        case "aceptada":

            await cambiarEstado(
                "en_camino"
            );

            break;

        case "en_camino":

            await cambiarEstado(
                "esperando_pasajero"
            );

            break;

        case "esperando_pasajero":

            await cambiarEstado(
                "en_viaje"
            );

            break;

        case "en_viaje":

            await cambiarEstado(
                "finalizada"
            );

            break;

    }

}

async function cambiarEstado(nuevoEstado){

    await updateDoc(

        doc(
            db,
            "solicitudes",
            viajeId
        ),

        {

            estado:
            nuevoEstado

        }

    );

    await cargarViaje(
        viajeId
    );

}


