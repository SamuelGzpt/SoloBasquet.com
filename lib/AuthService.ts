export interface User {
    id: string;
    username: string;
    email: string;
    password: string; // Stored as base64 encoded
    createdAt: string;
    avatar?: string;
}

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    avatar?: string;
}

const USERS_KEY = 'basketball_users';
const CURRENT_USER_KEY = 'basketball_current_user';

// Simple hash function using btoa
const hashPassword = (password: string): string => {
    return btoa(password + 'basketball_salt_2024');
};

export class AuthService {
    // Get all users from localStorage
    static getUsers(): User[] {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    static saveUsers(users: User[]): void {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // Register a new user
    static register(username: string, email: string, password: string): { success: boolean; message: string; user?: AuthUser } {
        const users = this.getUsers();

        // Validate username
        if (username.length < 3) {
            return { success: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, message: 'Email inválido' };
        }

        // Validate password
        if (password.length < 6) {
            return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
        }

        // Check if username already exists
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, message: 'El nombre de usuario ya existe' };
        }

        // Check if email already exists
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'El email ya está registrado' };
        }

        // Create new user
        const newUser: User = {
            id: crypto.randomUUID(),
            username,
            email,
            password: hashPassword(password),
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        this.saveUsers(users);

        const authUser = this.toAuthUser(newUser);
        this.setCurrentUser(authUser);

        return { success: true, message: 'Usuario registrado exitosamente', user: authUser };
    }

    // Login user
    static login(usernameOrEmail: string, password: string): { success: boolean; message: string; user?: AuthUser } {
        const users = this.getUsers();
        const hashedPassword = hashPassword(password);

        const user = users.find(
            u => (u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
                u.email.toLowerCase() === usernameOrEmail.toLowerCase()) &&
                u.password === hashedPassword
        );

        if (!user) {
            return { success: false, message: 'Credenciales inválidas' };
        }

        const authUser = this.toAuthUser(user);
        this.setCurrentUser(authUser);

        return { success: true, message: 'Inicio de sesión exitoso', user: authUser };
    }

    // Logout user
    static logout(): void {
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    // Get current user
    static getCurrentUser(): AuthUser | null {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    // Set current user
    static setCurrentUser(user: AuthUser): void {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }

    // Convert User to AuthUser (remove password)
    private static toAuthUser(user: User): AuthUser {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            avatar: user.avatar,
        };
    }

    // Update user profile
    static updateProfile(userId: string, updates: Partial<Pick<User, 'username' | 'email' | 'avatar'>>): { success: boolean; message: string } {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        // Check if new username is taken
        if (updates.username && users.some(u => u.id !== userId && u.username.toLowerCase() === updates.username!.toLowerCase())) {
            return { success: false, message: 'El nombre de usuario ya existe' };
        }

        // Check if new email is taken
        if (updates.email && users.some(u => u.id !== userId && u.email.toLowerCase() === updates.email!.toLowerCase())) {
            return { success: false, message: 'El email ya está registrado' };
        }

        users[userIndex] = { ...users[userIndex], ...updates };
        this.saveUsers(users);

        // Update current user if it's the same
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            this.setCurrentUser(this.toAuthUser(users[userIndex]));
        }

        return { success: true, message: 'Perfil actualizado exitosamente' };
    }
}
