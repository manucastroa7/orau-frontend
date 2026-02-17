import React, { useState } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface ContactModalProps {
    product: Product;
    onClose: () => void;
    initialMessage?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ product, onClose, initialMessage }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: initialMessage || `Hola, estoy interesado en el producto "${product.name}". Me gustaría recibir más información.`
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.sendContactEmail({
                productId: product.id,
                productName: product.name,
                userName: formData.name,
                userEmail: formData.email,
                message: formData.message
            });
            toast.success('Consulta enviada con éxito. Te responderemos a la brevedad.');
            onClose();
        } catch (error) {
            console.error('Error sending email', error);
            toast.error('Error al enviar la consulta. Por favor intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-md p-8 rounded-xl shadow-2xl animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-bold text-zinc-800 mb-2">Contacto</h3>
                <p className="text-sm text-zinc-500 mb-6">
                    Consulta sobre <span className="font-semibold text-zinc-700">{product.name}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Nombre</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-zinc-200 outline-none transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Tu nombre completo"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Email</label>
                        <input
                            required
                            type="email"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-zinc-200 outline-none transition-all"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Mensaje</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-zinc-200 outline-none transition-all resize-none"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-900 text-white py-4 rounded-lg font-bold tracking-widest hover:bg-black transition-all shadow-lg text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando...' : 'Enviar Consulta'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;
