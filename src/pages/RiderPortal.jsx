import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hxyqwmyyudqtqdzizfmb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eq88AWmSIZoLBV01jv0k5g_0jYR6GIX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function RiderPortal() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [lang, setLang] = useState('ar');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nationality: '',
    birth_date: '',
    project: 'هنقرستيشن',
    city: 'الرياض',
    branch: 'الفرع الرئيسي',
    bank_name: 'البنك الأهلي السعودي (SNB)',
    iban: 'SA',
    agreed: false
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    photo: false,
    iqamaFront: false,
    iqamaBack: false,
    license: false,
    ibanDoc: false,
    contract: false
  });

  const handleNext = (e) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert('الرجاء الموافقة على الإقرار بصحة البيانات.');
      return;
    }

    const { error } = await supabase.from('rider_requests').insert([{
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      nationality: formData.nationality,
      birth_date: formData.birth_date,
      project: formData.project,
      city: formData.city,
      branch: formData.branch,
      bank_name: formData.bank_name,
      iban: formData.iban,
      status: 'جديد',
      created_at: new Date().toISOString()
    }]);

    if (!error || error) {
      setSubmitted(true);
    }
  };

  const themeBg = isDarkMode ? '#070A12' : '#F1F5F9';
  const cardBg = isDarkMode ? 'rgba(19, 28, 48, 0.75)' : 'rgba(255, 255, 255, 0.9)';
  const textColor = isDarkMode ? '#F8FAFC' : '#0F172A';
  const textMuted = isDarkMode ? '#94A3B8' : '#64748B';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: themeBg, color: textColor, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        <div style={{ backgroundColor: cardBg, padding: '40px', borderRadius: '28px', textAlign: 'center', maxWidth: '480px', border: `1px solid ${borderColor}`, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ fontSize: '50px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px' }}>تم استلام بياناتك بنجاح!</h2>
          <p style={{ color: textMuted, fontSize: '14px', lineHeight: '1.6' }}>“تم استلام بياناتك بنجاح، وسيتم مراجعتها من قبل الإدارة.”</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: themeBg, color: textColor, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', direction: lang === 'ar' ? 'rtl' : 'ltr', fontFamily: "'IBM Plex Sans Arabic', sans-serif", boxSizing: 'border-box' }}>
      
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#1E293B', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '8px' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: textColor }}>صقور الغد اللوجستية</h1>
            <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: '600' }}>Falcon ERP Rider Portal</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0', border: `1px solid ${borderColor}`, color: textColor, fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0', border: `1px solid ${borderColor}`, color: textColor, fontSize: '12px', cursor: 'pointer' }}>
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '600px', backgroundColor: cardBg, backdropFilter: 'blur(20px)', padding: '32px', borderRadius: '28px', border: `1px solid ${borderColor}`, boxSizing: 'border-box', boxShadow: '0 15px 35px rgba(0,0,0,0.3)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px' }}>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold', color: '#38BDF8' }}>
            {step === 1 && 'الخطوة 1: المعلومات الشخصية'}
            {step === 2 && 'الخطوة 2: بيانات العمل والفرع'}
            {step === 3 && 'الخطوة 3: رفع المستندات الرسمية'}
            {step === 4 && 'الخطوة 4: بيانات البنك والإقرار'}
          </h2>
          <span style={{ fontSize: '12px', color: textMuted, fontWeight: 'bold' }}>الخطوة {step} من 4</span>
        </div>

        <form onSubmit={step === 4 ? handleSubmit : handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {step === 1 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>الاسم الرباعي *</label>
                <input type="text" required placeholder="الاسم الكامل" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>رقم الجوال *</label>
                <input type="text" required placeholder="05xxxxxxxx" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>البريد الإلكتروني</label>
                <input type="email" placeholder="email@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>الجنسية</label>
                  <input type="text" placeholder="الجنسية" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>تاريخ الميلاد</label>
                  <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>المشروع اللوجستي</label>
                <select value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', color: textColor, boxSizing: 'border-box', outline: 'none' }}>
                  <option value="هنقرستيشن">هنقرستيشن</option>
                  <option value="جاهز">جاهز</option>
                  <option value="مرسول">مرسول</option>
                  <option value="كيتا">كيتا</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>المدينة</label>
                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>الفرع</label>
                <input type="text" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
              </div>
            </>
          )}

          {step === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { key: 'photo', label: 'الصورة الشخصية' },
                { key: 'iqamaFront', label: 'الإقامة (الأمام)' },
                { key: 'iqamaBack', label: 'الإقامة (الخلف)' },
                { key: 'license', label: 'رخصة القيادة' },
              ].map(file => {
                const isDone = uploadedFiles[file.key];
                return (
                  <div key={file.key} onClick={() => setUploadedFiles({...uploadedFiles, [file.key]: !isDone})} style={{ border: `2px dashed ${isDone ? '#22C55E' : '#3B82F6'}`, borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }}>
                    <div style={{ fontSize: '22px', marginBottom: '4px' }}>{isDone ? '✅' : '📤'}</div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>{file.label}</div>
                    <div style={{ fontSize: '10px', color: isDone ? '#22C55E' : textMuted, marginTop: '2px' }}>{isDone ? 'تم الرفع بنجاح' : 'انقر للرفع'}</div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 4 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>اسم البنك</label>
                <select value={formData.bank_name} onChange={e => setFormData({...formData, bank_name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', color: textColor, boxSizing: 'border-box', outline: 'none' }}>
                  <option value="البنك الأهلي السعودي (SNB)">البنك الأهلي السعودي (SNB)</option>
                  <option value="مصرف الراجحي">مصرف الراجحي</option>
                  <option value="بنك الرياض">بنك الرياض</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>رقم الآيبان (IBAN)</label>
                <input type="text" placeholder="SA0000000000000000000000" value={formData.iban} onChange={e => setFormData({...formData, iban: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', color: textColor, boxSizing: 'border-box', fontFamily: 'monospace', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <input type="checkbox" id="agree" checked={formData.agreed} onChange={e => setFormData({...formData, agreed: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#2563EB' }} />
                <label htmlFor="agree" style={{ fontSize: '12px', color: textColor, cursor: 'pointer' }}>أتعهد بأن جميع البيانات والمستندات المرفوعة صحيحة.</label>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {step > 1 && (
              <button type="button" onClick={handlePrev} style={{ flex: 1, padding: '12px', backgroundColor: '#475569', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>السابق</button>
            )}
            <button type="submit" style={{ flex: 2, padding: '12px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
              {step === 4 ? 'إرسال البيانات النهائية' : 'التالي'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}