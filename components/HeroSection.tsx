import React, { useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from './SplitText';
import landingImg from '../style/images/landing.jpg';

function AnimatedBorderButton() {
    const buttonRef = useRef<HTMLAnchorElement>(null);

    // Animación hover por clases CSS
    // Mantenemos GSAP por si acaso
    // Cambiamos a CSS para consistencia

    useEffect(() => {
        // Limpieza si es necesaria
    }, []);

    return (
        <a
            ref={buttonRef}
            href="#noticias"
            className="mt-8 group relative inline-block p-[3px] overflow-hidden"
            style={{ borderRadius: '9999px' }}
        >
            {/* Borde Gradiente Rotatorio - Acelerado por GPU */}
            <div
                className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#ea580c_0%,#9333ea_25%,#ffffff_50%,#000000_75%,#ea580c_100%)] animate-spin-slow"
                style={{
                    borderRadius: '9999px',
                    // We need a large enough area to rotate without showing edges if it wasn't circular.
                    // But since it is a button pill, rotating a square gradient behind it works best.
                    width: '300%',
                    height: '300%',
                    left: '-100%',
                    top: '-100%',
                }}
            />

            {/* Contenido del Botón */}
            <div className="inner-button relative z-10 flex items-center justify-center rounded-full bg-black/95 backdrop-blur-md text-white border-none text-lg px-8 py-6 cursor-pointer font-semibold tracking-wide transition-colors duration-300 group-hover:bg-orange-600/20 group-hover:text-white">
                <span className="flex items-center gap-3">
                    Ver Noticias
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
            </div>
        </a>
    );
}

export function HeroSection({ isLoading }: { isLoading: boolean }) {
    const containerRef = useRef<HTMLElement>(null);
    useGSAP({ scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black group z-10"
        >
            {/* Imagen de Fondo Completa */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <img
                    src={landingImg}
                    alt="Basketball Court"
                    className="w-full h-full object-cover opacity-80"
                />
                {/* Capa Oscura */}
                <div className="absolute inset-0 bg-black/50 z-10" />
                {/* Gradiente de Transición Fluida */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-10" />
                {/* Desvanecimiento Inferior Extra */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
            </div>

            {/* Contenido Centrado */}
            <div className="container relative z-20 mx-auto px-4 flex flex-col items-center justify-center text-center space-y-8">
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-2xl overflow-visible notranslate">
                    <SplitText delay={0.1} stagger={0.04} x={0} y={80} start={!isLoading}>
                        SoloBasquet
                    </SplitText>
                </h1>

                <p className="max-w-2xl text-lg md:text-2xl text-gray-200 font-light tracking-wide drop-shadow-md px-4">
                    La casa del baloncesto moderno.
                </p>

                {/* Botón con Borde Gradiente Animado */}
                <AnimatedBorderButton />
            </div>
        </section>
    );
}
