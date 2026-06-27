import { auth, db }
from "./firebase-config.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const statusButton =
document.getElementById(
    "statusButton"
);

const statusDescription =
document.getElementById(
    "statusDescription"
);

let currentState = null;

const requestPopup =
document.getElementById(
    "requestPopup"
);

const requestContent =
document.getElementById(
    "requestContent"
);

const activeTripCard =
document.getElementById(
    "activeTripCard"
);

const activePassenger =
document.getElementById(
    "activePassenger"
);

const activeDestination =
document.getElementById(
    "activeDestination"
);

const activeStatus =
document.getElementById(
    "activeStatus"
);

const continueTrip =
document.getElementById(
    "continueTrip"
);

let ultimaSolicitud =
null;

requestContent.addEventListener(
    "click",
    (e)=>{

        if(
            e.target.classList.contains(
                "accept-trip"
            )
        ){

            aceptarSolicitud(
                ultimaSolicitud
            );

        }

        if(
            e.target.classList.contains(
                "reject-trip"
            )
        ){

            console.log(
                "Solicitud rechazada"
            );

        }

    }
);

onAuthStateChanged(
    auth,
    async (user) => {

        if(!user) return;

        const docRef =
        doc(
            db,
            "usuarios",
            user.uid
        );

        const docSnap =
        await getDoc(docRef);

        if(!docSnap.exists()) return;

        const datos =
        docSnap.data();

        currentState =
        datos.estadoServicio ||
        "disponible";

       actualizarVista();

       await verificarViajeActivo();

       if(currentState === "disponible"){

       escucharSolicitudes();

       }

        statusButton.addEventListener(
            "click",
            async () => {

                if(
                    currentState ===
                    "en_viaje"
                ){
                    return;
                }

                currentState =
                currentState ===
                "disponible"
                ?
                "no_disponible"
                :
                "disponible";

                await updateDoc(
                    docRef,
                    {
                        estadoServicio:
                        currentState
                    }
                );

                actualizarVista();

            }
        );

    }
);


function actualizarVista(){

    statusButton.classList.remove(
        "status-green",
        "status-gray",
        "status-yellow"
    );

    if(
        currentState ===
        "disponible"
    ){

        statusButton.textContent =
        "Disponible";

        statusDescription.textContent =
        "Estás recibiendo solicitudes";

        statusButton.classList.add(
            "status-green"
        );

    }

    if(
        currentState ===
        "no_disponible"
    ){

        statusButton.textContent =
        "No disponible";

        statusDescription.textContent =
        "No estás recibiendo solicitudes";

        statusButton.classList.add(
            "status-gray"
        );

    }

    if(
        currentState ===
        "en_viaje"
    ){

        statusButton.textContent =
        "En viaje";

        statusDescription.textContent =
        "Tienes un viaje activo";

        statusButton.classList.add(
            "status-yellow"
        );

    }

}


// ======================
// SOLICITUDES EN TIEMPO REAL
// ======================

function escucharSolicitudes(){

    const q =
    query(

        collection(
            db,
            "solicitudes"
        ),

        where(
            "estado",
            "==",
            "pendiente"
        ),

        orderBy(
            "fecha",
            "desc"
        ),

        limit(1)

    );

    onSnapshot(

        q,

        (snapshot)=>{

            if(snapshot.empty){

                requestPopup.style.display =
                "none";

                ultimaSolicitud =
                null;

                return;

            }

            const solicitud =
            snapshot.docs[0];

            if(
                ultimaSolicitud ===
                solicitud.id
            ){
                return;
            }

            ultimaSolicitud =
            solicitud.id;

            mostrarPopup(
                solicitud.id,
                solicitud.data()
            );

        }

    );

}

function mostrarPopup(
    id,
    datos
){

    const clase =
    datos.tipoViaje ===
    "especial"
    ?
    "popup-special"
    :
    "popup-local";

    const tipoViaje =
    datos.tipoViaje ===
    "especial"
    ?
    "ESPECIAL"
    :
    "LOCAL";

    let hora = "";

if(datos.fecha){

    hora =
    datos.fecha
    .toDate()
    .toLocaleTimeString(
        "es-MX",
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}

    requestContent.innerHTML = `

<div class="${clase}">

    <h3>

        Nueva solicitud

    </h3>

    <div class="trip-badge">

        ${tipoViaje}

    </div>

    <p>

        <strong>

            ${datos.nombrePasajero}

        </strong>

    </p>

    <p class="popup-time">

        ${hora}

    </p>

    <p>

        <strong>Destino</strong><br>

        ${datos.destino}

    </p>

    <p>

        <strong>Referencia</strong><br>

        ${datos.observaciones || "-"}

    </p>

    <div class="popup-actions">

        <button
            class="accept-trip">

            Aceptar

        </button>

        <button
            class="reject-trip">

            Rechazar

        </button>

    </div>

</div>

`;
    requestPopup.style.display =
    "block";

    console.log("Botón encontrado:",
document.querySelector(".accept-trip"));
}

async function aceptarSolicitud(id){

    try{

        const uid =
        auth.currentUser.uid;

        // Actualizar solicitud

        await updateDoc(

            doc(
                db,
                "solicitudes",
                id
            ),

            {

                estado:
                "aceptada",

                conductorId:
                uid,

                fechaAceptacion:
                serverTimestamp()

            }

        );

        // Actualizar conductor

        await updateDoc(

            doc(
                db,
                "usuarios",
                uid
            ),

            {

                estadoServicio:
                "en_viaje",

                viajeActivo:
                id

            }

        );

        window.location.href =
        "viaje-activo.html";

    }

    catch(error){

        console.error(error);

        alert(
            "No se pudo aceptar el viaje."
        );

    }

}

async function verificarViajeActivo(){

    const user =
    auth.currentUser;

    if(!user) return;

    const usuarioDoc =
    await getDoc(

        doc(
            db,
            "usuarios",
            user.uid
        )

    );

    const usuario =
    usuarioDoc.data();

    if(!usuario.viajeActivo){

        activeTripCard.style.display =
        "none";

        return;

    }

    const viajeDoc =
    await getDoc(

        doc(
            db,
            "solicitudes",
            usuario.viajeActivo
        )

    );

    if(!viajeDoc.exists()) return;

    const viaje =
    viajeDoc.data();

    activePassenger.textContent =
    viaje.nombrePasajero;

    activeDestination.textContent =
    viaje.destino;

    activeStatus.textContent =
    viaje.estado;

    activeTripCard.style.display =
    "block";

}







