import { useState, useMemo } from 'react';
import { Search as SearchIcon, Filter, SlidersHorizontal, X } from 'lucide-react';
import MedicineCard from '../../components/MedicineCard';
import { useSearchParams } from 'react-router-dom';

import { useMedicines } from '../../hooks/useMedicines';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const { medicines, loading } = useMedicines();
  
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [rxRequired, setRxRequired] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const CATEGORIES = useMemo(() => ['All', ...new Set(medicines.map(m => m.category).filter(Boolean))], [medicines]);
  const BRANDS = useMemo(() => ['All', ...new Set(medicines.map(m => m.brand).filter(Boolean))], [medicines]);

  const filteredMedicines = useMemo(() => {
    let result = medicines;

    // Search filter
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(m => 
        (m.name && m.name.toLowerCase().includes(q)) || 
        (m.brand && m.brand.toLowerCase().includes(q)) || 
        (m.genericName && m.genericName.toLowerCase().includes(q)) ||
        (m.category && m.category.toLowerCase().includes(q))
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
  }, [query, category, brand, rxRequired, inStockOnly, sortBy, medicines]);

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

          {loading ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500">Loading medicines...</p>
            </div>
          ) : filteredMedicines.length > 0 ? (
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
