import { db }
from "./firebase-config.js";

import {

doc,

onSnapshot

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const params =

new URLSearchParams(

window.location.search

);

const solicitudId =

params.get("id");


if(!solicitudId){

    alert("Solicitud no encontrada.");

    window.location.href =
    "dashboard-pasajero.html";

}


const solicitudRef =

doc(

db,

"solicitudes",

solicitudId

);


onSnapshot(

solicitudRef,

(docSnap)=>{

    if(!docSnap.exists()) return;

    const solicitud =

    docSnap.data();

    console.log(

        "Estado:",

        solicitud.estado

    );

    if(

        solicitud.estado ===

        "aceptada"

    ){

        window.location.href=

        `viaje-activo-pasajero.html?id=${solicitudId}`;

    }

}

);
