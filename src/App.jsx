import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import OwnerLayout from './layouts/OwnerLayout';
import { UserRoute, OwnerRoute } from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// User Pages
import Home from './pages/Home';
import Search from './pages/Products/Search';
import Category from './pages/Products/Category';
import MedicineDetail from './pages/Products/MedicineDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Orders from './pages/Profile/Orders';
import Profile from './pages/Profile/Profile';

// Owner Pages (Placeholders for now)
import OwnerDashboard from './pages/Owner/Dashboard';
import ManageMedicines from './pages/Owner/ManageMedicines';
import ManageOrders from './pages/Owner/ManageOrders';
import MedicineForm from './pages/Owner/MedicineForm';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public / User Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/medicine/:id" element={<MedicineDetail />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Protected User Routes */}
          <Route element={<UserRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Route>

        {/* Protected Owner Routes */}
        <Route path="/owner" element={<OwnerRoute />}>
          <Route element={<OwnerLayout />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="medicines" element={<ManageMedicines />} />
            <Route path="medicines/add" element={<MedicineForm />} />
            <Route path="medicines/edit/:id" element={<MedicineForm />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
