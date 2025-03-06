import { useEffect, useRef, useCallback } from "react";

export default function NeonLines() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    interface Line {
        x: number;
        speed: number;
        width: number;
    }

  // Resize the canvas on window resize
    const resizeCanvas = useCallback(() => {
        if (!canvasRef.current) return;
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return; // Ensure canvas exists
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return; // Ensure context exists

        resizeCanvas(); // Set initial size
        window.addEventListener("resize", resizeCanvas);

        const lines: Line[] = Array.from({ length: 10 }, () => ({
            x: Math.random() * canvas.width,
            speed: Math.random() * 3 + 2,
            width: Math.random() * 2 + 1,
          }));

    function drawLines() {
        if (!ctx || !canvasRef.current) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#00f0ff"; // Neon Blue
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;

        lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.x, canvas.height);
        ctx.lineTo(line.x, 0);
        ctx.stroke();
        line.x -= line.speed;
        if (line.x < 0) line.x = canvas.width;
    });

    requestAnimationFrame(drawLines);
    }

    drawLines();

    return () => {
        window.removeEventListener("resize", resizeCanvas);
    };
    }, [resizeCanvas]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
}
