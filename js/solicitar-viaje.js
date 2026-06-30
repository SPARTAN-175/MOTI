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

import {

    buscarDestino

}
from "./destinos/buscar-destino.js";

const btnSolicitar =
document.getElementById(
    "btnSolicitar"
);

const observaciones =
document.getElementById(
    "observaciones"
);

const buscarDestinoEspecial =

document.getElementById(

    "buscarDestinoEspecial"

);

const listaDestinos =

document.getElementById(

    "listaDestinos"

);

let destinoSeleccionado = null;

const destino =
document.getElementById(
    "destino"
);

const btnEspecial =
document.getElementById(
    "btnEspecial"
);



// ========================================
// BUSCAR DESTINOS ESPECIALES
// ========================================

buscarDestinoEspecial.addEventListener(

    "input",

    async()=>{

        const texto =

        buscarDestinoEspecial.value.trim();

        if(texto.length < 3){

            listaDestinos.style.display =

            "none";

            listaDestinos.innerHTML = "";

            return;

        }

        const resultados =

        await buscarDestino(texto);

        listaDestinos.innerHTML = "";

        resultados.forEach(

            destino=>{

                const item =

                document.createElement("div");

                item.className =

                "item-destino";

                item.innerHTML =

                `📍 ${destino.nombre}`;

                item.addEventListener(

                    "click",

                    ()=>{

                        destinoSeleccionado = destino;

                        buscarDestinoEspecial.value =

                        destino.nombre;

                        listaDestinos.innerHTML = "";

                        listaDestinos.style.display =

                        "none";

                        console.log(

                            destinoSeleccionado

                        );

                    }

                );

                listaDestinos.appendChild(

                    item

                );

            }

        );

        listaDestinos.style.display =

        resultados.length

        ?

        "block"

        :

        "none";

    }

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

            const solicitudRef = await addDoc(

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
        tipoViaje === "especial"
        ?
        destinoEspecial.value
        :
        destino.value.trim(),

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

window.location.href =
`esperando-conductor.html?id=${solicitudRef.id}`;

        }
        catch(error){

            console.error(error);

            alert(
                "Error al crear solicitud."
            );

        }

    }
);
