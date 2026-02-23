import React, { useState, useEffect } from 'react';
import { Size } from '../../types';
import { api } from '../../services/api';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';

const Sizes: React.FC = () => {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        loadSizes();
    }, []);

    const loadSizes = async () => {
        try {
            const data = await api.getSizes();
            setSizes(data);
        } catch (error) {
            console.error('Error loading sizes', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                const updated = await api.updateSize(editingId, formData);
                setSizes(prev => prev.map(s => s.id === editingId ? updated : s));
                toast.success('Talle actualizado con éxito');
            } else {
                const created = await api.createSize(formData);
                setSizes(prev => [...prev, created]);
                toast.success('Talle creado con éxito');
            }
            setFormData({ name: '' });
            setShowAddForm(false);
            setEditingId(null);
        } catch (error) {
            console.error('Error saving size', error);
            toast.error('Error al guardar talle');
        }
    };

    const handleEdit = (size: Size) => {
        setFormData({
            name: size.name
        });
        setEditingId(size.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro? Los productos que usen este talle podrían verse afectados.')) return;
        try {
            await api.deleteSize(id);
            setSizes(prev => prev.filter(s => s.id !== id));
            toast.success('Talle eliminado con éxito');
        } catch (error) {
            console.error('Error deleting size', error);
            toast.error('Error al eliminar talle');
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 tracking-tight">Talles</h2>
                    <p className="text-zinc-500 mt-2 text-sm">Gestiona los talles disponibles para tus productos</p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-all shadow-lg text-sm font-medium tracking-wide"
                    >
                        <Plus size={18} />
                        <span>Nuevo Talle</span>
                    </button>
                )}
            </div>

            {!showAddForm ? (
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm max-w-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nombre del Talle</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {sizes.map(size => (
                                <tr key={size.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-900">{size.name}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(size)}
                                            className="text-zinc-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50 mr-2"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(size.id)}
                                            className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {sizes.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-zinc-500 text-sm">
                                        No hay talles creados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="max-w-md bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
                    <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
                        <h3 className="text-xl font-bold text-zinc-800">{editingId ? 'Editar Talle' : 'Nuevo Talle'}</h3>
                        <button
                            onClick={() => {
                                setShowAddForm(false);
                                setEditingId(null);
                                setFormData({ name: '' });
                            }}
                            className="text-zinc-400 hover:text-zinc-600 text-sm"
                        >
                            Cancelar
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Nombre (Ej: S, M, L, XL, XL+, Único)</label>
                            <input
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="w-full bg-zinc-900 text-white py-3 rounded-lg font-bold tracking-widest hover:bg-black transition-all shadow-lg text-sm uppercase"
                            >
                                {editingId ? 'Guardar Cambios' : 'Crear Talle'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Sizes;
