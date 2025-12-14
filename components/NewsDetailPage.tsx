import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { NewsArticle } from '../lib/api';
import { ArrowLeft, ExternalLink, Calendar, User } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function NewsDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const article = location.state as NewsArticle | undefined;

    const containerRef = useRef<HTMLDivElement>(null);
    const backButtonRef = useRef<HTMLButtonElement>(null);
    const articleRef = useRef<HTMLElement>(null);

    // Desplazarse arriba cuando se monta el componente
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    // Animaciones GSAP
    useGSAP(() => {
        if (!article || !containerRef.current) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Animar entrada del botón volver
        tl.from(backButtonRef.current, {
            x: -50,
            opacity: 0,
            duration: 0.6,
        });

        // Animar tarjeta del artículo
        tl.from(articleRef.current, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            scale: 0.95,
        }, '-=0.3');

        // Animación escalonada del contenido del artículo
        tl.from('.article-image', {
            scale: 1.2,
            opacity: 0,
            duration: 1,
        }, '-=0.6');

        tl.from('.article-badge', {
            scale: 0,
            opacity: 0,
            duration: 0.4,
        }, '-=0.5');

        tl.from('.article-title', {
            y: 30,
            opacity: 0,
            duration: 0.6,
        }, '-=0.3');

        tl.from('.article-meta', {
            y: 20,
            opacity: 0,
            duration: 0.5,
        }, '-=0.4');

        tl.from('.article-content', {
            y: 20,
            opacity: 0,
            duration: 0.5,
        }, '-=0.3');

        tl.from('.article-button', {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
        }, '-=0.2');

    }, { scope: containerRef, dependencies: [article] });

    // Animación hover del botón volver
    useGSAP(() => {
        if (!backButtonRef.current) return;

        const button = backButtonRef.current;

        const handleMouseEnter = () => {
            gsap.to(button, {
                backgroundColor: '#ea580c',
                color: '#ffffff',
                borderColor: '#ea580c',
                scale: 1.05,
                duration: 0.1,
                ease: 'power0.none',
                overwrite: 'auto',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                backgroundColor: 'transparent',
                color: 'currentColor',
                borderColor: 'currentColor',
                scale: 1,
                duration: 0.15,
                ease: 'power1.out',
                overwrite: 'auto',
            });
        };

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            button.removeEventListener('mouseenter', handleMouseEnter);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, { scope: containerRef, dependencies: [] });

    if (!article) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">No se encontro el articulo</h2>
                <p className="mb-8 text-muted-foreground">No se encontro el articulo que buscabas.</p>
                <Link to="/" className="inline-flex items-center text-primary hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Noticias
                </Link>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="container mx-auto px-4 py-8 max-w-4xl">
            <button
                ref={backButtonRef}
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold mb-8"
                style={{ backgroundColor: 'transparent' }}
            >
                <ArrowLeft className="h-5 w-5" />
                Volver
            </button>

            <article
                ref={articleRef}
                className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
                {article.urlToImage && (
                    <div className="aspect-video w-full relative overflow-hidden">
                        <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="article-image w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <span className="article-badge inline-block px-4 py-2 bg-orange-600 text-white text-sm font-bold rounded-full shadow-lg">
                                {article.source.name}
                            </span>
                        </div>
                    </div>
                )}

                <div className="p-6 md:p-12">
                    <h1 className="article-title text-3xl md:text-5xl font-black mb-6 leading-tight text-white">
                        {article.title}
                    </h1>

                    <div className="article-meta flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8 pb-8 border-b border-white/10">
                        {article.author && (
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{article.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(article.publishedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                    </div>

                    <div className="article-content space-y-6 mb-8">
                        <p className="text-xl text-gray-300 font-medium leading-relaxed">
                            {article.description}
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            {article.content ? article.content.split('[')[0] : 'No additional content available.'}
                        </p>
                    </div>

                    <div className="article-button flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-orange-600/50 hover:scale-105"
                        >
                            Leer Noticia Completa
                            <ExternalLink className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </article>
        </div>
    );
}
