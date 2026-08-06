import React from 'react';
import { Search } from 'lucide-react';

export default function RiderFilters({ filters, setFilters, search, setSearch }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6 space-y-4">
      {/* حقل البحث الشامل */}
      <div className="relative">
        <Search className="absolute right-3 top-3 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم، رقم الموظف، رقم الإقامة، أو رقم الجوال..."
          className="w-full pr-10 pl-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* قوائم الفلاتر التشغيلية */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <select
          value={filters.project}
          onChange={(e) => setFilters({ ...filters, project: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
        >
          <option value="">جميع المشاريع</option>
          <option value="هنقرستيشن">هنقرستيشن</option>
          <option value="جاهز">جاهز</option>
          <option value="مرسول">مرسول</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
        >
          <option value="">جميع الحالات</option>
          <option value="نشط">نشط</option>
          <option value="إجازة">إجازة</option>
          <option value="موقوف">موقوف</option>
        </select>

        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
        >
          <option value="">جميع المدن</option>
          <option value="الرياض">الرياض</option>
          <option value="جدة">جدة</option>
          <option value="الدمام">الدمام</option>
        </select>

        <select
          value={filters.iqamaStatus}
          onChange={(e) => setFilters({ ...filters, iqamaStatus: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
        >
          <option value="">حالة الإقامة</option>
          <option value="valid">سارية</option>
          <option value="warning">قرب الانتهاء</option>
          <option value="expired">منتهية</option>
        </select>

        <button
          onClick={() => { setFilters({ project: '', status: '', city: '', iqamaStatus: '' }); setSearch(''); }}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg p-2 transition-colors"
        >
          إعادة ضبط الفلاتر
        </button>
      </div>
    </div>
  );
}