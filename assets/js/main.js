import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6FDCE3);

const fbxLoader1 = new FBXLoader();
// let city;

// fbxLoader1.load(
//   'city.fbx',
//   (object) => {
//     object.traverse((child) => {
//       if (child.isMesh) {
//         if (child.material) {
//           child.material.transparent = false;
//         }
//       }
//     });
//     object.scale.set(0.005, 0.005, 0.005);
//     object.rotateY(48.7);
//     object.position.set(11, -15, 35);
//     scene.add(object);
//     city = object;
//     city.originalPosition = object.position.clone();
//   },
//   (xhr) => {
//     console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
//   },
//   (error) => {
//     console.log(error);
//   }
// );

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const pointLight = new THREE.PointLight(0xffffff, 95, 100);
pointLight.position.set(6, 6, 10);
pointLight.intensity = 40;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(pointLight, ambientLight);

// Adding new directional lights
const directionalLight1 = new THREE.DirectionalLight(0xF8AD73, 1);
directionalLight1.position.set(5, 5, 5).normalize();
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xF8AD73, 1);
directionalLight2.position.set(-5, -5, -5).normalize();
scene.add(directionalLight2);

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100000); // Increased far clipping plane
camera.position.z = 15;
scene.add(camera);

const originalCameraPosition = camera.position.clone();

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = true;
controls.autoRotate = false;
controls.autoRotateSpeed = 5;

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });

let mouseDown = false;
let rgb = [];

window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.width) * 255),
      150,
    ];
  }
});


const zoomOutCity = () => {
  if (city) {
    gsap.to(camera.position, {
      duration: 1,
      x: originalCameraPosition.x,
      y: originalCameraPosition.y,
      z: originalCameraPosition.z,
      onUpdate: () => {
        camera.lookAt(city.position);
      },
    });
  }
};

window.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  zoomOutCity();
});
