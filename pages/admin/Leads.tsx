import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Mail, Calendar, User, MessageSquare, AlertCircle, Phone, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    productName?: string;
    productId?: string;
    status: string;
    createdAt: string;
}

const Leads: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            const data = await api.getLeads();
            setLeads(data);
        } catch (error) {
            console.error('Error loading leads', error);
            toast.error('Error al cargar los contactos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este contacto?')) return;
        try {
            await api.deleteLead(id);
            setLeads(prev => prev.filter(l => l.id !== id));
            toast.success('Contacto eliminado correctamente');
        } catch (error) {
            console.error('Error deleting lead', error);
            toast.error('Error al eliminar contacto');
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        status: 'new'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createLead(formData);
            toast.success('Cliente agregado correctamente');
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', message: '', status: 'new' });
            loadLeads();
        } catch (error) {
            console.error('Error creating lead', error);
            toast.error('Error al agregar cliente');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-800 tracking-tight">Posibles Clientes</h2>
                    <p className="text-zinc-500 mt-2">Gestiona las consultas recibidas desde la web.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                    >
                        Agregar Cliente
                    </button>
                    <div className="bg-white px-4 py-2 rounded-lg border border-zinc-200 shadow-sm">
                        <span className="text-sm font-medium text-zinc-600">Total: </span>
                        <span className="text-lg font-bold text-zinc-900">{leads.length}</span>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                {leads.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No hay consultas registradas aún.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Mensaje</th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-zinc-600">
                                                <Calendar size={14} className="text-zinc-400" />
                                                <span className="text-sm">
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className="text-xs text-zinc-400 pl-6 block">
                                                {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-900">{lead.name}</p>
                                                    <a href={`mailto:${lead.email}`} className="text-xs text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                                                        {lead.email}
                                                    </a>
                                                    {lead.phone && (
                                                        <span className="text-xs text-zinc-500 block">
                                                            Ph: {lead.phone}
                                                        </span>
                                                    )}
                                                    {lead.productName && (
                                                        <div className="mt-1">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                                                                Int: {lead.productName}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 max-w-xs">
                                                <MessageSquare size={14} className="text-zinc-400 mt-1 flex-shrink-0" />
                                                <p className="text-sm text-zinc-600 truncate" title={lead.message}>
                                                    {lead.message}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {lead.phone && (
                                                    <a
                                                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                                                        title="Contactar por WhatsApp"
                                                    >
                                                        <Phone size={16} />
                                                    </a>
                                                )}
                                                <a
                                                    href={`mailto:${lead.email}?subject=Respuesta a su consulta sobre ${lead.productName || 'ORAU'}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                                                    title="Enviar Correo"
                                                >
                                                    <Mail size={16} />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                                    title="Eliminar Contacto"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${lead.status === 'new'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : lead.status === 'contacted'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                                                    }`}>
                                                    {lead.status === 'new' && <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />}
                                                    {lead.status === 'new' ? 'Nuevo' : lead.status === 'contacted' ? 'Contactado' : lead.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-zinc-800">Agregar Nuevo Cliente</h3>
                            <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-red-500 transition-colors">
                                <AlertCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Nombre</label>
                                <input
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Teléfono</label>
                                <input
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+598 99 123 456"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Mensaje / Notas</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-zinc-200 text-zinc-600 rounded-lg text-sm font-medium hover:bg-zinc-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-black"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;
