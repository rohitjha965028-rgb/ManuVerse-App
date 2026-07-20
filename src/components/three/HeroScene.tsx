"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ===============================
   Mouse-tracking state (shared)
   =============================== */
const mouseState = { x: 0, y: 0 };

/* ===============================
   Floating wireframe geometry
   =============================== */
function WireframeShape({
  geometry,
  position,
  color,
  scale = 1,
  rotationSpeed = 0.3,
  floatIntensity = 1,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  color: string;
  scale?: number;
  rotationSpeed?: number;
  floatIntensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * rotationSpeed * 0.4;
    meshRef.current.rotation.y += delta * rotationSpeed * 0.6;

    /* Parallax tilt toward mouse */
    const targetRotX =
      meshRef.current.rotation.x + mouseState.y * 0.0004 * delta * 60;
    const targetRotY =
      meshRef.current.rotation.y + mouseState.x * 0.0004 * delta * 60;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotX,
      0.02
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotY,
      0.02
    );
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={floatIntensity}
      floatingRange={[-0.3, 0.3]}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <primitive object={geometry} attach="geometry" />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
      </mesh>
    </Float>
  );
}

/* ===============================
   Glowing core sphere
   =============================== */
function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * 0.8) * 0.08;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <Float speed={1} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.06} />
      </mesh>
      {/* Inner brighter core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} />
      </mesh>
    </Float>
  );
}

/* ===============================
   Connection lines between nodes
   =============================== */
function ConnectionLines({
  points,
}: {
  points: [number, number, number][];
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];

    /* Connect nearby points */
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i][0] - points[j][0];
        const dy = points[i][1] - points[j][1];
        const dz = points[i][2] - points[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 4.5) {
          positions.push(...points[i], ...points[j]);
        }
      }
    }

    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geo;
  }, [points]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#00f0ff" transparent opacity={0.06} />
    </lineSegments>
  );
}

/* ===============================
   Ambient floating particles
   =============================== */
function AmbientParticles({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      siz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, siz];
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.015;
    ref.current.rotation.x = Math.sin(t * 0.01) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f0ff"
        size={0.03}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ===============================
   Camera rig for mouse parallax
   =============================== */
function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    /* Smoothly move camera based on mouse position */
    const targetX = mouseState.x * 0.3;
    const targetY = mouseState.y * 0.3;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ===============================
   Main Scene Composition
   =============================== */
function Scene() {
  /* Pre-create geometries for performance */
  const geometries = useMemo(
    () => ({
      icosahedron: new THREE.IcosahedronGeometry(1.2, 1),
      octahedron: new THREE.OctahedronGeometry(0.9, 0),
      dodecahedron: new THREE.DodecahedronGeometry(0.7, 0),
      tetrahedron: new THREE.TetrahedronGeometry(0.6, 0),
      torusKnot: new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8, 2, 3),
    }),
    []
  );

  const nodePositions: [number, number, number][] = useMemo(
    () => [
      [0, 0.3, 0],
      [-3.2, 1.5, -1],
      [3.5, -1.2, -0.8],
      [-2.5, -1.8, 0.5],
      [2.8, 1.8, -1.5],
    ],
    []
  );

  return (
    <>
      <CameraRig />

      {/* Ambient light only — wireframes use MeshBasicMaterial so light isn't needed,
          but a dim ambient helps if any standard materials are added later */}
      <ambientLight intensity={0.15} />

      {/* Central icosahedron — the hero piece */}
      <WireframeShape
        geometry={geometries.icosahedron}
        position={[0, 0.3, 0]}
        color="#00f0ff"
        scale={1.3}
        rotationSpeed={0.25}
        floatIntensity={0.8}
      />

      {/* Surrounding smaller geometries */}
      <WireframeShape
        geometry={geometries.octahedron}
        position={[-3.2, 1.5, -1]}
        color="#a855f7"
        scale={0.9}
        rotationSpeed={0.4}
        floatIntensity={1.2}
      />
      <WireframeShape
        geometry={geometries.dodecahedron}
        position={[3.5, -1.2, -0.8]}
        color="#00f0ff"
        scale={0.85}
        rotationSpeed={0.35}
        floatIntensity={1}
      />
      <WireframeShape
        geometry={geometries.tetrahedron}
        position={[-2.5, -1.8, 0.5]}
        color="#ec4899"
        scale={0.7}
        rotationSpeed={0.5}
        floatIntensity={1.4}
      />
      <WireframeShape
        geometry={geometries.torusKnot}
        position={[2.8, 1.8, -1.5]}
        color="#a855f7"
        scale={0.75}
        rotationSpeed={0.3}
        floatIntensity={1.1}
      />

      {/* Glowing central sphere */}
      <GlowingSphere />

      {/* Connection lines between nodes */}
      <ConnectionLines points={nodePositions} />

      {/* Ambient floating particles */}
      <AmbientParticles count={150} />
    </>
  );
}

/* ===============================
   Exported Canvas wrapper
   =============================== */
export default function HeroScene() {
  /* Track mouse globally so the canvas wrapper can stay pointer-events-none */
  const containerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      mouseState.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseState.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 pointer-events-none"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ pointerEvents: "none" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
