let map;

let marcador = null;

// ======================
// CREAR MAPA
// ======================

map = L.map("map").setView(

    [17.4088035,-93.327078],

    16

);

L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        attribution:"© OpenStreetMap"

    }

).addTo(map);
