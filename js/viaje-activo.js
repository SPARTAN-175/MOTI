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


let viajeActual = null;
let viajeId = null;
let map = null;
let conductorMarker = null;
let pasajeroMarker = null;


// =========================
// CARGAR VIAJE ACTIVO
// =========================

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

        if(!usuarioDoc.exists()) return;

        const usuario =
        usuarioDoc.data();

        if(!usuario.viajeActivo){

            window.location.href =
            "dashboard-conductor.html";

            return;

        }

        await cargarViaje(
            usuario.viajeActivo
        );

    }

);


// =========================
// CARGAR DATOS DEL VIAJE
// =========================

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

    viajeActual =
    viajeDoc.data();

    document.getElementById(
        "nombrePasajero"
    ).textContent =
    viajeActual.nombrePasajero;

    document.getElementById(
        "destinoViaje"
    ).textContent =
    viajeActual.destino;

    document.getElementById(
        "referenciaViaje"
    ).textContent =
    viajeActual.observaciones || "-";

    actualizarInterfaz();
    await cargarMapa();

}


// =========================
// INTERFAZ
// =========================

function actualizarInterfaz(){

    const estado =
    document.getElementById(
        "estadoViaje"
    );

    const boton =
    document.getElementById(
        "btnAccion"
    );

    switch(viajeActual.estado){

        case "aceptada":

            estado.textContent =
            "En camino al pasajero";

            boton.textContent =
            "Iniciar recorrido";

            break;


        case "en_camino":

            estado.textContent =
            "En camino al pasajero";

            boton.textContent =
            "Llegué al pasajero";

            break;


        case "esperando_pasajero":

            estado.textContent =
            "Esperando al pasajero";

            boton.textContent =
            "Iniciar viaje";

            break;


        case "en_viaje":

            estado.textContent =
            "Viaje en curso";

            boton.textContent =
            "Finalizar viaje";

            break;


        case "finalizada":

            estado.textContent =
            "Viaje finalizado";

            boton.textContent =
            "Viaje finalizado";

            boton.disabled =
            true;

            break;

    }

}


// =========================
// BOTÓN PRINCIPAL
// =========================

document
.getElementById(
    "btnAccion"
)
.addEventListener(

    "click",

    ejecutarAccion

);


// =========================
// MÁQUINA DE ESTADOS
// =========================

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


// =========================
// CAMBIAR ESTADO
// =========================

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


// =========================
// CARGAR MAPA
// =========================
async function cargarMapa(){


console.log(

    "Conductor:",

    conductor.latitud,

    conductor.longitud

);

console.log(

    "Pasajero:",

    viajeActual.latitud,

    viajeActual.longitud

);


    
    const usuarioDoc =
    await getDoc(

        doc(
            db,
            "usuarios",
            auth.currentUser.uid
        )

    );

    const conductor =
    usuarioDoc.data();

    const conductorPos = [

        conductor.latitud,

        conductor.longitud

    ];

    const pasajeroPos = [

        viajeActual.latitud,

        viajeActual.longitud

    ];

    if(!map){

        map = L.map("map");

        L.tileLayer(

            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

            {

                maxZoom:19,

                attribution:"© OpenStreetMap"

            }

        ).addTo(map);

    }

    if(conductorMarker){

        map.removeLayer(
            conductorMarker
        );

    }

    if(pasajeroMarker){

        map.removeLayer(
            pasajeroMarker
        );

    }

    conductorMarker =
    L.marker(
        conductorPos
    )

    .addTo(map)

    .bindPopup(
        "Tú"
    );

    pasajeroMarker =
    L.marker(
        pasajeroPos
    )

    .addTo(map)

    .bindPopup(
        viajeActual.nombrePasajero
    );

    const grupo =
    L.featureGroup([

        conductorMarker,

        pasajeroMarker

    ]);

    map.fitBounds(

        grupo.getBounds(),

        {

            padding:[40,40]

        }

    );

}
