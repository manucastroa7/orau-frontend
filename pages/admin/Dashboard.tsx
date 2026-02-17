import React from 'react';
import { SOL_DE_MAYO_SVG } from '../../constants'; // Assuming constants is in src/constants.tsx, adjusting import path
// Fix import path locally since I don't know exact structure yet, assuming relative from src/pages/admin
// Wait, file structure check:
// d:/proyectos/orau/frontend/src/pages/admin/Dashboard.tsx
// d:/proyectos/orau/frontend/src/constants.tsx
// relative path: ../../constants

const Dashboard: React.FC = () => {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-800 tracking-tight">Dashboard</h2>
                <p className="text-zinc-500 mt-2">Bienvenido al panel de administración de ORAU.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-[#C5A059]">
                        {/* Using a placeholder or SVG if import works, strictly text for now to avoid complexity if import fails */}
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="40" /></svg>
                    </div>
                    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Ventas del Mes</h3>
                    <p className="text-3xl font-bold text-zinc-900">€0.00</p>
                    <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                        <span>+0%</span>
                        <span className="text-zinc-400">vs mes anterior</span>
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Pedidos Activos</h3>
                    <p className="text-3xl font-bold text-zinc-900">0</p>
                    <p className="text-xs text-zinc-400 mt-2">Pendientes de envío</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Total Productos</h3>
                    <p className="text-3xl font-bold text-zinc-900">-</p>
                    {/* We'll connect this to real data later */}
                    <p className="text-xs text-zinc-400 mt-2">En catálogo</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-8 text-center py-20">
                <div className="text-[#C5A059] mx-auto w-16 h-16 mb-4 opacity-20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                </div>
                <h3 className="text-lg font-medium text-zinc-900">Actividad Reciente</h3>
                <p className="text-zinc-500 max-w-sm mx-auto mt-2 text-sm">No hay actividad reciente para mostrar. Las nuevas ventas y actualizaciones de stock aparecerán aquí.</p>
            </div>
        </div>
    );
};

export default Dashboard;
