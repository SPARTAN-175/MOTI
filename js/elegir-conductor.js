import { auth, db }
from "./firebase-config.js";

import {

collection,
query,
where,
onSnapshot,
doc,
getDoc

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const params =

new URLSearchParams(

window.location.search

);

const destinoId =

params.get(

"destinoId"

);

const lista =

document.getElementById(

"listaConductores"

);

const nombreDestino =

document.getElementById(

"nombreDestino"

);

nombreDestino.textContent =

destinoId;



const consulta =

query(

collection(
db,
"rutasEspeciales"
),

where(
"destinoId",
"==",
destinoId
),

where(
"activo",
"==",
true
)

);

onSnapshot(

consulta,

(snapshot)=>{

lista.innerHTML="";

for(const rutaDoc of snapshot.docs){

const ruta =

rutaDoc.data();

const conductorDoc =

await getDoc(

doc(

db,

"usuarios",

ruta.conductorId

)

);

if(!conductorDoc.exists()){

continue;

}

const conductor =

conductorDoc.data();

crearTarjeta(

ruta,

conductor

);

}

});


// ========================================
// CREAR TARJETA
// ========================================

function crearTarjeta(

ruta,

conductor

){

const tarjeta =

document.createElement(

"div"

);

tarjeta.className=

"route-card";

const estado =

conductor.estadoServicio ===

"disponible"

?

"🟢 Disponible"

:

"🟡 Ocupado";

tarjeta.innerHTML =

`

<h3>

${conductor.nombre}

</h3>

<p>

${estado}

</p>

<p>

Tarifa: $${ruta.tarifa}

</p>

<button

class="btn-primary elegir-btn"

data-conductor="${ruta.conductorId}"

data-ruta="${ruta.destinoId}"

data-tarifa="${ruta.tarifa}">

Elegir

</button>

`;

lista.appendChild(

tarjeta

);

}







