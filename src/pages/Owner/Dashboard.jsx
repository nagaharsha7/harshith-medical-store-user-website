import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Package, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalUsers: 0,
    lowStock: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen to Users
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersCount = snapshot.docs.length;
      setStats(prev => ({ ...prev, totalUsers: usersCount }));
    });

    // 2. Listen to Medicines for Low Stock
    const unsubscribeMedicines = onSnapshot(collection(db, 'medicines'), (snapshot) => {
      let lowStockCount = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.stockQuantity <= 10) lowStockCount++;
      });
      setStats(prev => ({ ...prev, lowStock: lowStockCount }));
    });

    // 3. Listen to Orders for Sales and Chart Data
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      let totalSalesAmount = 0;
      const ordersCount = snapshot.docs.length;
      
      const salesByDate = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        totalSalesAmount += (data.total || 0);

        // Process data for chart
        if (data.createdAt) {
          const dateStr = new Date(data.createdAt).toLocaleDateString();
          if (!salesByDate[dateStr]) salesByDate[dateStr] = 0;
          salesByDate[dateStr] += (data.total || 0);
        }
      });

      const formattedSalesData = Object.keys(salesByDate).map(date => ({
        date,
        sales: salesByDate[date]
      }));

      // Sort by date basic
      formattedSalesData.sort((a, b) => new Date(a.date) - new Date(b.date));

      setStats(prev => ({ ...prev, totalOrders: ordersCount, totalSales: totalSalesAmount }));
      setSalesData(formattedSalesData);
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeMedicines();
      unsubscribeOrders();
    };
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { title: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { title: 'Low Stock Alerts', value: stats.lowStock, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  ];

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Over Time</h3>
        <div className="h-80">
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Sales']}
                />
                <Line type="monotone" dataKey="sales" stroke="#0284c7" strokeWidth={3} dot={{ fill: '#0284c7', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">No sales data available yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
