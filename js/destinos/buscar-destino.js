import {

    cargarDestinos

}
from "./cargar-destinos.js";

import {

    buscarEnNominatim

}
from "./nominatim.js";

import {

    guardarDestino

}
from "./guardar-destino.js";


export async function buscarDestino(texto){

    // ===========================
    // BUSCAR EN FIREBASE
    // ===========================

    const destinos =

    await cargarDestinos();

    const encontrados =

    destinos.filter(

        destino=>

        destino.nombre

        .toLowerCase()

        .includes(

            texto.toLowerCase()

        )

    );

    if(

        encontrados.length>0

    ){

        console.log(

            "Destino encontrado en Firebase"

        );

        return encontrados;

    }

    // ===========================
    // BUSCAR EN INTERNET
    // ===========================

    console.log(

        "Buscando en OpenStreetMap..."

    );

    const internet =

    await buscarEnNominatim(

        texto

    );

    // ===========================
    // GUARDAR EL PRIMERO
    // ===========================

    if(

        internet.length>0

    ){

        await guardarDestino(

            internet[0]

        );

    }

    return internet;

}
