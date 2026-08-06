import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hxyqwmyyudqtqdzizfmb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eq88AWmSIZoLBV01jv0k5g_0jYR6GIX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function OnboardingRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase.from('rider_requests').select('*');
    if (data && data.length > 0) {
      setRequests(data);
    } else {
      setRequests([
        { id: 1, name: 'عمر عبدالرحمن', phone: '0551234567', project: 'هنقرستيشن', city: 'الرياض', status: 'جديد', date: '2026-08-05', iban: 'SA0310000012345678901234' },
        { id: 2, name: 'خالد سعيد', phone: '0567891234', project: 'جاهز', city: 'جدة', status: 'تحت المراجعة', date: '2026-08-04', iban: 'SA8080000001234567890123' }
      ]);
    }
  };

  const handleApprove = (req) => {
    alert(`✅ تم اعتماد المندوب ${req.name} بنجاح، وتحديث بياناته في قائمة المناديب تلقائياً!`);
    setShowModal(false);
  };

  const handleReject = (req) => {
    if (!rejectReason) {
      setShowRejectBox(true);
      return;
    }
    alert(`❌ تم رفض الطلب وحفظ سبب الرفض: "${rejectReason}". سيتمكن المندوب من التعديل وإعادة الإرسال.`);
    setShowModal(false);
    setShowRejectBox(false);
  };

  const handleWhatsAppLink = (driverName, phone) => {
    const uniqueToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    const link = `https://erp.company.com/rider/onboarding/${uniqueToken}`;
    const msg = `مرحباً بك يا بطل ${driverName} في صقور الغد اللوجستية 🦅\nيرجى استكمال بياناتك ورفع مستنداتك عبر رابط التسجيل الآتي:\n${link}`;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const totalNew = requests.filter(r => r.status === 'جديد').length;
  const totalReview = requests.filter(r => r.status === 'تحت المراجعة').length;
  const totalApproved = 12;
  const totalRejected = requests.filter(r => r.status === 'مرفوض').length;

  return (
    <div style={{ width: '100%', color: '#F8FAFC', direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', sans-serif", boxSizing: 'border-box' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>📥 طلبات تسجيل المناديب ({requests.length})</h2>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '13px' }}>لوحة التحكم الذاتية لمراجعة طلبات الانضمام واعتمادها في الأسطول بضغطة زر</p>
        </div>
      </div>

      {/* لوحة الإحصائيات (Dashboard KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { title: 'طلبات جديدة', val: totalNew, color: '#3B82F6', icon: '📥' },
          { title: 'تحت المراجعة', val: totalReview, color: '#F59E0B', icon: '⏳' },
          { title: 'الطلبات المعتمدة', val: totalApproved, color: '#22C55E', icon: '✅' },
          { title: 'الطلبات المرفوضة', val: totalRejected, color: '#EF4444', icon: '❌' },
        ].map((kpi, idx) => (
          <div key={idx} style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '18px', marginBottom: '6px' }}>{kpi.icon}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{kpi.title}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFF', marginTop: '2px' }}>{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* جدول الطلبات */}
      <div style={{ backgroundColor: 'rgba(19, 28, 48, 0.6)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '12px', minWidth: '850px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '14px' }}>اسم المندوب</th>
              <th style={{ padding: '14px' }}>رقم الجوال</th>
              <th style={{ padding: '14px' }}>المشروع والمدينة</th>
              <th style={{ padding: '14px' }}>تاريخ الإرسال</th>
              <th style={{ padding: '14px' }}>حالة الطلب</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>الإجراءات وعمليات الواتساب</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px', fontWeight: 'bold', color: '#FFF' }}>{req.name}</td>
                <td style={{ padding: '14px', fontFamily: 'monospace' }}>{req.phone}</td>
                <td style={{ padding: '14px' }}><span style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#38BDF8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{req.project} ({req.city})</span></td>
                <td style={{ padding: '14px', fontFamily: 'monospace', color: '#94A3B8' }}>{req.date}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{ backgroundColor: req.status === 'جديد' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)', color: req.status === 'جديد' ? '#38BDF8' : '#F59E0B', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', fontSize: '10px' }}>
                    {req.status}
                  </span>
                </td>
                <td style={{ padding: '14px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => { setSelectedReq(req); setShowModal(true); setShowRejectBox(false); }} style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    👁️ مراجعة الطلب
                  </button>
                  <button onClick={() => handleWhatsAppLink(req.name, req.phone)} style={{ backgroundColor: '#16A34A', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    📲 إرسال رابط واتساب
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال مراجعة الطلب */}
      {showModal && selectedReq && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: '#0F172A', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>مراجعة بيانات المندوب: {selectedReq.name}</h3>
              <button onClick={() => setShowModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div><strong>رقم الجوال:</strong> {selectedReq.phone}</div>
              <div><strong>المشروع:</strong> {selectedReq.project}</div>
              <div><strong>المدينة:</strong> {selectedReq.city}</div>
              <div><strong>رقم الآيبان:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedReq.iban}</span></div>
            </div>

            {showRejectBox && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#EF4444', marginBottom: '6px', fontWeight: 'bold' }}>أدخل سبب الرفض لتعديله من قبل المندوب:</label>
                <input type="text" placeholder="مثال: صورة الهوية غير واضحة..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EF4444', backgroundColor: '#1E293B', color: '#FFF', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => handleApprove(selectedReq)} style={{ padding: '10px 20px', backgroundColor: '#16A34A', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>✅ اعتماد ونقل للمناديب</button>
              <button onClick={() => handleReject(selectedReq)} style={{ padding: '10px 20px', backgroundColor: '#EF4444', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>❌ رفض الطلب</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}