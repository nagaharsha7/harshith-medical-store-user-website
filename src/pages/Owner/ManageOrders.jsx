import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Search, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sort by most recent using standard JS sort after fetching, 
    // or if you want to use query(orderBy), you need a Firestore index.
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      ords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ords);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.shippingInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Orders</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Order ID & Date</th>
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Customer</th>
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Location</th>
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Total</th>
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Payment</th>
                  <th className="pb-3 px-4 font-semibold text-slate-600 dark:text-slate-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-500">No orders found</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium text-slate-900 dark:text-white uppercase">#{order.id.slice(-6)}</p>
                        <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-slate-900 dark:text-white">{order.shippingInfo?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{order.shippingInfo?.phone || ''}</p>
                      </td>
                      <td className="py-4 px-4">
                        {order.location ? (
                          <a 
                            href={`https://maps.google.com/?q=${order.location.lat},${order.location.lng}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <MapPin className="w-3 h-3" /> View Map
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500">No GPS</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">₹{order.total}</td>
                      <td className="py-4 px-4">
                        <span className="text-xs uppercase px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-medium">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-sm font-medium rounded-lg px-3 py-1.5 border-none focus:ring-2 focus:ring-primary
                            ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : ''}
                            ${order.status === 'Accepted' ? 'bg-blue-100 text-blue-700' : ''}
                            ${order.status === 'Packed' ? 'bg-indigo-100 text-indigo-700' : ''}
                            ${order.status === 'Out for Delivery' ? 'bg-purple-100 text-purple-700' : ''}
                            ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : ''}
                            ${order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : ''}
                          `}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Packed">Packed</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
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
