import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star } from 'lucide-react';
import { SplitText } from './SplitText';
import videoBg from '../style/videos/otro.mp4';


gsap.registerPlugin(ScrollTrigger);

export function CallToAction() {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    // Animación de entrada
    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.from(".cta-content", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

    }, { scope: containerRef });

    // Hover del botón
    const onButtonHover = contextSafe(() => {
        gsap.to(".cta-button", { scale: 1.05, duration: 0.3 });
        gsap.to(".cta-arrow", { x: 5, duration: 0.3 });
    });

    return (
        <section
            ref={containerRef}
            id="cta"
            className="relative py-32 overflow-hidden group"
        >
            {/* Video de fondo */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src={videoBg} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/80 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />

                {/* Gradientes fluidos */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
            </div>



            {/* Sin contenedor de rastro local */}

            <div className="container relative z-20 mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex justify-center mb-6">
                        <div className="cta-content bg-orange-600/20 backdrop-blur-md p-3 rounded-full border border-orange-500/30">
                            <Star className="w-8 h-8 text-orange-500 fill-orange-500 animate-pulse" />
                        </div>
                    </div>

                    <h2 className="cta-content text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl notranslate">
                        <SplitText delay={0.1}>Únete a la</SplitText> <span className="text-orange-600 block md:inline"><SplitText delay={0.2}>Revolución</SplitText></span>
                    </h2>

                    <p className="cta-content text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                        No te pierdas ni un segundo de la acción.
                    </p>

                    <div className="cta-content pt-8">
                        <button
                            onClick={() => navigate('/register')}
                            className="cta-button group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-full text-white font-bold text-lg tracking-wider overflow-hidden shadow-[0_0_40px_rgba(234,88,12,0.6)] hover:shadow-[0_0_60px_rgba(234,88,12,0.8)] transition-shadow cursor-pointer"
                            onMouseEnter={onButtonHover}
                        >
                            <span className="relative z-10 flex items-center gap-3 notranslate">
                                REGISTRARTE
                                <ArrowRight className="cta-arrow w-6 h-6" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
