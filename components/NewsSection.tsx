import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchNews, NewsArticle } from '../lib/api';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import videoBg from '../style/videos/fondo.mp4';
import { SplitText } from './SplitText';

gsap.registerPlugin(ScrollTrigger);

export function NewsSection() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const containerRef = useRef<HTMLElement>(null);

    // Cargar Noticias
    useEffect(() => {
        const loadNews = async () => {
            try {
                const articles = await fetchNews();
                setNews(articles);
            } catch (err: any) {
                console.error("Error loading news in UI:", err);
                setError(err.message || 'Failed to load news');
            } finally {
                setLoading(false);
            }
        };
        loadNews();
    }, []);


    // Animación de entrada inicial
    useGSAP(() => {
        if (loading || news.length === 0 || !containerRef.current) return;

        gsap.from(".news-card", {
            y: 50,
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".news-grid",
                start: "top 90%",
            }
        });


    }, { scope: containerRef, dependencies: [loading, news] });

    // Animación flotante continua para cada tarjeta
    useGSAP(() => {
        if (loading || news.length === 0 || !containerRef.current) return;

        const cards = gsap.utils.toArray<HTMLElement>(".news-card");

        cards.forEach((card, index) => {
            gsap.to(card, {
                y: "+=8", // Reducido de 15px para evitar superposición
                duration: 2 + (index % 3) * 0.3,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: index * 0.1,
            });
        });

    }, { scope: containerRef, dependencies: [loading, news] });

    // Lógica de movimiento de tarjeta COMPLETA (Física Tic/Tac)
    const { contextSafe } = useGSAP({ scope: containerRef });

    const onMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        // Disable on touch devices or small screens
        if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024) return;

        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Rotación (Inclinación) - solo rotación, sin traslación para preservar la animación flotante
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        // Animar rotación y escala solamente (no tocar x/y para preservar flotación)
        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.02, // Reducido de 1.05 para evitar superposición
            transformPerspective: 1000,
            duration: 0.1,
            ease: "power1.out",
            overwrite: false // No sobrescribir la animación flotante
        });
    });

    const onMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;

        // Restablecer rotación, escala, borde y sombra (mantener animación flotante activa)
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
            overwrite: false // No sobrescribir la animación flotante
        });
    });

    const onMouseEnter = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        gsap.to(card, {
            borderColor: "rgba(234, 88, 12, 0.5)",
            boxShadow: "0 20px 60px rgba(234, 88, 12, 0.6), 0 0 40px rgba(234, 88, 12, 0.4)", // Brillo neón naranja
            duration: 0.3
        });
    });

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading news...</div>;
    if (error) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 p-4 text-center">
            <h2 className="text-2xl font-bold mb-2">Error Loading News</h2>
            <p className="max-w-md bg-red-900/20 p-4 rounded border border-red-500/50">{error}</p>
        </div>
    );
    if (!loading && news.length === 0) return <div className="min-h-screen bg-black flex items-center justify-center text-white">No news articles found.</div>;

    return (
        <section ref={containerRef} id="noticias" className="relative min-h-screen w-full bg-black text-white py-24 px-4 overflow-hidden z-10">

            {/* Video de fondo fijo con gradientes fluidos */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-50 absolute inset-0"
                >
                    <source src={videoBg} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/70 z-0" />

                {/* Gradientes fluidos - Esencial para la mezcla */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10" />
            </div>

            <div className="container mx-auto relative z-10 max-w-[1920px]">
                {/* Título con animación SplitText */}
                <div className="text-center mb-20 overflow-hidden">
                    <h3 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl flex justify-center gap-4 notranslate">
                        <SplitText delay={0.2}>ULTIMAS</SplitText>
                        <span className="text-orange-600">
                            <SplitText delay={0.4}>NOTICIAS</SplitText>
                        </span>
                    </h3>
                </div>

                {/* Cuadrícula 5x3 */}
                <div className="news-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 perspective-1000">
                    {news.map((article, index) => (
                        <Link
                            key={index}
                            to="/news/detail"
                            state={article}
                            className="block"
                        >
                            <div
                                className="news-card relative h-[420px] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-white/10 rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] will-change-transform touch-none"
                                onMouseMove={onMouseMove}
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Contenedor de imagen */}
                                <div className="relative h-[55%] overflow-hidden pointer-events-none">
                                    <img
                                        src={article.urlToImage || 'https://images.unsplash.com/photo-1546519638-68e109498ee3'}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Gradiente para mezclar imagen en tarjeta negra */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                </div>

                                {/* Contenido */}
                                <div className="card-content absolute inset-x-0 bottom-0 h-[45%] p-6 flex flex-col justify-start bg-transparent pointer-events-none">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge className="badge bg-orange-600 font-bold text-[10px] uppercase tracking-wider px-2 py-1 border-none text-white shadow-sm">
                                            {article.source.name}
                                        </Badge>
                                        <span className="text-[10px] text-gray-300 font-mono mt-1">
                                            {new Date(article.publishedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="text-white font-bold leading-tight line-clamp-3 mb-2 text-lg drop-shadow-md">
                                        {article.title}
                                    </h4>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
