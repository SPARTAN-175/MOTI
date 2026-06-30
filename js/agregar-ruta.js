import { auth, db }
from "./firebase-config.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// ================================
// VARIABLES
// ================================

let map = null;

let marcador = null;

let destinoSeleccionado = null;


// ================================
// ELEMENTOS
// ================================

const txtBuscar =
document.getElementById(
"buscarDestino"
);

const lista =
document.getElementById(
"listaDestinos"
);

const btnNuevo =
document.getElementById(
"btnNuevoDestino"
);

const panelNuevo =
document.getElementById(
"nuevoDestino"
);

const txtNombre =
document.getElementById(
"nombreDestino"
);

const tarifa =
document.getElementById(
"tarifa"
);


// ================================
// VERIFICAR SESIÓN
// ================================

onAuthStateChanged(

auth,

(user)=>{

if(!user){

location.href="../index.html";

return;

}

});


// ================================
// BUSCAR DESTINOS
// ================================

txtBuscar.addEventListener(

"input",

buscarDestinos

);


async function buscarDestinos(){

const texto=

txtBuscar.value

.trim()

.toLowerCase();

lista.innerHTML="";

btnNuevo.style.display="none";

if(texto.length<2){

lista.style.display="none";

return;

}

const snapshot=

await getDocs(

collection(

db,

"destinos"

)

);

const encontrados=[];

snapshot.forEach(doc=>{

const destino=doc.data();

if(

destino.nombre

.toLowerCase()

.includes(texto)

){

encontrados.push({

id:doc.id,

...destino

});

}

});

if(encontrados.length===0){

lista.style.display="none";

btnNuevo.style.display="block";

return;

}

lista.style.display="block";

encontrados.forEach(destino=>{

const item=

document.createElement("div");

item.className=

"item-destino";

item.textContent=

destino.nombre;

item.onclick=()=>{

seleccionarDestino(

destino

);

};

lista.appendChild(item);

});

}


// ================================
// DESTINO SELECCIONADO
// ================================

function seleccionarDestino(destino){

destinoSeleccionado=

destino;

txtBuscar.value=

destino.nombre;

lista.innerHTML="";

lista.style.display="none";

btnNuevo.style.display="none";

console.log(

"Destino seleccionado",

destino

);

}

// ========================================
// REGISTRAR NUEVO DESTINO
// ========================================

btnNuevo.addEventListener(

"click",

()=>{

    panelNuevo.style.display="block";

    btnNuevo.style.display="none";

    txtNombre.value=

    txtBuscar.value;

    iniciarMapa();

}

);


// ========================================
// MAPA
// ========================================

function iniciarMapa(){

    if(map){

        return;

    }

    map =

    L.map("map")

    .setView(

        [17.4088035,-93.327078],

        13

    );

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:"© OpenStreetMap"

        }

    ).addTo(map);

    map.on(

        "click",

        function(e){

            if(marcador){

                map.removeLayer(

                    marcador

                );

            }

            marcador =

            L.marker(

                e.latlng

            )

            .addTo(map);

            destinoSeleccionado={

                nombre:

                txtNombre.value,

                latitud:

                e.latlng.lat,

                longitud:

                e.latlng.lng

            };

            console.log(

                destinoSeleccionado

            );

        }

    );

}







