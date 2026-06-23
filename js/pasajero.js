// =====================
// SELECTOR DE VIAJE
// =====================

const btnLocal =
document.getElementById("btnLocal");

const btnEspecial =
document.getElementById("btnEspecial");

const specialFields =
document.getElementById("specialFields");

const fareAmount =
document.getElementById("fareAmount");

btnLocal.addEventListener("click", () => {

    btnLocal.classList.add("active");
    btnEspecial.classList.remove("active");

    specialFields.style.display = "none";

    fareAmount.textContent = "$10";

});

btnEspecial.addEventListener("click", () => {

    btnEspecial.classList.add("active");
    btnLocal.classList.remove("active");

    specialFields.style.display = "block";

    fareAmount.textContent = "$30";

});

// =====================
// GPS
// =====================

const locationText =
document.getElementById("currentLocation");

if ("geolocation" in navigator) {

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const lat =
            position.coords.latitude;

            const lng =
            position.coords.longitude;

            locationText.textContent =
            `Lat: ${lat.toFixed(5)} | Lng: ${lng.toFixed(5)}`;

        },

        (error) => {

            locationText.textContent =
            "No se pudo obtener la ubicación";

            console.error(error);

        }

    );

} else {

    locationText.textContent =
    "GPS no compatible";

}
