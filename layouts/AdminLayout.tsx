import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Truck, LogOut, Tags, ExternalLink, DollarSign, Users } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-zinc-50">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 text-white flex flex-col">
                <div className="p-6 border-b border-zinc-800">
                    <h1 className="text-xl font-bold tracking-widest text-[#C5A059]">ORAU ADMIN</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-zinc-800 text-[#C5A059]' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`
                        }
                    >
                        <LayoutDashboard size={20} />
                        <span className="text-sm font-medium tracking-wide">Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-zinc-800 text-[#C5A059]' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`
                        }
                    >
                        <Package size={20} />
                        <span className="text-sm font-medium tracking-wide">Productos</span>
                    </NavLink>

                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-zinc-800 text-[#C5A059]' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`
                        }
                    >
                        <Tags size={20} />
                        <span className="text-sm font-medium tracking-wide">Categorías</span>
                    </NavLink>

                    <NavLink
                        to="/admin/sales"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-zinc-800 text-[#C5A059]' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`
                        }
                    >
                        <DollarSign size={20} />
                        <span className="text-sm font-medium tracking-wide">Ventas</span>
                    </NavLink>

                    <NavLink
                        to="/admin/leads"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-zinc-800 text-[#C5A059]' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`
                        }
                    >
                        <Users size={20} />
                        <span className="text-sm font-medium tracking-wide">Clientes</span>
                    </NavLink>

                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors mt-2 border border-zinc-800"
                    >
                        <ExternalLink size={20} />
                        <span className="text-sm font-medium tracking-wide">Ver Sitio Web</span>
                    </a>

                    <div className="pt-4 mt-4 border-t border-zinc-800">
                        <h3 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Próximamente</h3>
                        <div className="flex items-center gap-3 px-4 py-3 text-zinc-600 cursor-not-allowed">
                            <Truck size={20} />
                            <span className="text-sm font-medium tracking-wide">Stock & Envíos</span>
                        </div>
                    </div>
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-medium tracking-wide">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
