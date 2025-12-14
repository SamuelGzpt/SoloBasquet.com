import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function GlobalHalo() {
    const containerRef = useRef<HTMLDivElement>(null);
    // Más nodos = línea más suave, menos "puntos"
    const TRAIL_LENGTH = 50;
    const nodesRef = useRef<HTMLDivElement[]>([]);

    const mouse = useRef({ x: 0, y: 0 });
    const positions = useRef(Array(TRAIL_LENGTH).fill({ x: 0, y: 0 }));

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    // Lógica eficiente de visibilidad y bucle
    useGSAP(() => {
        const nodes = nodesRef.current;
        gsap.set(nodes, { autoAlpha: 0 });

        // Definir el bucle de física
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

        // ScrollTrigger controla la visibilidad Y el bucle de física
        ScrollTrigger.create({
            trigger: "#cta",
            start: "top 95%", // Empezar justo antes de entrar (evitar carga en Features)
            end: "bottom top",
            onEnter: () => {
                gsap.to(nodes, { autoAlpha: 1, duration: 0.5, overwrite: true });
                gsap.ticker.add(loop); // Iniciar física solo cuando es visible
            },
            onLeave: () => {
                gsap.to(nodes, { autoAlpha: 0, duration: 0.5, overwrite: true });
                gsap.ticker.remove(loop); // Detener física
            },
            onEnterBack: () => {
                gsap.to(nodes, { autoAlpha: 1, duration: 0.5, overwrite: true });
                gsap.ticker.add(loop);
            },
            onLeaveBack: () => {
                gsap.to(nodes, { autoAlpha: 0, duration: 0.5, overwrite: true });
                gsap.ticker.remove(loop);
            }
        });

        return () => gsap.ticker.remove(loop); // Limpieza de seguridad
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="fixed inset-0 z-[60] pointer-events-none overflow-hidden mix-blend-screen">
            {Array.from({ length: TRAIL_LENGTH }).map((_, i) => {
                // Lógica de Gradiente Naranja
                // Cabeza (0): Blanco/Amarillo (Caliente)
                // Medio: Naranja brillante
                // Cola: Rojo/Desvanecimiento

                let backgroundColor = "rgba(234, 88, 12, 0.5)"; // Naranja-600 por defecto
                if (i < 5) backgroundColor = "rgba(255, 255, 200, 0.9)"; // Cabeza Blanco/Amarillo
                else if (i < 20) backgroundColor = "rgba(255, 140, 0, 0.6)"; // Naranja
                else backgroundColor = "rgba(220, 38, 38, 0.4)"; // Rojo desvanecido

                // Tamaño: Efecto puff
                let size = 25;
                if (i < 15) size = 20 + (i * 2); // Expandir a 50px
                else size = 50 - ((i - 15) * 1); // Encoger lentamente

                // Desenfoque fuerte para fusionar puntos -> Humo
                const blur = 20 + (i * 0.5);

                // Gradiente de Opacidad
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
                            filter: `blur(${blur}px)`, // La clave para el "humo"
                        }}
                    />
                );
            })}
        </div>
    );
}
