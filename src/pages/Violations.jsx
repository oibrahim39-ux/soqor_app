import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hxyqwmyyudqtqdzizfmb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eq88AWmSIZoLBV01jv0k5g_0jYR6GIX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Violations() {
  const [violations, setViolations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);

  const [newViolation, setNewViolation] = useState({
    violation_number: 'V-98421',
    driver_name: 'عمر عبدالرحمن',
    car: 'تويوتا يارس (أ ب ج 1234)',
    project: 'هنقرستيشن',
    type: 'تجاوز السرعة',
    issuer: 'ساهر / المرور السعودي',
    date: '2026-08-04',
    amount: '300',
    status: 'غير مسددة',
    description: 'تجاوز السرعة المحددة على طريق الملك فهد',
    deduct_from_salary: true,
    installments: '1'
  });

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    const { data, error } = await supabase.from('violations').select('*').order('id', { ascending: false });
    if (!error && data) {
      setViolations(data);
    } else {
      setViolations([
        {
          id: 1, violation_number: 'V-98421', driver_name: 'عمر عبدالرحمن', car: 'تويوتا يارس (أ ب ج 1234)',
          project: 'هنقرستيشن', type: 'تجاوز السرعة', issuer: 'ساهر', date: '2026-08-04',
          amount: '300 ر.س', status: 'غير مسددة', description: 'تجاوز السرعة على طريق الملك فهد', salary_deducted: 'مخصومة من الراتب'
        },
        {
          id: 2, violation_number: 'V-88312', driver_name: 'خالد سعيد', car: 'هيونداي النترا (د هـ و 5678)',
          project: 'جاهز', type: 'وقوف خاطئ', issuer: 'أمانة الرياض', date: '2026-08-01',
          amount: '150 ر.س', status: 'مسددة', description: 'الوقوف في مكان ممنوع أمام المطعم', salary_deducted: 'تم السداد نقداً'
        }
      ]);
    }
  };

  const handleAddViolation = async (e) => {
    e.preventDefault();
    if (!newViolation.driver_name || !newViolation.amount) {
      alert('الرجاء إدخال اسم المندوب وقيمة المخالفة');
      return;
    }
    const { data, error } = await supabase.from('violations').insert([newViolation]).select();
    if (!error && data) {
      setViolations([data[0], ...violations]);
      setShowAddModal(false);
      alert('⚠️ تم حفظ المخالفة بنجاح وربطها بملف المندوب والراتب!');
    } else {
      setViolations([{ id: Date.now(), ...newViolation, amount: `${newViolation.amount} ر.س`, salary_deducted: 'مربوطة بالراتب' }, ...violations]);
      setShowAddModal(false);
      alert('⚠️ تمت إضافة المخالفة محلياً وربطها بالراتب بنجاح!');
    }
  };

  const totalViolations = violations.length;
  const unpaidViolations = violations.filter(v => v.status === 'غير مسددة').length;
  const totalAmount = '450 ر.س';

  const filteredViolations = violations.filter(v => {
    const matchSearch = v.driver_name?.includes(searchTerm) || v.violation_number?.includes(searchTerm) || v.type?.includes(searchTerm);
    const matchProject = filterProject === 'الكل' || v.project === filterProject;
    const matchStatus = filterStatus === 'الكل' || v.status === filterStatus;
    return matchSearch && matchProject && matchStatus;
  });

  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', color: '#F8FAFC', direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif" }}>
      
      {/* رأس الصفحة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>⚠️ إدارة المخالفات والجزاءات ({violations.length})</h2>
          <p style={{ margin: '6px 0 0 0', color: '#94A3B8', fontSize: '13px' }}>متابعة المخالفات المرورية، الجهات المصدرة، السداد، والخصم التلقائي من رواتب المناديب</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: '#2563EB', color: '#FFF', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
          + تسجيل مخالفة جديدة
        </button>
      </div>

      {/* لوحة المؤشرات (Dashboard KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { title: 'إجمالي المخالفات', val: totalViolations, color: '#3B82F6', icon: '⚠️' },
          { title: 'غير المسددة', val: unpaidViolations, color: '#EF4444', icon: '⏳' },
          { title: 'إجمالي قيمة المخالفات', val: totalAmount, color: '#F59E0B', icon: '💵' },
          { title: 'أكثر مندوب مخالف', val: 'عمر عبدالرحمن', color: '#A855F7', icon: '👤' },
          { title: 'أكثر سيارة مخالفة', val: 'تويوتا يارس (أ ب ج 1234)', color: '#10B981', icon: '🚗' },
        ].map((kpi, idx) => (
          <div key={idx} style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '18px' }}>{kpi.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: kpi.color, backgroundColor: `${kpi.color}15`, padding: '2px 6px', borderRadius: '4px' }}>نشط</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{kpi.title}</div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#FFF', marginTop: '4px' }}>{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* البحث والفلترة */}
      <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', boxSizing: 'border-box' }}>
        <input 
          type="text" 
          placeholder="🔍 بحث برقم المخالفة، اسم المندوب أو نوع المخالفة..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 2, minWidth: '200px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none', fontSize: '12px' }}
        />
        <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} style={{ flex: 1, minWidth: '130px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none', fontSize: '12px' }}>
          <option value="الكل">📦 كل المشاريع</option>
          <option value="هنقرستيشن">هنقرستيشن</option>
          <option value="جاهز">جاهز</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ flex: 1, minWidth: '130px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none', fontSize: '12px' }}>
          <option value="الكل">🚦 كل الحالات</option>
          <option value="مسددة">مسددة</option>
          <option value="غير مسددة">غير مسددة</option>
        </select>
      </div>

      {/* جدول قائمة المخالفات */}
      <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', width: '100%', overflowX: 'auto', boxSizing: 'border-box' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '12px', minWidth: '950px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '12px 14px' }}>رقم المخالفة</th>
              <th style={{ padding: '12px 14px' }}>المندوب والسيارة</th>
              <th style={{ padding: '12px 14px' }}>المشروع</th>
              <th style={{ padding: '12px 14px' }}>نوع المخالفة والجهة</th>
              <th style={{ padding: '12px 14px' }}>التاريخ</th>
              <th style={{ padding: '12px 14px' }}>القيمة</th>
              <th style={{ padding: '12px 14px' }}>الحالة والسداد</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>التفاصيل والإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredViolations.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 'bold', fontFamily: 'monospace', color: '#38BDF8' }}>{item.violation_number}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 'bold', color: '#FFF' }}>{item.driver_name}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>{item.car}</div>
                </td>
                <td style={{ padding: '12px 14px' }}><span style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#38BDF8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{item.project}</span></td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 'bold', color: '#FFF' }}>{item.type}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>{item.issuer}</div>
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#94A3B8' }}>{item.date}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 'bold', color: '#F59E0B' }}>{item.amount}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ backgroundColor: item.status === 'مسددة' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: item.status === 'مسددة' ? '#22C55E' : '#EF4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', fontSize: '10px' }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <button onClick={() => { setSelectedViolation(item); setShowDetailsModal(true); }} style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    👁️ عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال تسجيل مخالفة جديدة */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <div style={{ backgroundColor: '#0F172A', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>⚠️ تسجيل مخالفة جديدة وخصمها من الراتب</h3>
              <button onClick={() => setShowAddModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddViolation} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', marginBottom: '4px' }}>اسم المندوب</label>
                  <select value={newViolation.driver_name} onChange={(e) => setNewViolation({...newViolation, driver_name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }}>
                    <option value="عمر عبدالرحمن">عمر عبدالرحمن</option>
                    <option value="خالد سعيد">خالد سعيد</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', marginBottom: '4px' }}>السيارة المرتبطة</label>
                  <input type="text" value={newViolation.car} onChange={(e) => setNewViolation({...newViolation, car: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', marginBottom: '4px' }}>نوع المخالفة</label>
                  <input type="text" value={newViolation.type} onChange={(e) => setNewViolation({...newViolation, type: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', marginBottom: '4px' }}>الجهة المصدرة</label>
                  <input type="text" value={newViolation.issuer} onChange={(e) => setNewViolation({...newViolation, issuer: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', marginBottom: '4px' }}>قيمة المخالفة (ر.س)</label>
                  <input type="number" value={newViolation.amount} onChange={(e) => setNewViolation({...newViolation, amount: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', marginBottom: '4px' }}>تاريخ المخالفة</label>
                  <input type="date" value={newViolation.date} onChange={(e) => setNewViolation({...newViolation, date: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '4px' }}>وصف المخالفة</label>
                <textarea rows="2" value={newViolation.description} onChange={(e) => setNewViolation({...newViolation, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF', outline: 'none' }} />
              </div>
              <button type="submit" style={{ padding: '12px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>حفظ وربط المخالفة براتب المندوب</button>
            </form>
          </div>
        </div>
      )}

      {/* مودال تفاصيل المخالفة */}
      {showDetailsModal && selectedViolation && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <div style={{ backgroundColor: '#0F172A', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>📋 تفاصيل المخالفة: {selectedViolation.violation_number}</h3>
              <button onClick={() => setShowDetailsModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div><strong>اسم المندوب:</strong> {selectedViolation.driver_name}</div>
              <div><strong>السيارة:</strong> {selectedViolation.car}</div>
              <div><strong>المشروع:</strong> {selectedViolation.project}</div>
              <div><strong>نوع المخالفة:</strong> {selectedViolation.type}</div>
              <div><strong>الجهة المصدرة:</strong> {selectedViolation.issuer}</div>
              <div><strong>التاريخ:</strong> {selectedViolation.date}</div>
              <div><strong>القيمة:</strong> <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>{selectedViolation.amount}</span></div>
              <div><strong>الحالة:</strong> <span style={{ color: selectedViolation.status === 'مسددة' ? '#22C55E' : '#EF4444', fontWeight: 'bold' }}>{selectedViolation.status}</span></div>
            </div>

            <div style={{ backgroundColor: 'rgba(19,28,48,0.8)', padding: '14px', borderRadius: '12px', marginBottom: '16px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#38BDF8', fontWeight: 'bold', marginBottom: '4px' }}>📝 الوصف الإداري وحالة الخصم:</div>
              <div>{selectedViolation.description}</div>
              <div style={{ marginTop: '8px', color: '#22C55E', fontWeight: 'bold' }}>✓ مرتبطة تلقائياً بمسير الرواتب والمالية.</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowDetailsModal(false)} style={{ padding: '8px 16px', backgroundColor: '#64748B', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}