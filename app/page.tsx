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
      "/assets/Wood_Roughness.jpg",
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
    // Load the table model
    modelLoader.load("/assets/TABLE.glb", (data) => {
      const model = data.scene;

      // Apply a wood material to the table
      const woodMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
      const handleMaterial = new THREE.MeshStandardMaterial({
        map: handleTexture,
      });

      model.traverse((object) => {
        if (object.isMesh) {
          object.material = woodMaterial;
          if (object.name.toLowerCase().includes("hand")) {
            object.material = handleMaterial;
          }
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

      // Add the table to the scene
      ground.add(model);

      // ---- Add Paper on Table ----
      // Load the paper texture (your resume as an image)
    });

    const paperTexture = textureLoader.load("/assets/resume.png", (texture) => {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(1, 1); // Scale to fit the plane
    });

    // Create the material for the paper
    const paperMaterial = new THREE.MeshBasicMaterial({
      map: paperTexture,
    });

    // Create a plane geometry to represent the paper (A4 paper size)
    const paperGeo = new THREE.PlaneGeometry(0.5, 0.7);

    // Create the mesh for the paper
    const paper = new THREE.Mesh(paperGeo, paperMaterial);

    // Adjust the paper rotation to lie flat on the table
    paper.rotation.x = -0.5 * Math.PI; // Rotate to lie flat

    // Position the paper on top of the table (adjust height slightly above the table surface)
    paper.position.set(0.3, 0.115, 0); // Adjust y-position so it's just above the table surface

    // Add the paper to the table so it moves with the table
    scene.add(paper);

    const paperTexture1 = textureLoader.load(
      "/assets/resume.png",
      (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.repeat.set(1, 1); // Scale to fit the plane
      }
    );

    // Create the material for the paper
    const paperMaterial1 = new THREE.MeshBasicMaterial({
      map: paperTexture1,
    });

    // Create a plane geometry to represent the paper (A4 paper size)
    const paperGeo1 = new THREE.PlaneGeometry(0.5, 0.7);

    // Create the mesh for the second paper (page 2)
    const paper1 = new THREE.Mesh(paperGeo1, paperMaterial1);

    // Adjust the paper to lie flat on the table (along the x-axis)
    paper1.rotation.x = -0.5 * Math.PI; // Lie flat on the table

    // Rotate the paper around the z-axis (to rotate it on the table's surface)
    paper1.rotation.z = -0.5; // Adjust this value for different angles (45 degrees here)

    // Position the paper on top of the table (adjust height slightly above the table surface)
    paper1.position.set(0.53, 0.1156, 0); // Adjust y-position so it's just above the table surface

    // Add the second paper to the scene
    scene.add(paper1);

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

    const monitor = new GLTFLoader();
    monitor.setDRACOLoader(dracoLoader);
    monitor.load("/assets/monitor.glb", (data) => {
      const model = data.scene;

      // Apply a brown material to the gaming chair
      const brownMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b45,
      });

      model.traverse((object) => {
        if (object.isMesh) {
          object.material = brownMaterial;
        }
      });

      const scaleFactor = 4;
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);
      // model.rotation.set(Math.PI / 2, 4, 0);
      model.position.set(-1.7, -1.3, 2.3);
      model.rotation.y = -1.6;
      scene.add(model);
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
