const btnLocal = document.getElementById("btnLocal");
const btnEspecial = document.getElementById("btnEspecial");

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
