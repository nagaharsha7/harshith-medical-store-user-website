import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';

const MedicineCard = ({ medicine }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(medicine);
    toast.success(`${medicine.name} added to cart`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  const discountPercentage = Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100);
  
  // Calculate if medicine is in stock based on Firestore stockQuantity, falling back to mock data's inStock boolean
  const isInStock = medicine.stockQuantity !== undefined 
    ? medicine.stockQuantity > 0 
    : medicine.inStock !== false;

  return (
    <Link to={`/medicine/${medicine.id}`} className="group relative bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col h-full">
      
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          {discountPercentage}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button 
        onClick={handleToggleWishlist}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Image */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-4">
        <img 
          src={medicine.image || medicine.imageUrl} 
          alt={medicine.name} 
          className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
        {!isInStock && (
          <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-grow">
        <div className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">{medicine.category}</div>
        <h3 className="font-bold text-slate-900 dark:text-slate-50 text-lg mb-1 line-clamp-2">{medicine.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">By {medicine.brand}</p>
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 truncate">{medicine.genericName}</div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{medicine.rating || '4.5'}</span>
          <span className="text-xs text-slate-400">({medicine.reviews || '0'})</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-50">₹{medicine.price}</div>
            {discountPercentage > 0 && (
              <div className="text-sm text-slate-400 line-through">₹{medicine.mrp}</div>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="flex items-center justify-center bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MedicineCard;
