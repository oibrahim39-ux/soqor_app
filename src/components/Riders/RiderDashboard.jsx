import React from 'react';
import { getExpiryStatus } from '../../services/supabase';

export default function RiderDashboard({ riders = [] }) {
  const total = riders.length;
  const active = riders.filter(r => r.status === 'نشط').length;
  const vacation = riders.filter(r => r.status === 'إجازة').length;
  const suspended = riders.filter(r => r.status === 'موقوف').length;
  
  const expiredIqamas = riders.filter(r => getExpiryStatus(r.iqama_expiry).color === 'red').length;
  const expiredLicenses = riders.filter(r => getExpiryStatus(r.license_expiry).color === 'red').length;
  const expiredContracts = riders.filter(r => getExpiryStatus(r.contract_expiry).color === 'red').length;
  const noVehicles = riders.filter(r => !r.current_vehicle_id).length;

  const cards = [
    { title: 'إجمالي المناديب', value: total, color: 'border-blue-500', textColor: 'text-blue-400' },
    { title: 'المناديب النشطون', value: active, color: 'border-green-500', textColor: 'text-green-400' },
    { title: 'في إجازة', value: vacation, color: 'border-yellow-500', textColor: 'text-yellow-400' },
    { title: 'الموقوفون', value: suspended, color: 'border-gray-500', textColor: 'text-gray-400' },
    { title: 'الإقامات المنتهية', value: expiredIqamas, color: 'border-red-500', textColor: 'text-red-400' },
    { title: 'الرخص المنتهية', value: expiredLicenses, color: 'border-red-500', textColor: 'text-red-400' },
    { title: 'العقود المنتهية', value: expiredContracts, color: 'border-red-500', textColor: 'text-red-400' },
    { title: 'مناديب بدون سيارات', value: noVehicles, color: 'border-purple-500', textColor: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`bg-slate-800/80 border-r-4 ${card.color} border-slate-700 p-4 rounded-xl shadow-lg`}>
          <div className="text-slate-400 text-xs font-medium">{card.title}</div>
          <div className={`text-2xl font-bold mt-2 ${card.textColor}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}