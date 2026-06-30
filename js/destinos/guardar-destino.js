import { db }
from "../firebase-config.js";

import {

    collection,
    addDoc,
    serverTimestamp

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


export async function guardarDestino(destino){

    try{

        const docRef =

        await addDoc(

            collection(

                db,

                "destinosEspeciales"

            ),

            {

                nombre:

                destino.nombre,

                latitud:

                destino.latitud,

                longitud:

                destino.longitud,

                activo:true,

                fechaCreacion:

                serverTimestamp()

            }

        );

        return{

            id:docRef.id,

            ...destino

        };

    }

    catch(error){

        console.error(error);

        return null;

    }

}
