import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const RegisterIcon = () => (
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />

            {/* Signo Más */}
            <g style={{ transformOrigin: '19px 11px' }} className="transition-transform duration-500 ease-out group-hover:rotate-180">
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
            </g>
        </svg>
    </div>
);

export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
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
        const newErrors = { username: '', email: '', password: '', confirmPassword: '' };
        let isValid = true;

        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es requerido';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
            isValid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
        const result = await register(formData.username, formData.email, formData.password);
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
                        <RegisterIcon />
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Crear Cuenta</h1>
                        <p className="text-gray-400 font-light">Únete a la comunidad</p>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center justify-center animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                        {/* Campo usuario */}
                        <div className="auth-input-group space-y-2">
                            <label htmlFor="username" className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">
                                Nombre de Usuario
                            </label>
                            <div className="relative group">
                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${fieldErrors.username ? 'text-red-400' : 'text-gray-500 group-focus-within:text-orange-500'}`} />
                                <input
                                    id="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3.5 bg-black/20 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:bg-black/40 focus:ring-4 transition-all duration-300 ${fieldErrors.username
                                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-white/10 focus:border-orange-500/50 focus:ring-orange-500/10'
                                        }`}
                                    placeholder="Mi usuario"
                                />
                            </div>
                            {fieldErrors.username && (
                                <p className="text-red-400 text-xs ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.username}</p>
                            )}
                        </div>

                        {/* Campo Email */}
                        <div className="auth-input-group space-y-2">
                            <label htmlFor="email" className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">
                                Email
                            </label>
                            <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${fieldErrors.email ? 'text-red-400' : 'text-gray-500 group-focus-within:text-orange-500'}`} />
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3.5 bg-black/20 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:bg-black/40 focus:ring-4 transition-all duration-300 ${fieldErrors.email
                                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-white/10 focus:border-orange-500/50 focus:ring-orange-500/10'
                                        }`}
                                    placeholder="nombre@ejemplo.com"
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="text-red-400 text-xs ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.email}</p>
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

                        {/* Campo confirmar contraseña */}
                        <div className="auth-input-group space-y-2">
                            <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">
                                Confirmar Contraseña
                            </label>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${fieldErrors.confirmPassword ? 'text-red-400' : 'text-gray-500 group-focus-within:text-orange-500'}`} />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3.5 bg-black/20 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:bg-black/40 focus:ring-4 transition-all duration-300 ${fieldErrors.confirmPassword
                                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-white/10 focus:border-orange-500/50 focus:ring-orange-500/10'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {fieldErrors.confirmPassword && (
                                <p className="text-red-400 text-xs ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Botón enviar */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-button w-full relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300 group-hover:scale-[1.02]" />
                            {/* Efecto brillo */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative bg-transparent h-full px-6 py-3.5 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                        <span className="text-white font-semibold tracking-wide uppercase">Crear Cuenta</span>
                                        <UserPlus className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                ) : (
                                    <>
                                        <span className="text-white font-bold tracking-wide uppercase">Crear Cuenta</span>
                                        <UserPlus className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Enlace inicio de sesión */}
                    <div className="mt-8 text-center auth-input-group">
                        <p className="text-gray-400 text-sm">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                to="/login"
                                className="text-orange-500 hover:text-orange-400 font-semibold transition-colors relative group inline-block"
                            >
                                <span>Inicia sesión aquí</span>
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
