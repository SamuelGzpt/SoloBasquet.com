import React, { useRef } from 'react';
import videoBg from '../style/videos/otro.mp4';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FooterHalo } from './FooterHalo';

export function Footer() {
    const containerRef = useRef<HTMLElement>(null);
    useGSAP({ scope: containerRef });

    return (
        <footer
            ref={containerRef}
            className="relative w-full py-16 overflow-hidden border-t border-white/5 group bg-black"
        >
            {/* Video de fondo (Oscurecido) */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-20 blur-sm"
                >
                    <source src={videoBg} type="video/mp4" />
                </video>
                {/* Superposición casi negra */}
                <div className="absolute inset-0 bg-black/90 z-10" />

                {/* Desvanecimiento superior fluido */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
            </div>

            <FooterHalo />

            {/* Sin contenedor de rastro local */}

            <div className="container relative z-20 mx-auto px-4 text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 drop-shadow-lg">
                        SoloBasquet
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base max-w-2xl font-light">
                        La mejor cobertura del baloncesto mundial. NBA, Euroliga, ACB y más.
                    </p>
                    <div className="h-px w-24 bg-orange-600/50 my-4" />
                    <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">
                        &copy; 2025 Samuel Gaviria. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
