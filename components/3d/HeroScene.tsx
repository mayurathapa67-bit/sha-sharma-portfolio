"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, ContactShadows, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { ScrollContext } from "@/lib/scroll";
import { useContext } from "react";
import SceneSkeleton from "./SceneSkeleton";

function KineticHeadline({ words }: { words: string[] }) {
  const group = useRef<THREE.Group>(null);
  const { progress } = useContext(ScrollContext);
  const mouse = useThree((s) => s.pointer);
  const target = useRef({ x: 0, y: 0, rot: 0 });

  useFrame(() => {
    if (!group.current) return;
    const p = progress;
    target.current.x = mouse.x * 0.4;
    target.current.y = mouse.y * 0.2;
    target.current.rot = p * Math.PI * 0.5 - mouse.x * 0.15;
    group.current.position.x += (target.current.x - group.current.position.x) * 0.06;
    group.current.position.y += (target.current.y + 0.3 - group.current.position.y) * 0.06;
    group.current.rotation.y += (target.current.rot - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (-mouse.y * 0.1 - group.current.rotation.x) * 0.06;
  });

  const lineGap = 1.5;
  return (
    <group ref={group}>
      {words.map((word, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <Text
            position={[0, (words.length - 1) / 2 - i * lineGap, 0]}
            fontSize={1.15}
            letterSpacing={0.04}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0}
            outlineBlur={0}
          >
            {word}
            <meshStandardMaterial
              color={i % 2 === 0 ? "#1a1a1a" : "#0d7377"}
              roughness={0.35}
              metalness={0.05}
            />
          </Text>
        </Float>
      ))}
    </group>
  );
}

function SculpturalForm() {
  const ref = useRef<THREE.Mesh>(null);
  const { progress } = useContext(ScrollContext);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.18;
    ref.current.rotation.x += dt * 0.05;
    const s = 1 + Math.sin(progress * Math.PI) * 0.12;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={[0, 0, -2.4]}>
      <torusKnotGeometry args={[1.15, 0.34, 220, 32]} />
      <meshStandardMaterial
        color="#f3ece1"
        roughness={0.55}
        metalness={0.1}
        emissive="#e8c07d"
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}

function CursorBlob() {
  const ref = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += (pointer.x * 3 - ref.current.position.x) * 0.05;
    ref.current.position.y += (pointer.y * 1.8 - ref.current.position.y) * 0.05;
  });
  return (
    <mesh ref={ref} position={[0, 0, 1.5]}>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshStandardMaterial
        color="#ff6b6b"
        roughness={0.2}
        metalness={0}
        transparent
        opacity={0.18}
      />
    </mesh>
  );
}

function Rig() {
  const { camera } = useThree();
  const { progress } = useContext(ScrollContext);
  useFrame(() => {
    const z = 7 - progress * 1.5;
    camera.position.z += (z - camera.position.z) * 0.05;
  });
  return null;
}

export default function HeroScene({ words }: { words: string[] }) {
  const [ready] = useState(() => typeof window !== "undefined");
  if (!ready) return <SceneSkeleton label="Composing words" />;

  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      shadows={false}
      camera={{ position: [0, 0, 7], fov: 42 }}
    >
      <color attach="background" args={["#faf7f2"]} />
      <ambientLight intensity={1} />
      <hemisphereLight args={["#ffffff", "#e8c07d", 0.9]} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -2, 2]} intensity={0.5} color="#0d7377" />
      <pointLight position={[3, -3, 3]} intensity={0.6} color="#ff6b6b" />

      <SculpturalForm />
      <KineticHeadline words={words} />
      <CursorBlob />

      <Rig />
      <ContactShadows
        position={[0, -2.6, 0]}
        opacity={0.18}
        scale={14}
        blur={2.6}
        far={4}
        color="#1a1a1a"
      />
      <EffectComposer>
        <Bloom intensity={0.35} luminanceThreshold={0.75} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.35} />
      </EffectComposer>
      <Preload all />
    </Canvas>
  );
}
