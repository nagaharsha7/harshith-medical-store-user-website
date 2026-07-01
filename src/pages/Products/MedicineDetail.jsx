import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, ShieldCheck, ArrowLeft, Star, Heart, FileText, Info, AlertTriangle, Archive } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import toast from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
const RELATED_MEDICINES = [
  { id: '2', name: 'Benadryl Cough Syrup', genericName: 'Diphenhydramine', brand: 'Johnson & Johnson', category: 'Syrups', mrp: 120, price: 105, rating: 4.5, reviews: 856, inStock: true, image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80' },
  { id: '3', name: 'Volini Pain Relief Gel', genericName: 'Diclofenac', brand: 'Sun Pharma', category: 'Personal Care', mrp: 150, price: 135, rating: 4.6, reviews: 543, inStock: true, image: 'https://images.unsplash.com/photo-1550572017-edb79a528e21?w=400&q=80' },
];

export default function MedicineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const docRef = doc(db, 'medicines', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMedicine({ id: docSnap.id, ...docSnap.data() });
        } else {
          setMedicine(null);
        }
      } catch (error) {
        console.error("Error fetching medicine:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

  if (loading) {
    return <div className="text-center py-24 text-slate-500">Loading medicine details...</div>;
  }

  if (!medicine) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Medicine Not Found</h2>
        <Link to="/search" className="text-primary hover:underline">Return to Search</Link>
      </div>
    );
  }

  const discountPercentage = Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100);

  const isInStock = medicine.stockQuantity !== undefined 
    ? medicine.stockQuantity > 0 
    : medicine.inStock !== false;

  const handleAddToCart = () => {
    addItem(medicine);
    toast.success(`${medicine.name} added to cart`);
  };

  const handleBuyNow = () => {
    addItem(medicine);
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <span>/</span>
        <Link to="/search" className="hover:text-primary transition-colors">Products</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">{medicine.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center relative">
          <button 
            onClick={handleToggleWishlist}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
          >
            <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          {discountPercentage > 0 && (
            <div className="absolute top-6 left-6 z-10 bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
              {discountPercentage}% OFF
            </div>
          )}
          <img src={medicine.image} alt={medicine.name} className="max-w-full h-auto object-contain max-h-[400px]" />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{medicine.category}</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{medicine.name}</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">By <span className="font-semibold text-slate-700 dark:text-slate-300">{medicine.brand}</span></p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg font-bold">
              <Star className="w-4 h-4 fill-yellow-600 text-yellow-600" />
              {medicine.rating}
            </div>
            <span className="text-slate-500 text-sm">{medicine.reviews} Ratings & Reviews</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 mb-1">Composition</p>
            <p className="font-semibold text-slate-900 dark:text-white">{medicine.composition}</p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-end gap-4 mb-2">
              <span className="text-4xl font-extrabold text-primary">₹{medicine.price}</span>
              {discountPercentage > 0 && (
                <>
                  <span className="text-xl text-slate-400 line-through mb-1">₹{medicine.mrp}</span>
                  <span className="text-sm font-bold text-success mb-2">Save ₹{medicine.mrp - medicine.price}</span>
                </>
              )}
            </div>
            <p className="text-sm text-slate-500">Inclusive of all taxes</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="flex-1 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={!isInStock}
              className="flex-1 bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-5 h-5" /> Buy Now
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 pt-4">
            <div className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-success" /> Genuine Product</div>
            <div className="flex items-center gap-1"><Archive className="w-4 h-4 text-primary" /> Returnable within 7 days</div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-16">
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 no-scrollbar mb-8">
          {[
            { id: 'description', label: 'Description', icon: FileText },
            { id: 'uses', label: 'Uses & Benefits', icon: Heart },
            { id: 'dosage', label: 'Dosage', icon: Info },
            { id: 'sideEffects', label: 'Side Effects', icon: AlertTriangle },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 min-h-[200px]">
          {activeTab === 'description' && (
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold mb-4">About {medicine.name}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{medicine.description}</p>
              
              <h4 className="text-lg font-bold mt-8 mb-3">Storage Instructions</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{medicine.storage}</p>
            </div>
          )}

          {activeTab === 'uses' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Uses of {medicine.name}</h3>
              <ul className="space-y-3">
                {medicine.uses.map((use, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-primary"></div> {use}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'dosage' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Directions for Use</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{medicine.dosage}</p>
              {medicine.rxRequired && (
                <div className="mt-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
                  <p className="text-sm text-rose-700 dark:text-rose-300">This medicine requires a valid prescription from a registered medical practitioner. Please upload your prescription during checkout.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sideEffects' && medicine.sideEffects && (
            <div>
              <h3 className="text-xl font-bold mb-4">Common Side Effects</h3>
              <p className="text-slate-500 mb-6">Most side effects do not require any medical attention and disappear as your body adjusts to the medicine. Consult your doctor if they persist.</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(medicine.sideEffects) ? medicine.sideEffects.map((effect, i) => (
                  <li key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" /> {effect}
                  </li>
                )) : typeof medicine.sideEffects === 'string' ? medicine.sideEffects.split(',').map((effect, i) => (
                  <li key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" /> {effect.trim()}
                  </li>
                )) : null}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
