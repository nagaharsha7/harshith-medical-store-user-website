import { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'medicines'), (snapshot) => {
      const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicines(meds);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await deleteDoc(doc(db, 'medicines', id));
        toast.success("Medicine deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete medicine");
      }
    }
  };

  const filteredMeds = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Medicines</h1>
        <Link 
          to="/owner/medicines/add" 
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Medicine
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by name or generic name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading medicines...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Image</th>
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Name</th>
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Category</th>
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Price</th>
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Stock</th>
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeds.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-500">No medicines found</td>
                  </tr>
                ) : (
                  filteredMeds.map((med) => (
                    <tr key={med.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <img src={med.imageUrl || 'https://via.placeholder.com/50'} alt={med.name} className="w-12 h-12 rounded-lg object-cover bg-white" />
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900 dark:text-white">{med.name}</p>
                        <p className="text-xs text-slate-500">{med.brand}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{med.category}</td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">₹{med.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${med.stockQuantity > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {med.stockQuantity} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link 
                          to={`/owner/medicines/edit/${med.id}`}
                          className="inline-flex p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(med.id)}
                          className="inline-flex p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
