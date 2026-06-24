import { auth, db }
from "./firebase-config.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
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
