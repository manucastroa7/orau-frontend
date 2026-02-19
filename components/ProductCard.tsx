
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FDFCF9] shadow-inner border border-zinc-100/50 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain bg-transparent transition-transform duration-700 group-hover:scale-105"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white text-zinc-800 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white text-zinc-800 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                  {product.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all shadow-sm ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50 w-1'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-zinc-300 flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest">Sin Imagen</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <button className="bg-white text-black px-6 py-3 text-[10px] uppercase tracking-widest font-semibold hover:bg-brand-taupe hover:text-white transition-all shadow-md">
            Ver Detalle
          </button>
        </div>
      </div>
      <div className="mt-6 text-center">
        <h3 className="text-sm font-medium tracking-wide uppercase">{product.name}</h3>
        <p className="mt-1 text-zinc-500 text-sm tracking-widest">{product.price}€</p>
        <div className="mt-2 flex justify-center space-x-2">
          {product.sizes.map(size => (
            <span key={size} className="text-[10px] text-zinc-400 border border-zinc-200 px-1.5 py-0.5">{size}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
