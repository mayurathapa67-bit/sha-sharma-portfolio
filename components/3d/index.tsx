"use client";

import dynamic from "next/dynamic";
import SceneSkeleton from "./SceneSkeleton";

export const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <SceneSkeleton label="Composing words" />,
});

export const ScrollChapter = dynamic(() => import("./ScrollChapter"), {
  ssr: false,
  loading: () => <SceneSkeleton label="Shaping the idea" />,
});

export const LiquidImage = dynamic(() => import("./LiquidImage"), {
  ssr: false,
  loading: () => <SceneSkeleton label="Revealing" />,
});

export const KineticMarquee3D = dynamic(() => import("./KineticMarquee3D"), {
  ssr: false,
  loading: () => <SceneSkeleton label="Arranging kind words" />,
});

export const CursorField = dynamic(() => import("./CursorField"), {
  ssr: false,
  loading: () => null,
});
