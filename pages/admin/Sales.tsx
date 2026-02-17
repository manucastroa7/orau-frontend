import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Product, Sale } from '../../types';
import { Plus, DollarSign, TrendingUp, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Sales: React.FC = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    // New fields
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
    // New fields


    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [salesData, productsData] = await Promise.all([
                api.getSales(),
                api.getProducts()
            ]);
            setSales(salesData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error loading data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSale = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const saleData = {
                productId: selectedProduct,
                size: selectedSize,
                quantity,
                paymentMethod,
                customerName,
                customerEmail,
                customerPhone,
                date: customDate
            };

            if (editingId) {
                await api.updateSale(editingId, saleData);
                toast.success('Venta actualizada con éxito');
            } else {
                await api.createSale(saleData);
                toast.success('Venta registrada con éxito');
            }

            closeForm();
            loadData(); // Reload to update stock and history
        } catch (error: any) {
            console.error('Error registering sale', error);
            toast.error(error.response?.data?.message || 'Error al procesar venta');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta venta? El stock será devuelto.')) return;
        try {
            await api.deleteSale(id);
            toast.success('Venta eliminada');
            loadData();
        } catch (error) {
            console.error('Error deleting sale', error);
            toast.error('Error al eliminar venta');
        }
    };

    const handleEdit = (sale: Sale) => {
        setEditingId(sale.id);
        setSelectedProduct(sale.product?.id || '');
        // Note: checking if stock exists for this size might be tricky if it's 0 but was valid. 
        // We trust the value from the sale.
        setSelectedSize(sale.size);
        setQuantity(sale.quantity);
        setPaymentMethod(sale.paymentMethod || 'Efectivo');
        setCustomerName(sale.customerName || '');
        setCustomerEmail(sale.customerEmail || '');
        setCustomerPhone(sale.customerPhone || '');
        setCustomDate(new Date(sale.date).toISOString().split('T')[0]);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        // Reset form
        setSelectedProduct('');
        setSelectedSize('');
        setQuantity(1);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setPaymentMethod('Efectivo');
        setCustomDate(new Date().toISOString().split('T')[0]);
    };

    // Derived values
    const selectedProductDetails = products.find(p => p.id === selectedProduct);
    const availableStock = selectedProductDetails && selectedSize
        ? (selectedProductDetails.stock[selectedSize] || 0)
        : 0;

    const totalAmount = selectedProductDetails ? selectedProductDetails.price * quantity : 0;
    const totalRevenue = sales.reduce((acc, sale) => acc + Number(sale.totalPrice), 0);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 tracking-tight">Ventas</h2>
                    <p className="text-zinc-500 mt-2 text-sm">Registra ventas y controla el stock</p>
                </div>
                <button
                    onClick={() => {
                        closeForm(); // Ensure clean state
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-all shadow-lg text-sm font-medium tracking-wide"
                >
                    <Plus size={18} />
                    <span>Registrar Venta</span>
                </button>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-lg text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Ingresos Totales</p>
                            <h3 className="text-2xl font-bold text-zinc-900">€{totalRevenue.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Ventas Realizadas</p>
                            <h3 className="text-2xl font-bold text-zinc-900">{sales.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-semibold text-zinc-700">Historial de Ventas</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Fecha / Pago</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Detalle</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {sales.map(sale => (
                                <tr key={sale.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-zinc-600">
                                        <div className="font-medium text-zinc-900">{new Date(sale.date).toLocaleDateString()}</div>
                                        <div className="text-xs text-zinc-400">{sale.paymentMethod || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {sale.product?.imageUrl && (
                                                <img src={sale.product.imageUrl} className="w-8 h-8 rounded object-cover bg-transparent border border-zinc-200" />
                                            )}
                                            <span className="text-sm font-medium text-zinc-900">{sale.product?.name || 'Producto Eliminado'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">
                                        <div className="font-medium">{sale.customerName || 'Cliente Casual'}</div>
                                        <div className="text-xs text-zinc-400">{sale.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">
                                        <span className="bg-zinc-100 px-2 py-1 rounded text-xs font-bold mr-2">{sale.size}</span>
                                        <span className="text-xs text-zinc-500">x{sale.quantity}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-zinc-900">
                                        €{sale.totalPrice}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(sale)}
                                                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sale.id)}
                                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sales.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-sm">
                                        No hay ventas registradas aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-zinc-900">{editingId ? 'Editar Venta' : 'Registrar Nueva Venta'}</h3>
                            <button onClick={closeForm} className="text-zinc-400 hover:text-zinc-600">✕</button>
                        </div>

                        <form onSubmit={handleRegisterSale} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Producto</label>
                                <select
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 outline-none"
                                    value={selectedProduct}
                                    onChange={e => {
                                        setSelectedProduct(e.target.value);
                                        setSelectedSize('');
                                    }}
                                >
                                    <option value="">Seleccionar producto...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedProductDetails && (
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Talle</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProductDetails.sizes.map(size => {
                                            const stock = selectedProductDetails.stock[size] || 0;
                                            const noStock = stock <= 0;
                                            return (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    disabled={noStock}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-3 py-2 rounded text-sm border transition-all ${selectedSize === size
                                                        ? 'bg-zinc-900 text-white border-zinc-900'
                                                        : noStock
                                                            ? 'bg-zinc-100 text-zinc-300 border-zinc-100 cursor-not-allowed'
                                                            : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                                                        }`}
                                                >
                                                    {size} ({stock})
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Fecha</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 outline-none"
                                        value={customDate}
                                        onChange={e => setCustomDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Pago</label>
                                    <select
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 outline-none"
                                        value={paymentMethod}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Tarjeta">Tarjeta</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-zinc-100">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase">Datos del Cliente</h4>
                                <input
                                    type="text"
                                    placeholder="Nombre y Apellido"
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 outline-none"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="email"
                                        placeholder="Email (opcional)"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 outline-none"
                                        value={customerEmail}
                                        onChange={e => setCustomerEmail(e.target.value)}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Teléfono (opcional)"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 outline-none"
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Cantidad</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max={availableStock || 1}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-200 outline-none"
                                    value={quantity}
                                    onChange={e => setQuantity(Number(e.target.value))}
                                />
                                {selectedProduct && selectedSize && quantity > availableStock && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertTriangle size={12} /> Excede el stock disponible ({availableStock})
                                    </p>
                                )}
                            </div>

                            {selectedProductDetails && (
                                <div className="bg-zinc-50 p-4 rounded-lg flex justify-between items-center border border-zinc-100">
                                    <span className="text-sm text-zinc-600">Total a pagar:</span>
                                    <span className="text-xl font-bold text-zinc-900">€{totalAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!selectedProduct || !selectedSize || quantity > availableStock}
                                className="w-full bg-black text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                            >
                                {editingId ? 'Actualizar Venta' : 'Confirmar Venta'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sales;
