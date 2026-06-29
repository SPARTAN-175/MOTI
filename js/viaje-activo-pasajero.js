import { db }
from "./firebase-config.js";

import {

    doc,

    getDoc,

    onSnapshot

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =========================
// OBTENER ID DEL VIAJE
// =========================

const params =

new URLSearchParams(

    window.location.search

);

const viajeId =

params.get("id");


if(!viajeId){

    alert("Viaje no encontrado.");

    window.location.href =
    "dashboard-pasajero.html";

}


// =========================
// REFERENCIAS HTML
// =========================

const estadoViaje =

let map = null;

window.addEventListener(

    "load",

    ()=>{

        map = L.map("map").setView(

            [17.4088035,-93.327078],

            16

        );

        L.tileLayer(

            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

            {

                attribution:"© OpenStreetMap"

            }

        ).addTo(map);

    }

);





    
document.getElementById(
    "estadoViaje"
);

const nombreConductor =

document.getElementById(
    "nombreConductor"
);

const destinoViaje =

document.getElementById(
    "destinoViaje"
);


// =========================
// ESCUCHAR VIAJE
// =========================

const viajeRef =

doc(

    db,

    "solicitudes",

    viajeId

);


onSnapshot(

    viajeRef,

    async(docSnap)=>{

        if(!docSnap.exists()) return;

        const viaje =

        docSnap.data();

        console.log(viaje);

        estadoViaje.textContent =

        viaje.estado;

        destinoViaje.textContent =

        viaje.destino;

        if(viaje.conductorId){

            const conductorDoc =

            await getDoc(

                doc(

                    db,

                    "usuarios",

                    viaje.conductorId

                )

            );

            if(conductorDoc.exists()){

                const conductor =

                conductorDoc.data();

                nombreConductor.textContent =

                conductor.nombre;

            }

        }

    }

);
