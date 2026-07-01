import { useState, useMemo } from 'react';
import { Search as SearchIcon, Filter, SlidersHorizontal, X } from 'lucide-react';
import MedicineCard from '../../components/MedicineCard';
import { useSearchParams } from 'react-router-dom';

// Dummy medicines
const ALL_MEDICINES = [
  { id: '1', name: 'Dolo 650 Tablet', genericName: 'Paracetamol', brand: 'Micro Labs Ltd', category: 'Tablets', mrp: 30, price: 25, rating: 4.8, reviews: 1240, inStock: true, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', rxRequired: false },
  { id: '2', name: 'Benadryl Cough Syrup', genericName: 'Diphenhydramine', brand: 'Johnson & Johnson', category: 'Syrups', mrp: 120, price: 105, rating: 4.5, reviews: 856, inStock: true, image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80', rxRequired: false },
  { id: '3', name: 'Volini Pain Relief Gel', genericName: 'Diclofenac', brand: 'Sun Pharma', category: 'Personal Care', mrp: 150, price: 135, rating: 4.6, reviews: 543, inStock: true, image: 'https://images.unsplash.com/photo-1550572017-edb79a528e21?w=400&q=80', rxRequired: false },
  { id: '4', name: 'Himalaya Liv.52 DS', genericName: 'Ayurvedic Liver Tonic', brand: 'Himalaya Wellness', category: 'Ayurvedic', mrp: 180, price: 160, rating: 4.9, reviews: 2100, inStock: false, image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80', rxRequired: false },
  { id: '5', name: 'Augmentin 625 Duo Tablet', genericName: 'Amoxycillin + Clavulanic Acid', brand: 'GlaxoSmithKline', category: 'Tablets', mrp: 220, price: 195, rating: 4.7, reviews: 890, inStock: true, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', rxRequired: true },
];

const CATEGORIES = ['All', 'Tablets', 'Syrups', 'Baby Care', 'Personal Care', 'Ayurvedic', 'Diabetes', 'Heart Care', 'Skin Care'];
const BRANDS = ['All', 'Micro Labs Ltd', 'Johnson & Johnson', 'Sun Pharma', 'Himalaya Wellness', 'GlaxoSmithKline'];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [rxRequired, setRxRequired] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const filteredMedicines = useMemo(() => {
    let result = ALL_MEDICINES;

    // Search filter
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.brand.toLowerCase().includes(q) || 
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category !== 'All') {
      result = result.filter(m => m.category === category);
    }

    // Brand filter
    if (brand !== 'All') {
      result = result.filter(m => m.brand === brand);
    }

    // Checkbox filters
    if (rxRequired) {
      result = result.filter(m => m.rxRequired);
    }
    if (inStockOnly) {
      result = result.filter(m => m.inStock);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [query, category, brand, rxRequired, inStockOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Search Bar */}
      <div className="mb-8 relative max-w-2xl mx-auto">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for medicines by name, generic name, brand..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 text-lg shadow-sm transition-all"
        />
        <SearchIcon className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <span className="font-bold text-slate-900 dark:text-white">{filteredMedicines.length} Results found</span>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Sidebar Filters */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24 space-y-8">
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Filter className="w-5 h-5" /> Filters
              </h2>
              <button onClick={() => setShowFilters(false)} className="p-2 bg-slate-100 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold hidden lg:flex items-center gap-2 text-slate-900 dark:text-white mb-6">
              <Filter className="w-5 h-5 text-primary" /> Filters
            </h2>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Category</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category"
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Brand</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {BRANDS.map(b => (
                  <label key={b} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="brand"
                      checked={brand === b}
                      onChange={() => setBrand(b)}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Other Filters */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Availability & Type</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">In Stock Only</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rxRequired}
                    onChange={(e) => setRxRequired(e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">Prescription Required</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Results */}
        <div className="lg:w-3/4">
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {filteredMedicines.length} Results found
            </h2>
            
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-500">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {filteredMedicines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map(medicine => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
              <SearchIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No medicines found</h3>
              <p className="text-slate-500 max-w-md mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
