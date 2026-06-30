import { auth, db }
from "./firebase-config.js";

import {

collection,
query,
where,
getDocs,
doc,
getDoc

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const lista =

document.getElementById(

"listaRutas"

);


onAuthStateChanged(

auth,

async(user)=>{

if(!user)return;

await cargarRutas(

user.uid

);

}

);


async function cargarRutas(uid){

lista.innerHTML="";

const consulta=

query(

collection(

db,

"rutasEspeciales"

),

where(

"conductorId",

"==",

uid

),

where(

"activo",

"==",

true

)

);

const snapshot=

await getDocs(

consulta

);

if(snapshot.empty){

lista.innerHTML=

"<p>No tienes rutas registradas.</p>";

return;

}

for(const rutaDoc of snapshot.docs){

const ruta=

rutaDoc.data();

const destinoDoc=

await getDoc(

doc(

db,

"destinos",

ruta.destinoId

)

);

if(!destinoDoc.exists()){

continue;

}

const destino=

destinoDoc.data();

crearTarjeta(

rutaDoc.id,

destino,

ruta

);

}

}
