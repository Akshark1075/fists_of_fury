import * as THREE from "three";
import { OrbitControls } from "../../libs/OrbitControls.js";
import { VRButton } from "../../libs/VRButton.js";
import { loadModel, updateDelta } from "../js/model.js";
import showStatistics from "../js/statistics";
import {
  successToast,
  errorToast,
  successfulPurchaseToast,
} from "../js/toast.js";
import createGUI from "../js/gui";
import shaders from "./shaders.js";

//Raycaster and mouse for detecting clicks and mouse over
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let aspectRatio = window.innerWidth / window.innerHeight;
let scene, camera, renderer, controls, clock;
//Creating video element and videoTexture
const video = document.createElement("video");
video.src = "../assets/videos/undertaker.mp4";
video.loop = true;
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
//Loading manager for gltf and texture loader
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = function () {
  successToast.showToast();
};
loadingManager.onProgress = function () {};
loadingManager.onError = function () {
  errorToast.showToast();
};
const container = document.getElementById("container");
let isDisplayingText = false;
const bookedSeats = [];

/************Function for creating camera and orbit controls************/
function createCamera() {
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  camera.position.z = 0;
  camera.position.y = 5;
  camera.position.x = 8;

  controls = new OrbitControls(camera, renderer.domElement);

  const minDistance = 5; // Minimum distance from the camera to the target
  const maxDistance = 15; // Maximum distance from the camera to the target
  document.addEventListener("wheel", function (event) {
    // Calculate the current distance from the camera to the target
    const distance = camera.position.distanceTo(controls.target);

    // Adjust the zoom level based on the wheel delta
    const zoomDelta = event.deltaY * 0.1;
    const newDistance = distance - zoomDelta;

    // Clamp the new distance within the specified bounds
    const clampedDistance = Math.max(
      minDistance,
      Math.min(maxDistance, newDistance)
    );

    // Calculate the ratio between the new and current distances
    const ratio = clampedDistance / distance;

    // Adjust the camera position to zoom while keeping the target fixed
    camera.position
      .sub(controls.target)
      .multiplyScalar(ratio)
      .add(controls.target);

    // Update the controls to reflect the new camera position
    controls.update();
  });
}

/************Function for creating a clock************/
function createClock() {
  clock = new THREE.Clock();
}

/************Function for creating scene************/
function createScene() {
  scene = new THREE.Scene();
}

/************Function for creating geometry and assigning textures************/
async function createGeometry() {
  const textureLoader = new THREE.TextureLoader();

  //Creating a sphere and assigning texture
  const backgroundTexture = textureLoader.load(
    "../assets/images/textures/sky.jpeg"
  );
  const backgroundMaterial = new THREE.MeshBasicMaterial({
    map: backgroundTexture,
  });
  const backgroundGeometry = new THREE.SphereGeometry(20, 20, 20);
  backgroundGeometry.scale(-1, 1, 1);
  const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  backgroundMesh.position.y = 15;
  backgroundMesh.scale.x = -1;
  backgroundMesh.rotation.y += Math.PI;
  scene.add(backgroundMesh);

  //Load Gltf Models
  await loadModel(scene, loadingManager, renderer);

  //Creating video and ground plane
  const planeGeometry = new THREE.PlaneGeometry(2.4, 2);
  const groundPlaneGeometry = new THREE.PlaneGeometry(30, 30);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  }); // Adjust properties as needed

  // Create a mesh by combining the geometry and material
  const planeMesh = new THREE.Mesh(planeGeometry, material);

  planeMesh.position.x = -2.45;
  planeMesh.position.y = 1;
  planeMesh.position.z = 0;
  planeMesh.rotation.y = Math.PI / 2;
  scene.add(planeMesh);
  const groundPlaneMesh = new THREE.Mesh(groundPlaneGeometry, material);
  groundPlaneMesh.position.x = 0;
  groundPlaneMesh.position.y = 0;
  groundPlaneMesh.position.z = 0;
  groundPlaneMesh.rotation.x = Math.PI / 2;
  // Add the plane mesh to the scene
  scene.add(groundPlaneMesh);
  planeMesh.material.map = videoTexture;
  //Creating cube for positional audio
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({ color: 0xf0f099, wireframe: true })
  );
  cube.visible = false;
  cube.name = "posAudioHelper";
  scene.add(cube);
}

/************Function for creating lights************/
function createLight() {
  //Ambient Light
  const ambientLight = new THREE.AmbientLight(0x404040); // Soft white ambient light
  scene.add(ambientLight);
  //Directional Light
  const directionalLight = new THREE.DirectionalLight(0xffffff); // White directional light with intensity
  directionalLight.position.set(0, 10, 0);
  scene.add(directionalLight);
  //scene.add(new THREE.DirectionalLightHelper(directionalLight));
  directionalLight.target = scene.getObjectByName("Armature001");

  //Spotlights
  const spotLight1 = new THREE.SpotLight(0xffffff, 4);
  spotLight1.position.set(-1, 2, 0);
  // scene.add(new THREE.SpotLightHelper(spotLight1));
  spotLight1.target = scene.getObjectByName("Armature");
  scene.add(spotLight1);

  const spotLight2 = new THREE.SpotLight(0xffffff, 4);
  spotLight2.position.set(-1, 2, 0);
  // scene.add(new THREE.SpotLightHelper(spotLight2));
  spotLight2.target = scene.getObjectByName("Armature001");
  scene.add(spotLight2);

  const spotLight3 = new THREE.SpotLight(0xffffff, 2);
  spotLight3.position.set(0, 2, 2);
  //  scene.add(new THREE.SpotLightHelper(spotLight3));
  spotLight3.target = scene.getObjectByName("Screen_1");
  scene.add(spotLight3);

  const spotLight4 = new THREE.SpotLight(0xffffff, 2);
  spotLight4.position.set(0, 2, -2);
  //scene.add(new THREE.SpotLightHelper(spotLight4));
  spotLight4.target = scene.getObjectByName("Screen_3");
  scene.add(spotLight4);

  const spotLight5 = new THREE.SpotLight(0xff000d, 22);
  spotLight5.position.set(6.5, 2, 0);
  // scene.add(new THREE.SpotLightHelper(spotLight5));

  scene.add(spotLight5);

  const spotLight6 = new THREE.SpotLight(0xaaa9ff, 20);
  spotLight6.position.set(3, 2, -2);
  // scene.add(new THREE.SpotLightHelper(spotLight6));
  spotLight6.target = scene.getObjectByName("Armature");
  scene.add(spotLight6);

  const spotLight7 = new THREE.SpotLight(0xaaa9ff, 20);
  spotLight7.position.set(3, 2, 2);
  // scene.add(new THREE.SpotLightHelper(spotLight7));
  spotLight7.target = scene.getObjectByName("Armature");
  scene.add(spotLight7);
}

/************Function for creating renderer************/
function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1.0);
  console.log(renderer.info);
  renderer.xr.enabled = true;
}

/************Helper function for detecting mouse move************/
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const highlightedBenches = scene.children[1].children[0].children.filter(
    (model) =>
      model.name.includes("bench") &&
      model.material.hasOwnProperty("uniforms") &&
      model.material.uniforms.customColor.value.r == 1 &&
      model.material.uniforms.customColor.value.g == 1 &&
      model.material.uniforms.customColor.value.b == 1
  );
  var intersects = raycaster.intersectObjects(highlightedBenches, true);
  const textElement = document.createElement("h1");
  if (intersects.length > 0) {
    //Display Seat info is user hovers over the seat
    if (!isDisplayingText) {
      textElement.style.position = "absolute";
      textElement.style.top = "50%";
      textElement.style.left = "50%";
      textElement.style.transform = "translate(-50%, -50%)";
      textElement.style.color = "white";
      textElement.style.textAlign = "center";
      textElement.style.textShadow = "4px 4px 4px rgba(0, 0, 0, 0.5)";
      textElement.style.fontSize = "28px";
      textElement.style.lineHeight = "1.5";
      textElement.innerHTML = `
        <span style="font-size: 28px;">Click to sit in this chair and buy</span><br>
        <span style="font-size: 52px;">Seat AK11</span><br>
        <span>Price 500$</span>
      `;
      document.body.appendChild(textElement);
      isDisplayingText = true;
    }
  } else {
    //Hide seat info
    setTimeout(() => {
      const h1 = document.getElementsByTagName("h1")[0];
      if (h1) {
        h1.remove();
        isDisplayingText = false;
      }
    }, 500);
  }
}

/************Helper function for detecting click on highlighted bench************/
function onClick(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  console.log(
    scene.children[1].children[0].children.filter((model) =>
      model.name.includes("bench")
    )
  );
  const highlightedBenches = scene.children[1].children[0].children.filter(
    (model) =>
      model.name.includes("bench") &&
      model.material.hasOwnProperty("uniforms") &&
      model.material.uniforms.customColor.value.r == 1 &&
      model.material.uniforms.customColor.value.g == 1 &&
      model.material.uniforms.customColor.value.b == 1
  );
  var intersects = raycaster.intersectObjects(highlightedBenches, true);

  if (intersects.length > 0) {
    const p = intersects[0].point;
    new TWEEN.Tween(camera.position)
      .to(
        {
          x: p.x,
          y: p.y + 0.5,
          z: p.z,
        },
        2000
      )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        toggleModal();
      })
      .start();
  }
}
//Opens modal for booking the seat
const toggleModal = () => document.body.classList.toggle("open-modal");
const buyTicket = () => {
  toggleModal();
  successfulPurchaseToast.showToast();
  const highlightedBench = scene.children[1].children[0].children.filter(
    (model) =>
      model.name.includes("bench") &&
      model.material.hasOwnProperty("uniforms") &&
      model.material.uniforms.customColor.value.r == 1 &&
      model.material.uniforms.customColor.value.g == 1 &&
      model.material.uniforms.customColor.value.b == 1
  )[0];
  //Indicating booked seat
  const seatBookedMaterial = new THREE.ShaderMaterial({
    uniforms: {
      customColor: { value: new THREE.Color(0x257c00) },
    },

    vertexShader: shaders[0].vertexShader,
    fragmentShader: shaders[0].fragmentShader,
  });
  highlightedBench.material = seatBookedMaterial;
  const benches = scene.children[1].children[0].children.filter((model) =>
    model.name.includes("bench")
  );

  const highlightMaterial = new THREE.ShaderMaterial({
    uniforms: {
      customColor: { value: new THREE.Color(0xffffff) },
    },

    vertexShader: shaders[0].vertexShader,
    fragmentShader: shaders[0].fragmentShader,
  });
  const bookedSeatNumber = Number(highlightedBench.name.split("_")[1]) - 1;
  bookedSeats.push(bookedSeatNumber);

  let random;
  do {
    random = Math.floor(Math.random() * benches.length);
    if (bookedSeats.length == benches.length - 4) break;
  } while (([5, 6, 7, 8] + bookedSeats).includes(random));
  console.log(benches[random]);
  benches[random].material = highlightMaterial;
};

/************Function for animating the scene************/
function animate() {
  const stats = showStatistics(container);

  renderer.setAnimationLoop(function () {
    stats.begin();
    renderer.render(scene, camera);
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      if (videoTexture) videoTexture.needsUpdate = true;
    }
    updateDelta(clock);
    controls.update();
    TWEEN.update();
    stats.end();
  });
}

/************Function for initialising the scene************/
async function init() {
  createClock();
  createRenderer();
  createCamera();
  createScene();
  await createGeometry();
  createLight();
  animate();

  createGUI(video, scene);
  document.body.appendChild(VRButton.createButton(renderer));
  //const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);
  renderer.domElement.addEventListener("mousemove", onMouseMove);
  renderer.domElement.addEventListener("click", onClick, false);
  document.querySelector("#buyBtn").addEventListener("click", buyTicket);
}

init();
