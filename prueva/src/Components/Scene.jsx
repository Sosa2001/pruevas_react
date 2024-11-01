import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ThreeDScene = () => {
  const mountRef = useRef(null);
  const [backgroundPath, setBackgroundPath] = useState('sunset'); // Fondo inicial

  useEffect(() => {
    const currentMount = mountRef.current;

    // Configuración del renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // Crear la escena
    const scene = new THREE.Scene();

    // Función para cargar el fondo según el backgroundPath
    const loadBackground = (path) => {
      scene.background = new THREE.CubeTextureLoader()
        .setPath(`../../public/${path}/`)
        .load([
          'ft.jpg', 'bk.jpg', 'up.jpg',
          'dn.jpg', 'rt.jpg', 'lf.jpg'
        ]);
    };

    // Cargar el fondo inicial
    loadBackground(backgroundPath);

    // Configuración de luces
    const light = new THREE.DirectionalLight();
    light.intensity = 2;
    light.position.set(2, 5, 10);
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));

    // Configuración de cámara y controles
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    const initialPosition = new THREE.Vector3(-5, 5, 25);
    const bounds = {
      x: { min: -100, max: 100 },
      y: { min: -100, max: 100 },
      z: { min: -100, max: 100 },
    };

    camera.position.copy(initialPosition);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(-1, 2, 0);
    controls.update();

    // Crear objetos y piso
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
      mesh.layers.set(layer); // Capa inicial
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

    // Función para detectar clics en objetos
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
        selectedObject.layers.set(1); // Mover objeto a una capa invisible para la cámara
      }
    };

    document.addEventListener('mousedown', onMouseDown);

    // Función para ajustar la ventana al redimensionar
    const onWindowResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onWindowResize);

    // Bucle de renderizado
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Verificar si la cámara está fuera de los límites
      if (
        camera.position.x < bounds.x.min || camera.position.x > bounds.x.max ||
        camera.position.y < bounds.y.min || camera.position.y > bounds.y.max ||
        camera.position.z < bounds.z.min || camera.position.z > bounds.z.max
      ) {
        camera.position.copy(initialPosition);
        console.log("Camera position reset to initial state.");
      }

      renderer.render(scene, camera);
    };
    
    animate();

    // Limpieza al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('resize', onWindowResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [backgroundPath]);

  // Cambiar el fondo cuando se selecciona un botón
  const changeBackground = (path) => {
    setBackgroundPath(path);
  };

  return (
    <div>
      <div ref={mountRef}></div>
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <button onClick={() => changeBackground('clouds1')}>Clouds1</button>
        <button onClick={() => changeBackground('daylight')}>Daylight</button>
        <button onClick={() => changeBackground('miramar')}>Miramar</button>
        <button onClick={() => changeBackground('nigth')}>Nigth</button>
        <button onClick={() => changeBackground('skybox1')}>Skybox1</button>
        <button onClick={() => changeBackground('skyhigh')}>Skyhigh</button>
        <button onClick={() => changeBackground('stormy')}>Stormy</button>
        <button onClick={() => changeBackground('sunset')}>Sunset</button>
      </div>
    </div>
  );
};

export default ThreeDScene;
