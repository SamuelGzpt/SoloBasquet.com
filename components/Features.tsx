import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Zap, Globe, Trophy } from 'lucide-react';
import videoBg from '../style/videos/features.mp4';
import { SplitText } from './SplitText';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: <Zap className="w-12 h-12 text-orange-500 mb-4" />,
        title: "Cobertura Rápida",
        description: "Noticias al instante de las mejores ligas del mundo."
    },
    {
        icon: <Globe className="w-12 h-12 text-orange-500 mb-4" />,
        title: "Alcance Global",
        description: "Desde la NBA hasta la Euroliga y ligas locales."
    },
    {
        icon: <Shield className="w-12 h-12 text-orange-500 mb-4" />,
        title: "Análisis Experto",
        description: "Opiniones y estadísticas detalladas de cada partido."
    },
    {
        icon: <Trophy className="w-12 h-12 text-orange-500 mb-4" />,
        title: "Resultados en Vivo",
        description: "Sigue el marcador minuto a minuto."
    }
];

export function Features() {
    const containerRef = useRef<HTMLElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    // Animación de desplazamiento inicial
    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.from(".feature-card", {
            y: 80,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

    }, { scope: containerRef });

    // Lógica de inclinación 3D de tarjeta solamente (El Halo es Global ahora)
    const onCardMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -25;
        const rotateY = ((x - centerX) / centerX) * 25;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 0.9,
            transformPerspective: 1000,
            duration: 0.15,
            ease: "power2.out",
            overwrite: 'auto'
        });
    });

    const onCardMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)",
            overwrite: 'auto'
        });
    });

    return (
        <section
            ref={containerRef}
            id="features"
            className="relative py-24 px-4 overflow-hidden"
        >
            {/* Video de fondo */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rotate-180"
                >
                    <source src={videoBg} type="video/mp4" />
                </video>
                {/* Capa mate / vidrio esmerilado - opacidad reducida */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 z-10" />

                {/* Gradientes fluidos */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-white via-purple-200/80 to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-purple-300/30 via-purple-200/20 to-transparent z-20 pointer-events-none" />
            </div>

            {/* Sin contenedor .trail-blob local */}

            <div className="container relative z-20 mx-auto max-w-7xl pt-10">
                <div className="text-center mb-24">
                    <h2 className="text-5xl md:text-7xl font-black italic text-white mb-6 tracking-tighter drop-shadow-2xl flex flex-col md:flex-row justify-center items-center gap-3 notranslate">
                        <SplitText delay={0}>¿Por qué</SplitText>
                        <span className="text-orange-600">
                            <SplitText delay={0.2}>SoloBasquet?</SplitText>
                        </span>
                    </h2>
                </div>

                {/* Contenedor de cuadrícula */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 perspective-1000">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card relative group will-change-transform"
                            onMouseMove={onCardMouseMove}
                            onMouseLeave={onCardMouseLeave}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="h-full p-10 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] cursor-crosshair text-center transition-colors hover:bg-white/10 flex flex-col items-center">
                                <div className="inline-flex items-center justify-center p-5 bg-orange-600/20 rounded-2xl mb-6 shadow-inner group-hover:bg-orange-600/30 transition-all duration-300 group-hover:scale-110">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
