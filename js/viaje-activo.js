import { auth, db }
from "./firebase-config.js";

import {
    doc,
    getDoc,
    updateDoc,
    onSnapshot
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
let rutaLinea = null;
let rutaControl = null;


const motoIcon = L.icon({

    iconUrl:
    "../assets/icons/mototaxi.svg",

    iconSize:[42,42],

    iconAnchor:[21,21],

    popupAnchor:[0,-18]

});


const pasajeroIcon = L.icon({

    iconUrl:
    "../assets/icons/pasajero.svg",

    iconSize:[40,40],

    iconAnchor:[20,20],

    popupAnchor:[0,-18]

});


const destinoIcon = L.icon({

    iconUrl:
    "../assets/icons/destino.svg",

    iconSize:[38,38],

    iconAnchor:[19,19]

});

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
    escucharMovimientoConductor();

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


    console.log(
    "Datos del conductor:",
    conductor
);

console.log(
    "Latitud conductor:",
    conductor.latitud
);

console.log(
    "Longitud conductor:",
    conductor.longitud
);

console.log(
    "Datos del viaje:",
    viajeActual
);

console.log(
    "Latitud pasajero:",
    viajeActual.latitud
);

console.log(
    "Longitud pasajero:",
    viajeActual.longitud
);


    

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

    conductorPos,

    {

        icon:
        motoIcon

    }

)
.addTo(map)
.bindPopup("Tú");

   pasajeroMarker =
L.marker(

    pasajeroPos,

    {

        icon:
        pasajeroIcon

    }

)
.addTo(map)
.bindPopup(

    viajeActual.nombrePasajero

);



    if(rutaLinea){

    map.removeLayer(
        rutaLinea
    );

}

dibujarRuta(
    conductorPos,
    pasajeroPos
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


function escucharMovimientoConductor(){

    onSnapshot(

        doc(

            db,

            "usuarios",

            auth.currentUser.uid

        ),

        (docSnap)=>{

            const datos =
            docSnap.data();

            if(
                !datos ||
                !conductorMarker
            ) return;

            const nuevaPos = [

                datos.latitud,

                datos.longitud

            ];

            conductorMarker.setLatLng(
                nuevaPos
            );

            map.panTo(

    nuevaPos,

    {

        animate:true,

        duration:0.8

    }
                
);

            dibujarRuta(

    nuevaPos,

    [

        viajeActual.latitud,

        viajeActual.longitud

    ]

);

        }

    );

}


function dibujarRuta(
    origen,
    destino
){

    if(rutaControl){

        map.removeControl(
            rutaControl
        );

    }

    rutaControl =

    L.Routing.control({

        waypoints:[

            L.latLng(
                origen[0],
                origen[1]
            ),

            L.latLng(
                destino[0],
                destino[1]
            )

        ],

        showAlternatives:false,

        collapsible:true,

        routeWhileDragging:false,

        addWaypoints:false,

        draggableWaypoints:false,

        fitSelectedRoutes:false,

        show:false,

        lineOptions:{

            styles:[{

                color:

                viajeActual.tipoViaje==="especial"

                ?

                "#f97316"

                :

                "#16a34a",

                opacity:0.9,

                weight:6

            }]

        },

        createMarker:()=>null

    })

    .addTo(map);

}


