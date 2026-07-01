import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const gst = subtotal * 0.12; // 12% GST
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const grandTotal = subtotal + gst + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Looks like you haven't added any medicines to your cart yet.</p>
        <Link to="/search" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-semibold transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                <img src={item.image} alt={item.name} className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{item.genericName}</p>
                <div className="text-lg font-bold text-primary">₹{item.price} <span className="text-sm text-slate-400 line-through font-normal">₹{item.mrp}</span></div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-slate-900 dark:text-white">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>GST (12%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Delivery Charge</span>
                {deliveryCharge === 0 ? (
                  <span className="font-semibold text-success">Free</span>
                ) : (
                  <span className="font-semibold text-slate-900 dark:text-white">₹{deliveryCharge.toFixed(2)}</span>
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <span className="text-base font-bold text-slate-900 dark:text-white">Grand Total</span>
                <span className="text-xl font-bold text-primary">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>
            
            <div className="mt-4 text-xs text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-success" />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
