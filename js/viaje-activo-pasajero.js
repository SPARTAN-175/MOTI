import { db }
from "./firebase-config.js";

import {

    doc,
    getDoc,
    onSnapshot

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ========================================
// VARIABLES
// ========================================

let map = null;

let pasajeroMarker = null;

let conductorMarker = null;

let rutaControl = null;

let movimientoActivo = false;


// ========================================
// ICONOS
// ========================================

const motoIcon = L.icon({

    iconUrl:"../assets/icons/mototaxi.svg",

    iconSize:[42,42],

    iconAnchor:[21,21]

});

const pasajeroIcon = L.icon({

    iconUrl:"../assets/icons/pasajero.svg",

    iconSize:[40,40],

    iconAnchor:[20,20]

});


// ========================================
// ID DEL VIAJE
// ========================================

const params =

new URLSearchParams(

    window.location.search

);

const viajeId =

params.get("id");

if(!viajeId){

    window.location.href=

    "dashboard-pasajero.html";

}


// ========================================
// REFERENCIAS HTML
// ========================================

const estadoViaje =

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


// ========================================
// CREAR MAPA
// ========================================

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


// ========================================
// ESCUCHAR SOLICITUD
// ========================================

onSnapshot(

    doc(

        db,

        "solicitudes",

        viajeId

    ),

    async(docSnap)=>{

        if(!docSnap.exists()) return;

        const viaje =

        docSnap.data();

        estadoViaje.textContent=

        viaje.estado;

        destinoViaje.textContent=

        viaje.destino;

        // =========================
        // PASAJERO
        // =========================

        const pasajeroPos=[

            viaje.latitud,

            viaje.longitud

        ];

        if(!pasajeroMarker){

            pasajeroMarker=

            L.marker(

                pasajeroPos,

                {

                    icon:pasajeroIcon

                }

            )

            .addTo(map)

            .bindPopup(

                "Tú"

            );

        }

        else{

            pasajeroMarker.setLatLng(

                pasajeroPos

            );

        }

        // =========================
        // CONDUCTOR
        // =========================

        if(viaje.conductorId){

            const conductorDoc=

            await getDoc(

                doc(

                    db,

                    "usuarios",

                    viaje.conductorId

                )

            );

            if(conductorDoc.exists()){

                const conductor=

                conductorDoc.data();

                nombreConductor.textContent=

                conductor.nombre;


// =========================
// INICIAR MOVIMIENTO
// =========================

if(!movimientoActivo){

    escucharMovimientoConductor(

        viaje.conductorId

    );

    movimientoActivo = true;

}








                

                const conductorPos=[

                    conductor.latitud,

                    conductor.longitud

                ];

                if(!conductorMarker){

                    conductorMarker=

                    L.marker(

                        conductorPos,

                        {

                            icon:motoIcon

                        }

                    )

                    .addTo(map)

                    .bindPopup(

                        conductor.nombre

                    );

                }

                else{

                    conductorMarker.setLatLng(

                        conductorPos

                    );

                }



                dibujarRuta(

               conductorPos,

              pasajeroPos

              );

                const grupo=

                L.featureGroup([

                    pasajeroMarker,

                    conductorMarker

                ]);

                map.fitBounds(

                    grupo.getBounds(),

                    {

                        padding:[40,40]

                    }

                );

            }

        }

    }

);


// ========================================
// ESCUCHAR MOVIMIENTO DEL CONDUCTOR
// ========================================

function escucharMovimientoConductor(conductorId){

    onSnapshot(

        doc(

            db,

            "usuarios",

            conductorId

        ),

        (docSnap)=>{

            if(!docSnap.exists()) return;

            const conductor =

            docSnap.data();

            if(!conductorMarker) return;

            const nuevaPos=[

                conductor.latitud,

                conductor.longitud

            ];

            conductorMarker.setLatLng(

                nuevaPos

            );

            map.panTo(

                nuevaPos,

                {

                    animate:true,

                    duration:0.7

                }

            );

            dibujarRuta(

                nuevaPos,

                [

                    pasajeroMarker.getLatLng().lat,

                    pasajeroMarker.getLatLng().lng

                ]

            );

        }

    );

}





function dibujarRuta(origen,destino){

    if(!rutaControl){

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

            show:false,

            addWaypoints:false,

            draggableWaypoints:false,

            fitSelectedRoutes:false,

            routeWhileDragging:false,

            createMarker:()=>null,

            lineOptions:{

                styles:[{

                    color:"#16a34a",

                    weight:6,

                    opacity:0.9

                }]

            }

        })

        .addTo(map);

        rutaControl.on(

            "routesfound",

            function(e){

                const ruta =

                e.routes[0];

                document.getElementById(

                    "distanceText"

                ).textContent=

                (

                    ruta.summary.totalDistance

                    /1000

                ).toFixed(1)

                +" km";

                document.getElementById(

                    "timeText"

                ).textContent=

                Math.ceil(

                    ruta.summary.totalTime

                    /60

                )+" min";

            }

        );

    }

    else{

        rutaControl.setWaypoints([

            L.latLng(

                origen[0],

                origen[1]

            ),

            L.latLng(

                destino[0],

                destino[1]

            )

        ]);

    }

}





