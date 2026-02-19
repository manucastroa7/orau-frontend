import React, { useEffect, useState } from 'react';
import { Section, SectionType, Category, Product } from '../../types';
import { api } from '../../services/api';
import { toast } from 'sonner';

const Sections: React.FC = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [editingSection, setEditingSection] = useState<Partial<Section> | null>(null);
    const [formData, setFormData] = useState<Partial<Section>>({
        title: '',
        subtitle: '',
        type: SectionType.PRODUCT_GRID,
        isActive: true,
        content: {}
    });

    const fetchSections = async () => {
        try {
            const [sectionsData, categoriesData, productsData] = await Promise.all([
                api.getSectionsAdmin(),
                api.getCategories(),
                api.getProducts()
            ]);
            setSections(sectionsData);
            setCategories(categoriesData);
            setProducts(productsData);
        } catch (error) {
            toast.error('Error al cargar datos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    // Handlers
    const handleEdit = (section: Section) => {
        setEditingSection(section);
        setFormData({
            title: section.title,
            subtitle: section.subtitle || '',
            type: section.type,
            isActive: section.isActive,
            content: section.content || {}
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta sección?')) return;
        try {
            await api.deleteSection(id);
            toast.success('Sección eliminada');
            fetchSections();
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSection?.id) {
                await api.updateSection(editingSection.id, formData);
                toast.success('Sección actualizada');
            } else {
                await api.createSection(formData);
                toast.success('Sección creada');
            }
            setShowModal(false);
            setEditingSection(null);
            setFormData({ title: '', subtitle: '', type: SectionType.PRODUCT_GRID, isActive: true, content: {} });
            fetchSections();
        } catch (error) {
            toast.error('Error al guardar');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold brand-font">Gestión de Secciones (Home)</h1>
                <button
                    onClick={() => {
                        setEditingSection(null);
                        setFormData({ title: '', subtitle: '', type: SectionType.PRODUCT_GRID, isActive: true, content: {} });
                        setShowModal(true);
                    }}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-800 transition-colors text-xs uppercase tracking-widest"
                >
                    + Nueva Sección
                </button>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="space-y-4">
                    {sections.map(section => (
                        <div key={section.id} className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg">{section.title}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${section.isActive ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                        {section.isActive ? 'ACTIVA' : 'INACTIVA'}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-500">{section.subtitle}</p>
                                <span className="text-[10px] uppercase tracking-widest text-zinc-400 mt-2 block">{section.type}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(section)} className="text-blue-600 hover:text-blue-800 p-2">Editar</button>
                                <button onClick={() => handleDelete(section.id)} className="text-red-600 hover:text-red-800 p-2">Eliminar</button>
                            </div>
                        </div>
                    ))}
                    {sections.length === 0 && (
                        <p className="text-zinc-500 text-center py-12">No hay secciones dinámica configuradas.</p>
                    )}
                </div>
            )}

            {/* Simple Modal for MVP */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6">{editingSection ? 'Editar Sección' : 'Nueva Sección'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-2">Título</label>
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-2">Subtítulo</label>
                                <input
                                    type="text"
                                    value={formData.subtitle || ''}
                                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-2">Tipo</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as SectionType })}
                                    className="w-full border p-2 rounded bg-white"
                                >
                                    <option value={SectionType.PRODUCT_GRID}>Grilla de Productos</option>
                                    <option value={SectionType.BANNER}>Banner / Hero</option>
                                    <option value={SectionType.TEXT}>Bloque de Texto</option>
                                </select>
                            </div>

                            {/* Dynamic Content Fields based on Type */}
                            {/* Dynamic Content Fields based on Type */}
                            {formData.type === SectionType.PRODUCT_GRID && (
                                <div className="bg-zinc-50 p-4 rounded text-sm text-zinc-500 space-y-4">
                                    {/* Selection Mode */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest mb-2 text-zinc-800">Modo de Selección</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="selectionMode"
                                                    checked={!formData.content?.mode || formData.content.mode === 'CATEGORY'}
                                                    onChange={() => setFormData({
                                                        ...formData, content: { ...formData.content, mode: 'CATEGORY' }
                                                    })}
                                                />
                                                <span>Por Categorías</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="selectionMode"
                                                    checked={formData.content?.mode === 'MANUAL'}
                                                    onChange={() => setFormData({
                                                        ...formData, content: { ...formData.content, mode: 'MANUAL' }
                                                    })}
                                                />
                                                <span>Selección Manual</span>
                                            </label>
                                        </div>
                                    </div>

                                    {(!formData.content?.mode || formData.content?.mode === 'CATEGORY') && (
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest mb-2 text-zinc-800">Categorías Incluidas</label>
                                            <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded bg-white">
                                                {categories.map(cat => (
                                                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 p-1 rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.content?.categoryIds?.includes(cat.id)}
                                                            onChange={e => {
                                                                const currentIds = formData.content?.categoryIds || [];
                                                                const newIds = e.target.checked
                                                                    ? [...currentIds, cat.id]
                                                                    : currentIds.filter((id: string) => id !== cat.id);

                                                                setFormData({
                                                                    ...formData,
                                                                    content: { ...formData.content, categoryIds: newIds }
                                                                });
                                                            }}
                                                        />
                                                        <span>{cat.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <p className="mt-2 text-xs">Si no seleccionas ninguna, se mostrarán <strong>todas</strong>.</p>
                                        </div>
                                    )}

                                    {formData.content?.mode === 'MANUAL' && (
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest mb-2 text-zinc-800">Seleccionar Productos</label>
                                            <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded bg-white">
                                                {products.map(prod => (
                                                    <label key={prod.id} className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 p-1 rounded border-b border-zinc-100 last:border-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.content?.productIds?.includes(prod.id)}
                                                            onChange={e => {
                                                                const currentIds = formData.content?.productIds || [];
                                                                const newIds = e.target.checked
                                                                    ? [...currentIds, prod.id]
                                                                    : currentIds.filter((id: string) => id !== prod.id);

                                                                setFormData({
                                                                    ...formData,
                                                                    content: { ...formData.content, productIds: newIds }
                                                                });
                                                            }}
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            {prod.images?.[0] && <img src={prod.images[0]} alt="" className="w-8 h-8 object-cover rounded" />}
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium">{prod.name}</span>
                                                                <span className="text-[10px] text-zinc-500">{prod.category}</span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <span className="text-xs uppercase tracking-widest">Activa</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-zinc-100 rounded">Cancelar</button>
                                <button type="submit" className="bg-black text-white px-6 py-2 rounded btn-primary">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sections;
