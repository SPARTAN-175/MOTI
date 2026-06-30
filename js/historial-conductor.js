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

"listaHistorial"

);


onAuthStateChanged(

auth,

async(user)=>{

if(!user)return;

await cargarHistorial(

user.uid

);

});



async function cargarHistorial(uid){

lista.innerHTML="";

const consulta=

query(

collection(

db,

"solicitudes"

),

where(

"conductorId",

"==",

uid

)

);

const snapshot=

await getDocs(

consulta

);

if(snapshot.empty){

lista.innerHTML=

"<p>No tienes viajes registrados.</p>";

return;

}

for(const viajeDoc of snapshot.docs){

const viaje=

viajeDoc.data();

crearTarjeta(

viaje

);

}

}
