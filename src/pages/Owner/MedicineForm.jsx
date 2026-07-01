import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MedicineForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEditMode) {
      const fetchMedicine = async () => {
        try {
          const docRef = doc(db, 'medicines', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            reset(data); // Populate form fields
            if (data.imageUrl) setImagePreview(data.imageUrl);
          } else {
            toast.error("Medicine not found");
            navigate('/owner/medicines');
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to load medicine data");
        }
      };
      fetchMedicine();
    }
  }, [id, isEditMode, reset, navigate]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const withTimeout = (promise, ms, operationName) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`${operationName} timed out after ${ms/1000}s. Please check if Firebase Storage/Firestore is properly enabled in your console and your rules are set to public.`));
      }, ms);
      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timer));
    });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let imageUrl = data.imageUrl || ''; // Keep existing if edit mode and no new file

      if (imageFile) {
        const imageRef = ref(storage, `medicines/${Date.now()}_${imageFile.name}`);
        const uploadResult = await withTimeout(uploadBytes(imageRef, imageFile), 15000, "Image upload");
        imageUrl = await getDownloadURL(uploadResult.ref);
      } else if (!isEditMode && !imageUrl) {
        // Fallback for new items if no image provided (though we prefer one)
        imageUrl = 'https://via.placeholder.com/400x400?text=No+Image';
      }

      const medicineData = {
        ...data,
        price: parseFloat(data.price),
        mrp: parseFloat(data.mrp),
        stockQuantity: parseInt(data.stockQuantity, 10),
        rxRequired: data.rxRequired === 'true' || data.rxRequired === true,
        imageUrl,
        updatedAt: new Date().toISOString()
      };

      if (isEditMode) {
        await withTimeout(setDoc(doc(db, 'medicines', id), medicineData, { merge: true }), 10000, "Database update");
        toast.success("Medicine updated successfully!");
      } else {
        medicineData.createdAt = new Date().toISOString();
        await withTimeout(addDoc(collection(db, 'medicines'), medicineData), 10000, "Database save");
        toast.success("Medicine added successfully!");
      }

      navigate('/owner/medicines');
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save medicine");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/owner/medicines')} className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEditMode ? 'Edit Medicine' : 'Add New Medicine'}
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Medicine Image</label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-slate-400" />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="text-sm text-slate-500">
                <p>Click the square to upload an image.</p>
                <p>Recommended size: 800x800px</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name *</label>
              <input {...register('name', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Generic Name</label>
              <input {...register('genericName')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Brand *</label>
              <input {...register('brand', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category *</label>
              <select {...register('category', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                <option value="Tablets">Tablets</option>
                <option value="Capsules">Capsules</option>
                <option value="Syrups">Syrups</option>
                <option value="Baby Care">Baby Care</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Heart Care">Heart Care</option>
                <option value="Skin Care">Skin Care</option>
                <option value="Ayurvedic">Ayurvedic</option>
                <option value="Vitamins">Vitamins</option>
              </select>
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">MRP (₹) *</label>
              <input type="number" step="0.01" {...register('mrp', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Selling Price (₹) *</label>
              <input type="number" step="0.01" {...register('price', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Stock Quantity *</label>
              <input type="number" {...register('stockQuantity', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Expiry Date</label>
              <input type="date" {...register('expiryDate')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="space-y-1 flex items-center gap-3 pt-6">
              <input type="checkbox" id="rxRequired" {...register('rxRequired')} className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
              <label htmlFor="rxRequired" className="text-sm font-medium text-slate-700 dark:text-slate-300">Prescription Required</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea rows={2} {...register('description')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Uses (comma separated)</label>
              <textarea rows={2} {...register('uses')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Dosage Information</label>
              <textarea rows={2} {...register('dosage')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Side Effects (comma separated)</label>
              <textarea rows={2} {...register('sideEffects')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-70"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isEditMode ? 'Update Medicine' : 'Save Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
