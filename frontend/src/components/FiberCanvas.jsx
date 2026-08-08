import React, { useEffect, useRef } from 'react';

export const FiberCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const fibers = [];
        const fiberCount = 45;

        for (let i = 0; i < fiberCount; i++) {
            fibers.push({
                x1: Math.random() * canvas.width,
                y1: Math.random() * canvas.height,
                x2: Math.random() * canvas.width,
                y2: Math.random() * canvas.height,
                cp1x: Math.random() * canvas.width,
                cp1y: Math.random() * canvas.height,
                cp2x: Math.random() * canvas.width,
                cp2y: Math.random() * canvas.height,
                speed: Math.random() * 0.0008 + 0.0002,
                progress: Math.random(),
                width: Math.random() * 1.5 + 0.5,
                color: Math.random() > 0.3 ? 'rgba(0, 240, 255, ' : 'rgba(59, 130, 246, '
            });
        }

        let animId;
        const drawFibers = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            fibers.forEach(f => {
                f.progress += f.speed;
                if (f.progress > 1) f.progress = 0;

                ctx.beginPath();
                ctx.moveTo(f.x1, f.y1);
                ctx.bezierCurveTo(f.cp1x, f.cp1y, f.cp2x, f.cp2y, f.x2, f.y2);
                
                ctx.strokeStyle = f.color + '0.12)';
                ctx.lineWidth = f.width;
                ctx.stroke();

                const t = f.progress;
                const cx = Math.pow(1-t,3)*f.x1 + 3*Math.pow(1-t,2)*t*f.cp1x + 3*(1-t)*Math.pow(t,2)*f.cp2x + Math.pow(t,3)*f.x2;
                const cy = Math.pow(1-t,3)*f.y1 + 3*Math.pow(1-t,2)*t*f.cp1y + 3*(1-t)*Math.pow(t,2)*f.cp2y + Math.pow(t,3)*f.x2;

                ctx.beginPath();
                ctx.arc(cx, cy, f.width * 2, 0, Math.PI * 2);
                ctx.fillStyle = '#00f0ff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00f0ff';
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            animId = requestAnimationFrame(drawFibers);
        };
        drawFibers();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animId);
        };
    }, []);

    return <canvas id="fiberCanvas" ref={canvasRef}></canvas>;
};
