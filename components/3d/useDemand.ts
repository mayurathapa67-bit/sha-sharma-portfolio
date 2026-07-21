"use client";

import { useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";

/**
 * For canvases using frameloop="demand", call invalidate() whenever the scroll
 * position or pointer changes so the scene re-renders and stays in sync without
 * running the render loop continuously.
 */
export function useDemandInvalidate(onPointer = true) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const raf = () => {
      invalidate();
      requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    const handler = () => invalidate();
    if (onPointer) window.addEventListener("pointermove", handler);
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      if (onPointer) window.removeEventListener("pointermove", handler);
      window.removeEventListener("scroll", handler);
    };
  }, [invalidate, onPointer]);
}

export function useLerp(current: number, target: number, factor = 0.08): number {
  return current + (target - current) * factor;
}

export { useFrame };
