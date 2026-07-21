"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Preload } from "@react-three/drei";
import * as THREE from "three";
import SceneSkeleton from "./SceneSkeleton";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uHover;
  uniform float uReveal;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float wave = sin(uv.y * 12.0 + uTime * 1.5) * 0.012 * uHover;
    uv.x += wave;
    vec4 color = texture2D(uTex, uv);

    float edge = smoothstep(0.0, 0.6, uReveal);
    float clip = 1.0 - smoothstep(0.0, 1.0, (1.0 - vUv.y) * (1.0 - uReveal) + (1.0 - edge));
    float alpha = mix(0.0, 1.0, edge);

    float ripple = uHover * 0.12 * sin((vUv.x + vUv.y) * 18.0 - uTime * 2.0);
    color.rgb += ripple;

    gl_FragColor = vec4(color.rgb, alpha);
  }
`;

function Plane({
  src,
  hover,
  reveal,
}: {
  src: string;
  hover: React.MutableRefObject<number>;
  reveal: React.MutableRefObject<number>;
}) {
  const tex = useTexture(src);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  useFrame((state) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uHover.value += (hover.current - u.uHover.value) * 0.08;
    u.uReveal.value += (reveal.current - u.uReveal.value) * 0.08;
    u.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        uniforms={{
          uTex: { value: tex },
          uHover: { value: 0 },
          uReveal: { value: 0 },
          uTime: { value: 0 },
        }}
      />
    </mesh>
  );
}

export default function LiquidImage({
  src,
  alt = "",
  priority = false,
}: {
  src: string;
  alt?: string;
  priority?: boolean;
}) {
  const hover = useRef(0);
  const reveal = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  const [ready] = useState(() => typeof window !== "undefined");
  const [inView, setInView] = useState(priority);

  useEffect(() => {
    if (priority) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInView(true);
      return;
    }
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority]);

  useEffect(() => {
    if (inView) reveal.current = 1;
  }, [inView]);

  if (!ready) return <SceneSkeleton label="Revealing" />;

  return (
    <div
      ref={wrap}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink/5"
      onMouseEnter={() => (hover.current = 1)}
      onMouseLeave={() => (hover.current = 0)}
    >
      <span className="sr-only">{alt}</span>
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 1] }}
        style={{ background: "transparent" }}
      >
        <Plane src={src} hover={hover} reveal={reveal} />
        <Preload all />
      </Canvas>
    </div>
  );
}
