import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

let scene, camera, renderer, controls, mixer;

function init() {
    const canvas = document.getElementById('3d-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Ensure background is transparent

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(-5, -5, -5).normalize();
    scene.add(light2);

    const loader = new FBXLoader();
    loader.load('assets/ToyBlock.fbx', (object) => {
        mixer = new THREE.AnimationMixer(object);
        scene.add(object);
        object.position.set(0, 0, 0);
        object.scale.set(0.1, 0.1, 0.1);

        // Ensure materials in the FBX support transparency if needed
        object.traverse((child) => {
            if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = 1.0; // Adjust as necessary for your needs
                // Debugging logs to check materials
                console.log(`Material properties for ${child.name}:`, child.material);
            }
        });
    }, undefined, (error) => {
        console.error('Error loading FBX file:', error);
    });

    camera.position.z = 5;
    camera.position.x = 50;
    controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    const canvas = document.getElementById('3d-canvas');
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(clock.getDelta());
    renderer.render(scene, camera);
    controls.update();
}

const clock = new THREE.Clock();
init();
animate();

let info = document.getElementById("info");
let page = document.getElementById("info__page");
let infoGone = document.getElementById("info__gone");

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


console.log("jo");