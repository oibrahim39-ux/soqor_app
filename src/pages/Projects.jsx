import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hxyqwmyyudqtqdzizfmb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eq88AWmSIZoLBV01jv0k5g_0jYR6GIX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [newProject, setNewProject] = useState({
    name: 'هنقرستيشن',
    client: 'شركة هنقرستيشن',
    city: 'الرياض',
    branch: 'الفرع الرئيسي',
    supervisor: 'محمد عثمان',
    order_price: '14',
    daily_target: '15',
    monthly_target: '400',
    min_orders: '10',
    status: 'نشط',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    notes: 'عقد استراتيجي رئيسي للأسطول'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (!error && data) {
      setProjects(data);
    } else {
      setProjects([
        {
          id: 1, name: 'هنقرستيشن', client: 'شركة هنقرستيشن', city: 'الرياض', branch: 'الفرع الرئيسي',
          supervisor: 'محمد عثمان', drivers_count: 45, cars_count: 40, order_price: '14 ر.س',
          daily_target: '15 طلب', monthly_target: '400 طلب', status: 'نشط', start_date: '2026-01-01',
          end_date: '2026-12-31', revenue: '252,000 ر.س', orders_total: '18,000 طلب', profit: '75,000 ر.س'
        },
        {
          id: 2, name: 'جاهز', client: 'شركة جاهز الدولية', city: 'جدة', branch: 'فرع الغربية',
          supervisor: 'خالد سعيد', drivers_count: 30, cars_count: 28, order_price: '15 ر.س',
          daily_target: '14 طلب', monthly_target: '350 طلب', status: 'نشط', start_date: '2026-02-15',
          end_date: '2026-12-31', revenue: '189,000 ر.س', orders_total: '12,600 طلب', profit: '52,000 ر.س'
        }
      ]);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.client) {
      alert('الرجاء إدخال اسم المشروع واسم العميل');
      return;
    }
    const { data, error } = await supabase.from('projects').insert([newProject]).select();
    if (!error && data) {
      setProjects([data[0], ...projects]);
      setShowAddModal(false);
      alert('📦 تم حفظ المشروع الجديد بنجاح في Supabase!');
    } else {
      setProjects([{ id: Date.now(), ...newProject, drivers_count: 0, cars_count: 0, revenue: '0 ر.س', orders_total: '0 طلب', profit: '0 ر.س' }, ...projects]);
      setShowAddModal(false);
      alert('📦 تمت إضافة المشروع محلياً بنجاح!');
    }
  };

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'نشط').length;
  const stoppedProjects = projects.filter(p => p.status === 'متوقف' || p.status === 'مؤرشف').length;

  const filteredProjects = projects.filter(p => {
    const matchSearch = p.name?.includes(searchTerm) || p.client?.includes(searchTerm) || p.supervisor?.includes(searchTerm);
    const matchCity = filterCity === 'الكل' || p.city === filterCity;
    const matchStatus = filterStatus === 'الكل' || p.status === filterStatus;
    return matchSearch && matchCity && matchStatus;
  });

  return (
    <div style={{ padding: '32px', color: '#F8FAFC', direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif" }}>
      
      {/* رأس الصفحة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold' }}>📦 إدارة المشاريع والعملاء ({projects.length})</h2>
          <p style={{ margin: '6px 0 0 0', color: '#94A3B8', fontSize: '14px' }}>متابعة عقود المشاريع، الإيرادات، الأرباح، والتارجت التشغيلي</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: '#2563EB', color: '#FFF', padding: '12px 24px', borderRadius: '14px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
          + إضافة مشروع جديد
        </button>
      </div>

      {/* لوحة المؤشرات (KPIs Dashboard) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {[
          { title: 'إجمالي المشاريع', val: totalProjects, color: '#3B82F6', icon: '📦' },
          { title: 'المشاريع النشطة', val: activeProjects, color: '#22C55E', icon: '🟢' },
          { title: 'المشاريع المتوقفة', val: stoppedProjects, color: '#EF4444', icon: '🛑' },
          { title: 'إجمالي الإيرادات', val: '441,000 ر.س', color: '#10B981', icon: '💰' },
          { title: 'إجمالي الطلبات', val: '30,600 طلب', color: '#8B5CF6', icon: '🚀' },
        ].map((kpi, idx) => (
          <div key={idx} style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>{kpi.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: kpi.color, backgroundColor: `${kpi.color}15`, padding: '2px 8px', borderRadius: '6px' }}>محدث</span>
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{kpi.title}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFF', marginTop: '4px' }}>{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* البحث والفلترة */}
      <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="🔍 بحث سريع باسم المشروع، العميل أو المشرف..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 2, minWidth: '240px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none' }}
        />
        <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none' }}>
          <option value="الكل">🌆 كل المدن</option>
          <option value="الرياض">الرياض</option>
          <option value="جدة">جدة</option>
          <option value="الدمام">الدمام</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none' }}>
          <option value="الكل">🚦 كل الحالات</option>
          <option value="نشط">نشط</option>
          <option value="متوقف">متوقف</option>
          <option value="مؤرشف">مؤرشف</option>
        </select>
      </div>

      {/* جدول المشاريع */}
      <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '16px 20px' }}>اسم المشروع</th>
              <th style={{ padding: '16px 20px' }}>العميل والمدينة</th>
              <th style={{ padding: '16px 20px' }}>المشرف</th>
              <th style={{ padding: '16px 20px' }}>المناديب / السيارات</th>
              <th style={{ padding: '16px 20px' }}>سعر الطلب والتارجت</th>
              <th style={{ padding: '16px 20px' }}>الحالة</th>
              <th style={{ padding: '16px 20px', textAlign: 'center' }}>الإجراءات والعمليات</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 'bold', color: '#FFF' }}>{project.name}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 'bold', color: '#FFF' }}>{project.client}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{project.city} ({project.branch || 'الفرع الرئيسي'})</div>
                </td>
                <td style={{ padding: '16px 20px', color: '#FFF' }}>{project.supervisor}</td>
                <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#38BDF8' }}>
                  👤 {project.drivers_count || 0} مندوب <br/>
                  🚗 {project.cars_count || 0} سيارة
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ color: '#22C55E', fontWeight: 'bold' }}>{project.order_price}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>يومي: {project.daily_target}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ backgroundColor: project.status === 'نشط' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: project.status === 'نشط' ? '#22C55E' : '#EF4444', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px' }}>
                    {project.status}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button onClick={() => { setSelectedProject(project); setShowDetailsModal(true); }} style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>👁️ عرض</button>
                    <button onClick={() => alert(`تعديل بيانات المشروع: ${project.name}`)} style={{ backgroundColor: '#D97706', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>✏️ تعديل</button>
                    <button onClick={() => alert(`أرشفة المشروع: ${project.name}`)} style={{ backgroundColor: '#7C3AED', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>📂 أرشفة</button>
                    <button onClick={() => { if(window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) setProjects(projects.filter(p => p.id !== project.id)); }} style={{ backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال إضافة مشروع جديد */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, overflowY: 'auto', padding: '20px' }}>
          <div style={{ backgroundColor: '#0F172A', padding: '40px', borderRadius: '28px', width: '100%', maxWidth: '850px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', boxShadow: '0 25px 50px rgba(0,0,0,0.7)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>📦 إضافة مشروع جديد لنظام صقور الغد</h2>
              <button onClick={() => setShowAddModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>اسم المشروع *</label>
                  <input type="text" value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>اسم العميل *</label>
                  <input type="text" value={newProject.client} onChange={(e) => setNewProject({...newProject, client: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>المدينة</label>
                  <input type="text" value={newProject.city} onChange={(e) => setNewProject({...newProject, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>الفرع</label>
                  <input type="text" value={newProject.branch} onChange={(e) => setNewProject({...newProject, branch: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>اسم المشرف</label>
                  <input type="text" value={newProject.supervisor} onChange={(e) => setNewProject({...newProject, supervisor: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>سعر الطلب (ر.س)</label>
                  <input type="number" value={newProject.order_price} onChange={(e) => setNewProject({...newProject, order_price: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>التارجت اليومي</label>
                  <input type="number" value={newProject.daily_target} onChange={(e) => setNewProject({...newProject, daily_target: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>التارجت الشهري</label>
                  <input type="number" value={newProject.monthly_target} onChange={(e) => setNewProject({...newProject, monthly_target: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>الحد الأدنى للطلبات</label>
                  <input type="number" value={newProject.min_orders} onChange={(e) => setNewProject({...newProject, min_orders: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>حالة المشروع</label>
                  <select value={newProject.status} onChange={(e) => setNewProject({...newProject, status: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }}>
                    <option value="نشط">نشط</option>
                    <option value="متوقف">متوقف</option>
                    <option value="مؤرشف">مؤرشف</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={{ padding: '14px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>حفظ المشروع الجديد</button>
            </form>
          </div>
        </div>
      )}

      {/* مودال تفاصيل المشروع */}
      {showDetailsModal && selectedProject && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, overflowY: 'auto', padding: '20px' }}>
          <div style={{ backgroundColor: '#0F172A', padding: '40px', borderRadius: '28px', width: '100%', maxWidth: '800px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', boxShadow: '0 25px 50px rgba(0,0,0,0.7)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>📊 لوحة تحليلات وتفاصيل المشروع: {selectedProject.name}</h3>
              <button onClick={() => setShowDetailsModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.8)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>إجمالي الإيرادات</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22C55E', marginTop: '4px' }}>{selectedProject.revenue || '252,000 ر.س'}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.8)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>صافي الأرباح</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#38BDF8', marginTop: '4px' }}>{selectedProject.profit || '75,000 ر.س'}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.8)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>نسبة تحقيق التارجت</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#F59E0B', marginTop: '4px' }}>94.5%</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#38BDF8' }}>🏆 تقييم أداء المناديب في المشروع</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                <div>
                  <div style={{ color: '#22C55E', fontWeight: 'bold', marginBottom: '4px' }}>⭐ أفضل المناديب أداءً:</div>
                  <div>1. عمر عبدالرحمن (480 طلب)</div>
                  <div>2. عبدالله إبراهيم (455 طلب)</div>
                </div>
                <div>
                  <div style={{ color: '#EF4444', fontWeight: 'bold', marginBottom: '4px' }}>⚠️ المناديب الأقل أداءً:</div>
                  <div>1. أحمد حسن (180 طلب)</div>
                  <div>2. سالم محمد (195 طلب)</div>
                </div>
              </div>
            </div>

            <button onClick={() => setShowDetailsModal(false)} style={{ width: '100%', padding: '12px', backgroundColor: '#475569', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>إغلاق لوحة التفاصيل</button>
          </div>
        </div>
      )}

    </div>
  );
}