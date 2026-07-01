import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import MedicineCard from '../components/MedicineCard';

// Dummy data for initial display
const MOCK_CATEGORIES = [
  { id: 'tablets', name: 'Tablets', icon: '💊', color: 'bg-blue-100 text-blue-600' },
  { id: 'syrups', name: 'Syrups', icon: '🧪', color: 'bg-pink-100 text-pink-600' },
  { id: 'baby-care', name: 'Baby Care', icon: '🍼', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'personal-care', name: 'Personal Care', icon: '🧴', color: 'bg-purple-100 text-purple-600' },
  { id: 'ayurvedic', name: 'Ayurvedic', icon: '🌿', color: 'bg-green-100 text-green-600' },
  { id: 'diabetes', name: 'Diabetes', icon: '🩸', color: 'bg-red-100 text-red-600' },
];

const MOCK_MEDICINES = [
  {
    id: '1',
    name: 'Dolo 650 Tablet',
    genericName: 'Paracetamol',
    brand: 'Micro Labs Ltd',
    category: 'Tablets',
    mrp: 30,
    price: 25,
    rating: 4.8,
    reviews: 1240,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
  },
  {
    id: '2',
    name: 'Benadryl Cough Syrup',
    genericName: 'Diphenhydramine',
    brand: 'Johnson & Johnson',
    category: 'Syrups',
    mrp: 120,
    price: 105,
    rating: 4.5,
    reviews: 856,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80',
  },
  {
    id: '3',
    name: 'Volini Pain Relief Gel',
    genericName: 'Diclofenac',
    brand: 'Sun Pharma',
    category: 'Personal Care',
    mrp: 150,
    price: 135,
    rating: 4.6,
    reviews: 543,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1550572017-edb79a528e21?w=400&q=80',
  },
  {
    id: '4',
    name: 'Himalaya Liv.52 DS',
    genericName: 'Ayurvedic Liver Tonic',
    brand: 'Himalaya Wellness',
    category: 'Ayurvedic',
    mrp: 180,
    price: 160,
    rating: 4.9,
    reviews: 2100,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80',
  }
];

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-primary/5 dark:bg-primary/10 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                100% Genuine Medicines
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Your Health, <br/>
                <span className="text-primary">Delivered Safely.</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Order medicines online and get flat 15% off on your first prescription order.
              </p>
              <div className="flex gap-4">
                <Link to="/search" className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
                  Order Now <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80" 
                alt="Pharmacy Delivery" 
                className="rounded-3xl shadow-2xl object-cover h-[400px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Genuine Products</h3>
              <p className="text-sm text-slate-500">Sourced directly from brands</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Free Delivery</h3>
              <p className="text-sm text-slate-500">On orders above ₹500</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Fast Processing</h3>
              <p className="text-sm text-slate-500">Same day dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Shop by Category</h2>
          <Link to="/search" className="text-primary font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {MOCK_CATEGORIES.map(category => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 group"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform ${category.color}`}>
                {category.icon}
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Medicines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Medicines</h2>
          <Link to="/search?filter=featured" className="text-primary font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_MEDICINES.map(medicine => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-success to-teal-500 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="mb-6 md:mb-0 space-y-4">
            <h2 className="text-3xl font-bold">Ayurvedic Store</h2>
            <p className="text-success-50 text-lg max-w-md">Discover natural healing with our wide range of authentic Ayurvedic products.</p>
            <Link to="/category/ayurvedic" className="inline-block bg-white text-success px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Explore Now
            </Link>
          </div>
          <div className="w-full md:w-1/3">
            <img src="https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&q=80" alt="Ayurvedic" className="rounded-2xl shadow-md border-4 border-white/20"/>
          </div>
        </div>
      </section>

    </div>
  );
}
