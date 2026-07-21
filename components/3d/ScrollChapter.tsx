"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Preload } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useScroll, useTransform, motion } from "framer-motion";
import SceneSkeleton from "./SceneSkeleton";

export interface Beat {
  label: string;
  title: string;
  copy: string;
}

function Traveller({ progress }: { progress: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    const p = progress.current;
    if (ref.current) {
      ref.current.position.x = (p - 0.5) * 6;
      ref.current.position.y = Math.sin(p * Math.PI * 2) * 0.8;
      ref.current.rotation.z = p * Math.PI * 1.5;
    }
    if (knot.current) {
      knot.current.rotation.y += dt * 0.4;
      knot.current.rotation.x += dt * 0.2;
      const s = 0.7 + Math.abs(Math.sin(p * Math.PI)) * 0.6;
      knot.current.scale.setScalar(s);
    }
  });
  return (
    <group ref={ref}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={knot}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#f3ece1"
            roughness={0.5}
            flatShading
            emissive="#e8c07d"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function ScrollChapter({ beats }: { beats?: Beat[] }) {
  const BEATS = beats ?? [];
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [ready] = useState(() => typeof window !== "undefined");
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      progressRef.current = v;
    });
    return () => unsub();
  }, [scrollYProgress]);

  const titleOpacity = useTransform(scrollYProgress, [0, 0.06, 0.1], [0, 0, 1]);
  const endOpacity = useTransform(scrollYProgress, [0.92, 0.98, 1], [0, 0, 1]);

  return (
    <section ref={wrapRef} className="relative h-[320vh] bg-ivory">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          {ready ? (
            <Canvas
              frameloop="always"
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              shadows={false}
              camera={{ position: [0, 0, 8], fov: 45 }}
            >
              <ambientLight intensity={1.1} />
              <hemisphereLight args={["#ffffff", "#e8c07d", 0.8]} />
              <directionalLight position={[5, 5, 5]} intensity={1.3} color="#ffffff" />
              <directionalLight position={[-4, -2, 2]} intensity={0.7} color="#0d7377" />
              <pointLight position={[0, 0, 4]} intensity={0.6} color="#ff6b6b" />
              <Traveller progress={progressRef} />
              <EffectComposer>
                <Bloom intensity={0.3} luminanceThreshold={0.8} mipmapBlur />
              </EffectComposer>
              <Preload all />
            </Canvas>
          ) : (
            <SceneSkeleton label="Shaping the idea" />
          )}
        </div>

        <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
          <motion.p style={{ opacity: titleOpacity }} className="eyebrow mb-6">
            The Visionary — how the work travels
          </motion.p>
          <div className="relative h-[60vh]">
            {BEATS.map((b, i) => {
              const start = i / BEATS.length;
              const mid = start + 0.16;
              const end = start + 0.32;
              return (
                <BeatCard
                  key={b.label}
                  beat={b}
                  scrollYProgress={scrollYProgress}
                  start={start}
                  mid={mid}
                  end={end}
                />
              );
            })}
          </div>
          <motion.div style={{ opacity: endOpacity }} className="mt-8 max-w-md">
            <p className="font-display text-2xl text-ink">One idea, made unforgettable.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BeatCard({
  beat,
  scrollYProgress,
  start,
  mid,
  end,
}: {
  beat: Beat;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  mid: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, mid, end], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [start, mid], [40, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute left-0 top-1/2 max-w-md -translate-y-1/2"
    >
      <span className="font-display text-7xl text-coral/30">{beat.label}</span>
      <h3 className="mt-2 font-display text-4xl text-ink md:text-5xl">{beat.title}</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/70">{beat.copy}</p>
    </motion.div>
  );
}
