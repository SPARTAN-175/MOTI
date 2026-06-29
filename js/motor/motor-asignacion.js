import {
    buscarConductores
}
from "./buscar-conductores.js";

import {
    calcularDistancia
}
from "./calcular-distancia.js";

const conductores = [

    {
        nombre:"Carlos",
        estadoServicio:"disponible",
        latitud:17.409058,
        longitud:-93.327280
    },

    {
        nombre:"Juan",
        estadoServicio:"en_viaje",
        latitud:17.410500,
        longitud:-93.329500
    },

    {
        nombre:"Pedro",
        estadoServicio:"disponible",
        latitud:17.408700,
        longitud:-93.327100
    },

    {
        nombre:"Luis",
        estadoServicio:"ocupado",
        latitud:17.420000,
        longitud:-93.330000
    },

    {
        nombre:"Miguel",
        estadoServicio:"disponible",
        latitud:17.412000,
        longitud:-93.331000
    }

];

const pasajero = {

    latitud:17.4088035,

    longitud:-93.327078

};

const boton =
document.getElementById(
    "btnProbar"
);

boton.addEventListener(

    "click",

    ejecutarMotor

);

function ejecutarMotor(){

    const disponibles =
    buscarConductores(
        conductores
    );

    disponibles.forEach(

        conductor=>{

            conductor.distancia =
            Math.round(

                calcularDistancia(

                    pasajero.latitud,
                    pasajero.longitud,

                    conductor.latitud,
                    conductor.longitud

                )

            );

        }

    );

    mostrarResultado(
        disponibles
    );

}

function mostrarResultado(lista){

    const tabla =
    document.getElementById(
        "tablaConductores"
    );

    tabla.innerHTML = "";

    lista.forEach(

        (conductor,index)=>{

            tabla.innerHTML += `

            <tr>

                <td>${conductor.nombre}</td>

                <td>${conductor.estadoServicio}</td>

                <td>${conductor.distancia} m</td>

                <td>--</td>

                <td>${index+1}</td>

            </tr>

            `;

        }

    );

    document.getElementById(
        "log"
    ).textContent =

`Conductores encontrados: ${conductores.length}

Disponibles: ${lista.length}

Distancias calculadas correctamente.`;

}
