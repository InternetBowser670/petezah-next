"use client";

import { useEffect, useState } from "react";

const generateParticles = () => {
  return Array.from({ length: 50 }).map(() => ({
    left: `${Math.random() * 100}vw`,
    top: `${Math.random() * 100}vh`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${Math.random() * 15 + 5}s`,
  }));
};

export default function Particles() {
  const [particles, setParticles] = useState(generateParticles());
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
      const interval = setInterval(() => {
        setParticles(generateParticles());
      }, 15000);
  
      setMounted(true);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div >
        {mounted && (
          <>
            {particles.map((particle, index) => (
              <div
                key={index}
                className="particle absolute bg-white rounded-full opacity-50"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDelay: particle.animationDelay,
                  animationDuration: particle.animationDuration,
                }}
              ></div>
            ))}
          </>
        )}
      </div>
    );
}
