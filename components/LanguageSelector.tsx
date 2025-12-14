import React, { useState, useEffect } from 'react';
import { Languages, Check } from 'lucide-react';

export function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        // Leer cookie para establecer estado inicial
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };
        const googtrans = getCookie('googtrans');
        if (googtrans === '/auto/es') {
            setCurrentLang('es');
        } else {
            setCurrentLang('en');
        }
    }, []);

    const changeLanguage = (lang: string) => {
        // Establecer cookie para Google Translate
        document.cookie = `googtrans=/auto/${lang}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=/auto/${lang}; path=/`;

        setCurrentLang(lang);
        window.location.reload();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 border
                    ${isOpen
                        ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-orange-600 hover:border-orange-500 hover:text-white hover:shadow-[0_0_15px_rgba(234,88,12,0.4)]'
                    }
                `}
                aria-label="Change Language"
            >
                <Languages className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">{currentLang}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden z-[60]">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-white/10 transition-colors ${currentLang === 'en' ? 'text-orange-500 font-bold' : 'text-gray-300'}`}
                    >
                        English
                        {currentLang === 'en' && <Check className="w-3 h-3" />}
                    </button>
                    <button
                        onClick={() => changeLanguage('es')}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-white/10 transition-colors ${currentLang === 'es' ? 'text-orange-500 font-bold' : 'text-gray-300'}`}
                    >
                        Español
                        {currentLang === 'es' && <Check className="w-3 h-3" />}
                    </button>
                </div>
            )}

            {/* Superposición para cerrar al hacer clic fuera */}
            {isOpen && (
                <div className="fixed inset-0 z-[55]" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
}
