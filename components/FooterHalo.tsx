import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function FooterHalo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const TRAIL_LENGTH = 20;
    const nodesRef = useRef<HTMLDivElement[]>([]);

    const mouse = useRef({ x: 0, y: 0 });
    const positions = useRef(Array(TRAIL_LENGTH).fill({ x: 0, y: 0 }));

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            // Obtener límites del contenedor para calcular posición relativa
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                mouse.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            }
        };

        // Escuchar en ventana para evitar pointer-events-none en el contenedor
        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    useGSAP(() => {
        // Inicializar posiciones
        positions.current = positions.current.map(() => ({ x: mouse.current.x, y: mouse.current.y }));

        const loop = () => {
            const LEAD_SPEED = 0.5;
            const TAIL_SPEED = 0.2;

            // Cabeza
            positions.current[0].x += (mouse.current.x - positions.current[0].x) * LEAD_SPEED;
            positions.current[0].y += (mouse.current.y - positions.current[0].y) * LEAD_SPEED;

            if (nodesRef.current[0]) {
                gsap.set(nodesRef.current[0], { x: positions.current[0].x, y: positions.current[0].y });
            }

            // Cola
            for (let i = 1; i < TRAIL_LENGTH; i++) {
                const prevNode = positions.current[i - 1];
                const currNode = positions.current[i];

                currNode.x += (prevNode.x - currNode.x) * TAIL_SPEED;
                currNode.y += (prevNode.y - currNode.y) * TAIL_SPEED;

                if (nodesRef.current[i]) {
                    gsap.set(nodesRef.current[i], { x: currNode.x, y: currNode.y });
                }
            }
        };

        // ScrollTrigger para el FooterHalo
        // Solo ejecutar cuando el footer (padre) es visible
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            gsap.registerPlugin(ScrollTrigger);

            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top bottom", // Cuando el top del halo entra por el bottom del viewport
                end: "bottom top",   // Cuando el bottom del halo sale por el top del viewport
                onEnter: () => gsap.ticker.add(loop),
                onLeave: () => gsap.ticker.remove(loop),
                onEnterBack: () => gsap.ticker.add(loop),
                onLeaveBack: () => gsap.ticker.remove(loop)
            });
        });

        return () => gsap.ticker.remove(loop);
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-30 pointer-events-none overflow-hidden mix-blend-screen"
        >
            {Array.from({ length: TRAIL_LENGTH }).map((_, i) => {
                let backgroundColor = "rgba(234, 88, 12, 0.5)";
                // Adjusted ranges for 20 particles
                if (i < 2) backgroundColor = "rgba(255, 255, 200, 0.9)";
                else if (i < 8) backgroundColor = "rgba(255, 140, 0, 0.6)";
                else backgroundColor = "rgba(220, 38, 38, 0.4)";

                let size = 25;
                // Adjusted sizing logic
                if (i < 6) size = 20 + (i * 3);
                else size = 50 - ((i - 6) * 2);

                const blur = 20 + (i * 1); // Increased blur multiplier slightly
                const opacity = 1 - (i / TRAIL_LENGTH);

                return (
                    <div
                        key={i}
                        ref={(el) => { if (el) nodesRef.current[i] = el; }}
                        className="absolute top-0 left-0 rounded-full will-change-transform"
                        style={{
                            backgroundColor,
                            width: `${size}px`,
                            height: `${size}px`,
                            opacity: opacity * 0.8,
                            transform: 'translate(-50%, -50%)',
                            filter: `blur(${blur}px)`,
                        }}
                    />
                );
            })}
        </div>
    );
}
