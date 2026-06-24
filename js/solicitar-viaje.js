import { auth, db }
from "./firebase-config.js";

import {
    addDoc,
    collection,
    serverTimestamp,
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const btnSolicitar =
document.getElementById(
    "btnSolicitar"
);

const observaciones =
document.getElementById(
    "observaciones"
);

const destinoEspecial =
document.getElementById(
    "destinoEspecial"
);

const btnEspecial =
document.getElementById(
    "btnEspecial"
);


btnSolicitar.addEventListener(
    "click",
    async (e) => {

        e.preventDefault();

        try{

            const user =
            auth.currentUser;

            const userDoc =
await getDoc(
    doc(
        db,
        "usuarios",
        user.uid
    )
);

const userData =
userDoc.data();

            if(!user){

                alert(
                    "Debes iniciar sesión."
                );

                return;

            }

            const tipoViaje =
            btnEspecial.classList.contains(
                "active"
            )
            ?
            "especial"
            :
            "local";

            await addDoc(

                collection(
                    db,
                    "solicitudes"
                ),

                {

                    pasajeroId:
                    user.uid,

                    nombrePasajero:
                    userData.nombre,

                    tipoViaje,

                    destino:
                    tipoViaje ===
                    "especial"
                    ?
                    destinoEspecial.value
                    :
                    "Local",

                    observaciones:
observaciones.value.trim(),

latitud:
userData.latitud,

longitud:
userData.longitud,

estado:
"pendiente",
                    fecha:
                    serverTimestamp()

                }

            );

            alert(
                "Solicitud enviada correctamente."
            );

        }
        catch(error){

            console.error(error);

            alert(
                "Error al crear solicitud."
            );

        }

    }
);
