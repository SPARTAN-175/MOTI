import {
    buscarConductores
}
from "./buscar-conductores.js";

import {
    calcularDistancia
}
from "./calcular-distancia.js";

import {
    filtrarRadio
}
from "./filtrar-radio.js";

import {
    calcularPuntaje
}
from "./calcular-puntaje.js";

import {
    filtrarRutasEspeciales
}
from "./filtrar-rutas-especiales.js";


const viaje={

    tipoViaje:"especial",

    destino:"Plan de Ayala"

};


const conductores=[

{

nombre:"Carlos",

estadoServicio:"disponible",

latitud:17.409058,

longitud:-93.327280,

minutosSinViaje:35,

rutasEspeciales:[

{

destino:"Plan de Ayala",

tarifa:120,

activo:true

}

]

},

{

nombre:"Juan",

estadoServicio:"en_viaje",

latitud:17.410500,

longitud:-93.329500,

minutosSinViaje:5,

rutasEspeciales:[]

},

{

nombre:"Pedro",

estadoServicio:"disponible",

latitud:17.408700,

longitud:-93.327100,

minutosSinViaje:55,

rutasEspeciales:[

{

destino:"Nuevo Xochimilco",

tarifa:150,

activo:true

}

]

},

{

nombre:"Miguel",

estadoServicio:"disponible",

latitud:17.412000,

longitud:-93.331000,

minutosSinViaje:15,

rutasEspeciales:[

{

destino:"Plan de Ayala",

tarifa:130,

activo:true

}

]

},

{

nombre:"José",

estadoServicio:"disponible",

latitud:17.414000,

longitud:-93.333000,

minutosSinViaje:45,

rutasEspeciales:[

{

destino:"Plan de Ayala",

tarifa:120,

activo:false

}

]

}

];

const pasajero={

latitud:17.4088035,

longitud:-93.327078

};

document

.getElementById(

"btnProbar"

)

.addEventListener(

"click",

ejecutarMotor

);

function ejecutarMotor(){

let disponibles=

buscarConductores(

conductores

);

disponibles.forEach(

conductor=>{

conductor.distancia=

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

let radio=

filtrarRadio(

disponibles

);

let especiales=

filtrarRutasEspeciales(

radio.conductores,

viaje

);

let puntuados=

calcularPuntaje(

especiales

);

puntuados.sort(

(a,b)=>

b.puntaje-a.puntaje

);

mostrarResultado(

puntuados,

radio.radio

);

}

function mostrarResultado(lista,radio){

const tabla=

document.getElementById(

"tablaConductores"

);

tabla.innerHTML="";

lista.forEach(

(conductor,index)=>{

tabla.innerHTML+=`

<tr>

<td>${conductor.nombre}</td>

<td>${conductor.estadoServicio}</td>

<td>${conductor.distancia} m</td>

<td>${conductor.puntaje}</td>

<td>${index+1}</td>

</tr>

`;

}

);

document.getElementById(

"log"

).textContent=

`Tipo de viaje: ${viaje.tipoViaje}

Destino: ${viaje.destino}

Radio utilizado: ${radio}

Conductores compatibles: ${lista.length}

✔ Filtro de rutas especiales funcionando correctamente.`;

}
