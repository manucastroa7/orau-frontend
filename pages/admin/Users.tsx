import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { api } from '../../services/api';
import { Plus, Trash2, Shield, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Users: React.FC = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin'
    });

    useEffect(() => {
        // Safe navigation guard
        if (currentUser && currentUser.email !== 'orau.orgulloaustral@gmail.com') {
            navigate('/admin/dashboard');
            toast.error('No tienes permisos para acceder a esta sección.');
        } else {
            loadUsers();
        }
    }, [currentUser, navigate]);

    const loadUsers = async () => {
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users', error);
            toast.error('Error al cargar la lista de usuarios');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.username.trim() || !formData.password.trim()) {
                toast.error('Por favor completa todos los campos.');
                return;
            }

            const created = await api.createUser({
                username: formData.username.trim().toLowerCase(),
                password: formData.password,
                role: formData.role
            });

            setUsers(prev => [...prev, created]);
            toast.success(`Usuario "${created.username}" creado con éxito.`);
            setFormData({ username: '', password: '', role: 'admin' });
            setShowAddForm(false);
        } catch (error: any) {
            console.error('Error creating user', error);
            toast.error(error.response?.data?.message || 'Error al crear usuario.');
        }
    };

    const handleDelete = async (userToDelete: User) => {
        if (userToDelete.email === 'orau.orgulloaustral@gmail.com') {
            toast.error('No puedes eliminar la cuenta de administrador principal.');
            return;
        }

        if (currentUser && userToDelete.id === currentUser.id) {
            toast.error('No puedes eliminar tu propio usuario actual.');
            return;
        }

        if (!window.confirm(`¿Estás seguro que deseas eliminar el acceso para "${userToDelete.username || userToDelete.email}"?`)) {
            return;
        }

        try {
            await api.deleteUser(userToDelete.id);
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            toast.success('Usuario eliminado con éxito.');
        } catch (error) {
            console.error('Error deleting user', error);
            toast.error('Error al eliminar usuario.');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 tracking-tight">Usuarios</h2>
                    <p className="text-zinc-500 mt-2 text-sm">Gestiona los accesos y nombres de usuario para tu equipo</p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-all shadow-lg text-sm font-medium tracking-wide"
                    >
                        <Plus size={18} />
                        <span>Nuevo Acceso</span>
                    </button>
                )}
            </div>

            {!showAddForm ? (
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm max-w-3xl">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Identificador (Usuario/Email)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-900 flex items-center gap-2">
                                        <UserCheck size={16} className="text-[#C5A059]" />
                                        <span>{u.username || u.email}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full uppercase tracking-wider ${
                                            u.email === 'orau.orgulloaustral@gmail.com' 
                                                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                                : 'bg-zinc-100 text-zinc-800'
                                        }`}>
                                            {u.email === 'orau.orgulloaustral@gmail.com' ? 'Super Admin' : u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {u.email !== 'orau.orgulloaustral@gmail.com' && (
                                            <button
                                                onClick={() => handleDelete(u)}
                                                className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                                title="Eliminar usuario"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-zinc-500 text-sm">
                                        Cargando lista de usuarios...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="max-w-md bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
                    <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
                        <h3 className="text-xl font-bold text-zinc-800">Nuevo Usuario Acceso</h3>
                        <button
                            onClick={() => {
                                setShowAddForm(false);
                                setFormData({ username: '', password: '', role: 'admin' });
                            }}
                            className="text-zinc-400 hover:text-zinc-600 text-sm"
                        >
                            Cancelar
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Nombre de Usuario (ej: lucia, sofia)</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all lowercase"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Escribe el nombre de usuario"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Contraseña</label>
                            <input
                                required
                                type="password"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Escribe la contraseña de acceso"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Rol asignado</label>
                            <select
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="admin">Administrador (Puede editar catálogo/ventas)</option>
                            </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="w-full bg-zinc-900 text-white py-3 rounded-lg font-bold tracking-widest hover:bg-black transition-all shadow-lg text-sm uppercase"
                            >
                                Crear Acceso
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Users;
