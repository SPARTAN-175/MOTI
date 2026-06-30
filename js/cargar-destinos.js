import { db }
from "./firebase-config.js";

import {

doc,
setDoc

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const btn =
document.getElementById(
"btnCargar"
);

const log =
document.getElementById(
"log"
);


// ===========================
// LISTA DE DESTINOS
// ===========================

const destinos=[

// AQUÍ VAMOS A PEGAR TODAS
// LAS LOCALIDADES

];


// ===========================
// CARGAR
// ===========================

btn.addEventListener(

"click",

cargarDestinos

);


async function cargarDestinos(){

log.textContent="";

for(const destino of destinos){

await setDoc(

doc(

db,

"destinos",

destino.id

),

destino

);

log.textContent +=

"✔ "

+

destino.nombre

+

"\n";

}

log.textContent +=

"\n\n✅ CARGA FINALIZADA";

}
