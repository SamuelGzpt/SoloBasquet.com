import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const LoginIcon = () => (
    <div className="w-20 h-20 mx-auto mb-6 group cursor-pointer relative">
        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.6)] transition-all duration-300 group-hover:drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]"
        >
            {/* Puerta/Marco */}
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" className="opacity-90" />

            {/* Flecha moviéndose hacia adentro */}
            <g className="group-hover:translate-x-1 transition-transform duration-500 ease-out">
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
            </g>
        </svg>
    </div>
);

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        usernameOrEmail: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);


    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".auth-card", {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        })
            .from(".auth-header > *", {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8
            }, "-=0.6")
            .from(".auth-input-group", {
                x: -20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8
            }, "-=0.6")
            .from(".auth-button", {
                y: 10,
                opacity: 0,
                scale: 0.95,
                duration: 0.6
            }, "-=0.4");

    }, { scope: containerRef });

    const validateForm = () => {
        const newErrors = { usernameOrEmail: '', password: '' };
        let isValid = true;

        if (!formData.usernameOrEmail.trim()) {
            newErrors.usernameOrEmail = 'Ingresa tu usuario o email';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Ingresa tu contraseña';
            isValid = false;
        }

        setFieldErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        const result = await login(formData.usernameOrEmail, formData.password);

        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md auth-card relative z-10">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden">

                    {/* Encabezado */}
                    <div className="auth-header text-center mb-8">
                        <LoginIcon />
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Bienvenido</h1>
                        <p className="text-gray-400 font-light">Inicia sesión para continuar</p>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center justify-center animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Campo Email/Usuario */}
                        <div className="auth-input-group space-y-2">
                            <label htmlFor="usernameOrEmail" className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">
                                Usuario o Email
                            </label>
                            <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${fieldErrors.usernameOrEmail ? 'text-red-400' : 'text-gray-500 group-focus-within:text-orange-500'}`} />
                                <input
                                    id="usernameOrEmail"
                                    type="text"
                                    value={formData.usernameOrEmail}
                                    onChange={(e) => handleInputChange('usernameOrEmail', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3.5 bg-black/20 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:bg-black/40 focus:ring-4 transition-all duration-300 ${fieldErrors.usernameOrEmail
                                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-white/10 focus:border-orange-500/50 focus:ring-orange-500/10'
                                        }`}
                                    placeholder="nombre@ejemplo.com"
                                />
                            </div>
                            {fieldErrors.usernameOrEmail && (
                                <p className="text-red-400 text-xs ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.usernameOrEmail}</p>
                            )}
                        </div>

                        {/* Campo contraseña */}
                        <div className="auth-input-group space-y-2">
                            <label htmlFor="password" className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${fieldErrors.password ? 'text-red-400' : 'text-gray-500 group-focus-within:text-orange-500'}`} />
                                <input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3.5 bg-black/20 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:bg-black/40 focus:ring-4 transition-all duration-300 ${fieldErrors.password
                                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-white/10 focus:border-orange-500/50 focus:ring-orange-500/10'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {fieldErrors.password && (
                                <p className="text-red-400 text-xs ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Botón enviar */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-button w-full relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300 group-hover:scale-[1.02]" />
                            {/* Efecto brillo */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative bg-transparent h-full px-6 py-3.5 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                        <span className="text-white font-semibold tracking-wide">Iniciando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-white font-bold tracking-wide">INICIAR SESIÓN</span>
                                        <LogIn className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Enlace registro */}
                    <div className="mt-8 text-center auth-input-group">
                        <p className="text-gray-400 text-sm">
                            ¿No tienes una cuenta?{' '}
                            <Link
                                to="/register"
                                className="text-orange-500 hover:text-orange-400 font-semibold transition-colors relative group inline-block"
                            >
                                <span>Regístrate aquí</span>
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
