import { cn } from "@/lib/utils";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function DotBackground({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const backgroundX = useMotionValue(0);
  const backgroundY = useMotionValue(0);

  useAnimationFrame((t) => {
    const amplitude = 20;
    const frequency = 2000;

    const offsetX = Math.sin(t / frequency) * amplitude + mousePos.x / 30;
    const offsetY = Math.cos(t / frequency) * amplitude + mousePos.y / 30;

    backgroundX.set(offsetX);
    backgroundY.set(offsetY);
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setMousePos({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[100dvh] w-full items-center justify-center bg-black dark:bg-black overflow-hidden"
    >
      {/* Multicolored dot layers */}
      <motion.div
        style={{
          backgroundPosition: `${backgroundX.get()}px ${backgroundY.get()}px`,
        }}
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#ff6b6b_1px,transparent_1px),radial-gradient(#6bcf63_1px,transparent_1px),radial-gradient(#4d96ff_1px,transparent_1px)]",
          "opacity-60 dark:opacity-40"
        )}
      />

      {/* Radial mask pulsing */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black z-10"
      />

      <div className="relative z-20">{children}</div>
    </div>
  );
}
