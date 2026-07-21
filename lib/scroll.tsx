'use client';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Lenis from 'lenis';

export interface ScrollState {
  scroll: number;
  progress: number;
}

export const ScrollContext = createContext<ScrollState>({
  scroll: 0,
  progress: 0,
});

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scroll, setScroll] = useState(0);
  const [progress, setProgress] = useState(0);
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    lenis.current = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onScroll = (e: { scroll: number }) => {
      setScroll(e.scroll);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? e.scroll / max : 0);
    };

    lenis.current.on('scroll', onScroll);

    let raf = 0;
    const loop = (t: number) => {
      lenis.current?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.current?.destroy();
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ scroll, progress }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollValue(): ScrollState {
  return useContext(ScrollContext);
}
