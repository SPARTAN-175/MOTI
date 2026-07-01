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

const nombre =

params.get(

"nombre"

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

nombre;



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

async (snapshot)=>{

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

  const boton =

conductor.estadoServicio ===

"disponible"

?

`<button
class="btn-primary elegir-btn"
data-conductor="${ruta.conductorId}"
data-ruta="${ruta.destinoId}"
data-tarifa="${ruta.tarifa}">

Elegir

</button>`

:

`<button
class="btn-primary"
disabled>

No disponible

</button>`;

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

${boton}
`;

lista.appendChild(

tarjeta

);

const boton =

tarjeta.querySelector(

".elegir-btn"

);

if(boton){

boton.addEventListener(

"click",

()=>{

seleccionarConductor(

ruta,

conductor

);

}

);

}

}


function seleccionarConductor(

ruta,

conductor

){

console.log(

"Conductor seleccionado"

);

console.log(

ruta

);

console.log(

conductor

);

}




