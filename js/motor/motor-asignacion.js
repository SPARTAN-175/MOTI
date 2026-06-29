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

import {
    seleccionarGrupos
}
from "./seleccionar-grupo.js";

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
}]
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
}]
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
}]
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
activo:false
}]
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
activo:true
}]
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
activo:true
}]
}

];

const pasajero={

latitud:17.4088035,

longitud:-93.327078

};

document
.getElementById("btnProbar")
.addEventListener("click",ejecutarMotor);

function ejecutarMotor(){

let log=[];

log.push("🚖 MOTI ENGINE INICIADO");

let disponibles=
buscarConductores(conductores);

log.push(`✅ Conductores registrados: ${conductores.length}`);

log.push(`✅ Disponibles: ${disponibles.length}`);

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

log.push("✅ Distancias calculadas.");

const radio=

filtrarRadio(disponibles);

log.push(`✅ Radio dinámico aplicado: ${radio.radio}`);

log.push(`✅ Conductores cercanos: ${radio.conductores.length}`);

const especiales=

filtrarRutasEspeciales(

radio.conductores,

viaje

);

if(viaje.tipoViaje==="especial"){

log.push("✅ Viaje especial detectado.");

log.push(`✅ Compatibles con la ruta: ${especiales.length}`);

}

const puntuados=

calcularPuntaje(especiales);

log.push("✅ Puntajes calculados.");

puntuados.sort(

(a,b)=>b.puntaje-a.puntaje

);

log.push("✅ Conductores ordenados.");

const grupos=

seleccionarGrupos(

puntuados

);

log.push(`✅ Grupos creados: ${grupos.length}`);

log.push("🏁 MOTOR FINALIZADO.");

mostrarResultado(

grupos,

log

);

}

function mostrarResultado(grupos,log){

const tabla=

document.getElementById("tablaConductores");

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

<strong>${conductor.nombre}</strong>

</td>

<td>${conductor.estadoServicio}</td>

<td>${conductor.distancia} m</td>

<td>${conductor.puntaje}</td>

<td>${index+1}</td>

</tr>

`;

}

);

}

);

document.getElementById(

"log"

).textContent=

log.join("\n");

console.log(grupos);

}
