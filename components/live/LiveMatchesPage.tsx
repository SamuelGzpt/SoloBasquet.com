import { useState, useEffect } from 'react';
import { LiveMatchesService, LiveMatch } from '../../lib/LiveMatchesService';
import { Radio, Clock, Trophy, Loader2 } from 'lucide-react';

export function LiveMatchesPage() {
    const [matches, setMatches] = useState<LiveMatch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMatches();
        // Actualización auto cada 30 segundos
        const interval = setInterval(loadMatches, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadMatches = async () => {
        setLoading(true);
        const data = await LiveMatchesService.fetchLiveMatches();
        setMatches(data);
        setLoading(false);
    };

    const getStatusColor = (status: LiveMatch['status']) => {
        switch (status) {
            case 'live':
                return 'bg-green-600';
            case 'upcoming':
                return 'bg-purple-600';
            case 'finished':
                return 'bg-red-600';
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
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Encabezado */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Radio className="w-10 h-10 text-orange-500" />
                        Partidos en Vivo
                    </h1>
                    <p className="text-gray-400">Sigue los partidos NBA en tiempo real</p>
                </div>

                {/* Cargando */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    </div>
                ) : (
                    /* Cuadrícula de partidos */
                    <div className="grid md:grid-cols-2 gap-6">
                        {matches.length === 0 ? (
                            <div className="col-span-2 text-center py-16 bg-white/5 rounded-lg border border-white/10">
                                <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">No hay partidos en este momento</p>
                                <p className="text-gray-500 text-sm mt-2">Vuelve más tarde para ver los partidos en vivo</p>
                            </div>
                        ) : (
                            matches.map(match => (
                                <div key={match.id} className="relative group">
                                    {/* Efecto brillo para partidos en vivo */}
                                    {match.status === 'live' && (
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition animate-pulse"></div>
                                    )}

                                    <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition">
                                        {/* Insignia de estado */}
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
                                            {/* Equipo local */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {match.homeTeam.logo ? (
                                                        <div className="w-12 h-12 bg-white/5 rounded-full p-2 flex items-center justify-center">
                                                            <img
                                                                src={match.homeTeam.logo}
                                                                alt={match.homeTeam.name}
                                                                className="w-full h-full object-contain drop-shadow-md"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                                                            {match.homeTeam.name.slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-white font-semibold text-lg">{match.homeTeam.name}</span>
                                                </div>
                                                <span className="text-3xl font-bold text-white">{match.homeTeam.score}</span>
                                            </div>

                                            {/* Divisor */}
                                            <div className="border-t border-white/10"></div>

                                            {/* Equipo visitante */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {match.awayTeam.logo ? (
                                                        <div className="w-12 h-12 bg-white/5 rounded-full p-2 flex items-center justify-center">
                                                            <img
                                                                src={match.awayTeam.logo}
                                                                alt={match.awayTeam.name}
                                                                className="w-full h-full object-contain drop-shadow-md"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                                            {match.awayTeam.name.slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-white font-semibold text-lg">{match.awayTeam.name}</span>
                                                </div>
                                                <span className="text-3xl font-bold text-white">{match.awayTeam.score}</span>
                                            </div>
                                        </div>

                                        {/* Tiempo/Info partido */}
                                        {match.time && (
                                            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">{match.time}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}


            </div>
        </div>
    );
}
