import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Cambio en la ruta de importación

const ThreeDScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // Create the scene
    const scene = new THREE.Scene();

    // Setup lighting
    const light = new THREE.DirectionalLight();
    light.intensity = 2;
    light.position.set(2, 5, 10);
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));

    // Setup camera and controls
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(-5, 5, 25);
    camera.layers.enable(0); // Camera can see layer 0 only
    controls.target.set(-1, 2, 0);
    controls.update();

    // Create floor and objects
    const floorGeometry = new THREE.PlaneGeometry(25, 20);
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2);
    const material = new THREE.MeshLambertMaterial();

    const floorMesh = new THREE.Mesh(
      floorGeometry,
      new THREE.MeshLambertMaterial({ color: 0xfff000 })
    );
    floorMesh.rotation.x = -Math.PI / 2.0;
    floorMesh.name = 'Floor';
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    function createMesh(geometry, material, x, y, z, name, layer) {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.set(x, y, z);
      mesh.name = name;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.layers.set(layer); // Set initial layer
      return mesh;
    }

    const cylinders = new THREE.Group();
    cylinders.add(createMesh(cylinderGeometry, material, 3, 1, 0, 'Cylinder A', 0));
    cylinders.add(createMesh(cylinderGeometry, material, 4.2, 1, 0, 'Cylinder B', 0));
    cylinders.add(createMesh(cylinderGeometry, material, 3.6, 3, 0, 'Cylinder C', 0));
    scene.add(cylinders);

    const boxes = new THREE.Group();
    boxes.add(createMesh(boxGeometry, material, -1, 1, 0, 'Box A', 0));
    boxes.add(createMesh(boxGeometry, material, -4, 1, 0, 'Box B', 0));
    boxes.add(createMesh(boxGeometry, material, -2.5, 3, 0, 'Box C', 0));
    scene.add(boxes);

    const raycaster = new THREE.Raycaster();
    
    //important function that help me to know where is the mause
    const onMouseDown = (event) => {
      const coords = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
      );

      raycaster.setFromCamera(coords, camera);

      const intersections = raycaster.intersectObjects(scene.children, true);
      if (intersections.length > 0) {
        const selectedObject = intersections[0].object;
        console.log(`${selectedObject.name} was clicked!`);

        // Make the object "disappear" by moving it to layer 1
        selectedObject.layers.set(1); // Change to layer 1, which is invisible to the camera
      }
    };

    document.addEventListener('mousedown', onMouseDown);

    // Handle window resize
    const onWindowResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onWindowResize);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Clean up on component unmount
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('resize', onWindowResize); // Cleanup resize listener
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef}></div>;
};

export default ThreeDScene;
