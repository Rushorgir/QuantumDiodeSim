import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LabBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 16;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const particleCount = 900;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const x = (Math.random() - 0.5) * 42;
      const y = (Math.random() - 0.5) * 26;
      const z = (Math.random() - 0.5) * 28;
      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = z;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      color: new THREE.Color('#00d4ff'),
      size: 0.055,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    const ringGeometry = new THREE.TorusGeometry(4.8, 0.07, 12, 120);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: '#ffb800',
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = 1.2;
    ring.rotation.y = 0.3;
    scene.add(ring);

    const ringInnerGeometry = new THREE.TorusGeometry(3.25, 0.05, 12, 120);
    const ringInnerMaterial = new THREE.MeshBasicMaterial({
      color: '#00d4ff',
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const ringInner = new THREE.Mesh(ringInnerGeometry, ringInnerMaterial);
    ringInner.rotation.x = 0.85;
    ringInner.rotation.z = 0.4;
    scene.add(ringInner);

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      points.rotation.y = elapsed * 0.045;
      points.rotation.x = Math.sin(elapsed * 0.18) * 0.08;
      ring.rotation.z = elapsed * 0.11;
      ringInner.rotation.z = -elapsed * 0.085;
      camera.position.x = Math.sin(elapsed * 0.07) * 0.32;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      ringInnerGeometry.dispose();
      ringInnerMaterial.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-20 opacity-70" aria-hidden="true" />;
};

export default LabBackground;
