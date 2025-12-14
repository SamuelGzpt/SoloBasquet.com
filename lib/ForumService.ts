export interface Thread {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorUsername: string;
    authorRole: 'user' | 'admin' | 'tipster'; // rol agregado
    authorAvatar?: string;
    category: 'general' | 'nba' | 'predictions';
    createdAt: string;
    likes: number;
    likedBy: string[];
    commentCount: number;
    isHot?: boolean;
}

export interface Comment {
    id: string;
    threadId: string;
    content: string;
    authorId: string;
    authorUsername: string;
    authorRole: 'user' | 'admin' | 'tipster'; // rol agregado
    authorAvatar?: string;
    createdAt: string;
    likes: number;
    likedBy: string[];
}

const THREADS_KEY = 'basketball_forum_threads_v2'; // Clave cambiada para forzar reinicio
const COMMENTS_KEY = 'basketball_forum_comments_v2';

// Configuración de datos simulados
const PREDICTORS = [
    { id: 'tipster1', username: 'ElGuruBasket', role: 'tipster' as const, avatar: 'https://i.pravatar.cc/150?u=tipster1' },
    { id: 'tipster2', username: 'OracleNBA', role: 'tipster' as const, avatar: 'https://i.pravatar.cc/150?u=tipster2' },
    { id: 'tipster3', username: 'StatsMaster', role: 'tipster' as const, avatar: 'https://i.pravatar.cc/150?u=tipster3' },
];

const NORMAL_USERS = Array.from({ length: 10 }, (_, i) => ({
    id: `user${i + 1}`,
    username: `BasketFan${i + 1}`,
    role: 'user' as const,
    avatar: `https://i.pravatar.cc/150?u=user${i + 1}`
}));

const ALL_MOCK_USERS = [...PREDICTORS, ...NORMAL_USERS];

export class ForumService {
    // Verificar e inicializar datos
    static initialize() {
        if (!localStorage.getItem(THREADS_KEY)) {
            this.seedData();
        }
    }

    static seedData() {
        const threads: Thread[] = [
            {
                id: 't1',
                title: 'Predicción Lakers vs Warriors: Análisis detallado',
                content: 'Basado en los últimos 5 partidos, veo una clara ventaja para GSW en el perímetro. Curry está promediando 35ppg. Mi pick: GSW -4.5. ¿Qué opinan?',
                authorId: PREDICTORS[0].id,
                authorUsername: PREDICTORS[0].username,
                authorRole: 'tipster',
                category: 'predictions',
                createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
                likes: 45,
                likedBy: [],
                commentCount: 5,
                isHot: true
            },
            {
                id: 't2',
                title: '¿LeBron James MVP a los 40 años?',
                content: 'Es increíble la longevidad de este hombre. Los números que está poniendo no tienen sentido. Debate serio.',
                authorId: NORMAL_USERS[0].id,
                authorUsername: NORMAL_USERS[0].username,
                authorRole: 'user',
                category: 'nba',
                createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
                likes: 120,
                likedBy: [],
                commentCount: 12,
                isHot: true
            },
            {
                id: 't3',
                title: 'Pick del Día: Celtics Over 112.5',
                content: 'La defensa de los Hawks es inexistente. Tatum y Brown deberían divertirse hoy. Stake alto.',
                authorId: PREDICTORS[1].id,
                authorUsername: PREDICTORS[1].username,
                authorRole: 'tipster',
                category: 'predictions',
                createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
                likes: 89,
                likedBy: [],
                commentCount: 8
            },
            {
                id: 't4',
                title: 'Rumores de Traspaso: Lavine a los Lakers',
                content: 'He leído en varias fuentes que los Bulls están escuchando ofertas. ¿Encajaría bien con AD y Bron?',
                authorId: PREDICTORS[2].id,
                authorUsername: PREDICTORS[2].username,
                authorRole: 'tipster',
                category: 'nba',
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                likes: 34,
                likedBy: [],
                commentCount: 15
            },
            {
                id: 't5',
                title: 'Mejor base de la historia: ¿Magic o Curry?',
                content: 'El debate de siempre. Uno cambió el juego con el pase, el otro con el tiro. Yo me quedo con Magic por el impacto total.',
                authorId: NORMAL_USERS[3].id,
                authorUsername: NORMAL_USERS[3].username,
                authorRole: 'user',
                category: 'general',
                createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
                likes: 56,
                likedBy: [],
                commentCount: 42
            }
        ];

        const comments: Comment[] = [
            {
                id: 'c1',
                threadId: 't1',
                content: 'Te sigo con el pick, GSW viene fuerte.',
                authorId: NORMAL_USERS[1].id,
                authorUsername: NORMAL_USERS[1].username,
                authorRole: 'user',
                createdAt: new Date(Date.now() - 3500000).toISOString(),
                likes: 5,
                likedBy: []
            },
            {
                id: 'c2',
                threadId: 't1',
                content: 'Ojo que AD está defendiendo brutal. Podría ser under.',
                authorId: PREDICTORS[1].id,
                authorUsername: PREDICTORS[1].username,
                authorRole: 'tipster',
                createdAt: new Date(Date.now() - 3400000).toISOString(),
                likes: 12,
                likedBy: []
            },
            {
                id: 'c3',
                threadId: 't2',
                content: 'GOAT indiscutible.',
                authorId: NORMAL_USERS[2].id,
                authorUsername: NORMAL_USERS[2].username,
                authorRole: 'user',
                createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
                likes: 8,
                likedBy: []
            }
        ];

        this.saveThreads(threads);
        this.saveComments(comments);
    }

    // Obtener todos los temas
    static getThreads(): Thread[] {
        this.initialize();
        const threads = localStorage.getItem(THREADS_KEY);
        return threads ? JSON.parse(threads) : [];
    }

    // Guardar temas
    static saveThreads(threads: Thread[]): void {
        localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
    }

    // Obtener todos los comentarios
    static getComments(): Comment[] {
        this.initialize();
        const comments = localStorage.getItem(COMMENTS_KEY);
        return comments ? JSON.parse(comments) : [];
    }

    // Guardar comentarios
    static saveComments(comments: Comment[]): void {
        localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    }

    // Crear un nuevo tema
    static createThread(title: string, content: string, category: Thread['category'], authorId: string, authorUsername: string): Thread {
        const threads = this.getThreads();
        const newThread: Thread = {
            id: crypto.randomUUID(),
            title,
            content,
            authorId,
            authorUsername,
            authorRole: 'user', // Predeterminado para usuarios reales
            category,
            createdAt: new Date().toISOString(),
            likes: 0,
            likedBy: [],
            commentCount: 0,
        };
        threads.unshift(newThread);
        this.saveThreads(threads);
        return newThread;
    }

    // Obtener tema por ID
    static getThreadById(id: string): Thread | null {
        const threads = this.getThreads();
        return threads.find(t => t.id === id) || null;
    }

    // Obtener temas por categoría
    static getThreadsByCategory(category: Thread['category'] | 'all'): Thread[] {
        const threads = this.getThreads();
        if (category === 'all') return threads;
        return threads.filter(t => t.category === category);
    }

    // Alternar me gusta en tema
    static toggleThreadLike(threadId: string, userId: string): boolean {
        const threads = this.getThreads();
        const threadIndex = threads.findIndex(t => t.id === threadId);

        if (threadIndex === -1) return false;

        const thread = threads[threadIndex];
        const likedIndex = thread.likedBy.indexOf(userId);

        if (likedIndex > -1) {
            thread.likedBy.splice(likedIndex, 1);
            thread.likes--;
        } else {
            thread.likedBy.push(userId);
            thread.likes++;
        }

        this.saveThreads(threads);
        return true;
    }

    // Agregar comentario al tema
    static addComment(threadId: string, content: string, authorId: string, authorUsername: string): Comment | null {
        const comments = this.getComments();
        const newComment: Comment = {
            id: crypto.randomUUID(),
            threadId,
            content,
            authorId,
            authorUsername,
            authorRole: 'user',
            createdAt: new Date().toISOString(),
            likes: 0,
            likedBy: [],
        };

        comments.push(newComment);
        this.saveComments(comments);

        const threads = this.getThreads();
        const threadIndex = threads.findIndex(t => t.id === threadId);
        if (threadIndex > -1) {
            threads[threadIndex].commentCount++;
            this.saveThreads(threads);
        }

        return newComment;
    }

    // Obtener comentarios del tema
    static getCommentsByThreadId(threadId: string): Comment[] {
        const comments = this.getComments();
        return comments.filter(c => c.threadId === threadId).sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }

    // Alternar me gusta en comentario
    static toggleCommentLike(commentId: string, userId: string): boolean {
        const comments = this.getComments();
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) return false;

        const comment = comments[commentIndex];
        const likedIndex = comment.likedBy.indexOf(userId);

        if (likedIndex > -1) {
            comment.likedBy.splice(likedIndex, 1);
            comment.likes--;
        } else {
            comment.likedBy.push(userId);
            comment.likes++;
        }

        this.saveComments(comments);
        return true;
    }

    // Eliminar tema
    static deleteThread(threadId: string, userId: string): boolean {
        const threads = this.getThreads();
        const threadIndex = threads.findIndex(t => t.id === threadId && t.authorId === userId);

        if (threadIndex === -1) return false;

        threads.splice(threadIndex, 1);
        this.saveThreads(threads);

        const comments = this.getComments();
        const filteredComments = comments.filter(c => c.threadId !== threadId);
        this.saveComments(filteredComments);

        return true;
    }

    // Eliminar comentario
    static deleteComment(commentId: string, userId: string): boolean {
        const comments = this.getComments();
        const commentIndex = comments.findIndex(c => c.id === commentId && c.authorId === userId);

        if (commentIndex === -1) return false;

        const threadId = comments[commentIndex].threadId;
        comments.splice(commentIndex, 1);
        this.saveComments(comments);

        const threads = this.getThreads();
        const threadIndex = threads.findIndex(t => t.id === threadId);
        if (threadIndex > -1 && threads[threadIndex].commentCount > 0) {
            threads[threadIndex].commentCount--;
            this.saveThreads(threads);
        }

        return true;
    }
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
