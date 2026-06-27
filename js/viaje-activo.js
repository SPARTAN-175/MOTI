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
    "btnNavegar"
)
.addEventListener(

    "click",

    ()=>{

        if(!viajeActual)
        return;

        const url =
`https://www.google.com/maps/dir/?api=1&destination=${viajeActual.latitud},${viajeActual.longitud}`;

        window.open(
            url,
            "_blank"
        );

    }

);

cambiarEstado();

async function cambiarEstado(){

    if(!viajeId)
    return;

    await updateDoc(

        doc(
            db,
            "solicitudes",
            viajeId
        ),

        {

            estado:
            "en_camino"

        }

    );

    document.getElementById(
        "estadoViaje"
    ).textContent =
    "En camino al pasajero";

    document.getElementById(
        "btnNavegar"
    ).textContent =
    "Llegué al pasajero";

}


