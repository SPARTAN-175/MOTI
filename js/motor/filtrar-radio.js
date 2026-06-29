export function filtrarRadio(

    conductores,

    radioMaximo

){

    return conductores.filter(

        conductor =>

            conductor.distancia <= radioMaximo

    );

}
