import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import bolaImg from '../style/images/bola.png';

const FACTS = [
    "Michael Jordan ganó 6 anillos con los Bulls.",
    "El aro está a 3.05 metros de altura.",
    "Wilt Chamberlain anotó 100 puntos en un solo partido.",
    "LeBron James es el máximo anotador de la historia.",
    "El baloncesto fue inventado por James Naismith en 1891.",
    "Un partido de la NBA dura 48 minutos.",
    "Stephen Curry tiene el récord de triples en una temporada.",
    "El balón oficial de la NBA es Wilson.",
    "Kobe Bryant anotó 81 puntos contra los Raptors.",
    "La línea de tres puntos se introdujo en 1979."
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const ballRef = useRef<HTMLDivElement>(null);
    const [fact, setFact] = useState("");

    useEffect(() => {
        setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: onComplete
                });
            }
        });

        // 1. ROTACIÓN (Balón girando)
        gsap.to(ballRef.current, {
            rotation: 360,
            duration: 1.5,
            repeat: -1,
            ease: "linear"
        });

        // 2. REBOTE
        gsap.fromTo(ballRef.current,
            { y: -400, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }
        );

        gsap.to(ballRef.current, {
            y: -60,
            duration: 0.5,
            ease: "power1.out",
            repeat: 5,
            yoyo: true,
            delay: 1
        });

        // Revelación de texto
        gsap.fromTo(textRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.5 }
        );

        tl.to({}, { duration: 3 });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">

            <div
                ref={ballRef}
                className="w-32 h-32 rounded-full relative overflow-hidden shadow-[0_0_60px_rgba(234,88,12,0.5)]"
            >
                {/* Usando la imagen importada */}
                <img
                    src={bolaImg}
                    alt="Balón de Baloncesto"
                    className="w-full h-full object-cover scale-[1.2]"
                />
            </div>

            {/* Hecho */}
            <div className="mt-16 h-16 flex items-center justify-center px-4 max-w-lg">
                <p ref={textRef} className="text-white/90 font-light text-xl md:text-2xl tracking-wide text-center italic drop-shadow-md">
                    "{fact}"
                </p>
            </div>

            <div className="absolute bottom-10 text-white/30 text-xs uppercase tracking-[0.3em] animate-pulse">
                Cargando...
            </div>
        </div>
    );
}
