import React from 'react';
import { getExpiryStatus } from '../../../services/supabase';

export default function RiderTable({ riders, onView, onEdit, onDelete, onArchive, onPrint }) {
  const renderStatusBadge = (expiryDate) => {
    const status = getExpiryStatus(expiryDate);
    let bg = 'bg-green-500/10 text-green-400 border-green-500/20';
    if (status.color === 'orange') bg = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    if (status.color === 'red') bg = 'bg-red-500/10 text-red-400 border-red-500/20';

    return (
      <span className={`px-2 py-0.5 text-[11px] font-semibold border rounded-md ${bg}`}>
        {expiryDate || 'غير محدد'}
      </span>
    );
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-x-auto shadow-xl">
      <table className="w-full text-right text-xs text-slate-200">
        <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
          <tr>
            <th className="p-3">الصورة</th>
            <th className="p-3">الاسم</th>
            <th className="p-3">رقم الموظف</th>
            <th className="p-3">رقم الإقامة</th>
            <th className="p-3">الجوال</th>
            <th className="p-3">المشروع</th>
            <th className="p-3">السيارة</th>
            <th className="p-3">المشرف</th>
            <th className="p-3">الطلبات</th>
            <th className="p-3">التارجت</th>
            <th className="p-3">الراتب</th>
            <th className="p-3">الحالة</th>
            <th className="p-3">الإقامة</th>
            <th className="p-3">الرخصة</th>
            <th className="p-3">العقد</th>
            <th className="p-3 text-center">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {riders.map((r) => (
            <tr key={r.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
              <td className="p-3">
                <img src={r.photo_url || '/logo.jpg'} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-600" />
              </td>
              <td className="p-3 font-bold text-white whitespace-nowrap">{r.name}</td>
              <td className="p-3 font-mono">{r.employee_id || `DRV-${r.id}`}</td>
              <td className="p-3 font-mono">{r.iqama_number}</td>
              <td className="p-3 font-mono">{r.phone}</td>
              <td className="p-3">{r.project || 'هنقرستيشن'}</td>
              <td className="p-3">{r.car || 'تويوتا يارس'}</td>
              <td className="p-3">{r.supervisor || 'أحمد محمد'}</td>
              <td className="p-3 font-semibold text-blue-400">{r.daily_orders || '14'}</td>
              <td className="p-3 font-semibold text-green-400">{r.target_ratio || '95%'}</td>
              <td className="p-3 font-semibold">{r.current_salary || '4500'} ر.س</td>
              <td className="p-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  r.status === 'إجازة' ? 'bg-yellow-500/20 text-yellow-400' :
                  r.status === 'موقوف' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {r.status || 'نشط'}
                </span>
              </td>
              <td className="p-3">{renderStatusBadge(r.iqama_expiry)}</td>
              <td className="p-3">{renderStatusBadge(r.license_expiry)}</td>
              <td className="p-3">{renderStatusBadge(r.contract_expiry)}</td>
              <td className="p-3 text-center whitespace-nowrap space-x-1 space-x-reverse">
                <button onClick={() => onView(r)} className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer">عرض</button>
                <button onClick={() => onEdit(r)} className="bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer">تعديل</button>
                <button onClick={() => onDelete(r.id)} className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer">حذف</button>
                <button onClick={() => onArchive(r.id)} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer">أرشفة</button>
                <button onClick={() => onPrint(r)} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer">طباعة</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}