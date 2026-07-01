import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, Heart, LogOut } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-primary">MediStore</span>
              </Link>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search for medicines, health products..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              {currentUser ? (
                <>
                  {userRole === 'owner' && (
                    <Link to="/owner/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors flex flex-col items-center gap-1">
                      <User className="h-5 w-5" />
                      <span className="text-xs hidden sm:block">Dashboard</span>
                    </Link>
                  )}
                  <Link to="/profile" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors flex flex-col items-center gap-1">
                    <User className="h-5 w-5" />
                    <span className="text-xs hidden sm:block">Profile</span>
                  </Link>
                  <button onClick={handleLogout} className="text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors flex flex-col items-center gap-1">
                    <LogOut className="h-5 w-5" />
                    <span className="text-xs hidden sm:block">Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors flex flex-col items-center gap-1">
                  <User className="h-5 w-5" />
                  <span className="text-xs hidden sm:block">Login</span>
                </Link>
              )}
              
              <Link to="/cart" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors flex flex-col items-center gap-1 relative">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs hidden sm:block">Cart</span>
              </Link>

              <button className="md:hidden text-slate-600 dark:text-slate-300">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:block bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-8 h-10 text-sm font-medium">
              <Link to="/category/tablets" className="hover:text-primary-100 transition-colors">Tablets</Link>
              <Link to="/category/syrups" className="hover:text-primary-100 transition-colors">Syrups</Link>
              <Link to="/category/baby-care" className="hover:text-primary-100 transition-colors">Baby Care</Link>
              <Link to="/category/personal-care" className="hover:text-primary-100 transition-colors">Personal Care</Link>
              <Link to="/category/ayurvedic" className="hover:text-primary-100 transition-colors">Ayurvedic</Link>
              <Link to="/category/offers" className="text-yellow-300 hover:text-yellow-200 transition-colors">Offers</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">MediStore</span>
            </div>
            <p className="text-sm text-slate-400">Your trusted online pharmacy for genuine medicines and healthcare products.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="hover:text-primary transition-colors">Search Medicines</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">My Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/diabetes" className="hover:text-primary transition-colors">Diabetes Care</Link></li>
              <li><Link to="/category/heart" className="hover:text-primary transition-colors">Heart Care</Link></li>
              <li><Link to="/category/skin" className="hover:text-primary transition-colors">Skin Care</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>1800-123-4567</li>
              <li>support@medistore.com</li>
              <li>123 Pharmacy Lane, Health City</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
