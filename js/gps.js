import { auth, db }
from "./firebase-config.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


onAuthStateChanged(

    auth,

    (user)=>{

        if(!user) return;

        iniciarGPS(user.uid);

    }

);


function iniciarGPS(uid){

    if(!("geolocation" in navigator)){

        console.log(
            "GPS no compatible"
        );

        return;

    }

    navigator.geolocation.watchPosition(

        async(position)=>{

            const lat =
            position.coords.latitude;

            const lng =
            position.coords.longitude;

            await updateDoc(

                doc(
                    db,
                    "usuarios",
                    uid
                ),

                {

                    latitud:lat,

                    longitud:lng,

                    ultimaUbicacion:
                    new Date().toISOString()

                }

            );

            console.log(
    "📍 GPS",
    auth.currentUser?.uid,
    lat,
    lng
);

        },

        (error)=>{

            console.error(error);

        },

        {

            enableHighAccuracy:true,

            maximumAge:5000,

            timeout:10000

        }

    );

}
