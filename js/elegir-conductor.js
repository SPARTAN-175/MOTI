import { auth, db }
from "./firebase-config.js";

import {

collection,
query,
where,
onSnapshot

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
