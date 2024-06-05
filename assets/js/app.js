let info = document.getElementById("info");
let page = document.getElementById("info__page");
let infoGone = document.getElementById("info__gone");
let f = false;

info.onclick = function () {
    page.style.display = "flex";
}
infoGone.onclick = function () {
    page.style.display = "none";
}

document.getElementById('playButton').addEventListener('click', function() {
    var video = document.getElementById('video');
    var button = document.getElementById('playButton');
    if (video.paused) {
        video.play();
        button.classList.add('pause-icon');
        button.style.borderLeft = 'none';
        button.style.borderTop = 'none';
        button.style.borderBottom = 'none';
    } else {
        video.pause();
        button.classList.remove('pause-icon');
        button.style.borderLeft = '2rem solid white';
        button.style.borderTop = '1rem solid transparent';
        button.style.borderBottom = '1rem solid transparent';
    }
});