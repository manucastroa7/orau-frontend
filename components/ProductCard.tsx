
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      className="group cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FDFCF9] shadow-inner border border-zinc-100/50 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain bg-transparent transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-zinc-300 flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest">Sin Imagen</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button className="bg-white text-black px-6 py-3 text-[10px] uppercase tracking-widest font-semibold hover:bg-brand-taupe hover:text-white transition-all">
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
