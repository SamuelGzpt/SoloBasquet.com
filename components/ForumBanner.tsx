import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';


gsap.registerPlugin(ScrollTrigger);

export function ForumBanner() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const containerRef = useRef<HTMLElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    useGSAP(() => {
        if (!containerRef.current) return;

        // Efecto dominó "cayendo"
        gsap.from(".forum-item", {
            y: -100, // Caer desde arriba
            opacity: 0,
            duration: 1,
            stagger: 0.2, // Efecto dominó
            ease: "bounce.out", // Efecto de rebote al caer
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse" // Más suave que reset
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-16 relative overflow-hidden">
            {/* Fondo Unificado (Continuación del fluido) */}
            <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
                {/* Blobs que continúan la estética */}
                {/* Top blob matches Features bottom blob style */}
                <div className="absolute -top-[30%] left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-800/30 blur-[120px] mix-blend-screen" />
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[100px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[30%] w-[40%] h-[40%] rounded-full bg-blue-900/30 blur-[100px] mix-blend-screen" />

                {/* Brillos */}
                <div className="absolute top-[10%] right-[30%] w-[20%] h-[20%] rounded-full bg-white/5 blur-[60px] mix-blend-overlay" />

                {/* Ruido */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            </div>

            <div className="container mx-auto px-4 relative z-20">
                <div className="relative group">
                    {/* Animated gradient glow - menos intenso */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                    {/* Banner principal */}
                    <div className="relative bg-gradient-to-br from-orange-500/10 to-purple-500/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8 md:p-12 overflow-hidden">
                        {/* Patrón de fondo - más sutil */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 left-0 w-40 h-40 bg-orange-500 rounded-full filter blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-500 rounded-full filter blur-3xl"></div>
                        </div>

                        <div className="relative z-10 text-center">
                            {/* Icono */}
                            <div className="forum-item inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 mb-6 shadow-2xl shadow-orange-500/50 will-change-transform">
                                <MessageSquare className="w-10 h-10 text-white" />
                            </div>

                            {/* Título */}
                            <h2 className="forum-item text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                                Únete a la Discusión
                            </h2>

                            {/* Descripción */}
                            <p className="forum-item text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
                                Comparte tus predicciones, analiza jugadas y debate con otros fanáticos del baloncesto en nuestro foro comunitario
                            </p>

                            {/* Características */}
                            <div className="flex flex-wrap justify-center gap-6 mb-8">
                                <div className="forum-item flex items-center gap-2 text-white">
                                    <Users className="w-5 h-5 text-orange-400" />
                                    <span className="drop-shadow-md">Comunidad Activa</span>
                                </div>
                                <div className="forum-item flex items-center gap-2 text-white">
                                    <TrendingUp className="w-5 h-5 text-orange-400" />
                                    <span className="drop-shadow-md">Predicciones</span>
                                </div>
                                <div className="forum-item flex items-center gap-2 text-white">
                                    <MessageSquare className="w-5 h-5 text-orange-400" />
                                    <span className="drop-shadow-md">Debates en Vivo</span>
                                </div>
                            </div>

                            {/* Botón CTA */}
                            <div className="forum-item inline-block">
                                <button
                                    onClick={() => navigate(isAuthenticated ? '/forum' : '/register')}
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg font-bold rounded-xl shadow-2xl shadow-orange-500/50 hover:shadow-orange-600/60 transition duration-300 transform hover:scale-105"
                                >
                                    <MessageSquare className="w-6 h-6" />
                                    <span>{isAuthenticated ? 'Ir al Foro' : 'Regístrate y Participa'}</span>
                                    <span className="group-hover:translate-x-1 transition">→</span>
                                </button>
                            </div>

                            {isAuthenticated && (
                                <p className="forum-item mt-4 text-sm text-gray-300 drop-shadow-md">
                                    Ya tienes cuenta, ¡empieza a participar!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
