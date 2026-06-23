import { auth } from "./firebase-config.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const btnLogout =
document.getElementById("btnLogout");

if(btnLogout){

    btnLogout.addEventListener(
        "click",
        async (e) => {

            e.preventDefault();

            try{

                await signOut(auth);

                window.location.href =
                "login.html";

            }
            catch(error){

                console.error(error);

                alert(
                    "No se pudo cerrar sesión."
                );

            }

        }
    );

}
