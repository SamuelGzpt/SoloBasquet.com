import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ForumService, Thread } from '../../lib/ForumService';
import { MessageSquare, Heart, Plus, Calendar, Crown, TrendingUp, Search, LayoutGrid, Gem, Trophy, Megaphone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const FilterButton = ({ cat, isSelected, onClick }: { cat: any, isSelected: boolean, onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`group flex items-center h-[50px] rounded-full border transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden relative cursor-pointer ${isSelected
                ? 'max-w-[200px] pr-5 bg-opacity-100'
                : 'max-w-[50px] hover:max-w-[200px] hover:pr-5 bg-transparent hover:bg-opacity-10'
                }`}
            style={{
                borderColor: isSelected ? cat.color : 'rgba(255,255,255,0.1)',
                backgroundColor: isSelected ? cat.bgColor : 'transparent',
                boxShadow: isSelected ? `0 0 20px ${cat.color}40` : 'none'
            }}
        >
            <div className="w-[50px] h-full flex items-center justify-center flex-shrink-0">
                <cat.icon
                    className={`w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSelected ? 'scale-110 text-white' : 'text-gray-400 group-hover:scale-110 group-hover:text-white'
                        }`}
                    style={{ color: isSelected ? '#fff' : undefined }}
                />
            </div>
            <span
                className={`whitespace-nowrap overflow-hidden font-bold text-sm text-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSelected
                    ? 'opacity-100 max-w-[150px]'
                    : 'opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[150px]'
                    }`}
            >
                {cat.label}
            </span>
        </button>
    );
};

export function ForumPage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'nba' | 'predictions'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newThread, setNewThread] = useState({ title: '', content: '', category: 'general' as Thread['category'] });

    useEffect(() => {
        loadThreads();
    }, [selectedCategory]);

    const loadThreads = () => {
        const allThreads = ForumService.getThreadsByCategory(selectedCategory);
        setThreads(allThreads);
    };

    const handleCreateThread = () => {
        if (!user || !newThread.title || !newThread.content) return;

        ForumService.createThread(newThread.title, newThread.content, newThread.category, user.id, user.username);
        setNewThread({ title: '', content: '', category: 'general' });
        setShowCreateModal(false);
        loadThreads();
    };

    const handleLike = (threadId: string) => {
        if (!user) return;
        ForumService.toggleThreadLike(threadId, user.id);
        loadThreads();
    };

    const categories = [
        { id: 'all', label: 'Todo', icon: LayoutGrid, color: '#f97316', bgColor: '#f97316' },
        { id: 'predictions', label: 'Predicciones', icon: Gem, color: '#a855f7', bgColor: '#a855f7' },
        { id: 'nba', label: 'NBA', icon: Trophy, color: '#3b82f6', bgColor: '#3b82f6' },
        { id: 'general', label: 'General', icon: Megaphone, color: '#fbbf24', bgColor: '#fbbf24' },
    ];


    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center bg-black">
                <div className="text-center bg-zinc-900/50 p-10 rounded-3xl border border-white/10 backdrop-blur-xl max-w-lg">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-orange-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Comunidad Exclusiva</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">Únete a la discusión con expertos y fanáticos. Accede a predicciones premium y debates en tiempo real.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/20"
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="mt-4 text-gray-400 hover:text-white transition text-sm"
                    >
                        ¿No tienes cuenta? Regístrate
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 bg-black relative overflow-hidden">
            {/* Fondo ambiental */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">Foro Oficial</h1>
                        <p className="text-gray-400 text-lg">Debate, analiza y gana con la comunidad.</p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Debate</span>
                    </button>
                </div>

                {/* Filtros */}
                <div className="mb-8 pl-1">
                    <p className="text-white text-xs font-black mb-4 tracking-[0.3em] uppercase transform origin-left scale-x-125 scale-y-75">
                        Filtrar por
                    </p>
                    <div className="flex flex-wrap gap-3 items-center">
                        {categories.map(cat => (
                            <FilterButton
                                key={cat.id}
                                cat={cat}
                                isSelected={selectedCategory === cat.id}
                                onClick={() => setSelectedCategory(cat.id as any)}
                            />
                        ))}
                    </div>
                </div>

                {/* Cuadrícula de temas */}
                <div className="grid gap-4">
                    {threads.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <MessageSquare className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2">Está muy tranquilo por aquí...</h3>
                            <p className="text-gray-500">Sé el primero en iniciar una conversación en esta categoría.</p>
                        </div>
                    ) : (
                        threads.map(thread => (
                            <div
                                key={thread.id}
                                onClick={() => navigate(`/forum/${thread.id}`)}
                                className="group relative bg-zinc-900/40 hover:bg-zinc-900/60 border border-white/5 hover:border-orange-500/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
                            >
                                {/* Insignia destacada */}
                                {thread.isHot && (
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10 animate-pulse">
                                        <TrendingUp className="w-3 h-3" /> HOT
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    {/* Marcador de posición de avatar */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${thread.authorRole === 'tipster'
                                            ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-black ring-2 ring-yellow-500/50'
                                            : 'bg-gradient-to-br from-zinc-700 to-zinc-800 text-gray-300'
                                            }`}>
                                            {thread.authorUsername.charAt(0).toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-sm font-bold ${thread.authorRole === 'tipster' ? 'text-yellow-400 flex items-center gap-1' : 'text-gray-300'
                                                }`}>
                                                {thread.authorRole === 'tipster' && <Crown className="w-3 h-3 text-yellow-500 fill-current" />}
                                                {thread.authorUsername}
                                            </span>
                                            <span className="text-zinc-600 text-xs">•</span>
                                            <span className="text-zinc-500 text-xs font-medium">
                                                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true, locale: es })}
                                            </span>

                                            {/* Insignia de rol */}
                                            {thread.authorRole === 'tipster' && (
                                                <span className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-yellow-500/20 ml-2">
                                                    Predicador
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-1">
                                            {thread.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm line-clamp-2 mb-4 font-normal leading-relaxed">
                                            {thread.content}
                                        </p>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                                <span className={`w-2 h-2 rounded-full ${thread.category === 'predictions' ? 'bg-purple-500' :
                                                    thread.category === 'nba' ? 'bg-orange-500' : 'bg-blue-500'
                                                    }`} />
                                                {thread.category.toUpperCase()}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-500 ml-auto">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLike(thread.id);
                                                    }}
                                                    className={`flex items-center gap-1.5 transition-colors group/like ${user && thread.likedBy.includes(user.id) ? 'text-red-500' : 'hover:text-red-500'
                                                        }`}
                                                >
                                                    <Heart className={`w-4 h-4 transition-transform group-active/like:scale-75 ${user && thread.likedBy.includes(user.id) ? 'fill-current' : ''
                                                        }`} />
                                                    <span className="font-semibold">{thread.likes}</span>
                                                </button>

                                                <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-white transition-colors">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span className="font-semibold">{thread.commentCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal crear tema */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                            {/* Resplandor decorativo */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-purple-600" />

                            <h2 className="text-2xl font-bold text-white mb-6">Iniciar Nuevo Debate</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categoría</label>
                                    <select
                                        value={newThread.category}
                                        onChange={(e) => setNewThread({ ...newThread, category: e.target.value as Thread['category'] })}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer appearance-none"
                                    >
                                        <option value="general">General</option>
                                        <option value="nba">NBA</option>
                                        <option value="predictions">Predicciones</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Título</label>
                                    <input
                                        type="text"
                                        value={newThread.title}
                                        onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                                        placeholder="Un título interesante..."
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contenido</label>
                                    <textarea
                                        value={newThread.content}
                                        onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                                        placeholder="Comparte tu opinión..."
                                        rows={6}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleCreateThread}
                                        disabled={!newThread.title || !newThread.content}
                                        className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-lg shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Publicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
