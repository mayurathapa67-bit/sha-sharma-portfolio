"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Preload } from "@react-three/drei";
import * as THREE from "three";
import { ScrollContext } from "@/lib/scroll";
import { useContext } from "react";
import SceneSkeleton from "./SceneSkeleton";

export interface Quote {
  text: string;
  author: string;
}

function Ring({ quotes }: { quotes: Quote[] }) {
  const group = useRef<THREE.Group>(null);
  const { progress } = useContext(ScrollContext);
  useFrame(() => {
    if (!group.current) return;
    const target = progress * Math.PI * 2;
    group.current.rotation.y += (target - group.current.rotation.y) * 0.06;
  });
  const radius = 4.2;
  return (
    <group ref={group}>
      {quotes.map((q, i) => {
        const angle = (i / quotes.length) * Math.PI * 2;
        return (
          <group
            key={i}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius,
            ]}
            rotation={[0, -angle, 0]}
          >
            <Text
              fontSize={0.42}
              maxWidth={3.4}
              anchorX="center"
              anchorY="middle"
              textAlign="center"
              color="#1a1a1a"
            >
              “{q.text}”
            </Text>
            <Text
              position={[0, -0.7, 0]}
              fontSize={0.22}
              anchorX="center"
              color="#0d7377"
            >
              — {q.author}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export default function KineticMarquee3D({ quotes }: { quotes: Quote[] }) {
  const [ready] = useState(() => typeof window !== "undefined");
  if (!ready) return <SceneSkeleton label="Arranging kind words" />;
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 9], fov: 45 }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 5, 4]} intensity={1} />
      <Ring quotes={quotes.length ? quotes : [{ text: "Words that stay.", author: "Esha" }]} />
      <Preload all />
    </Canvas>
  );
}
