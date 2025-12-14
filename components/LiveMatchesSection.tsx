import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveMatchesService, LiveMatch } from '../lib/LiveMatchesService';
import { Radio, Clock, Loader2, ArrowRight } from 'lucide-react';

export function LiveMatchesSection() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState<LiveMatch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        if (matches.length === 0) setLoading(true);
        try {
            const data = await LiveMatchesService.fetchLiveMatches();
            setMatches(data.slice(0, 4));
        } catch (error) {
            console.error("Error loading matches:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: LiveMatch['status']) => {
        switch (status) {
            case 'live':
                return 'bg-red-500';
            case 'upcoming':
                return 'bg-blue-500';
            case 'finished':
                return 'bg-gray-500';
        }
    };

    const getStatusLabel = (status: LiveMatch['status']) => {
        switch (status) {
            case 'live':
                return 'EN VIVO';
            case 'upcoming':
                return 'PRÓXIMO';
            case 'finished':
                return 'FINALIZADO';
        }
    };

    return (
        <section className="py-16 relative overflow-hidden bg-black">
            {/* Gradiente superior negro */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none z-10"></div>
            {/* Gradiente inferior negro */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-10"></div>

            <div className="container mx-auto px-4 relative z-20">
                {/* Encabezado Sección */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-2 flex items-center gap-3">
                            <Radio className="w-10 h-10 text-orange-500" />
                            Partidos en Vivo
                        </h2>
                        <p className="text-gray-400">Sigue los partidos NBA en tiempo real</p>
                    </div>
                    <button
                        onClick={() => navigate('/live')}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 text-white font-semibold rounded-lg transition group"
                    >
                        <span>Ver Todos</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                    </button>
                </div>

                {/* Cargando */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    </div>
                ) : (
                    /* Cuadrícula Partidos */
                    <div className="grid md:grid-cols-2 gap-6">
                        {matches.length === 0 ? (
                            <div className="col-span-2 text-center py-8 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-gray-400">No hay partidos en este momento</p>
                            </div>
                        ) : (
                            matches.map(match => (
                                <div key={match.id} className="relative group">
                                    {/* Efecto brillo partidos en vivo */}
                                    {match.status === 'live' && (
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition animate-pulse"></div>
                                    )}

                                    <div
                                        onClick={() => navigate('/live')}
                                        className="relative bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:border-orange-500/50 transition-all cursor-pointer hover:scale-[1.02] duration-300 will-change-transform"
                                    >
                                        {/* Insignia Estado */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(match.status)} text-white text-sm font-bold`}>
                                                {match.status === 'live' && <Radio className="w-4 h-4 animate-pulse" />}
                                                {getStatusLabel(match.status)}
                                            </div>
                                            {match.quarter && (
                                                <div className="text-white font-bold">{match.quarter}</div>
                                            )}
                                        </div>

                                        {/* Equipos */}
                                        <div className="space-y-4">
                                            {/* Equipo Local */}
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    {match.homeTeam.logo ? (
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full p-2 flex items-center justify-center flex-shrink-0">
                                                            <img
                                                                src={match.homeTeam.logo}
                                                                alt={match.homeTeam.name}
                                                                className="w-full h-full object-contain drop-shadow-md"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                                                            {match.homeTeam.name.slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-white font-semibold text-base sm:text-lg whitespace-nowrap">{match.homeTeam.name}</span>
                                                </div>
                                                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{match.homeTeam.score}</span>
                                            </div>

                                            {/* Divisor */}
                                            <div className="border-t border-white/10"></div>

                                            {/* Equipo Visitante */}
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    {match.awayTeam.logo ? (
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full p-2 flex items-center justify-center flex-shrink-0">
                                                            <img
                                                                src={match.awayTeam.logo}
                                                                alt={match.awayTeam.name}
                                                                className="w-full h-full object-contain drop-shadow-md"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                                                            {match.awayTeam.name.slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-white font-semibold text-base sm:text-lg whitespace-nowrap">{match.awayTeam.name}</span>
                                                </div>
                                                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{match.awayTeam.score}</span>
                                            </div>
                                        </div>

                                        {/* Tiempo/Info Partido */}
                                        {match.time && (
                                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-gray-400 text-sm">
                                                <Clock className="w-4 h-4" />
                                                <span>{match.time}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>
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
