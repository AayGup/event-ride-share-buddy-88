import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onToggleMode: () => void;
  isSignUp: boolean;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const spacing = 30;
    const dotRadius = 2;
    const rows = Math.floor(height / spacing);
    const cols = Math.floor(width / spacing);

    const blue = { r: 23, g: 120, b: 181, a: 255 };
    const orange = { r: 229, g: 105, b: 56, a: 255 };

    const interpolateColor = (t: number) => {
      const r = Math.round(blue.r + t * (orange.r - blue.r));
      const g = Math.round(blue.g + t * (orange.g - blue.g));
      const b = Math.round(blue.b + t * (orange.b - blue.b));
      const a = Math.round(blue.a + t * (orange.a - blue.a));
      return `rgba(${r},${g},${b},${a / 255})`;
    };

    const drawDots = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const px = x * spacing;
          const py = y * spacing;

          const wave =
            Math.sin(x / 2 + time / 500) * Math.cos(y / 2 + time / 700);
          const offset = wave * 10;
          const t = (wave + 1) / 2;
          const color = interpolateColor(t);

          ctx.beginPath();
          ctx.arc(px, py + offset, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    };

    let frameId: number;
    const animate = (time: number) => {
      drawDots(time);
      frameId = requestAnimationFrame(animate);
    };

    animate(0);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(username.trim(), "internal-user");
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
      />
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            🚗 PoolUp!
          </CardTitle>
          <CardDescription>
            Enter your username to join the carpool coordination system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your unique username"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Enter PoolUp!"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
