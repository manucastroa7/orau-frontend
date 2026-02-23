import React, { useRef, useState, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCarouselProps {
    products: Product[];
    onProductClick: (product: Product) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, onProductClick }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [products]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group/carousel">
            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[280px] md:min-w-[320px] lg:min-w-[280px] snap-start">
                        <ProductCard
                            product={product}
                            onClick={onProductClick}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 z-30 bg-white shadow-xl border border-zinc-100 p-3 rounded-full hover:bg-brand-taupe hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hidden md:block"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            {showRightArrow && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 z-30 bg-white shadow-xl border border-zinc-100 p-3 rounded-full hover:bg-brand-taupe hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hidden md:block"
                    aria-label="Siguiente"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}

            {/* Mobile hint: fade edges or simple scroll is enough usually, but we could add visual cues */}
            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
};

export default ProductCarousel;
