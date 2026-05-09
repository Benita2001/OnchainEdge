"use client";

import { useEffect, useState } from "react";

export function CursorGlow() {
  const [position, setPosition] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[9999] h-[400px] w-[400px] rounded-full"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
        transition: "left 0.1s ease, top 0.1s ease",
        background: "radial-gradient(circle, rgba(245,192,0,0.04) 0%, transparent 70%)",
      }}
    />
  );
}
