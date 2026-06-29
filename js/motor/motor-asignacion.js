import {

buscarConductores

}

from "./buscar-conductores.js";

const conductores=[

{

nombre:"Carlos",

estadoServicio:"disponible"

},

{

nombre:"Juan",

estadoServicio:"en_viaje"

},

{

nombre:"Pedro",

estadoServicio:"disponible"

},

{

nombre:"Luis",

estadoServicio:"ocupado"

},

{

nombre:"Miguel",

estadoServicio:"disponible"

}

];

const boton=

document.getElementById(

"btnProbar"

);

boton.addEventListener(

"click",

()=>{

const disponibles=

buscarConductores(

conductores

);

mostrarResultado(

disponibles

);

}

);

function mostrarResultado(lista){

const tabla=

document.getElementById(

"tablaConductores"

);

tabla.innerHTML="";

lista.forEach(

(conductor,index)=>{

const fila=`

<tr>

<td>${conductor.nombre}</td>

<td>${conductor.estadoServicio}</td>

<td>--</td>

<td>--</td>

<td>${index+1}</td>

</tr>

`;

tabla.innerHTML+=fila;

}

);

document.getElementById(

"log"

).textContent=

`Conductores encontrados: ${conductores.length}

Disponibles: ${lista.length}

Primer módulo funcionando correctamente.`;

}
