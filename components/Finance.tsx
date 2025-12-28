import React, { useState } from 'react';
import { Transaction } from '../types';
import { Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface FinanceProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
}

const Finance: React.FC<FinanceProps> = ({ transactions, onAddTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'EXPENSE',
    category: '',
    amount: 0,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: formData.type || 'EXPENSE',
      category: formData.category || 'عام',
      amount: formData.amount || 0,
      description: formData.description || ''
    });
    setShowModal(false);
    setFormData({ type: 'EXPENSE', category: '', amount: 0, description: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">الحسابات والمالية</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
        >
          <Plus size={20} />
          تسجيل مصروف
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التصنيف</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوصف</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.slice().reverse().map(t => (
              <tr key={t.id}>
                <td className="px-6 py-4 flex items-center gap-2">
                  {t.type === 'INCOME' ? 
                    <ArrowUpCircle className="text-green-500" size={20} /> : 
                    <ArrowDownCircle className="text-red-500" size={20} />
                  }
                  <span className={t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                    {t.type === 'INCOME' ? 'دخل' : 'مصروف'}
                  </span>
                </td>
                <td className="px-6 py-4">{t.category}</td>
                <td className="px-6 py-4 font-bold">{t.amount} ر.س</td>
                <td className="px-6 py-4 text-gray-500">{t.description}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{new Date(t.date).toLocaleDateString('ar-EG')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">تسجيل حركة مالية جديدة</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">نوع الحركة</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as 'INCOME' | 'EXPENSE'})}
                >
                  <option value="EXPENSE">مصروفات (إيجار، كهرباء، شراء قطع)</option>
                  <option value="INCOME">دخل إضافي</option>
                </select>
              </div>
              
              <input 
                required
                placeholder="التصنيف (مثال: إيجار، فواتير)"
                className="w-full p-2 border rounded"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              />

              <input 
                type="number"
                required
                placeholder="المبلغ"
                className="w-full p-2 border rounded"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
              />

              <textarea 
                placeholder="تفاصيل إضافية"
                className="w-full p-2 border rounded"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
