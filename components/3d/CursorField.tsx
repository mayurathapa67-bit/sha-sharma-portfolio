"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const frag = /* glsl */ `
  uniform vec2 uMouse;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, uMouse);
    float ring = smoothstep(0.22, 0.0, abs(d - 0.12 - sin(uTime * 1.2) * 0.02));
    float core = smoothstep(0.16, 0.0, d) * 0.35;
    vec3 coral = vec3(1.0, 0.42, 0.42);
    vec3 teal = vec3(0.05, 0.45, 0.47);
    vec3 col = mix(coral, teal, vUv.y);
    float a = (ring * 0.5 + core);
    gl_FragColor = vec4(col, a * 0.5);
  }
`;

const vert = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Field() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { pointer, viewport } = useThree();
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  useFrame((state) => {
    if (!mat.current) return;
    target.current.x += (pointer.x * 0.5 + 0.5 - target.current.x) * 0.06;
    target.current.y += (pointer.y * 0.5 + 0.5 - target.current.y) * 0.06;
    mat.current.uniforms.uMouse.value.copy(target.current);
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        depthWrite={false}
        uniforms={{ uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uTime: { value: 0 } }}
      />
    </mesh>
  );
}

export default function CursorField() {
  const [ready] = useState(() => typeof window !== "undefined");
  if (!ready) return null;
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
      camera={{ position: [0, 0, 1] }}
    >
      <Field />
    </Canvas>
  );
}
