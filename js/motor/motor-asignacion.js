import { buscarConductores }

from "./buscar-conductores.js";

const conductores = [

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

    }

];

const disponibles =

buscarConductores(conductores);

console.log(disponibles);
