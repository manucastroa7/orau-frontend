import React, { useState, useEffect } from 'react';
import { Product, Size, Category } from '../../types';
import { api } from '../../services/api';
import { Plus, Trash2, Edit, Eye, X } from 'lucide-react';
import { toast } from 'sonner';

import ImageCropper from '../../components/ImageCropper';
import ProductCard from '../../components/ProductCard';

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [cropperOpen, setCropperOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stock: {} as Record<string, number>,
        images: [] as string[],
        categoryId: '',
        sizes: [] as string[]
    });

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products', error);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
            if (data.length > 0 && !editingId) {
                setFormData(prev => ({ ...prev, categoryId: data[0].id }));
            }
        } catch (error) {
            console.error('Error loading categories', error);
        }
    };

    const handleSizeToggle = (size: string) => {
        setFormData(prev => {
            const isSelected = prev.sizes.includes(size);
            const newSizes = isSelected
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];

            const newStock = { ...prev.stock };
            if (!isSelected) {
                // If adding size, init stock to 0
                newStock[size] = 0;
            } else {
                // If removing size, maybe delete stock key? Optional but cleaner
                delete newStock[size];
            }
            return { ...prev, sizes: newSizes, stock: newStock };
        });
    };

    const handleEditClick = (product: Product) => {
        setEditingId(product.id);
        const catId = categories.find(c => c.name === product.category)?.id || categories[0]?.id || '';
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images || [],
            categoryId: catId,
            sizes: product.sizes
        });
        setShowAddForm(true);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingId(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            stock: {},
            images: [],
            categoryId: categories[0]?.id || '',
            sizes: []
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                ...formData,
                categoryRelation: { id: formData.categoryId }
            };
            delete payload.categoryId; // Remove aux field

            console.log('Submitting Product Payload:', payload);

            if (editingId) {
                const updated = await api.updateProduct(editingId, payload);
                setProducts(prev => prev.map(p => p.id === editingId ? updated : p));
                toast.success('Producto actualizado con éxito');
            } else {
                const created = await api.createProduct(payload);
                setProducts(prev => [created, ...prev]);
                toast.success('Producto creado con éxito');
            }

            handleCancel();
        } catch (error) {
            console.error('Error saving product', error);
            toast.error('Error al guardar producto');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
        try {
            await api.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success('Producto eliminado con éxito');
        } catch (error) {
            console.error('Error deleting product', error);
            toast.error('Error al eliminar producto');
        }
    }

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 tracking-tight">Productos</h2>
                    <p className="text-zinc-500 mt-2 text-sm">Gestiona el catálogo de ORAU</p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                name: '',
                                description: '',
                                price: 0,
                                stock: {},
                                images: [],
                                categoryId: categories[0]?.id || '',
                                sizes: []
                            });
                            setShowAddForm(true);
                        }}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-all shadow-lg text-sm font-medium tracking-wide"
                    >
                        <Plus size={18} />
                        <span>Nuevo Producto</span>
                    </button>
                )}
            </div>

            {!showAddForm ? (
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Categoría</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Talles</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-zinc-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {product.images && product.images.length > 0 ? (
                                                    <div className="relative">
                                                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-zinc-100" />
                                                        {product.images.length > 1 && (
                                                            <span className="absolute -top-1 -right-1 bg-zinc-800 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                                                                {product.images.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-300">
                                                        <span className="text-[10px]">Sin Foto</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-zinc-900">{product.name}</p>
                                                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                                                {product.category || 'Sin Categoría'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-zinc-900">
                                            €{product.price}
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-medium ${(Object.values(product.stock || {}).reduce((a: number, b: number) => a + b, 0) as number) <= 5 ? 'text-red-600' : 'text-zinc-600'}`}>
                                            {Object.values(product.stock || {}).reduce((a: number, b: number) => a + b, 0)}
                                            {(Object.values(product.stock || {}).reduce((a: number, b: number) => a + b, 0) as number) <= 5 && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Bajo Stock</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {product.sizes.map(size => (
                                                    <span key={size} className="text-[10px] border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-500">{size}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setPreviewProduct(product)}
                                                    className="text-zinc-400 hover:text-zinc-600 transition-colors p-2 rounded-full hover:bg-zinc-50"
                                                    title="Ver Previsualización"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-zinc-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
                                            No hay productos registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
                    <div className="flex justify-between items-center mb-8 border-b border-zinc-100 pb-4">
                        <h3 className="text-xl font-bold text-zinc-800">
                            {editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                        </h3>
                        <button onClick={handleCancel} className="text-zinc-400 hover:text-zinc-600 text-sm">Cancelar</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Nombre del Producto</label>
                                <input
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all"
                                    placeholder="Ej. Buzo Oversized Black"
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFormData(prev => ({ ...prev, name: val }));
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Categoría</label>
                                <select
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all"
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFormData(prev => ({ ...prev, categoryId: val }));
                                    }}
                                >
                                    <option value="" disabled>Seleccionar...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Precio (€)</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all"
                                    placeholder="0.00"
                                    onChange={e => {
                                        const val = Number(e.target.value);
                                        setFormData(prev => ({ ...prev, price: val }));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Descripción</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all resize-none"
                                placeholder="Detalles del producto..."
                                onChange={e => {
                                    const val = e.target.value;
                                    setFormData(prev => ({ ...prev, description: val }));
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Galería de Imágenes</label>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative aspect-[4/5] rounded-lg overflow-hidden border border-zinc-200 group">
                                        <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <div className="border-2 border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-zinc-50 transition-colors relative aspect-[4/5]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    setTempImageSrc(reader.result as string);
                                                    setCropperOpen(true);
                                                };
                                                reader.readAsDataURL(file);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center justify-center pointer-events-none text-zinc-400">
                                        <Plus size={24} className="mb-2" />
                                        <span className="text-xs font-medium text-center">Agregar Imagen</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {cropperOpen && tempImageSrc && (
                            <ImageCropper
                                imageSrc={tempImageSrc}
                                onCancel={() => {
                                    setCropperOpen(false);
                                    setTempImageSrc(null);
                                }}
                                onCropComplete={async (croppedBlob) => {
                                    try {
                                        const file = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
                                        const result = await api.uploadImage(file);
                                        console.log('Image uploaded successfully:', result);

                                        if (result.secure_url) {
                                            setFormData(prev => {
                                                console.log('Previous images:', prev.images);
                                                const newImages = [...(prev.images || []), result.secure_url];
                                                console.log('New images list:', newImages);
                                                return {
                                                    ...prev,
                                                    images: newImages
                                                };
                                            });
                                        } else {
                                            console.error('No secure_url in response:', result);
                                            toast.error('Error: No se recibió la URL de la imagen');
                                        }

                                        setCropperOpen(false);
                                        setTempImageSrc(null);
                                    } catch (error: any) {
                                        console.error('Error uploading cropped image:', error);
                                        console.error('Error details:', error.response?.data);
                                        toast.error(`Error al subir imagen: ${error.message || 'Desconocido'}`);
                                    }
                                }}
                            />
                        )}

                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide block">Talles Disponibles</label>
                            <div className="flex flex-wrap gap-3">
                                {Object.values(Size).map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSizeToggle(size)}
                                        className={`h-10 w-14 rounded-lg text-sm font-medium transition-all ${formData.sizes.includes(size)
                                            ? 'bg-zinc-900 text-white shadow-md transform scale-105'
                                            : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {formData.sizes.length > 0 && (
                            <div className="space-y-3 animate-fade-in">
                                <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide block">Stock por Talle</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {formData.sizes.map(size => (
                                        <div key={size} className="space-y-1">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase">{size}</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 outline-none transition-all"
                                                value={formData.stock[size] || 0}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    stock: { ...prev.stock, [size]: Number(e.target.value) }
                                                }))}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex gap-4 pt-6 border-t border-zinc-100 mt-8">
                            <button
                                type="submit"
                                className="w-full bg-zinc-900 text-white py-4 rounded-lg font-bold tracking-widest hover:bg-black transition-all shadow-lg text-sm uppercase"
                            >
                                Publicar Producto
                            </button>
                        </div>
                    </form >
                </div >
            )}
            {/* Preview Modal */}
            {previewProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewProduct(null)} />
                    <div className="relative z-10 w-full max-w-sm">
                        <div className="bg-[#FDFCF9] rounded-xl overflow-hidden shadow-2xl transform transition-all">
                            <div className="absolute top-4 right-4 z-20">
                                <button onClick={() => setPreviewProduct(null)} className="bg-white/50 hover:bg-white p-2 rounded-full backdrop-blur-sm transition-all">
                                    <svg className="w-5 h-5 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <ProductCard product={previewProduct} onClick={() => { }} />
                        </div>
                        <p className="text-center text-white mt-4 text-sm opacity-80">Vista previa de tarjeta</p>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Products;
