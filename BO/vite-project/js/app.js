let info = document.getElementById("info");
let page = document.getElementById("info__page");
let f = false;

info.onclick = function () {
    page.style.display = "flex";
    page.style.zIndex = "3";
}

