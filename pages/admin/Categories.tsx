import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const created = await api.createCategory(formData);
            setCategories(prev => [...prev, created]);
            setFormData({ name: '', description: '' });
            setShowAddForm(false);
            toast.success('Categoría creada con éxito');
        } catch (error) {
            console.error('Error creating category', error);
            toast.error('Error al crear categoría');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro? Esto no eliminará los productos asociados pero los dejará sin categoría.')) return;
        try {
            await api.deleteCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
            toast.success('Categoría eliminada con éxito');
        } catch (error) {
            console.error('Error deleting category', error);
            toast.error('Error al eliminar categoría');
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 tracking-tight">Categorías</h2>
                    <p className="text-zinc-500 mt-2 text-sm">Organiza tu catálogo</p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-all shadow-lg text-sm font-medium tracking-wide"
                    >
                        <Plus size={18} />
                        <span>Nueva Categoría</span>
                    </button>
                )}
            </div>

            {!showAddForm ? (
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm max-w-4xl">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Descripción</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {categories.map(category => (
                                <tr key={category.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-900">{category.name}</td>
                                    <td className="px-6 py-4 text-sm text-zinc-500">{category.description || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-zinc-500 text-sm">
                                        No hay categorías creadas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
                    <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
                        <h3 className="text-xl font-bold text-zinc-800">Nueva Categoría</h3>
                        <button onClick={() => setShowAddForm(false)} className="text-zinc-400 hover:text-zinc-600 text-sm">Cancelar</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Nombre</label>
                            <input
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Descripción (Opcional)</label>
                            <textarea
                                rows={3}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="w-full bg-zinc-900 text-white py-3 rounded-lg font-bold tracking-widest hover:bg-black transition-all shadow-lg text-sm uppercase"
                            >
                                Crear Categoría
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Categories;
