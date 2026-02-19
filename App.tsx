import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import { Product, Size, Category } from './types';
import { SOL_DE_MAYO_SVG } from './constants';
import { api } from './services/api';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Sales from './pages/admin/Sales';
import Leads from './pages/admin/Leads';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster, toast } from 'sonner';
import ContactModal from './components/ContactModal';
import WhatsAppFloat from './components/WhatsAppFloat';

const PublicHome: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate();

    // Reset size when product changes
    useEffect(() => {
        if (selectedProduct) {
            setSelectedSize(null);
            setCurrentImageIndex(0);
        }
    }, [selectedProduct]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsData, categoriesData] = await Promise.all([
                api.getProducts(),
                api.getCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error loading data', error);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.login(loginForm);
            if (response && response.token) {
                login(response.user, response.token);
                setShowLogin(false);
                navigate('/admin/dashboard');
            }
        } catch (error) {
            toast.error('Credenciales incorrectas');
        }
    };

    const handleAdminClick = () => {
        if (isAuthenticated) {
            navigate('/admin/dashboard');
        } else {
            setShowLogin(true);
        }
    };

    const toggleCategory = (categoryId: string) => {
        if (categoryId === 'all') {
            setSelectedCategories([]);
            return;
        }
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId]
        );
    };

    const filteredProducts = selectedCategories.length === 0
        ? products
        : products.filter(p => selectedCategories.includes(p.categoryRelation?.id || '') || selectedCategories.includes(p.category || ''));

    return (
        <div className="min-h-screen">
            <Navbar
                onAdminClick={handleAdminClick}
                isAdmin={isAuthenticated}
                onLogout={logout}
            />

            {/* Hero Section */}
            <section className="h-screen relative overflow-hidden flex items-center justify-center bg-[#FDFCF9]">
                {/* LARGE GOLD SUN BACKGROUND ELEMENT - Authentic Argentine Sun */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#C5A059] opacity-[0.05] pointer-events-none z-0">
                    {SOL_DE_MAYO_SVG("w-[700px] h-[700px] md:w-[900px] md:h-[900px] animate-[spin_120s_linear_infinite]")}
                </div>

                <div className="absolute inset-0 z-0">
                    <img
                        src="/fondo-mar.png"
                        className="w-full h-full object-cover opacity-20 filter grayscale contrast-125"
                        alt="Mar Argentino Textura"
                    />
                </div>



                <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 h-full pt-20">
                    <div className="flex justify-center mb-4 text-[#C5A059] sun-glow">
                        {SOL_DE_MAYO_SVG("w-12 h-12")}
                    </div>

                    <span className="text-[10px] uppercase tracking-[0.5em] text-brand-taupe font-bold mb-0 block animate-fade-in relative z-20">
                        España & Argentina unidos
                    </span>

                    <div className="flex justify-center -my-12 md:-my-32 relative z-10 w-full pointer-events-none">
                        <img
                            src="/logo-oscuro.png"
                            alt="Orgullo Austral"
                            className="h-64 md:h-[42rem] w-auto object-contain drop-shadow-sm scale-125 md:scale-110"
                        />
                    </div>

                    <p className="max-w-xl mx-auto text-zinc-900 text-lg md:text-xl leading-relaxed font-normal tracking-[0.2em] mb-10 relative z-20 text-center -mt-12 md:-mt-24">
                        Un viaje hecho prenda
                    </p>

                    <a
                        href="#products"
                        className="inline-block border border-black px-12 py-5 text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500 font-medium bg-white/50 backdrop-blur-sm relative z-20 mb-12"
                    >
                        Explorar Colección
                    </a>

                    <div className="flex flex-col items-center gap-2 relative z-20">
                        <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-400">Descubre más</span>
                        <div className="animate-bounce">
                            <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section >

            {/* About / Identity Section */}
            < section id="about" className="py-32 px-6 bg-white relative" >
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <div className="absolute -top-10 -left-10 text-[#C5A059] opacity-[0.06] -z-10">
                            {SOL_DE_MAYO_SVG("w-56 h-56")}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <img src="/img1.jpeg" className="w-full h-auto object-cover" />
                            <img src="/img2.jpeg" className="w-full h-auto mt-12 object-cover" />
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="text-[#C5A059]">
                            {SOL_DE_MAYO_SVG("w-12 h-12")}
                        </div>
                        <h3 className="text-4xl brand-font leading-tight">Un detalle que reconocés sin que nadie te lo explique.</h3>
                        <div className="w-20 h-px bg-brand-taupe"></div>
                        <p className="text-zinc-500 leading-loose text-lg font-light">
                            ORAU nace entre Argentina y Europa.<br />
                            Es distancia. Es raíces. Es pertenencia.<br />
                            Es lo que usamos cuando queremos sentirnos un poco más cerca.
                        </p>
                    </div>
                </div>
            </section >

            {/* Product Grid */}
            < section id="products" className="py-32 px-6 bg-brand-cream relative overflow-hidden" >
                {/* Subtle pattern background */}
                < div className="absolute top-0 right-0 p-20 text-[#C5A059] opacity-[0.03] pointer-events-none" >
                    {SOL_DE_MAYO_SVG("w-96 h-96")}
                </div >

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
                        <div>
                            <h2 className="text-5xl brand-font">Nueva Temporada</h2>
                            <p className="text-xs uppercase tracking-[0.4em] text-brand-taupe mt-4 font-bold">Identidad Austral • Invierno 2025</p>
                        </div>
                        <div className="flex space-x-8 text-[10px] uppercase tracking-widest border-b border-zinc-200 pb-2 overflow-x-auto">
                            <button
                                onClick={() => toggleCategory('all')}
                                className={`pb-2 transition-colors ${selectedCategories.length === 0 ? 'font-bold border-b-2 border-brand-taupe' : 'hover:text-brand-taupe'}`}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`pb-2 transition-colors whitespace-nowrap ${selectedCategories.includes(cat.id) ? 'font-bold border-b-2 border-brand-taupe' : 'hover:text-brand-taupe'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={setSelectedProduct}
                            />
                        ))}
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-zinc-950 text-white py-24 px-6 relative overflow-hidden" >
                <div className="absolute bottom-0 right-0 text-white opacity-[0.02] translate-y-1/2 translate-x-1/4">
                    {SOL_DE_MAYO_SVG("w-[600px] h-[600px]")}
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-4 mb-8">
                            <h4 className="brand-font text-4xl">ORAU</h4>
                            <div className="text-[#C5A059]">
                                {SOL_DE_MAYO_SVG("w-8 h-8")}
                            </div>
                        </div>
                        <p className="text-zinc-500 max-w-sm text-sm leading-loose tracking-wide font-light">
                            Orgullo Austral es una marca de indumentaria casual moderna creada en España con identidad argentina en cada detalle. Diseño minimalista con alma austral.
                        </p>
                    </div>
                    <div>
                        <h5 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 text-zinc-400">Contacto</h5>
                        <ul className="space-y-4 text-sm text-zinc-300 font-light">
                            <li className="hover:text-[#C5A059] transition-colors cursor-pointer">orgullo.au@gmail.com</li>
                            <li>Málaga, España</li>
                            <li className="hover:text-[#C5A059] transition-colors cursor-pointer">@orgullo.austral</li>
                            <li
                                className="text-[#C5A059] cursor-pointer hover:text-white transition-colors mt-6 block font-medium"
                                onClick={() => setShowContactForm(true)}
                            >
                                Escribinos →
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 text-zinc-400">Explorar</h5>
                        <ul className="space-y-4 text-sm text-zinc-300 font-light">
                            <li><a href="#products" className="hover:text-[#C5A059] transition-colors">Productos</a></li>
                            <li><a href="#about" className="hover:text-[#C5A059] transition-colors">Identidad</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-zinc-900 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                    <p>© 2025 ORAU - ORGULLO AUSTRAL | ESPAÑA</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">TikTok</a>
                    </div>
                </div>
            </footer >

            {/* Modals */}
            {
                selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
                        <div className="relative bg-white w-full max-w-4xl h-full max-h-[90vh] md:max-h-[80vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 z-20 p-2 bg-white/50 backdrop-blur-md hover:bg-white rounded-full transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div className="md:w-1/2 h-80 md:h-auto overflow-hidden relative bg-white group">
                                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                    <>
                                        <img
                                            src={selectedProduct.images[currentImageIndex] || selectedProduct.images[0]}
                                            className="w-full h-full object-contain transition-opacity duration-300"
                                        />
                                        {selectedProduct.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentImageIndex(prev => prev === 0 ? selectedProduct.images.length - 1 : prev - 1);
                                                    }}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-zinc-400 hover:text-zinc-800 p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentImageIndex(prev => prev === selectedProduct.images.length - 1 ? 0 : prev + 1);
                                                    }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-zinc-400 hover:text-zinc-800 p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" /></svg>
                                                </button>
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                    {selectedProduct.images.map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-zinc-800 w-3' : 'bg-zinc-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50">
                                        <span className="text-sm uppercase tracking-widest">Sin Imagen</span>
                                    </div>
                                )}
                                <div className="absolute top-8 left-8 text-[#C5A059] p-3 bg-white/20 backdrop-blur-md rounded-full shadow-lg">
                                    {SOL_DE_MAYO_SVG("w-10 h-10")}
                                </div>
                            </div>
                            <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-[#FDFCF9]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-400">{selectedProduct.category}</span>
                                    <div className="text-[#C5A059]">
                                        {SOL_DE_MAYO_SVG("w-4 h-4")}
                                    </div>
                                </div>
                                <h2 className="text-4xl brand-font mb-4">{selectedProduct.name}</h2>
                                <p className="text-2xl font-light mb-8 text-brand-taupe">{selectedProduct.price}€</p>
                                <p className="text-zinc-500 text-sm leading-loose mb-10 font-light tracking-wide italic">
                                    {selectedProduct.description}
                                </p>

                                <div className="mb-12">
                                    <p className="text-[10px] uppercase tracking-widest font-bold mb-6 text-zinc-400">Talles Disponibles</p>
                                    <div className="flex flex-wrap gap-4">
                                        {selectedProduct.sizes
                                            .filter(size => (selectedProduct.stock?.[size] || 0) > 0)
                                            .map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                                                    className={`w-14 h-14 border text-[10px] font-bold tracking-widest transition-all uppercase ${selectedSize === size
                                                        ? 'bg-zinc-900 text-white border-zinc-900 transform scale-105 shadow-md'
                                                        : 'border-zinc-200 hover:border-black hover:bg-zinc-50'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        {selectedProduct.sizes.filter(size => (selectedProduct.stock?.[size] || 0) > 0).length === 0 && (
                                            <p className="text-xs text-red-400 italic">Sin stock disponible online</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowContactForm(true)}
                                        className="flex-1 bg-black text-white py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-zinc-800 transition-all shadow-xl"
                                    >
                                        Email
                                    </button>
                                    <a
                                        href={`https://wa.me/5491137766748?text=${encodeURIComponent(
                                            selectedSize
                                                ? `Hola, estoy interesado en el producto "${selectedProduct.name}" en talle ${selectedSize}.`
                                                : `Hola, estoy interesado en el producto "${selectedProduct.name}".`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-[#25D366] text-white py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#20bd5a] transition-all shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                        </svg>
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Contact Modal */}
            {
                showContactForm && selectedProduct && (
                    <ContactModal
                        product={selectedProduct}
                        onClose={() => setShowContactForm(false)}
                        initialMessage={
                            selectedSize
                                ? `Hola, estoy interesado en el producto "${selectedProduct.name}" en talle ${selectedSize}.`
                                : `Hola, estoy interesado en el producto "${selectedProduct.name}". (Por favor indicar talle preferido)`
                        }
                    />
                )
            }

            {/* Login Modal */}
            {
                showLogin && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogin(false)} />
                        <div className="relative bg-white p-12 max-w-md w-full shadow-2xl text-center">
                            <div className="flex justify-center mb-8 text-[#C5A059]">
                                {SOL_DE_MAYO_SVG("w-14 h-14")}
                            </div>
                            <h3 className="text-2xl brand-font mb-8 uppercase tracking-widest">Acceso Gestión</h3>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <input
                                    type="text"
                                    placeholder="USUARIO"
                                    required
                                    className="w-full border-b border-zinc-300 py-4 text-[10px] tracking-widest focus:border-brand-taupe outline-none transition-colors uppercase"
                                    value={loginForm.username}
                                    onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                                />
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="CONTRASEÑA"
                                        required
                                        className="w-full border-b border-zinc-300 py-4 text-[10px] tracking-widest focus:border-brand-taupe outline-none transition-colors uppercase pr-10"
                                        value={loginForm.password}
                                        onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                                <button className="w-full bg-brand-taupe text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold mt-8 shadow-lg hover:bg-zinc-800 transition-all">
                                    Ingresar
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            <WhatsAppFloat />
        </div >
    );
}

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster position="bottom-right" richColors />
                <Routes>
                    <Route path="/" element={<PublicHome />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="products" element={<Products />} />
                            <Route path="categories" element={<Categories />} />
                            <Route path="sales" element={<Sales />} />
                            <Route path="leads" element={<Leads />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
