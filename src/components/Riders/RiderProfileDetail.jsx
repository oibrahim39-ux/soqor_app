import React, { useState } from 'react';
import { User, Briefcase, CreditCard, FileText, Car, AlertTriangle } from 'lucide-react';

export default function RiderProfileDetail({ rider, onBack }) {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'البيانات الشخصية', icon: User },
    { id: 'work', label: 'بيانات العمل', icon: Briefcase },
    { id: 'banking', label: 'البيانات البنكية', icon: CreditCard },
    { id: 'documents', label: 'المستندات', icon: FileText },
    { id: 'vehicle', label: 'السيارة والسجل', icon: Car },
    { id: 'alerts', label: 'التنبيهات', icon: AlertTriangle },
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-700 pb-4">
        <div className="flex items-center gap-4">
          <img src={rider.photo_url || '/logo.jpg'} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
          <div>
            <h2 className="text-xl font-bold text-white">{rider.name}</h2>
            <p className="text-xs text-slate-400">رقم الموظف: {rider.employee_id || `DRV-${rider.id}`} | {rider.project || 'هنقرستيشن'}</p>
          </div>
        </div>
        <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer">
          ← العودة للقائمة
        </button>
      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-700/50 pb-4">
        {['إضافة مخالفة', 'إضافة سلفة', 'إضافة حافز', 'خصم', 'تغيير السيارة', 'تحويل مشروع', 'تجديد الإقامة', 'طباعة PDF'].map((action, i) => (
          <button key={i} className="bg-slate-900 border border-slate-700 hover:border-blue-500 text-xs px-3 py-1.5 rounded-lg text-slate-200 transition-colors cursor-pointer">
            {action}
          </button>
        ))}
      </div>

      {/* Internal Tabs */}
      <div className="flex gap-2 border-b border-slate-700 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="pt-2 text-sm text-slate-300">
        {activeTab === 'personal' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><span className="text-xs text-slate-500 block">رقم الهوية/الإقامة</span>{rider.iqama_number}</div>
            <div><span className="text-xs text-slate-500 block">الجنسية</span>{rider.nationality || 'سعودي'}</div>
            <div><span className="text-xs text-slate-500 block">رقم الجوال</span>{rider.phone}</div>
            <div><span className="text-xs text-slate-500 block">المدينة</span>{rider.city || 'الرياض'}</div>
            <div><span className="text-xs text-slate-500 block">العنوان</span>{rider.address || 'غير مسجل'}</div>
          </div>
        )}

        {activeTab === 'banking' && (
          <div className="grid grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-700">
            <div><span className="text-xs text-slate-500 block">اسم البنك</span>{rider.bank_name || 'البنك الأهلي'}</div>
            <div><span className="text-xs text-slate-500 block">رقم الآيبان (IBAN)</span><span className="font-mono text-blue-400">{rider.iban || 'SA0000000000000000000000'}</span></div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 rounded-lg flex justify-between">
              <span>تاريخ انتهاء الإقامة</span>
              <span className="font-bold text-yellow-400">{rider.iqama_expiry || '2026-10-01'}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg flex justify-between">
              <span>تاريخ انتهاء الرخصة</span>
              <span className="font-bold text-green-400">{rider.license_expiry || '2027-05-15'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}