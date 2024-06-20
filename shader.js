import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6FDCE3);

// Declare fbxLoader and fbxLoader1 once
const fbxLoader = new FBXLoader();
const fbxLoader1 = new FBXLoader();

// Function to apply custom shader to a mesh (if needed in future)
function applyCustomShader(mesh) {
  // Placeholder for applying custom shaders
  // Example:
  // const shaderMaterial = new THREE.ShaderMaterial({
  //   uniforms: customShader.uniforms,
  //   vertexShader: customShader.vertexShader,
  //   fragmentShader: customShader.fragmentShader,
  //   // Add any other parameters as needed
  // });

  // mesh.material = shaderMaterial;
}

// Declare loadedObject and boot before using them
let loadedObject;
let boot;

// Function to load FBX models
function loadFBXModels() {
  // Using fbxLoader for 'Pier.fbx'
  fbxLoader.load(
    'Pier.fbx',
    (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          // applyCustomShader(child); // Optionally apply custom shader
        }
      });
      scene.add(object);
      loadedObject = object; // Assign loadedObject after loading completes
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
      console.error('Error loading Pier.fbx:', error);
    }
  );

  // Using fbxLoader1 for 'boot2.fbx'
  fbxLoader1.load(
    'boot2.fbx',
    (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.transparent = false; // Example: Adjusting material properties
          }
          // applyCustomShader(child); // Optionally apply custom shader
        }
      });
      object.scale.set(8, 8, 8);
      object.rotateY(48.7);
      object.position.set(11, 15, 35);
      scene.add(object);
      boot = object;
      boot.originalPosition = object.position.clone();
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
      console.error('Error loading boot2.fbx:', error);
    }
  );
}

// Call the function to load FBX models
loadFBXModels();

// Setup renderer, camera, controls, and animation loop...

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100000);
camera.position.z = 15;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
