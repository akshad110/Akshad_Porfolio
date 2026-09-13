"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Grid } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { Color } from "three";

function Scene() {
  const group = useRef<Group>(null);
  const accent = useMemo(() => new Color("#1985a1"), []);

  useFrame(({ pointer, clock }) => {
    if (!group.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    group.current.rotation.y = pointer.x * 0.18;
    group.current.rotation.x = -pointer.y * 0.08;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <>
      <color attach="background" args={["#0e0f0f"]} />
      <fog attach="fog" args={["#0e0f0f", 8, 18]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 2]} intensity={0.7} color="#d9dfe3" />
      <pointLight position={[-3, 2, 1]} intensity={1.1} color={accent} />
      <Grid
        args={[20, 20]}
        cellColor="#2d373e"
        sectionColor="#1985a1"
        fadeDistance={16}
        fadeStrength={1}
        cellSize={0.6}
        sectionSize={3}
        infiniteGrid
        position={[0, -1.6, 0]}
      />
      <group ref={group}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <Monitor />
        </Float>
        <mesh position={[2.2, 0.6, -1.8]} rotation={[0.4, 0.4, 0]}>
          <boxGeometry args={[0.9, 1.2, 0.08]} />
          <meshStandardMaterial color="#2b2c2e" metalness={0.4} roughness={0.35} />
        </mesh>
        <mesh position={[-2.4, -0.4, -1.2]}>
          <icosahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color="#4c5c68" metalness={0.5} roughness={0.2} emissive="#146a7f" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </>
  );
}

function Monitor() {
  const screen = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!screen.current) return;
    const material = screen.current.material as MeshStandardMaterial;
    material.emissiveIntensity = 0.25 + Math.sin(clock.elapsedTime * 1.4) * 0.08;
  });

  return (
    <group position={[0.8, 0.2, -1.4]}>
      <mesh>
        <boxGeometry args={[2.6, 1.6, 0.08]} />
        <meshStandardMaterial color="#1c1e1f" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh ref={screen} position={[0, 0, 0.05]}>
        <planeGeometry args={[2.3, 1.3]} />
        <meshStandardMaterial color="#0f1215" emissive="#1985a1" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0.4, 6], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
