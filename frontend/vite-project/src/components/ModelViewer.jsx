import { useEffect, useRef, useState } from "react";
import { getModelUrl } from "../api";
import { Loader2, AlertTriangle } from "lucide-react";

export default function ModelViewer({ sessionId }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let renderer, scene, camera, controls, animationId;
    let resizeObserver;

    const init = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
        const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");

        if (!containerRef.current) return;

        // Cleanup previous
        containerRef.current.innerHTML = "";

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 10, 7.5);
        scene.add(dirLight);

        const backLight = new THREE.DirectionalLight(0x4c51bf, 1.0);
        backLight.position.set(-5, 0, -10);
        scene.add(backLight);

        // Load Model
        const url = getModelUrl(sessionId);
        const loader = new GLTFLoader();

        loader.load(
          url,
          (gltf) => {
            if (!containerRef.current) return;
            const model = gltf.scene;
            scene.add(model);

            // Center Model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 2.0; // Fit factor

            // Adjust model position to stick to center
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            // Move camera back
            camera.position.set(0, 0, cameraZ || 5);
            camera.lookAt(0, 0, 0);

            controls.target.set(0, 0, 0);
            controls.update();

            setLoading(false);
          },
          undefined,
          (err) => {
            console.error(err);
            setError("Failed to load 3D Model");
            setLoading(false);
          }
        );

        // Animation Loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        const handleResize = () => {
          if (!containerRef.current) return;
          const newWidth = containerRef.current.clientWidth;
          const newHeight = containerRef.current.clientHeight;

          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };

        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(containerRef.current);

      } catch (e) {
        console.error("Three.js Init Error", e);
        setError("Error initializing 3D Viewer");
        setLoading(false);
      }
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
      if (resizeObserver) resizeObserver.disconnect();
      if (renderer) renderer.dispose();
    };
  }, [sessionId]);

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-xl overflow-hidden shadow-inner bg-slate-800/20">
      <div ref={containerRef} className="w-full h-full absolute inset-0 z-0" />

      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
          <p className="text-white font-medium">Loading 3D Model...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
