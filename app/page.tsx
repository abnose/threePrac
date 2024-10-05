"use client";
import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default function Home() {
  useEffect(() => {
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.zoomSpeed = 2;
    camera.position.set(5, 5, 5);

    // Ground plane (at the origin)
    const planeGeo = new THREE.PlaneGeometry(10, 10); // Ground size
    const mat1 = new THREE.MeshStandardMaterial({
      color: 0x727272, // Gray ground
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(planeGeo, mat1);
    ground.rotation.x = -0.5 * Math.PI;
    ground.position.set(0, -2.1, 1);
    scene.add(ground);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-2, 10, 0);
    scene.add(dirLight);

    // Load the wood texture for the table
    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load(
      "/assets/Wood_Color.jpg",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4); // Adjust the scale of the texture
      }
    );

    // Load the handle texture
    const handleTexture = textureLoader.load(
      "/assets/Handle_Texture.jpg",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1); // Adjust the scale of the handle texture
      }
    );

    // Load the table model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
    );

    const modelLoader = new GLTFLoader();
    modelLoader.setDRACOLoader(dracoLoader);
    modelLoader.load("/assets/TABLE.glb", (data) => {
      const model = data.scene;
      // Apply a wood material to the table
      const woodMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });

      model.traverse((object) => {
        if (object.isMesh) {
          console.log(object);
          object.material = woodMaterial;

          if (object.name.toLowerCase().includes("wall")) {
            object.visible = false;
          }
          if (object.name.toLowerCase().includes("flore")) {
            object.visible = false;
          }
        }
      });

      const scaleFactor = 3;
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);
      model.rotation.set(Math.PI / 2, 0, 0);
      model.position.set(1, 2.5, 0);
      ground.add(model);
    });

    const gamingChair = new GLTFLoader();
    gamingChair.setDRACOLoader(dracoLoader);
    gamingChair.load("/assets/gamer table.glb", (data) => {
      const model = data.scene;

      // Apply a brown material to the gaming chair
      const brownMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

      model.traverse((object) => {
        if (object.isMesh) {
          object.material = brownMaterial;
        }
      });

      const scaleFactor = 2.5;
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);
      model.rotation.set(Math.PI / 2, 4, 0);
      model.position.set(1, -1.5, 0);
      ground.add(model);
    });

    // Helper function to create axis helpers
    function createAxisHelper(length) {
      const axesHelper = new THREE.AxesHelper(length);
      scene.add(axesHelper);
    }

    // Create the axes helper to visualize the coordinate system
    createAxisHelper(5); // Length of 5 units

    function animate() {
      requestAnimationFrame(animate);
      controls.update(); // Apply damping (if enabled) and other control changes
      renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    // Cleanup
    return () => {
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return <div className=""></div>;
}
