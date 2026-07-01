import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Wallet, Banknote, Loader2, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid 10-digit phone number"),
  address: z.string().min(10, "Address must be detailed"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Invalid 6-digit pincode"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  instructions: z.string().optional()
});

export default function Checkout() {
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema)
  });

  const handleGetLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationLoading(false);
        toast.success('Live location captured successfully!');
      },
      (error) => {
        setLocationLoading(false);
        let errorMsg = "Failed to get location";
        if(error.code === 1) errorMsg = "Please allow location permission";
        toast.error(errorMsg);
      },
      { enableHighAccuracy: true }
    );
  };

  const { currentUser, userData } = useAuth();

  const onSubmit = async (data) => {
    if (!location) {
      toast.error("Please capture your live GPS location before placing the order");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../../config/firebase');

      const orderData = {
        userId: currentUser?.uid || 'guest',
        userEmail: currentUser?.email || '',
        shippingInfo: data,
        location,
        paymentMethod,
        items,
        total: items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      toast.success("Order Placed Successfully!");
      navigate('/orders');
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const gst = subtotal * 0.12;
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const grandTotal = subtotal + gst + deliveryCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Delivery Address */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Delivery Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input {...register('name')} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
                {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input {...register('phone')} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
                {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Address</label>
              <textarea {...register('address')} rows="3" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
              {errors.address && <p className="text-rose-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pincode</label>
                <input {...register('pincode')} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
                {errors.pincode && <p className="text-rose-500 text-xs mt-1">{errors.pincode.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                <input {...register('city')} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
                {errors.city && <p className="text-rose-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State</label>
                <input {...register('state')} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
                {errors.state && <p className="text-rose-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
            </div>

            {/* Live Location Capture */}
            <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-primary mb-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Live GPS Location
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Capture your precise location to help our delivery partners find you easily.
                  </p>
                </div>
                {location && <CheckCircle2 className="w-6 h-6 text-success" />}
              </div>
              
              <button 
                type="button" 
                onClick={handleGetLocation}
                className="bg-white dark:bg-slate-800 text-primary border border-primary/30 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
                disabled={locationLoading}
              >
                {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                {location ? 'Location Captured (Click to update)' : 'Capture Live Location'}
              </button>
              {location && (
                <p className="text-xs text-slate-500 mt-2 font-mono">
                  Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                </p>
              )}
            </div>

          </div>

          {/* Payment Options */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Payment Options</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                <Banknote className={`w-6 h-6 mr-3 ${paymentMethod === 'cod' ? 'text-primary' : 'text-slate-400'}`} />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Cash on Delivery</div>
                  <div className="text-xs text-slate-500">Pay when you receive the medicines</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Details</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-slate-50 rounded-lg" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{item.name}</div>
                      <div className="text-xs text-slate-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-slate-100 dark:border-slate-800 pt-4 mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>GST (12%)</span>
                <span className="font-semibold">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Delivery Charge</span>
                <span className="font-semibold">{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <span className="text-base font-bold text-slate-900 dark:text-white">To Pay</span>
                <span className="text-xl font-bold text-primary">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Processing Payment...</>
              ) : (
                `Place Order • ₹${grandTotal.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
