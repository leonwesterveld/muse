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

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('cube-container').appendChild(renderer.domElement);

// Adjust renderer size to fit the container
renderer.setSize(document.getElementById('cube-container').clientWidth, document.getElementById('cube-container').clientHeight);

// Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Animation
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('cube-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});