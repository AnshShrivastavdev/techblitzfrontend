import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ScrollytellingCanvas3D({ scrollProgress = 0 }) {
  const mountRef = useRef(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010103, 0.035);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // 1. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00d4ff, 1.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const bluePointLight = new THREE.PointLight(0x2563eb, 2, 20);
    bluePointLight.position.set(-4, -2, 2);
    scene.add(bluePointLight);

    // 2. Starfield
    const starCount = 2400;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPositions[idx] = (Math.random() - 0.5) * 80;
      starPositions[idx + 1] = (Math.random() - 0.5) * 80;
      starPositions[idx + 2] = (Math.random() - 0.5) * 80;

      // Deep cyan/starlight tones
      const isCyan = Math.random() > 0.6;
      starColors[idx] = isCyan ? 0.35 : 0.9;
      starColors[idx + 1] = isCyan ? 0.85 : 0.95;
      starColors[idx + 2] = 1.0;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 3. Central Wireframe Celestial Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Outer Geodesic Wireframe Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(2.4, 3);
    const wireframeGeo = new THREE.WireframeGeometry(sphereGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      linewidth: 1,
    });
    const sphereWire = new THREE.LineSegments(wireframeGeo, wireframeMat);
    coreGroup.add(sphereWire);

    // Inner Solid Core with Fresnel glow feel
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x050c1e,
      roughness: 0.3,
      metalness: 0.9,
      wireframe: false,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerSphere);

    // 4. Concentric Orbital Rings
    const createRing = (radius, tiltX, tiltZ, color, opacity = 0.4) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(120);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      const ring = new THREE.Line(geom, mat);
      ring.rotation.x = tiltX;
      ring.rotation.z = tiltZ;
      return ring;
    };

    const ring1 = createRing(3.8, Math.PI / 3, 0.2, 0x38bdf8, 0.45);
    const ring2 = createRing(5.2, -Math.PI / 4, 0.4, 0x0284c7, 0.35);
    const ring3 = createRing(6.8, Math.PI / 2.5, -0.3, 0x2563eb, 0.25);
    coreGroup.add(ring1);
    coreGroup.add(ring2);
    coreGroup.add(ring3);

    // 5. 11 Domain Telemetry Beacons (Probes orbiting the core)
    const domainProbes = [];
    const probeGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const probeMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });

    for (let i = 0; i < 11; i++) {
      const probeMesh = new THREE.Mesh(probeGeo, probeMat);
      const orbitRadius = 3.6 + (i % 3) * 1.5;
      const baseAngle = (i / 11) * Math.PI * 2;
      const speed = 0.3 + (i % 4) * 0.15;
      const inclination = (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.2);

      domainProbes.push({
        mesh: probeMesh,
        orbitRadius,
        angle: baseAngle,
        speed,
        inclination,
      });
      coreGroup.add(probeMesh);
    }

    // 6. Mouse Parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 7. Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation & Camera Trajectory Loop
    let animationId;
    let clock = new THREE.Clock();

    const currentCam = { x: 0, y: 0, z: 14 };
    const currentLook = { x: 0, y: 0, z: 0 };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Subtle base rotation
      sphereWire.rotation.y += delta * 0.12;
      sphereWire.rotation.x += delta * 0.06;
      innerSphere.rotation.y -= delta * 0.08;

      ring1.rotation.y += delta * 0.1;
      ring2.rotation.y -= delta * 0.08;
      ring3.rotation.y += delta * 0.06;

      starField.rotation.y += delta * 0.02;

      // Update 11 Probes along orbital paths
      domainProbes.forEach((p) => {
        p.angle += delta * p.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.orbitRadius;
        p.mesh.position.z = Math.sin(p.angle) * p.orbitRadius;
        p.mesh.position.y = Math.sin(p.angle * 2) * p.inclination * 1.5;
      });

      // Camera Mission Trajectory based on scrollProgress (0 to 1)
      const p = Math.max(0, Math.min(1, scrollRef.current || 0));

      let targetCamX = 0;
      let targetCamY = 0;
      let targetCamZ = 14;
      let targetLookX = 0;
      let targetLookY = 0;
      let targetLookZ = 0;

      if (p < 0.25) {
        // Phase 1: Hero Launchpad (0 - 0.25)
        const t = p / 0.25;
        targetCamX = THREE.MathUtils.lerp(0, 3.5, t);
        targetCamY = THREE.MathUtils.lerp(0, 1.8, t);
        targetCamZ = THREE.MathUtils.lerp(14, 11, t);
        targetLookX = 0;
        targetLookY = 0;
      } else if (p < 0.55) {
        // Phase 2: Telemetry & Domains Array (0.25 - 0.55)
        const t = (p - 0.25) / 0.3;
        targetCamX = THREE.MathUtils.lerp(3.5, -5.5, t);
        targetCamY = THREE.MathUtils.lerp(1.8, 3.2, t);
        targetCamZ = THREE.MathUtils.lerp(11, 8.5, t);
        targetLookX = THREE.MathUtils.lerp(0, -0.8, t);
        targetLookY = THREE.MathUtils.lerp(0, 0.5, t);
      } else if (p < 0.8) {
        // Phase 3: Mission Archive & Classified Crew (0.55 - 0.8)
        const t = (p - 0.55) / 0.25;
        targetCamX = THREE.MathUtils.lerp(-5.5, 4.8, t);
        targetCamY = THREE.MathUtils.lerp(3.2, -2.5, t);
        targetCamZ = THREE.MathUtils.lerp(8.5, 11.5, t);
        targetLookX = THREE.MathUtils.lerp(-0.8, 0.4, t);
        targetLookY = THREE.MathUtils.lerp(0.5, -0.3, t);
      } else {
        // Phase 4: Re-entry Terminal & Footer (0.8 - 1.0)
        const t = (p - 0.8) / 0.2;
        targetCamX = THREE.MathUtils.lerp(4.8, 0, t);
        targetCamY = THREE.MathUtils.lerp(-2.5, 4.5, t);
        targetCamZ = THREE.MathUtils.lerp(11.5, 13, t);
        targetLookX = 0;
        targetLookY = THREE.MathUtils.lerp(-0.3, 0, t);
      }

      // Add Mouse Parallax
      targetCamX += mouse.x * 1.5;
      targetCamY += mouse.y * 1.2;

      // Smooth camera interpolation
      currentCam.x += (targetCamX - currentCam.x) * 0.08;
      currentCam.y += (targetCamY - currentCam.y) * 0.08;
      currentCam.z += (targetCamZ - currentCam.z) * 0.08;

      currentLook.x += (targetLookX - currentLook.x) * 0.08;
      currentLook.y += (targetLookY - currentLook.y) * 0.08;
      currentLook.z += (targetLookZ - currentLook.z) * 0.08;

      camera.position.set(currentCam.x, currentCam.y, currentCam.z);
      camera.lookAt(currentLook.x, currentLook.y, currentLook.z);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      probeGeo.dispose();
      probeMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}

export default ScrollytellingCanvas3D;
