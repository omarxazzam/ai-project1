import React, { useState, useEffect } from 'react';
import { Ticket, Part, Transaction, TicketStatus } from './types';
import * as Storage from './services/storage';
import Dashboard from './components/Dashboard';
import Reception from './components/Reception';
import Inventory from './components/Inventory';
import Finance from './components/Finance';
import CRM from './components/CRM';
import AIHelp from './components/AIHelp';
import { LayoutDashboard, ClipboardList, Package, DollarSign, Users, Bot, Smartphone } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reception' | 'inventory' | 'finance' | 'crm' | 'ai'>('dashboard');
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initial Load
  useEffect(() => {
    Storage.seedData();
    setTickets(Storage.getTickets());
    setParts(Storage.getParts());
    setTransactions(Storage.getTransactions());
  }, []);

  // Sync with Storage whenever state changes
  useEffect(() => { Storage.saveTickets(tickets); }, [tickets]);
  useEffect(() => { Storage.saveParts(parts); }, [parts]);
  useEffect(() => { Storage.saveTransactions(transactions); }, [transactions]);

  const handleAddTicket = (ticket: Ticket) => {
    setTickets([...tickets, ticket]);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    const oldTicket = tickets.find(t => t.id === updatedTicket.id);
    setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));

    // Automated Finance Logic: If delivered and marked paid, add to income
    if (updatedTicket.status === TicketStatus.DELIVERED && !oldTicket?.paid) {
        // In a real app we would check if it was already paid or add a specific 'Mark Paid' button
        // For simplicity here, we assume delivery implies payment collected
        const income: Transaction = {
            id: Date.now().toString(),
            type: 'INCOME',
            amount: updatedTicket.cost,
            category: 'صيانة',
            description: `إيراد صيانة تذكرة رقم ${updatedTicket.id}`,
            date: new Date().toISOString(),
            ticketId: updatedTicket.id
        };
        setTransactions([...transactions, income]);
    }
  };

  const handleDeleteTicket = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه التذكرة؟')) {
        setTickets(tickets.filter(t => t.id !== id));
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'reception', label: 'الاستقبال', icon: ClipboardList },
    { id: 'inventory', label: 'المخزن', icon: Package },
    { id: 'finance', label: 'المالية', icon: DollarSign },
    { id: 'crm', label: 'العملاء', icon: Users },
    { id: 'ai', label: 'المساعد الذكي', icon: Bot },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-800 text-white flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <Smartphone className="text-blue-400 h-8 w-8" />
          <h1 className="text-xl font-bold">مركز الصيانة</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard tickets={tickets} transactions={transactions} />}
        {activeTab === 'reception' && (
            <Reception 
                tickets={tickets} 
                onAddTicket={handleAddTicket} 
                onUpdateTicket={handleUpdateTicket}
                onDeleteTicket={handleDeleteTicket}
            />
        )}
        {activeTab === 'inventory' && (
            <Inventory 
                parts={parts}
                onAddPart={p => setParts([...parts, p])}
                onUpdatePart={p => setParts(parts.map(x => x.id === p.id ? p : x))}
                onDeletePart={id => setParts(parts.filter(x => x.id !== id))}
            />
        )}
        {activeTab === 'finance' && (
            <Finance 
                transactions={transactions}
                onAddTransaction={t => setTransactions([...transactions, t])}
            />
        )}
        {activeTab === 'crm' && <CRM tickets={tickets} />}
        {activeTab === 'ai' && <AIHelp />}
      </main>
    </div>
  );
};

export default App;
