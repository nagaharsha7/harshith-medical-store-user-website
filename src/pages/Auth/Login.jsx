import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Heart, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const [loginType, setLoginType] = useState('user');

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    // HARDCODED ADMIN BYPASS
    if (loginType === 'owner' && data.email === 'harshith@gmail.com' && data.password === '123456') {
      localStorage.setItem('admin_token', 'mock_jwt_token_for_admin');
      toast.success("Admin Login Successful!");
      
      // Force reload to let AuthContext pick up the local storage token
      window.location.href = '/owner/dashboard';
      return;
    }

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');
      const { auth, db } = await import('../../config/firebase');

      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Fetch user role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let role = 'user';
      if (userDoc.exists()) {
        role = String(userDoc.data().role || 'user').trim().toLowerCase();
      }

      if (loginType === 'owner' && role !== 'owner') {
        throw new Error(`Access denied. Your current role is "${role}", not "owner".`);
      }

      toast.success("Successfully logged in!");
      
      if (role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {loginType === 'owner' ? 'Admin Login' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {loginType === 'owner' ? 'Log in to the owner dashboard' : 'Log in to your account to continue'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
          
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setLoginType('user')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${loginType === 'user' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Customer
            </button>
            <button 
              onClick={() => setLoginType('owner')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${loginType === 'owner' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Store Owner
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-sm font-semibold text-primary hover:text-primary-hover">Forgot password?</a>
              </div>
              <div className="relative">
                <input 
                  type="password"
                  {...register('password')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
              {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-xl font-bold transition-colors disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {loginType === 'user' && (
            <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary hover:text-primary-hover">Sign up now</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
