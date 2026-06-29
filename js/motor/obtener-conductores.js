import { db }
from "../firebase-config.js";

import {

    collection,

    getDocs

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


export async function obtenerConductores(){

    const snapshot = await getDocs(

        collection(

            db,

            "usuarios"

        )

    );

    const conductores = [];

    snapshot.forEach(

        (doc)=>{

            const usuario = doc.data();

            if(

                usuario.tipo === "conductor"

                &&

                usuario.estadoServicio === "disponible"

            ){

                conductores.push({

                    id: doc.id,

                    ...usuario

                });

            }

        }

    );

    return conductores;

}
