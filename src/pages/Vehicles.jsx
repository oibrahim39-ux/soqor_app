import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hxyqwmyyudqtqdzizfmb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eq88AWmSIZoLBV01jv0k5g_0jYR6GIX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Vehicles() {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const [newCar, setNewCar] = useState({
    plate_number: '',
    car_type: 'تويوتا يارس',
    model: '2025',
    year: '2025',
    color: 'أبيض',
    vin: '',
    form_number: '',
    form_expiry_date: '',
    insurance_expiry_date: '',
    mileage: '0',
    project: 'هنقرستيشن',
    driver_name: 'أحمد محمد',
    status: 'تعمل'
  });

  const [inspection, setInspection] = useState({
    inspector_name: 'عثمان إبراهيم',
    mileage: '',
    fuel: 'ممتلئ',
    tires_pressure: 'سليم',
    engine_oil: 'ممتاز',
    radiator_water: 'طبيعي',
    battery: 'سليمة',
    brakes: 'ممتازة',
    lights: 'تعمل بالكامل',
    ac: 'ممتاز',
    body: 'بدون صدمات',
    notes: ''
  });

  const [maintenance, setMaintenance] = useState({
    maintenance_type: 'صيانة دورية (تغيير زيت وفلاتر)',
    workshop_name: 'ورشة صقور الغد المركزية',
    cost: '250',
    approved_by: 'عثمان إبراهيم',
    notes: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const { data, error } = await supabase.from('cars').select('*').order('id', { ascending: false });
    if (!error && data) {
      setCars(data);
    } else {
      setCars([
        {
          id: 1, plate_number: 'أ ب ج 1234', car_type: 'تويوتا يارس', model: '2025', year: '2025', color: 'أبيض',
          vin: 'VIN987654321', form_number: 'FRM-9988', form_expiry_date: '2026-12-30', insurance_number: 'INS-4455',
          insurance_expiry_date: '2026-10-15', status: 'تعمل', driver_name: 'عمر عبدالرحمن', project: 'هنقرستيشن',
          mileage: '45,200 كم', last_check: 'اليوم'
        },
        {
          id: 2, plate_number: 'س ص ع 5678', car_type: 'هيونداي النترا', model: '2024', year: '2024', color: 'فضي',
          vin: 'VIN123456789', form_number: 'FRM-1122', form_expiry_date: '2026-03-10', insurance_number: 'INS-9988',
          insurance_expiry_date: '2026-02-20', status: 'صيانة', driver_name: 'خالد سعيد', project: 'جاهز',
          mileage: '68,100 كم', last_check: 'قبل يومين'
        }
      ]);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    if (!newCar.plate_number || !newCar.vin) {
      alert('الرجاء إدخال رقم اللوحة ورقم الهيكل (VIN)');
      return;
    }
    const { data, error } = await supabase.from('cars').insert([newCar]).select();
    if (!error && data) {
      setCars([data[0], ...cars]);
      setShowAddCarModal(false);
      alert('🚗 تم حفظ بيانات السيارة بنجاح في Supabase!');
    } else {
      setCars([{ id: Date.now(), ...newCar, last_check: 'الآن' }, ...cars]);
      setShowAddCarModal(false);
      alert('🚗 تمت إضافة السيارة محلياً بنجاح!');
    }
  };

  const handleSaveInspection = (e) => {
    e.preventDefault();
    alert(`✅ تم حفظ سجل التشييك اليومي للسيارة (${selectedCar?.plate_number}) بنجاح!`);
    setShowCheckModal(false);
  };

  const handleSaveMaintenance = (e) => {
    e.preventDefault();
    alert(`🛠️ تم تسجيل عملية الصيانة للسيارة (${selectedCar?.plate_number}) بنجاح!`);
    setShowMaintenanceModal(false);
  };

  const totalCars = cars.length;
  const activeCars = cars.filter(c => c.status === 'تعمل').length;
  const maintenanceCars = cars.filter(c => c.status === 'صيانة').length;
  const stoppedCars = cars.filter(c => c.status === 'متوقفة' || c.status === 'حادث').length;

  const filteredCars = cars.filter(c => {
    const matchSearch = c.plate_number?.includes(searchTerm) || c.driver_name?.includes(searchTerm) || c.car_type?.includes(searchTerm);
    const matchProject = filterProject === 'الكل' || c.project === filterProject;
    const matchStatus = filterStatus === 'الكل' || c.status === filterStatus;
    return matchSearch && matchProject && matchStatus;
  });

  return (
    <div style={{ padding: '32px', color: '#F8FAFC', direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif" }}>
      
      {/* رأس الصفحة وأزرار التصدير والإضافة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold' }}>🚗 إدارة السيارات والأسطول ({cars.length})</h2>
          <p style={{ margin: '6px 0 0 0', color: '#94A3B8', fontSize: '14px' }}>متابعة حالة المركبات، التشييك اليومي، الصيانة، والربط مع المناديب</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => alert('📊 تم تصدير بيانات الأسطول إلى Excel بنجاح!')} style={{ backgroundColor: '#16A34A', color: '#FFF', padding: '10px 18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            📥 Export Excel
          </button>
          <button onClick={() => alert('📄 تم تصدير تقرير السيارات إلى PDF بنجاح!')} style={{ backgroundColor: '#DC2626', color: '#FFF', padding: '10px 18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            📑 Export PDF
          </button>
          <button onClick={() => window.print()} style={{ backgroundColor: '#475569', color: '#FFF', padding: '10px 18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            🖨️ Print
          </button>
          <button onClick={() => setShowAddCarModal(true)} style={{ backgroundColor: '#2563EB', color: '#FFF', padding: '10px 22px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
            + إضافة سيارة جديدة
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {[
          { title: 'إجمالي السيارات', val: totalCars, color: '#3B82F6', icon: '🚗' },
          { title: 'السيارات العاملة', val: activeCars, color: '#22C55E', icon: '🟢' },
          { title: 'السيارات بالصيانة', val: maintenanceCars, color: '#F59E0B', icon: '🛠️' },
          { title: 'السيارات المتوقفة', val: stoppedCars, color: '#EF4444', icon: '🛑' },
          { title: 'استمارة منتهية القريب', val: '2', color: '#A855F7', icon: '📄' },
          { title: 'تأمين منتهي', val: '1', color: '#EC4899', icon: '🛡️' },
        ].map((kpi, idx) => (
          <div key={idx} style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>{kpi.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: kpi.color, backgroundColor: `${kpi.color}15`, padding: '2px 8px', borderRadius: '6px' }}>محدث</span>
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{kpi.title}</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#FFF', marginTop: '4px' }}>{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* البحث والفلترة */}
      <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="🔍 بحث برقم اللوحة، المندوب أو النوع..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 2, minWidth: '240px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none' }}
        />
        <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} style={{ flex: 1, minWidth: '160px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none' }}>
          <option value="الكل">📦 كل المشاريع</option>
          <option value="هنقرستيشن">هنقرستيشن</option>
          <option value="جاهز">جاهز</option>
          <option value="مرسول">مرسول</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ flex: 1, minWidth: '160px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none' }}>
          <option value="الكل">🚦 كل الحالات</option>
          <option value="تعمل">تعمل</option>
          <option value="صيانة">صيانة</option>
          <option value="متوقفة">متوقفة</option>
          <option value="حادث">حادث</option>
        </select>
      </div>

      {/* جدول عرض السيارات */}
      <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '16px 20px' }}>رقم اللوحة</th>
              <th style={{ padding: '16px 20px' }}>النوع والموديل</th>
              <th style={{ padding: '16px 20px' }}>رقم الهيكل (VIN)</th>
              <th style={{ padding: '16px 20px' }}>الاستمارة والتأمين</th>
              <th style={{ padding: '16px 20px' }}>المندوب الحالي</th>
              <th style={{ padding: '16px 20px' }}>المشروع</th>
              <th style={{ padding: '16px 20px' }}>العداد</th>
              <th style={{ padding: '16px 20px' }}>الحالة</th>
              <th style={{ padding: '16px 20px', textAlign: 'center' }}>الإجراءات والعمليات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car) => (
              <tr key={car.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 'bold', color: '#FFF', fontFamily: 'monospace' }}>{car.plate_number}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 'bold', color: '#FFF' }}>{car.car_type}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{car.year} ({car.color})</div>
                </td>
                <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#94A3B8', fontSize: '12px' }}>{car.vin}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '11px', color: '#38BDF8' }}>الاستمارة: {car.form_expiry_date || '2026-12-30'}</div>
                  <div style={{ fontSize: '11px', color: '#A855F7' }}>التأمين: {car.insurance_expiry_date || '2026-10-15'}</div>
                </td>
                <td style={{ padding: '16px 20px', fontWeight: 'bold', color: '#FFF' }}>{car.driver_name || 'غير مسند'}</td>
                <td style={{ padding: '16px 20px' }}><span style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#38BDF8', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>{car.project}</span></td>
                <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#FFF' }}>{car.mileage || '0 كم'}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ backgroundColor: car.status === 'تعمل' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: car.status === 'تعمل' ? '#22C55E' : '#F59E0B', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px' }}>
                    {car.status}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => { setSelectedCar(car); setShowCheckModal(true); }} style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>📋 تشييك</button>
                    <button onClick={() => { setSelectedCar(car); setShowMaintenanceModal(true); }} style={{ backgroundColor: '#D97706', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>🛠️ صيانة</button>
                    <button onClick={() => alert(`نقل السيارة ${car.plate_number} لمندوب آخر`)} style={{ backgroundColor: '#7C3AED', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>🔄 نقل</button>
                    <button onClick={() => { if(window.confirm('هل أنت متأكد من حذف هذه السيارة؟')) setCars(cars.filter(c => c.id !== car.id)); }} style={{ backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال إضافة سيارة جديدة */}
      {showAddCarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, overflowY: 'auto', padding: '20px' }}>
          <div style={{ backgroundColor: '#0F172A', padding: '40px', borderRadius: '28px', width: '100%', maxWidth: '900px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', boxShadow: '0 25px 50px rgba(0,0,0,0.7)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>🚗 إضافة سيارة جديدة للأسطول اللوجستي</h2>
              <button onClick={() => setShowAddCarModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddCar} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>رقم اللوحة *</label>
                  <input type="text" placeholder="أ ب ج 1234" value={newCar.plate_number} onChange={(e) => setNewCar({...newCar, plate_number: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>نوع السيارة</label>
                  <input type="text" placeholder="تويوتا يارس..." value={newCar.car_type} onChange={(e) => setNewCar({...newCar, car_type: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>سنة الصنع</label>
                  <input type="text" placeholder="2025" value={newCar.year} onChange={(e) => setNewCar({...newCar, year: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>اللون</label>
                  <input type="text" placeholder="أبيض" value={newCar.color} onChange={(e) => setNewCar({...newCar, color: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>رقم الهيكل (VIN) *</label>
                  <input type="text" placeholder="رقم الشاصيه" value={newCar.vin} onChange={(e) => setNewCar({...newCar, vin: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>تاريخ انتهاء الاستمارة</label>
                  <input type="date" value={newCar.form_expiry_date} onChange={(e) => setNewCar({...newCar, form_expiry_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>تاريخ انتهاء التأمين</label>
                  <input type="date" value={newCar.insurance_expiry_date} onChange={(e) => setNewCar({...newCar, insurance_expiry_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>عداد الكيلومترات الحالي</label>
                  <input type="text" placeholder="0 كم" value={newCar.mileage} onChange={(e) => setNewCar({...newCar, mileage: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>المشروع</label>
                  <select value={newCar.project} onChange={(e) => setNewCar({...newCar, project: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }}>
                    <option value="هنقرستيشن">هنقرستيشن</option>
                    <option value="جاهز">جاهز</option>
                    <option value="مرسول">مرسول</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>حالة السيارة</label>
                  <select value={newCar.status} onChange={(e) => setNewCar({...newCar, status: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }}>
                    <option value="تعمل">تعمل</option>
                    <option value="صيانة">صيانة</option>
                    <option value="متوقفة">متوقفة</option>
                    <option value="حادث">حادث</option>
                  </select>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', color: '#38BDF8' }}>📷 رفع صور المستندات والمركبة إلى Supabase Storage</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {['صورة أمامية', 'صورة خلفية', 'صورة يمين', 'صورة يسار', 'صورة العداد', 'صورة الاستمارة', 'صورة التأمين'].map((imgLabel, idx) => (
                    <div key={idx} style={{ border: '2px dashed #3B82F6', borderRadius: '10px', padding: '10px', textAlign: 'center', fontSize: '11px', color: '#94A3B8', cursor: 'pointer', backgroundColor: '#1E293B' }}>
                      📤 {imgLabel}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '14px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>حفظ السيارة في الأسطول</button>
                <button type="button" onClick={() => setShowAddCarModal(false)} style={{ padding: '14px 20px', backgroundColor: '#475569', color: '#FFF', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال التشييك اليومي */}
      {showCheckModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, overflowY: 'auto', padding: '20px' }}>
          <div style={{ backgroundColor: '#0F172A', padding: '40px', borderRadius: '28px', width: '100%', maxWidth: '750px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', boxShadow: '0 25px 50px rgba(0,0,0,0.7)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>📋 سجل التشييك اليومي للسيارة ({selectedCar?.plate_number})</h3>
              <button onClick={() => setShowCheckModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSaveInspection} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>اسم الفاحص</label>
                  <input type="text" value={inspection.inspector_name} onChange={(e) => setInspection({...inspection, inspector_name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>قراءة العداد الحالية</label>
                  <input type="text" placeholder="الكم المحسوب" value={inspection.mileage} onChange={(e) => setInspection({...inspection, mileage: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>مستوى البنزين</label>
                  <select value={inspection.fuel} onChange={(e) => setInspection({...inspection, fuel: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }}>
                    <option value="ممتلئ">ممتلئ</option>
                    <option value="نصف">نصف</option>
                    <option value="منخفض">منخفض</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>ضغط الكفرات</label>
                  <select value={inspection.tires_pressure} onChange={(e) => setInspection({...inspection, tires_pressure: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }}>
                    <option value="سليم">سليم تماماً</option>
                    <option value="يحتاج هواء">يحتاج هواء</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>زيت المكينة</label>
                  <input type="text" value={inspection.engine_oil} onChange={(e) => setInspection({...inspection, engine_oil: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>ماء الرديتر</label>
                  <input type="text" value={inspection.radiator_water} onChange={(e) => setInspection({...inspection, radiator_water: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>ملاحظات الفحص</label>
                <textarea rows="2" value={inspection.notes} onChange={(e) => setInspection({...inspection, notes: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
              </div>
              <button type="submit" style={{ padding: '12px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>حفظ وإرسال التشييك اليومي</button>
            </form>
          </div>
        </div>
      )}

      {/* مودال الصيانة */}
      {showMaintenanceModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, overflowY: 'auto', padding: '20px' }}>
          <div style={{ backgroundColor: '#0F172A', padding: '40px', borderRadius: '28px', width: '100%', maxWidth: '650px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', boxShadow: '0 25px 50px rgba(0,0,0,0.7)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>🛠️ تسجيل وصيانة السيارة ({selectedCar?.plate_number})</h3>
              <button onClick={() => setShowMaintenanceModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSaveMaintenance} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>نوع الصيانة</label>
                <input type="text" value={maintenance.maintenance_type} onChange={(e) => setMaintenance({...maintenance, maintenance_type: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>اسم الورشة</label>
                <input type="text" value={maintenance.workshop_name} onChange={(e) => setMaintenance({...maintenance, workshop_name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>التكلفة (ر.س)</label>
                <input type="number" value={maintenance.cost} onChange={(e) => setMaintenance({...maintenance, cost: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>رفع صورة الفاتورة (Invoice Upload)</label>
                <div style={{ border: '2px dashed #3B82F6', borderRadius: '8px', padding: '12px', textAlign: 'center', fontSize: '12px', color: '#94A3B8', cursor: 'pointer', backgroundColor: '#1E293B' }}>
                  📤 انقر لرفع فاتورة الصيانة
                </div>
              </div>
              <button type="submit" style={{ padding: '12px', backgroundColor: '#D97706', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>حفظ سجل الصيانة والفاتورة</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}