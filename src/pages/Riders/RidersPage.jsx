import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import RiderDashboard from '../../components/Riders/RiderDashboard';
import RiderFilters from '../../components/Riders/RiderFilters';
import RiderTable from '../../components/Riders/RiderTable';
import RiderProfileDetail from '../../components/Riders/RiderProfileDetail';

export default function RidersPage() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ project: '', status: '', city: '', iqamaStatus: '' });

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('drivers').select('*').order('id', { ascending: false });
    if (!error && data) setRiders(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت تأكد من حذف هذا المندوب نهائياً؟')) {
      await supabase.from('drivers').delete().eq('id', id);
      fetchRiders();
    }
  };

  const filteredRiders = riders.filter((r) => {
    const matchSearch =
      r.name?.includes(search) ||
      r.iqama_number?.includes(search) ||
      r.phone?.includes(search) ||
      r.employee_id?.includes(search);

    const matchProject = !filters.project || r.project === filters.project;
    const matchStatus = !filters.status || r.status === filters.status;
    const matchCity = !filters.city || r.city === filters.city;

    return matchSearch && matchProject && matchStatus && matchCity;
  });

  if (loading) {
    return <div className="p-8 text-center text-slate-400">جاري تحميل بيانات المناديب...</div>;
  }

  if (selectedRider) {
    return <RiderProfileDetail rider={selectedRider} onBack={() => setSelectedRider(null)} />;
  }

  return (
    <div className="space-y-6">
      <RiderDashboard riders={riders} />
      <RiderFilters filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />
      <RiderTable
        riders={filteredRiders}
        onView={(r) => setSelectedRider(r)}
        onEdit={(r) => alert(`تعديل: ${r.name}`)}
        onDelete={handleDelete}
        onArchive={(id) => alert(`أرشفة السجل رقم ${id}`)}
      />
    </div>
  );
}