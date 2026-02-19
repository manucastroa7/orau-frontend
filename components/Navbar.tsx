
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onAdminClick: () => void;
  isAdmin: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick, isAdmin, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex-1 hidden md:flex space-x-8 text-xs uppercase tracking-[0.2em] font-medium">
          <a href="#" className="hover:text-brand-taupe transition-colors">Colección</a>
          <a href="#about" className="hover:text-brand-taupe transition-colors">Identidad</a>
        </div>

        <div className="flex-1 flex justify-center">
          <div
            className="cursor-pointer transition-all duration-500"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {isScrolled ? (
              <div className="h-12 w-32 relative overflow-hidden flex items-center justify-center">
                <img
                  src="/logo-dorado.png"
                  alt="ORAU"
                  className="absolute inset-0 w-full h-full object-contain scale-[3.5] animate-fade-in drop-shadow-sm"
                />
              </div>
            ) : (
              <h1 className="brand-font text-3xl tracking-tighter whitespace-nowrap animate-fade-in">
                ORGULLO AUSTRAL
              </h1>
            )}
          </div>
        </div>

        <div className="flex-1 flex justify-end space-x-6 items-center">
          {isAdmin ? (
            <div className="flex items-center gap-4">
              <button
                onClick={onAdminClick}
                className="text-[10px] uppercase tracking-widest hover:text-brand-taupe transition-colors font-bold"
              >
                Panel
              </button>
              <button
                onClick={onLogout}
                className="text-[10px] uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <button
              onClick={onAdminClick}
              className="text-[10px] uppercase tracking-widest hover:text-brand-taupe transition-colors"
            >
              Admin
            </button>
          )}
          {/* Shopping Cart - Hidden until store launch
          <button className="relative group">
            <svg className="w-5 h-5 group-hover:text-brand-taupe transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-brand-taupe text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </button>
          */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
