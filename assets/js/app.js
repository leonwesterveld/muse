import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

let scene, camera, renderer, controls, mixer;
let models = [];
let currentModelIndex = 0;
let clock = new THREE.Clock();

function init() {
    const canvas = document.getElementById('3d-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 100000);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Ensure background is transparent

    const light = new THREE.DirectionalLight(0xE8AD73, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);
    const light2 = new THREE.DirectionalLight(0xE8AD73, 1);
    light2.position.set(-5, -5, -5).normalize();
    scene.add(light2);

    loadModels();

    camera.position.z = 200;
    camera.position.x = 10;
    controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    // Ensure the canvas dimensions are set correctly
    onWindowResize();

    // Start animation loop
    animate();

    // Set interval to rotate and switch models every 40 seconds
    setInterval(switchModel, 40000);
}

function loadModels() {
    const loader = new FBXLoader();
    const modelPaths = ['assets/Boot2.fbx', 'assets/Pier.fbx', 'assets/House1.fbx', 'assets/RowBoat.fbx'];

    modelPaths.forEach((path) => {
        loader.load(path, (object) => {
            object.visible = false; // Hide the model initially
            mixer = new THREE.AnimationMixer(object);
            scene.add(object);
            object.position.set(0, 0, 0); // Center the model
            object.scale.set(0.1, 0.1, 0.1);

            object.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = 1.0;
                    console.log(`Material properties for ${child.name}:`, child.material);
                }
            });

            models.push(object);

            // Show the first model immediately after loading
            if (models.length === 1) {
                models[0].visible = true;
            }
        }, undefined, (error) => {
            console.error(`Error loading FBX file ${path}:`, error);
        });
    });
}

function switchModel() {
    if (models.length > 0) {
        models[currentModelIndex].visible = false; // Hide the current model
        currentModelIndex = (currentModelIndex + 1) % models.length; // Move to the next model
        models[currentModelIndex].visible = true; // Show the next model
        models[currentModelIndex].rotation.y = 0; // Reset rotation of the new model
    }
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

init();

document.getElementById("info").onclick = function () {
    document.getElementById("info__page").style.display = "flex";
    document.getElementById("city__page").style.display = "none";
};
document.getElementById("info__gone").onclick = function () {
    document.getElementById("info__page").style.display = "none";
    document.getElementById("city__page").style.display = "flex";
};