import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ForumService, Thread, Comment } from '../../lib/ForumService';
import { Heart, MessageSquare, ArrowLeft, Send, Calendar, Crown, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function ThreadDetailPage() {
    const { threadId } = useParams<{ threadId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [thread, setThread] = useState<Thread | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (!threadId) return;
        loadThread();
        loadComments();
    }, [threadId]);

    const loadThread = () => {
        if (!threadId) return;
        const t = ForumService.getThreadById(threadId);
        setThread(t);
    };

    const loadComments = () => {
        if (!threadId) return;
        const c = ForumService.getCommentsByThreadId(threadId);
        setComments(c);
    };

    const handleAddComment = () => {
        if (!user || !threadId || !newComment.trim()) return;

        ForumService.addComment(threadId, newComment, user.id, user.username);
        setNewComment('');
        loadThread();
        loadComments();
    };

    const handleLikeThread = () => {
        if (!user || !threadId) return;
        ForumService.toggleThreadLike(threadId, user.id);
        loadThread();
    };

    const handleLikeComment = (commentId: string) => {
        if (!user) return;
        ForumService.toggleCommentLike(commentId, user.id);
        loadComments();
    };

    if (!thread) {
        return (
            <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center bg-black">
                <p className="text-gray-400">Debate no encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 bg-black relative overflow-hidden">
            {/* Fondo ambiental */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Botón volver */}
                <button
                    onClick={() => navigate('/forum')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 group pl-2"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Volver al Foro</span>
                </button>

                {/* Publicación principal */}
                <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
                    {/* Acento superior */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-purple-600 opacity-50" />

                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{thread.title}</h1>
                        <span className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ml-4 ${thread.category === 'nba' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            thread.category === 'predictions' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                'bg-gray-500/10 text-gray-400 border-gray-500/20'
                            }`}>
                            {thread.category.toUpperCase()}
                        </span>
                    </div>

                    {/* Info del autor */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${thread.authorRole === 'tipster'
                            ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-black ring-2 ring-yellow-500/50'
                            : 'bg-gradient-to-br from-zinc-700 to-zinc-800 text-gray-300'
                            }`}>
                            {thread.authorUsername.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`text-base font-bold ${thread.authorRole === 'tipster' ? 'text-yellow-400' : 'text-white'
                                    }`}>
                                    {thread.authorUsername}
                                </span>
                                {thread.authorRole === 'tipster' && (
                                    <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-yellow-500/20">
                                        <Crown className="w-3 h-3 fill-current" />
                                        Predicador
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <span>Publicado {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true, locale: es })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg">
                        <p className="whitespace-pre-wrap">{thread.content}</p>
                    </div>

                    <div className="flex items-center gap-4 pt-8 mt-8 border-t border-white/5">
                        <button
                            onClick={handleLikeThread}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-bold ${user && thread.likedBy.includes(user.id)
                                ? 'bg-red-500/20 text-red-500'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${user && thread.likedBy.includes(user.id) ? 'fill-current' : ''}`} />
                            <span>{thread.likes}</span>
                        </button>
                        <div className="flex items-center gap-2 text-gray-400 px-4 py-2 bg-white/5 rounded-xl">
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-medium">{thread.commentCount} comentarios</span>
                        </div>
                    </div>
                </div>

                {/* Sección comentarios */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        Comentarios <span className="text-lg text-gray-500 font-normal">({comments.length})</span>
                    </h3>

                    {/* Entrada comentario */}
                    {user && (
                        <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Agrega tu opinión al debate..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors resize-none mb-3"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleAddComment}
                                            disabled={!newComment.trim()}
                                            className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>Comentar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {comments.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                            <p className="text-gray-400">No hay comentarios todavía. ¡Sé el primero en opinar!</p>
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="group bg-zinc-900/30 hover:bg-zinc-900/50 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all">
                                <div className="flex gap-4">
                                    {/* Avatar autor comentario */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${comment.authorRole === 'tipster'
                                            ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-black ring-1 ring-yellow-500/50'
                                            : 'bg-gradient-to-br from-zinc-700 to-zinc-800 text-gray-300'
                                            }`}>
                                            {comment.authorUsername.charAt(0).toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-bold text-sm ${comment.authorRole === 'tipster' ? 'text-yellow-400' : 'text-white'
                                                }`}>
                                                {comment.authorUsername}
                                            </span>
                                            {comment.authorRole === 'tipster' && (
                                                <Crown className="w-3 h-3 text-yellow-500 fill-current" />
                                            )}
                                            <span className="text-zinc-600 text-xs">•</span>
                                            <span className="text-zinc-500 text-xs">
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
                                            </span>
                                        </div>

                                        <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap mb-3">
                                            {comment.content}
                                        </p>

                                        <button
                                            onClick={() => handleLikeComment(comment.id)}
                                            className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${user && comment.likedBy.includes(user.id)
                                                ? 'text-red-500'
                                                : 'text-gray-500 hover:text-red-500'
                                                }`}
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${user && comment.likedBy.includes(user.id) ? 'fill-current' : ''}`} />
                                            <span>{comment.likes}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
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
