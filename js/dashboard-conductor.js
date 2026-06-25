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
    onSnapshot
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

let ultimaSolicitud =
null;

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
        escucharSolicitudes();

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

    requestContent.innerHTML = `

        <div class="${clase}">

            <h3>

                Solicitud de viaje

            </h3>

            <p>

                <strong>

                    ${datos.nombrePasajero}

                </strong>

            </p>

            <p>

                Destino:
                ${datos.destino}

            </p>

            <p>

                Referencia:
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

}


