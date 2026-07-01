import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, MapPin, Phone, Lock, Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid 10-digit phone number"),
  address: z.string().min(10, "Address must be detailed"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm new password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock User
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    address: '123, Health Avenue, Medical City, HC 400001',
    photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80'
  };

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      address: user.address
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const onProfileUpdate = (data) => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      toast.success('Profile updated successfully');
    }, 1500);
  };

  const onPasswordUpdate = (data) => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      resetPassword();
      toast.success('Password changed successfully');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Profile</h1>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          
          {/* Sidebar Tabs */}
          <div className="w-full sm:w-1/3 bg-slate-50 dark:bg-slate-800/50 p-6 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group cursor-pointer mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-md">
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'personal' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <User className="w-5 h-5" /> Personal Details
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'security' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Lock className="w-5 h-5" /> Security
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="w-full sm:w-2/3 p-6 sm:p-8">
            
            {activeTab === 'personal' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Details</h3>
                <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Full Name
                    </label>
                    <input 
                      {...registerProfile('name')} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                    />
                    {profileErrors.name && <p className="text-rose-500 text-xs mt-1">{profileErrors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" /> Phone Number
                    </label>
                    <input 
                      {...registerProfile('phone')} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                    />
                    {profileErrors.phone && <p className="text-rose-500 text-xs mt-1">{profileErrors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                    </label>
                    <textarea 
                      {...registerProfile('address')} 
                      rows="3" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    ></textarea>
                    {profileErrors.address && <p className="text-rose-500 text-xs mt-1">{profileErrors.address.message}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" /> {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Change Password</h3>
                <form onSubmit={handlePasswordSubmit(onPasswordUpdate)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                    <input 
                      type="password"
                      {...registerPassword('currentPassword')} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                    />
                    {passwordErrors.currentPassword && <p className="text-rose-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                    <input 
                      type="password"
                      {...registerPassword('newPassword')} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                    />
                    {passwordErrors.newPassword && <p className="text-rose-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                    <input 
                      type="password"
                      {...registerPassword('confirmPassword')} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                    />
                    {passwordErrors.confirmPassword && <p className="text-rose-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
                  >
                    <Lock className="w-5 h-5" /> {isUpdating ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
