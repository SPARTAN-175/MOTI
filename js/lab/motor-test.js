import {
    ejecutarMotor
}
from "../motor/motor-asignacion.js";


// ==============================
// DATOS DE PRUEBA
// ==============================

const viaje={

    tipoViaje:"especial",

    destino:"Plan de Ayala"

};

const pasajero={

    latitud:17.4088035,

    longitud:-93.327078

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

aceptaViaje:false
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

aceptaViaje:false

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

aceptaViaje:false

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

aceptaViaje:false
}

]

},

{

nombre:"Antonio",

estadoServicio:"disponible",

latitud:17.413000,

longitud:-93.330000,

minutosSinViaje:70,

rutasEspeciales:[

{

destino:"Plan de Ayala",

aceptaViaje:false

}

]

},

{

nombre:"Luis",

estadoServicio:"disponible",

latitud:17.415000,

longitud:-93.334000,

minutosSinViaje:25,

rutasEspeciales:[

{

destino:"Plan de Ayala",

aceptaViaje:false

}

]

}

];


// ==============================
// EVENTO BOTÓN
// ==============================

document

.getElementById(

"btnProbar"

)

.addEventListener(

"click",

probarMotor

);


// ==============================
// EJECUTAR MOTOR
// ==============================

function probarMotor(){

const resultado=

ejecutarMotor(

conductores,

viaje,

pasajero

);

mostrarTabla(

resultado.grupos

);

mostrarLog(

resultado.log

);

}


// ==============================
// TABLA
// ==============================

function mostrarTabla(

grupos

){

const tabla=

document.getElementById(

"tablaConductores"

);

tabla.innerHTML="";

grupos.forEach(

(grupo,numeroGrupo)=>{

grupo.forEach(

(conductor,index)=>{

tabla.innerHTML+=`

<tr>

<td>

Grupo ${numeroGrupo+1}

<br>

<strong>

${conductor.nombre}

</strong>

</td>

<td>

${conductor.estadoServicio}

</td>

<td>

${conductor.distancia} m

</td>

<td>

${conductor.puntaje}

</td>

<td>

${index+1}

</td>

</tr>

`;

}

);

}

);

}


// ==============================
// LOG
// ==============================

function mostrarLog(

log

){

document.getElementById(

"log"

).textContent=

log.join("\n");

}
