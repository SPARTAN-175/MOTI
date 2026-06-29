export function calcularPuntaje(conductores){

    conductores.forEach(

        conductor=>{

            let puntos = 0;

            // =====================
            // DISTANCIA
            // =====================

            if(conductor.distancia<=300){

                puntos +=100;

            }

            else if(conductor.distancia<=500){

                puntos +=80;

            }

            else if(conductor.distancia<=1000){

                puntos +=60;

            }

            else if(conductor.distancia<=2000){

                puntos +=40;

            }

            else{

                puntos +=20;

            }

            // =====================
            // ROTACIÓN
            // =====================

            if(conductor.minutosSinViaje<=10){

                puntos +=10;

            }

            else if(conductor.minutosSinViaje<=20){

                puntos +=20;

            }

            else if(conductor.minutosSinViaje<=40){

                puntos +=40;

            }

            else{

                puntos +=60;

            }

            conductor.puntaje = puntos;

        }

    );

    return conductores;

}
