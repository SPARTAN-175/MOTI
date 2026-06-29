export function filtrarRutasEspeciales(

    conductores,

    viaje

){

    if(

        viaje.tipoViaje !== "especial"

    ){

        return conductores;

    }

    return conductores.filter(

        conductor=>{

            return conductor.rutasEspeciales.some(

                ruta=>

                    ruta.destino===viaje.destino

                    &&

                    ruta.activo===true

            );

        }

    );

}
