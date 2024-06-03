import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const scene = new THREE.Scene();
// Background color
scene.background = new THREE.Color(0x6FDCE3);

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 95, 100);
light.position.set(6, 6, 10);
light.intensity = 40;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(light, ambientLight);

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 15;
scene.add(camera);

// Store original camera position
const originalCameraPosition = camera.position.clone();

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener('resize', () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update Camera
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
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });

// Mouse animation Color
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
    // Animate
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const fbxLoader = new FBXLoader();
let toyBlock; // Variable to store the loaded toy block
fbxLoader.load(
  'ToyBlock.fbx',
  (object) => {
    object.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material.transparent = false;
        }
      }
    });
    object.scale.set(0.25, 0.25, 0.25);
    object.rotateX(48.7);
    object.position.set(5, 0, 0);
    scene.add(object);
    toyBlock = object; // Store the toy block
    // Store the original position of the toy block
    toyBlock.originalPosition = object.position.clone();
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  (error) => {
    console.log(error);
  }
);

const zoomOutToyBlock = () => {
  if (toyBlock) {
    // Animate the camera back to its original position
    gsap.to(camera.position, {
      duration: 1,
      x: originalCameraPosition.x,
      y: originalCameraPosition.y,
      z: originalCameraPosition.z,
      onUpdate: () => {
        camera.lookAt(toyBlock.position);
      },
    });
  }
};

window.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  zoomOutToyBlock();
});

const onClick = (event) => {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the ray
  const intersects = raycaster.intersectObjects([mesh, toyBlock], true);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    const target = intersects[0].point;

    if (intersectedObject === mesh) {
      // Animate the camera to zoom in on the mesh
      gsap.to(camera.position, {
        duration: 1,
        x: target.x,
        y: target.y,
        z: target.z + 2, // Adjusted the zoom level to be less pronounced
        onUpdate: () => {
          camera.lookAt(mesh.position);
        },
      });
    } else if (intersectedObject === toyBlock) {
      // Animate the camera to zoom in on the toy block
      gsap.to(camera.position, {
        duration: 1,
        x: target.x,
        y: target.y,
        z: target.z + 2.5, // Adjusted the zoom level to be less pronounced
        onUpdate: () => {
          camera.lookAt(toyBlock.position);
        },
      });
    }
  }
};

window.addEventListener('click', onClick);

