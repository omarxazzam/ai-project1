import React from 'react';
import { Ticket, Transaction, TicketStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, Users, Wrench, AlertCircle } from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard: React.FC<DashboardProps> = ({ tickets, transactions }) => {
  
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const activeTickets = tickets.filter(t => t.status !== TicketStatus.DELIVERED && t.status !== TicketStatus.READY).length;
  const readyTickets = tickets.filter(t => t.status === TicketStatus.READY).length;

  const statusData = Object.values(TicketStatus).map(status => ({
    name: status,
    value: tickets.filter(t => t.status === status).length
  }));

  const incomeVsExpense = [
    { name: 'الدخل', amount: totalIncome },
    { name: 'المصروفات', amount: totalExpense },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">لوحة التحكم</h2>
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-r-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500">صافي الأرباح</p>
            <p className="text-2xl font-bold text-gray-800">{netProfit.toLocaleString()} ر.س</p>
          </div>
          <Wallet className="text-green-500 h-8 w-8" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-r-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500">أجهزة قيد الصيانة</p>
            <p className="text-2xl font-bold text-gray-800">{activeTickets}</p>
          </div>
          <Wrench className="text-blue-500 h-8 w-8" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-r-4 border-yellow-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500">أجهزة جاهزة</p>
            <p className="text-2xl font-bold text-gray-800">{readyTickets}</p>
          </div>
          <AlertCircle className="text-yellow-500 h-8 w-8" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-r-4 border-purple-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500">إجمالي التذاكر</p>
            <p className="text-2xl font-bold text-gray-800">{tickets.length}</p>
          </div>
          <Users className="text-purple-500 h-8 w-8" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow h-80">
          <h3 className="text-lg font-semibold mb-4">حالة الأجهزة</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow h-80">
          <h3 className="text-lg font-semibold mb-4">الدخل مقابل المصروفات</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeVsExpense}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8">
                {incomeVsExpense.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
