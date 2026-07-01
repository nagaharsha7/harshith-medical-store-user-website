import { Package, CheckCircle2, Truck, Home, Download, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ORDERS = [
  {
    id: 'ORD789012',
    date: '2023-10-24T10:30:00Z',
    status: 'Out For Delivery',
    total: 310.00,
    paymentMethod: 'UPI',
    items: [
      { name: 'Dolo 650 Tablet', quantity: 2, price: 25 },
      { name: 'Benadryl Cough Syrup', quantity: 1, price: 105 }
    ]
  },
  {
    id: 'ORD456789',
    date: '2023-10-10T14:15:00Z',
    status: 'Delivered',
    total: 160.00,
    paymentMethod: 'Cash on Delivery',
    items: [
      { name: 'Volini Pain Relief Gel', quantity: 1, price: 135 }
    ]
  }
];

const getStatusStep = (status) => {
  const steps = ['Order Received', 'Accepted', 'Packed', 'Out For Delivery', 'Delivered'];
  return steps.indexOf(status);
};

export default function Orders() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Orders</h1>
        <Link to="/profile" className="text-primary font-semibold hover:underline">
          Back to Profile
        </Link>
      </div>

      <div className="space-y-6">
        {MOCK_ORDERS.map(order => {
          const currentStep = getStatusStep(order.status);
          const isCancelled = order.status === 'Cancelled';

          return (
            <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">
                      {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">₹{order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Payment Method</p>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{order.id}</p>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 justify-end">
                  <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                    <Download className="w-4 h-4" /> Invoice
                  </button>
                  <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                    <RotateCcw className="w-4 h-4" /> Reorder
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Order Status</h3>
                  
                  {isCancelled ? (
                    <div className="text-rose-500 font-semibold bg-rose-50 dark:bg-rose-500/10 p-3 rounded-lg inline-block">
                      Order Cancelled
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 rounded-full z-0 hidden sm:block"></div>
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 hidden sm:block transition-all duration-1000"
                        style={{ width: `${(Math.max(0, currentStep) / 4) * 100}%` }}
                      ></div>

                      <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                        {[
                          { title: 'Received', icon: Package },
                          { title: 'Accepted', icon: CheckCircle2 },
                          { title: 'Packed', icon: Package },
                          { title: 'Out For Delivery', icon: Truck },
                          { title: 'Delivered', icon: Home }
                        ].map((step, idx) => {
                          const Icon = step.icon;
                          const isActive = currentStep >= idx;
                          return (
                            <div key={step.title} className="flex sm:flex-col items-center gap-3 sm:gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                isActive 
                                  ? 'bg-primary text-white ring-4 ring-white dark:ring-slate-900' 
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`text-sm font-semibold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                {step.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                            💊
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.name}</p>
                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
