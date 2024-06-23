import * as THREE from "three";
import { GLTFLoader } from "../../libs/GLTFLoader.js";
import { DRACOLoader } from "../../libs/DRACOLoader.js";
let mixer;
import shaders from "./shaders.js";
/*********Function for loading GLTF models and playing animation*********/
async function loadModel(scene, loadingManager, renderer) {
  // Instantiate a loader
  const loader = new GLTFLoader(loadingManager);
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("../../libs/draco/");
  loader.setDRACOLoader(dracoLoader);
  try {
    // Load a glTF resource
    const gltf = await loader.loadAsync(
      // resource URL
      "../assets/models/boxing_arena.gltf",
      function (xhr) {
        var item = document.querySelector(".progress");
        var iStr = ((xhr.loaded / xhr.total) * 100).toString();
        item.style.width = iStr + "%";
      }
    );
    // called when the resource is loaded

    document.querySelector(".loading").remove();
    document.querySelector(".progress_bar").remove();
    container.appendChild(renderer.domElement);
    scene.add(gltf.scene);
    //Play Animations
    mixer = new THREE.AnimationMixer(gltf.scene);

    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });

    //Adding vertex and fragment shaders to the models
    gltf.scene.children[0].scale.set(0.5, 0.5, 0.5);
    const benches = gltf.scene.children[0].children.filter((model) =>
      model.name.includes("bench")
    );
    //Phong reflection shader
    const reflectionShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: shaders[1].vertexShader,
      fragmentShader: shaders[1].fragmentShader,
    });
    gltf.scene.getObjectByName("Armature001").material =
      reflectionShaderMaterial;
    //Texture shader
    const textureShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: shaders[2].vertexShader,
      fragmentShader: shaders[2].fragmentShader,
    });
    gltf.scene.getObjectByName("Armature").material = textureShaderMaterial;
    //Basic color shader
    const highlightMaterial = new THREE.ShaderMaterial({
      uniforms: {
        customColor: { value: new THREE.Color(0xffffff) },
      },

      vertexShader: shaders[0].vertexShader,
      fragmentShader: shaders[0].fragmentShader,
    });

    //Allocating a random bench for selection
    let random = Math.floor(Math.random() * benches.length);
    random = [5, 6, 7, 8].includes(random) ? 0 : random;
    benches[random].material = highlightMaterial;
    gltf.scene.children[0].children.forEach((model) => {
      model.castShadow = true;
    });
  } catch (error) {
    console.log(error);
  }
}

/*********Function for updating the mixer clock*********/
function updateDelta(clock) {
  if (!!mixer) mixer.update(clock.getDelta());
}
export { loadModel, updateDelta };
