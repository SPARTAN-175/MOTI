import { auth, db }
from "./firebase-config.js";

import {

collection,
query,
where,
onSnapshot,
doc,
getDoc,
addDoc,
serverTimestamp

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

  const htmlBoton =

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

${htmlBoton}
`;

lista.appendChild(

tarjeta

);

const btnElegir =

tarjeta.querySelector(

".elegir-btn"

);

if(btnElegir){

btnElegir.addEventListener(

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

async function seleccionarConductor(
ruta,
conductor
){

try{

const pasajero = auth.currentUser;

const pasajeroDoc = await getDoc(

doc(
db,
"usuarios",
pasajero.uid
)

);

const datosPasajero = pasajeroDoc.data();

const solicitudRef = await addDoc(

collection(
db,
"solicitudes"
),

{

pasajeroId: pasajero.uid,

nombrePasajero: datosPasajero.nombre,

conductorId: ruta.conductorId,

nombreConductor: conductor.nombre,

placa: conductor.placa,

tipoViaje: "especial",

destinoId: ruta.destinoId,

destino: nombre,

tarifa: ruta.tarifa,

observaciones: "",

latitud: datosPasajero.latitud,

longitud: datosPasajero.longitud,

estado: "pendiente",

fechaSolicitud: serverTimestamp()

}

);

console.log("Solicitud creada:", solicitudRef.id);

window.location.href =
`esperando-conductor.html?id=${solicitudRef.id}`;

}
catch(error){

console.error(error);

alert(error.message);

}

}





