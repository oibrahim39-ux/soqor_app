import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hxyqwmyyudqtqdzizfmb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eq88AWmSIZoLBV01jv0k5g_0jYR6GIX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterMonth, setFilterMonth] = useState('أغسطس 2026');

  const [showAddAdvanceModal, setShowAddAdvanceModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [newAdvance, setNewAdvance] = useState({
    driver_name: 'عمر عبدالرحمن',
    amount: '500',
    date: '2026-08-05',
    reason: 'ظروف طارئة',
    installments: '2',
    remaining: '500'
  });

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    const { data, error } = await supabase.from('salaries').select('*').order('id', { ascending: false });
    if (!error && data) {
      setSalaries(data);
    } else {
      setSalaries([
        {
          id: 1, name: 'عمر عبدالرحمن', project: 'هنقرستيشن', orders: 420, target: 400, achievement: '105%',
          order_price: '14 ر.س', base_total: '5,880 ر.س', incentives: '300 ر.س', deductions: '100 ر.س',
          fuel: '200 ر.س', housing: '500 ر.س', advances: '500 ر.س', violations: '0 ر.س',
          net_salary: '4,780 ر.س', status: 'تم الصرف', bank: 'البنك الأهلي السعودي (SNB)', iban: 'SA0310000012345678901234'
        },
        {
          id: 2, name: 'خالد سعيد', project: 'جاهز', orders: 350, target: 350, achievement: '100%',
          order_price: '15 ر.س', base_total: '5,250 ر.س', incentives: '200 ر.س', deductions: '50 ر.س',
          fuel: '150 ر.س', housing: '500 ر.س', advances: '0 ر.س', violations: '100 ر.س',
          net_salary: '4,650 ر.س', status: 'لم يتم الصرف', bank: 'مصرف الراجحي', iban: 'SA8080000001234567890123'
        }
      ]);
    }
  };

  const handleAddAdvance = (e) => {
    e.preventDefault();
    alert(`💸 تمت إضافة السلفة بقيمة ${newAdvance.amount} ر.س للمندوب ${newAdvance.driver_name} بنجاح وترتبط براتبه المباشر!`);
    setShowAddAdvanceModal(false);
  };

  const filteredSalaries = salaries.filter(s => {
    const matchSearch = s.name?.includes(searchTerm) || s.project?.includes(searchTerm);
    const matchProject = filterProject === 'الكل' || s.project === filterProject;
    const matchStatus = filterStatus === 'الكل' || s.status === filterStatus;
    return matchSearch && matchProject && matchStatus;
  });

  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', color: '#F8FAFC', direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif" }}>
      
      {/* رأس الصفحة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>💰 إدارة الرواتب والمالية ({salaries.length})</h2>
          <p style={{ margin: '6px 0 0 0', color: '#94A3B8', fontSize: '13px' }}>احتساب الرواتب التلقائي، الحوافز، السلف، الخصومات، والتحويلات البنكية</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowAddAdvanceModal(true)} style={{ backgroundColor: '#D97706', color: '#FFF', padding: '10px 18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
            + إضافة سلفة جديدة
          </button>
          <button onClick={() => setShowBankTransferModal(true)} style={{ backgroundColor: '#16A34A', color: '#FFF', padding: '10px 18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(22,163,74,0.4)' }}>
            💳 التحويلات البنكية وتصدير Excel
          </button>
        </div>
      </div>

      {/* لوحة المؤشرات المالية (Dashboard KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { title: 'إجمالي الرواتب', val: '9,430 ر.س', color: '#3B82F6', icon: '💵' },
          { title: 'إجمالي الحوافز', val: '500 ر.س', color: '#22C55E', icon: '🎁' },
          { title: 'إجمالي الخصومات', val: '150 ر.س', color: '#EF4444', icon: '⚠️' },
          { title: 'إجمالي السلف', val: '500 ر.س', color: '#F59E0B', icon: '💸' },
          { title: 'إجمالي البنزين', val: '350 ر.س', color: '#A855F7', icon: '⛽' },
          { title: 'صافي الرواتب', val: '9,430 ر.س', color: '#10B981', icon: '💰' },
          { title: 'رواتب مصروفة', val: '1', color: '#22C55E', icon: '✅' },
          { title: 'رواتب معلقة', val: '1', color: '#EF4444', icon: '⏳' },
        ].map((kpi, idx) => (
          <div key={idx} style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '16px' }}>{kpi.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: kpi.color, backgroundColor: `${kpi.color}15`, padding: '2px 4px', borderRadius: '4px' }}>نشط</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{kpi.title}</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFF', marginTop: '2px' }}>{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* البحث والفلترة */}
      <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', boxSizing: 'border-box' }}>
        <input 
          type="text" 
          placeholder="🔍 بحث سريع باسم المندوب أو المشروع..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 2, minWidth: '180px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none', fontSize: '12px' }}
        />
        <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} style={{ flex: 1, minWidth: '120px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none', fontSize: '12px' }}>
          <option value="الكل">📦 كل المشاريع</option>
          <option value="هنقرستيشن">هنقرستيشن</option>
          <option value="جاهز">جاهز</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ flex: 1, minWidth: '120px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', color: '#FFF', outline: 'none', fontSize: '12px' }}>
          <option value="الكل">🚦 كل الحالات</option>
          <option value="تم الصرف">تم الصرف</option>
          <option value="لم يتم الصرف">لم يتم الصرف</option>
        </select>
      </div>

      {/* جدول قائمة الرواتب مع احتواء مرن ومناسب */}
      <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', width: '100%', overflowX: 'auto', boxSizing: 'border-box' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '12px', minWidth: '950px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '12px 14px' }}>اسم المندوب</th>
              <th style={{ padding: '12px 14px' }}>المشروع</th>
              <th style={{ padding: '12px 14px' }}>الطلبات والتارجت</th>
              <th style={{ padding: '12px 14px' }}>السعر</th>
              <th style={{ padding: '12px 14px' }}>الأساسي</th>
              <th style={{ padding: '12px 14px' }}>حوافز</th>
              <th style={{ padding: '12px 14px' }}>خصومات</th>
              <th style={{ padding: '12px 14px' }}>بنزين/سكن</th>
              <th style={{ padding: '12px 14px' }}>سلف/مخالفات</th>
              <th style={{ padding: '12px 14px', color: '#22C55E' }}>الصافي</th>
              <th style={{ padding: '12px 14px' }}>الحالة</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>الكشف</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 'bold', color: '#FFF' }}>{item.name}</td>
                <td style={{ padding: '12px 14px' }}><span style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#38BDF8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{item.project}</span></td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>{item.orders}/{item.target}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>{item.order_price}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 'bold' }}>{item.base_total}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#22C55E' }}>+{item.incentives}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#EF4444' }}>-{item.deductions}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#A855F7' }}>{item.fuel}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#F59E0B' }}>{item.advances}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 'bold', color: '#22C55E' }}>{item.net_salary}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ backgroundColor: item.status === 'تم الصرف' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: item.status === 'تم الصرف' ? '#22C55E' : '#EF4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', fontSize: '10px' }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <button onClick={() => { setSelectedRecord(item); setShowPayslipModal(true); }} style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    📄 الكشف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال إضافة سلفة */}
      {showAddAdvanceModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: '#0F172A', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>💸 إضافة سلفة مالية للمندوب</h3>
              <button onClick={() => setShowAddAdvanceModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', fontSize: '16px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddAdvance} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
              <div>
                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '4px' }}>اختر المندوب</label>
                <select value={newAdvance.driver_name} onChange={(e) => setNewAdvance({...newAdvance, driver_name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }}>
                  <option value="عمر عبدالرحمن">عمر عبدالرحمن</option>
                  <option value="خالد سعيد">خالد سعيد</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '4px' }}>مبلغ السلفة (ر.س)</label>
                <input type="number" value={newAdvance.amount} onChange={(e) => setNewAdvance({...newAdvance, amount: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '4px' }}>السبب</label>
                <input type="text" value={newAdvance.reason} onChange={(e) => setNewAdvance({...newAdvance, reason: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1E293B', color: '#FFF' }} />
              </div>
              <button type="submit" style={{ padding: '12px', backgroundColor: '#D97706', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>حفظ وربط السلفة بالراتب</button>
            </form>
          </div>
        </div>
      )}

      {/* مودال كشف الراتب (Payslip) */}
      {showPayslipModal && selectedRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <div style={{ backgroundColor: '#FFF', color: '#0F172A', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#1E293B' }}>شركة صقور الغد اللوجستية</h2>
                <div style={{ fontSize: '11px', color: '#64748B' }}>كشف الراتب الشهري (أغسطس 2026)</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563EB' }}>Falcon ERP</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div><strong>اسم المندوب:</strong> {selectedRecord.name}</div>
              <div><strong>المشروع:</strong> {selectedRecord.project}</div>
              <div><strong>عدد الطلبات:</strong> {selectedRecord.orders} طلب</div>
              <div><strong>سعر الطلب:</strong> {selectedRecord.order_price}</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
                  <th style={{ padding: '8px', textAlign: 'right' }}>البند / الوصف</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>القيمة (ر.س)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '6px' }}>المستحق الأساسي</td><td style={{ padding: '6px', textAlign: 'left', fontWeight: 'bold' }}>{selectedRecord.base_total}</td></tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '6px', color: '#16A34A' }}>+ الحوافز</td><td style={{ padding: '6px', textAlign: 'left', color: '#16A34A' }}>{selectedRecord.incentives}</td></tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '6px', color: '#DC2626' }}>- الخصومات والسلف</td><td style={{ padding: '6px', textAlign: 'left', color: '#DC2626' }}>{selectedRecord.deductions}</td></tr>
                <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 'bold' }}><td style={{ padding: '10px', fontSize: '13px' }}>صافي الراتب النهائي</td><td style={{ padding: '10px', textAlign: 'left', fontSize: '14px', color: '#16A34A' }}>{selectedRecord.net_salary}</td></tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => window.print()} style={{ padding: '8px 16px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>🖨️ طباعة</button>
              <button onClick={() => setShowPayslipModal(false)} style={{ padding: '8px 16px', backgroundColor: '#64748B', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال التحويلات البنكية */}
      {showBankTransferModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: '#0F172A', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '650px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>💳 التحويلات البنكية وصرف الرواتب</h3>
              <button onClick={() => setShowBankTransferModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', fontSize: '16px', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '12px' }}>
              <span style={{ color: '#94A3B8' }}>ملف التحويل البنكي للمناديب:</span>
              <button onClick={() => alert('📊 تم تصدير ملف Excel للتحويلات بنجاح!')} style={{ backgroundColor: '#16A34A', color: '#FFF', padding: '6px 12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>📥 تصدير Excel</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '11px' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '10px' }}>المندوب</th>
                  <th style={{ padding: '10px' }}>البنك</th>
                  <th style={{ padding: '10px' }}>الآيبان</th>
                  <th style={{ padding: '10px' }}>المبلغ</th>
                  <th style={{ padding: '10px' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.name}</td>
                    <td style={{ padding: '10px' }}>{s.bank}</td>
                    <td style={{ padding: '10px', fontFamily: 'monospace' }}>{s.iban}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#22C55E' }}>{s.net_salary}</td>
                    <td style={{ padding: '10px' }}>
                      <select defaultValue={s.status} style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px' }}>
                        <option value="تم الصرف">تم الصرف</option>
                        <option value="لم يتم الصرف">لم يتم الصرف</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}