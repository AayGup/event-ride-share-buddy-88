
import { useEffect, useRef } from "react";
import { Car } from "lucide-react";

const HeroAnimation = () => {
  return (
    <div className="relative h-[300px] bg-gradient-primary overflow-hidden rounded-xl shadow-elevated">
      {/* Static L-membrane (simplified) */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 100 100"
        className="absolute left-1/2 top-8 -translate-x-1/2"
      >
        <defs>
          <linearGradient id="orange-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(24 93% 56%)" />
            <stop offset="100%" stopColor="hsl(16 85% 50%)" />
          </linearGradient>
        </defs>
        <path
          d="M10,90 C30,10 70,10 90,90 Z"
          fill="url(#orange-gradient)"
          stroke="hsl(var(--foreground))"
          strokeWidth="1"
        />
      </svg>

      {/* Static Car */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground">
        <Car className="w-10 h-10" />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-xl font-bold text-primary-foreground">Welcome to PoolUp!</h1>
        <p className="text-sm text-primary-foreground/80">Organize carpools with ease</p>
      </div>
    </div>
  );
};

export default HeroAnimation;
