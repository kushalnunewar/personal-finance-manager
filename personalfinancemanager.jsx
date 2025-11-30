import React, { useState, useEffect, useMemo } from 'react';

// --- Zero-Dependency Icons (Inline SVGs) ---
const Icons = {
  Wallet: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  TrendingUp: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  TrendingDown: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  Plus: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Trash2: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Edit2: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  PieChart: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  List: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  DollarSign: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Tag: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Search: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  X: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronRight: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

// --- Custom Zero-Dependency Charts ---

const SimplePieChart = ({ data, colors }) => {
  // Calculate total value
  const total = data.reduce((acc, item) => acc + item.value, 0);
  
  if (total === 0) return (
    <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data to display</div>
  );

  // Create conic gradient string
  let currentAngle = 0;
  const gradientParts = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle = end;
    return `${colors[index % colors.length]} ${start}deg ${end}deg`;
  });

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-48 h-48 rounded-full" style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}>
        {/* Inner white circle for donut effect */}
        <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs text-gray-400 font-medium">Expenses</span>
        </div>
      </div>
    </div>
  );
};

const SimpleBarChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-gray-400 text-sm text-center">No data</div>;
  
  // Find max value to normalize heights
  const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expense)));
  
  return (
    <div className="flex items-end justify-between h-full w-full gap-2 pt-4">
      {data.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2 flex-1 group relative">
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-gray-800 text-white text-xs p-2 rounded z-10 whitespace-nowrap">
            <span>{item.name}</span>
            <span className="text-green-300">In: ${item.income}</span>
            <span className="text-red-300">Out: ${item.expense}</span>
          </div>
          
          <div className="flex gap-1 items-end w-full justify-center h-48">
            {/* Income Bar */}
            <div 
              className="w-3 bg-green-500 rounded-t transition-all hover:bg-green-600"
              style={{ height: maxVal ? `${(item.income / maxVal) * 100}%` : '0%' }}
            ></div>
            {/* Expense Bar */}
            <div 
              className="w-3 bg-red-500 rounded-t transition-all hover:bg-red-600"
              style={{ height: maxVal ? `${(item.expense / maxVal) * 100}%` : '0%' }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 font-medium truncate w-full text-center">{item.name}</span>
        </div>
      ))}
    </div>
  );
};


// --- Constants & Utilities ---
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'],
  expense: ['Housing', 'Food', 'Transport', 'Utilities', 'Fun', 'Health', 'Shop', 'Other']
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// --- Reusable UI Components ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md shadow-blue-200",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-200",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
  };
  
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, required = false, name }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
    />
  </div>
);

const Select = ({ label, value, onChange, options, name }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
        <Icons.ChevronRight className="w-4 h-4 rotate-90" />
      </div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Icons.X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function FinanceManager() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  // Filters
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // --- LOCAL STORAGE PERSISTENCE (Replacing Firebase) ---
  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem('finance_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTransactions(parsed);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save to local storage whenever transactions change
    if (!loading) {
      localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }
  }, [transactions, loading]);

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: CATEGORIES[value][0] } : {})
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: editingId || Date.now().toString(), // Simple ID generation
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      note: formData.note,
      updatedAt: new Date().toISOString(),
      createdAt: editingId ? transactions.find(t => t.id === editingId).createdAt : new Date().toISOString()
    };

    if (editingId) {
      setTransactions(prev => prev.map(t => t.id === editingId ? payload : t));
    } else {
      setTransactions(prev => [payload, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const openModal = (transaction = null) => {
    if (transaction) {
      setEditingId(transaction.id);
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        note: transaction.note
      });
    } else {
      setEditingId(null);
      setFormData({
        type: 'expense',
        amount: '',
        category: CATEGORIES['expense'][0],
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  // --- Derived State (Stats & Charts) ---

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.note.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [transactions, filterType, searchTerm]);

  const chartData = useMemo(() => {
    // Expense by Category (Pie)
    const expenseByCategory = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });
    
    const pieData = Object.entries(expenseByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Monthly Activity (Bar)
    const monthlyData = {};
    // Populate last 6 months to ensure chart looks good even empty
    for(let i=5; i>=0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleString('default', { month: 'short' });
        monthlyData[monthName] = { name: monthName, income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (monthlyData[month]) {
          if (t.type === 'income') monthlyData[month].income += t.amount;
          else monthlyData[month].expense += t.amount;
      }
    });

    const barData = Object.values(monthlyData);

    return { pieData, barData };
  }, [transactions]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium">Loading Finance Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20 md:pb-0">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Icons.Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">FinTrack</h1>
              <p className="text-xs text-gray-500 mt-1">Local Mode (No Cloud)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={() => openModal()} className="!px-3 !py-1.5 md:!px-4 md:!py-2">
              <Icons.Plus className="w-4 h-4" />
              <span className="hidden md:inline">Transaction</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-8 w-full md:w-auto md:inline-flex">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Icons.PieChart },
            { id: 'transactions', label: 'Transactions', icon: Icons.List },
            { id: 'reports', label: 'Reports', icon: Icons.TrendingUp },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 md:flex-none justify-center
                ${activeTab === tab.id 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- DASHBOARD VIEW --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="!p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-blue-200 shadow-lg">
                <div className="flex justify-between items-start mb-4 opacity-80">
                  <span className="font-medium text-blue-100">Total Balance</span>
                  <Icons.Wallet className="w-5 h-5 text-blue-100" />
                </div>
                <div className="text-3xl font-bold mb-1">{formatCurrency(stats.balance)}</div>
                <div className="text-sm text-blue-100 opacity-75">Available funds</div>
              </Card>

              <Card className="!p-5">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-medium text-gray-500">Income</span>
                  <div className="bg-green-100 p-1.5 rounded-lg">
                    <Icons.TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.income)}</div>
                <div className="text-xs text-green-600 font-medium">+ This Month</div>
              </Card>

              <Card className="!p-5">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-medium text-gray-500">Expenses</span>
                  <div className="bg-red-100 p-1.5 rounded-lg">
                    <Icons.TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.expense)}</div>
                <div className="text-xs text-red-600 font-medium">- This Month</div>
              </Card>
            </div>

            {/* Quick Charts Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Card>
                 <h3 className="font-bold text-gray-800 mb-6">Spending Breakdown</h3>
                 <div className="h-64">
                   <SimplePieChart data={chartData.pieData} colors={COLORS} />
                 </div>
               </Card>

               <Card>
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-gray-800">Recent Transactions</h3>
                   <button onClick={() => setActiveTab('transactions')} className="text-blue-600 text-sm font-medium hover:underline">View All</button>
                 </div>
                 <div className="space-y-3">
                   {transactions.slice(0, 5).map(t => (
                     <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                       <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                           {t.type === 'income' ? <Icons.TrendingUp className="w-4 h-4" /> : <Icons.Tag className="w-4 h-4" />}
                         </div>
                         <div>
                           <div className="font-medium text-gray-900">{t.category}</div>
                           <div className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</div>
                         </div>
                       </div>
                       <span className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                         {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                       </span>
                     </div>
                   ))}
                   {transactions.length === 0 && (
                     <p className="text-center text-gray-500 py-8">No recent transactions found.</p>
                   )}
                 </div>
               </Card>
            </div>
          </div>
        )}

        {/* --- TRANSACTIONS VIEW --- */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-full md:w-64">
                <Icons.Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search notes or categories..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'income', 'expense'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors
                      ${filterType === type 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Note</th>
                      <th className="p-4 font-semibold text-right">Amount</th>
                      <th className="p-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                          {new Date(t.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            t.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {t.type === 'income' ? <Icons.TrendingUp className="w-3 h-3" /> : <Icons.TrendingDown className="w-3 h-3" />}
                            {t.category}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={t.note}>
                          {t.note || '-'}
                        </td>
                        <td className={`p-4 text-right font-medium whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(t)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors">
                              <Icons.Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors">
                              <Icons.Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-12 text-center text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <Icons.Search className="w-8 h-8 opacity-20" />
                            <p>No transactions found matching your criteria.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- REPORTS VIEW --- */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card>
               <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <Icons.TrendingUp className="w-5 h-5 text-blue-600" />
                 Income vs Expenses Over Time
               </h3>
               <div className="h-64 w-full">
                 <SimpleBarChart data={chartData.barData} />
               </div>
             </Card>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="font-bold text-gray-800 mb-6">Expense Distribution</h3>
                  <div className="h-48">
                    <SimplePieChart data={chartData.pieData} colors={COLORS} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {chartData.pieData.slice(0, 6).map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="truncate flex-1">{entry.name}</span>
                        <span className="font-medium">{Math.round((entry.value / stats.expense) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="flex flex-col justify-center items-center text-center p-8 bg-blue-50 border-blue-100">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                     <Icons.DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Net Savings Rate</h3>
                  <p className="text-gray-500 mb-6 max-w-xs">
                    Your savings rate is calculated based on income versus expenses for the current period.
                  </p>
                  
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stats.income > 0 ? Math.round(((stats.income - stats.expense) / stats.income) * 100) : 0}%
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    of income saved
                  </p>
                </Card>
             </div>
          </div>
        )}

      </main>

      {/* --- ADD/EDIT TRANSACTION MODAL --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingId ? "Edit Transaction" : "New Transaction"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1.5">
               <label className="text-sm font-medium text-gray-700">Type</label>
               <div className="flex bg-gray-100 p-1 rounded-lg">
                 {['income', 'expense'].map(type => (
                   <button
                     key={type}
                     type="button"
                     onClick={() => handleInputChange({ target: { name: 'type', value: type } })}
                     className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                       formData.type === type 
                         ? 'bg-white text-gray-900 shadow-sm' 
                         : 'text-gray-500 hover:text-gray-700'
                     }`}
                   >
                     {type}
                   </button>
                 ))}
               </div>
             </div>
             <Input 
               label="Date"
               type="date"
               name="date"
               value={formData.date}
               onChange={handleInputChange}
               required
             />
          </div>

          <Input 
            label="Amount"
            type="number"
            name="amount"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleInputChange}
            required
            step="0.01"
            min="0"
          />

          <Select 
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={CATEGORIES[formData.type]}
          />

          <div className="flex flex-col gap-1.5">
             <label className="text-sm font-medium text-gray-700">Note (Optional)</label>
             <textarea 
               name="note"
               value={formData.note}
               onChange={handleInputChange}
               placeholder="What was this for?"
               rows="3"
               className="px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white resize-none"
             />
          </div>

          <div className="pt-4 flex gap-3">
             <Button variant="secondary" onClick={closeModal} className="flex-1">Cancel</Button>
             <Button type="submit" variant="primary" className="flex-1">
               {editingId ? 'Update' : 'Save Transaction'}
             </Button>
          </div>
        </form>
      </Modal>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => openModal()}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-300 flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all z-40"
      >
        <Icons.Plus className="w-6 h-6" />
      </button>

    </div>
  );
}