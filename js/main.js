// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Keep track of the touch position
let touchX = null;
let touchY = null;
let prevTouchX = null;
let prevTouchY = null;

// Keep the 3D object on a global variable so we can access it later
let object;

// Set which object to render
let objToRender = 'eye';

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
  `models/${objToRender}/4.gltf`,
  function (gltf) {
    // If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    // While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // If there is an error, log it
    console.error(error);
  }
);

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dino" ? 2 : 20;

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); // top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

// This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "dino") {
  const controls = new OrbitControls(camera, renderer.domElement);
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  // Here we could add some code to update the scene, adding some automatic movement

  // Rotate the object based on touch movement
  if (object && objToRender === "eye" && touchX !== null && touchY !== null) {
    // Adjust rotation based on touch movement
    const deltaX = touchX - prevTouchX;
    const deltaY = touchY - prevTouchY;
    const rotationSpeedX = 0.002; // Adjust this value to control rotation speed
    const rotationSpeedY = 0.002; // Adjust this value to control rotation speed
    object.rotation.y -= deltaX * rotationSpeedX;
    object.rotation.x -= deltaY * rotationSpeedY;
    prevTouchX = touchX;
    prevTouchY = touchY;
  }
  renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add touch event listeners to the container3D element
const container3D = document.getElementById("container3D");
container3D.addEventListener("touchstart", handleTouchStart, false);
container3D.addEventListener("touchmove", handleTouchMove, false);
container3D.addEventListener("touchend", handleTouchEnd, false);

// Function to handle touch start event
function handleTouchStart(event) {
  touchX = event.touches[0].clientX;
  touchY = event.touches[0].clientY;
  prevTouchX = touchX;
  prevTouchY = touchY;
}

// Function to handle touch move event
function handleTouchMove(event) {
  touchX = event.touches[0].clientX;
  touchY = event.touches[0].clientY;
}

// Function to handle touch end event
function handleTouchEnd(event) {
  touchX = null;
  touchY = null;
}

// Start the 3D rendering
animate();
