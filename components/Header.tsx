import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { LanguageSelector } from './LanguageSelector';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, MessageSquare, LogIn, UserPlus } from 'lucide-react';

function LogoText({ isLoading }: { isLoading: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || isLoading) return;

        // Animate each character on load, no ScrollTrigger
        // Only runs after preloader finishes
        gsap.from(".logo-char", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "circ.out",
            delay: 0.3, // Small delay after preloader ends
        });
    }, { scope: containerRef, dependencies: [isLoading] });

    return (
        <div ref={containerRef} className="group-hover:scale-105 transition-transform duration-300 origin-left inline-block">
            {"SoloBasquet".split("").map((char, index) => (
                <span key={index} className="logo-char inline-block will-change-transform">
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </div>
    );
}

export function Header({ isLoading }: { isLoading: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!headerRef.current || !glowRef.current) return;

        const rect = headerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(glowRef.current, {
            x: x,
            y: y,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
    };

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Noticias", href: "/#noticias" },
        { name: "En Vivo", href: "/live" },
        { name: "Foro", href: "/forum" }
    ];

    return (
        <header
            ref={headerRef}
            onMouseMove={handleMouseMove}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out bg-black overflow-visible ${isScrolled
                ? 'py-3 shadow-2xl border-b border-white/10'
                : 'py-6 border-b border-transparent'
                }`}
        >
            {/* Contenedor Halo de Fondo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    ref={glowRef}
                    className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-80"
                    style={{
                        background: `radial-gradient(circle, 
                            rgba(255,255,255,0.6) 0%, 
                            rgba(234,88,12,0.4) 30%, 
                            rgba(147,51,234,0.2) 60%, 
                            transparent 70%)`,
                        transform: 'translate(-50%, -50%)',
                        mixBlendMode: 'screen',
                        filter: 'blur(25px)'
                    }}
                />
            </div>

            <div className="container relative z-10 mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link
                    to="/"
                    className="relative group notranslate"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        window.history.pushState({}, '', '/');
                    }}
                >
                    <h1 className="text-xl md:text-3xl font-black tracking-tighter text-white drop-shadow-md cursor-pointer overflow-visible">
                        <span className="sr-only">SoloBasquet</span>
                        <LogoText isLoading={isLoading} />
                    </h1>
                </Link>

                <nav>
                    <ul className="flex gap-4 md:gap-6 items-center">
                        {/* Enlaces de Navegación (Ocultos en móvil por ahora para evitar overflow) */}
                        <div className="hidden md:flex gap-6 items-center">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="relative group block px-2 py-1 overflow-hidden"
                                        onClick={(e) => {
                                            if (link.href.startsWith('/#') || link.href.startsWith('#')) {
                                                if (window.location.pathname === '/') {
                                                    e.preventDefault();
                                                    const id = link.href.split('#')[1];
                                                    const element = document.getElementById(id);
                                                    if (element) {
                                                        const y = element.getBoundingClientRect().top + window.scrollY - 100;
                                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <span className="relative z-10 text-sm md:text-base font-medium text-gray-400 transition-colors duration-300 group-hover:text-white tracking-wide notranslate">
                                            {link.name}
                                        </span>
                                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-600 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out" />
                                    </Link>
                                </li>
                            ))}
                        </div>

                        {/* Selector de Idioma */}
                        <li className="flex items-center">
                            <LanguageSelector />
                        </li>

                        {/* Menú de Autenticación */}
                        {isAuthenticated && user ? (
                            <li className="relative">
                                <div ref={dropdownRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-white hidden md:block">
                                            {user.username}
                                        </span>
                                    </button>

                                    {/* Menú Desplegable */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50">
                                            <div className="p-4 border-b border-white/10">
                                                <p className="text-white font-semibold">{user.username}</p>
                                                <p className="text-gray-400 text-sm">{user.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    to="/forum"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span>Foro</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Cerrar Sesión</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className="flex items-center justify-center relative group p-2.5 rounded-full border border-transparent overflow-hidden transition-all duration-300 hover:bg-white/5"
                                        title="Iniciar Sesión"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/0 via-orange-500/0 to-orange-400/0 group-hover:from-orange-600/20 group-hover:via-orange-500/40 group-hover:to-orange-400/20 transition-all duration-300" />
                                        <LogIn className="w-5 h-5 text-gray-300 group-hover:text-white relative z-10 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        className="flex items-center justify-center relative group p-2.5 rounded-full overflow-hidden bg-white/5 border border-white/10 transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                                        title="Registrarse"
                                    >
                                        {/* Gradiente Brillo Naranja */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-700 via-orange-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <UserPlus className="w-5 h-5 text-white relative z-10" />
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

/*************************************************
⠀⠀⠀⠀    ⣠⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣼⡟⠉⠉⠀⠀⠀⠀⢀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢿⣇⠀⠀⠀⠀⣠⣶⣿⠿⣿⣿⡿⣷⡀⠸⣿⣶⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠘⢿⣆⠀⣠⣾⣿⣿⣿⣶⣿⣿⣶⣿⠁⠀⣠⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢛⣁⣤⣴⣿⠟⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⡟⠉⠉⠀⠀⠈⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⠁⠀⠀⠀⠀⠀⢻⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣾⣿⠇⠀⠀⠀⠀⠀⠀⠀⢿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠹⢿⠁⡀⠀⠀⠀⠀⠀⠀⠸⣿⣶⡄


---------------------------------------------------
 signed by: Samuel Gaviria
*  A.K.A:     𝗪𝗘𝗧𝗧𝗢
**************************************************/
