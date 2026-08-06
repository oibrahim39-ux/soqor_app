import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Vehicles from './pages/Vehicles';
import Projects from './pages/Projects';
import Salaries from './pages/Salaries';
import Violations from './pages/Violations'; 
const SUPABASE_URL = 'https://hxyqwmyyudqtqdzizfmb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eq88AWmSIZoLBV01jv0k5g_0jYR6GIX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [lang, setLang] = useState('ar');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('drivers');
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('الكل');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [ibanVerified, setIbanVerified] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState({
    photo: false,
    iqamaFront: false,
    iqamaBack: false,
    license: false,
    contract: false,
    ibanDoc: false
  });

  const [newDriver, setNewDriver] = useState({
    name: '',
    iqama_number: '',
    nationality: '',
    birth_date: '',
    phone: '',
    emergency_phone: '',
    email: '',
    gender: 'ذكر',
    status: 'نشط',
    project: 'هنقرستيشن',
    branch: 'الفرع الرئيسي',
    city: 'الرياض',
    supervisor: 'محمد عثمان',
    work_start_date: '',
    contract_type: 'دوام كامل',
    base_salary: '4500',
    daily_target: '15',
    monthly_target: '400',
    order_price: '14',
    working_hours: '8',
    iqama_issue_date: '',
    iqama_expiry_date: '',
    license_number: '',
    license_type: 'رخصة عمومي',
    license_issue_date: '',
    license_expiry_date: '',
    bank_name: 'البنك الأهلي السعودي (SNB)',
    iban: 'SA',
    account_holder: '',
    has_vehicle: true,
    vehicle_model: 'تويوتا يارس',
    plate_number: '',
    notes: ''
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const { data, error } = await supabase.from('drivers').select('*').order('id', { ascending: false });
    if (!error && data) {
      setDrivers(data);
    }
  };

  const calculateExpiryStatus = (expiryDateStr) => {
    if (!expiryDateStr) return { days: 0, status: 'غير محدد', color: 'text-slate-400', bg: 'bg-slate-500/10' };
    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { days: diffDays, status: '🔴 منتهية', color: 'text-red-400', bg: 'bg-red-500/10' };
    } else if (diffDays <= 30) {
      return { days: diffDays, status: '🟡 تنتهي قريباً', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    } else {
      return { days: diffDays, status: '🟢 سارية', color: 'text-green-400', bg: 'bg-green-500/10' };
    }
  };

  const handleVerifyIban = () => {
    if (newDriver.iban.length >= 15 && newDriver.iban.startsWith('SA')) {
      setIbanVerified(true);
      alert('✅ تم التحقق من صحة رقم الآيبان بنجاح!');
    } else {
      setIbanVerified(false);
      alert('❌ رقم الآيبان غير صحيح، يجب أن يبدأ بـ SA ويحتوي على أرقام كافية.');
    }
  };

  const handleSaveDriver = async (e, addAnother = false) => {
    e.preventDefault();
    
    let errors = {};
    if (!newDriver.name) errors.name = 'الاسم الرباعي إجباري';
    if (!newDriver.iqama_number) errors.iqama_number = 'رقم الإقامة إجباري';
    if (!newDriver.phone) errors.phone = 'رقم الجوال إجباري';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert('الرجاء تعبئة الحقول الإلزامية المطلوبة.');
      return;
    }
    setFormErrors({});

    const driverPayload = {
      name: newDriver.name,
      iqama_number: newDriver.iqama_number,
      iqama: newDriver.iqama_number,
      phone: newDriver.phone,
      project: newDriver.project,
      city: newDriver.city,
      supervisor: newDriver.supervisor,
      status: newDriver.status,
    };

    const { data, error } = await supabase.from('drivers').insert([driverPayload]).select();
    if (!error && data) {
      setDrivers([data[0], ...drivers]);
      alert('💾 تم حفظ بيانات المندوب وإنشاء التنبيهات النظامية بنجاح!');
      if (addAnother) {
        setNewDriver({
          name: '', iqama_number: '', nationality: '', birth_date: '', phone: '', emergency_phone: '',
          email: '', gender: 'ذكر', status: 'نشط', project: 'هنقرستيشن', branch: 'الفرع الرئيسي',
          city: 'الرياض', supervisor: 'محمد عثمان', work_start_date: '', contract_type: 'دوام كامل',
          base_salary: '4500', daily_target: '15', monthly_target: '400', order_price: '14',
          working_hours: '8', iqama_issue_date: '', iqama_expiry_date: '', license_number: '',
          license_type: 'رخصة عمومي', license_issue_date: '', license_expiry_date: '',
          bank_name: 'البنك الأهلي السعودي (SNB)', iban: 'SA', account_holder: '', has_vehicle: true,
          vehicle_model: 'تويوتا يارس', plate_number: '', notes: ''
        });
        setIbanVerified(false);
      } else {
        setShowAddModal(false);
      }
    } else {
      alert('حدث خطأ أثناء الحفظ في Supabase: ' + error?.message);
    }
  };

  const t = {
    ar: {
      appName: 'صقور الغد',
      company: 'Tomorrow Falcon Logistics',
      dashboard: 'لوحة التحكم',
      drivers: 'إدارة المناديب',
      cars: 'السيارات والأسطول',
      projects: 'المشاريع',
      contracts: 'العقود والمستندات',
      salaries: 'الرواتب والمالية',
      violations: 'المخالفات',
      reports: 'التقارير التحليلية',
      alerts: 'التنبيهات النظامية',
      users: 'المستخدمون والصلاحيات',
      settings: 'إعدادات النظام',
      search: 'بحث عام في النظام...',
      addDriverBtn: '+ إضافة مندوب جديد',
      version: 'Falcon ERP v1.0',
      footerCopy: '© Tomorrow Falcon Logistics. All Rights Reserved.'
    },
    en: {
      appName: 'Tomorrow Falcon',
      company: 'Tomorrow Falcon Logistics',
      dashboard: 'Dashboard',
      drivers: 'Drivers Management',
      cars: 'Fleet & Cars',
      projects: 'Projects',
      contracts: 'Contracts & Docs',
      salaries: 'Salaries & Finance',
      violations: 'Violations',
      reports: 'Analytics Reports',
      alerts: 'System Alerts',
      users: 'Users & Roles',
      settings: 'System Settings',
      search: 'Global system search...',
      addDriverBtn: '+ Add New Driver',
      version: 'Falcon ERP v1.0',
      footerCopy: '© Tomorrow Falcon Logistics. All Rights Reserved.'
    }
  };

  const currentText = t[lang];
  const themeBg = isDarkMode ? '#070A12' : '#F1F5F9';
  const sidebarBg = isDarkMode ? 'rgba(11, 17, 32, 0.85)' : 'rgba(255, 255, 255, 0.85)';
  const headerBg = isDarkMode ? 'rgba(11, 17, 32, 0.75)' : 'rgba(255, 255, 255, 0.75)';
  const cardBg = isDarkMode ? 'rgba(19, 28, 48, 0.6)' : 'rgba(255, 255, 255, 0.7)';
  const textColor = isDarkMode ? '#F8FAFC' : '#0F172A';
  const textMuted = isDarkMode ? '#94A3B8' : '#64748B';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name?.includes(searchTerm) || d.iqama_number?.includes(searchTerm) || d.phone?.includes(searchTerm);
    const matchesProject = selectedProject === 'الكل' || d.project === selectedProject;
    return matchesSearch && matchesProject;
  });

  const iqamaStatus = calculateExpiryStatus(newDriver.iqama_expiry_date);
  const licenseStatus = calculateExpiryStatus(newDriver.license_expiry_date);

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif", direction: lang === 'ar' ? 'rtl' : 'ltr', minHeight: '100vh', backgroundColor: themeBg, color: textColor, display: 'flex', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .page-transition { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .sidebar-item:hover { background: rgba(37, 99, 235, 0.12); color: #3B82F6 !important; transform: translateX(2px); }
        .kpi-card:hover { transform: translateY(-5px); box-shadow: 0 16px 35px -10px rgba(37, 99, 235, 0.25); border-color: rgba(59, 130, 246, 0.5) !important; }
        table tr:hover { background-color: rgba(37, 99, 235, 0.04); }
        input:focus, select:focus, textarea:focus { border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25); }
      `}</style>

      <aside style={{ width: isSidebarCollapsed ? '88px' : '260px', backgroundColor: sidebarBg, backdropFilter: 'blur(20px)', borderLeft: lang === 'ar' ? `1px solid ${borderColor}` : 'none', borderRight: lang === 'en' ? `1px solid ${borderColor}` : 'none', display: 'flex', flexDirection: 'column', padding: '24px 14px', position: 'fixed', top: 0, bottom: 0, zIndex: 50, transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: isSidebarCollapsed ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '16px', borderBottom: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#1E293B', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 20px rgba(37, 99, 235, 0.35)', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
              <img src="/logo.jpg" alt="Falcon Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '10px' }} />
            </div>
            {!isSidebarCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: textColor, whiteSpace: 'nowrap' }}>{currentText.appName}</h1>
                <span style={{ fontSize: '10px', color: '#38BDF8', fontWeight: '600' }}>Tomorrow Falcon</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{ backgroundColor: 'transparent', border: `1px solid ${borderColor}`, color: textMuted, width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', marginTop: isSidebarCollapsed ? '10px' : '0' }}
          >
            {isSidebarCollapsed ? '➔' : '⬅'}
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', overflowX: 'hidden' }}>
          {[
            { id: 'dashboard', label: currentText.dashboard, icon: '📊' },
            { id: 'drivers', label: currentText.drivers, icon: '👤' },
            { id: 'cars', label: currentText.cars, icon: '🚗' },
            { id: 'projects', label: currentText.projects, icon: '📦' },
            { id: 'contracts', label: currentText.contracts, icon: '📄' },
            { id: 'salaries', label: currentText.salaries, icon: '💰' },
            { id: 'violations', label: currentText.violations, icon: '⚠️' },
            { id: 'fuel', label: 'إدارة الوقود', icon: '⛽' },
            { id: 'reports', label: currentText.reports, icon: '📈' },
            { id: 'alerts', label: currentText.alerts, icon: '🔔' },
            { id: 'users', label: currentText.users, icon: '👥' },
            { id: 'settings', label: currentText.settings, icon: '⚙️' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="sidebar-item"
                title={isSidebarCollapsed ? item.label : ''}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: 'none',
                  textAlign: lang === 'ar' ? 'right' : 'left', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: '14px', fontSize: '13px', fontWeight: isActive ? 'bold' : '500',
                  backgroundColor: isActive ? '#2563EB' : 'transparent', color: isActive ? '#FFF' : textMuted,
                  boxShadow: isActive ? '0 4px 15px rgba(37, 99, 235, 0.4)' : 'none', transition: 'all 0.2s ease', boxSizing: 'border-box'
                }}
              >
                <span style={{ fontSize: '18px', display: 'flex', justifyContent: 'center', minWidth: '24px' }}>{item.icon}</span>
                {!isSidebarCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      <div style={{ flex: 1, [lang === 'ar' ? 'marginRight' : 'marginLeft']: isSidebarCollapsed ? '88px' : '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin 0.3s ease', boxSizing: 'border-box' }}>
        
        <header style={{ height: '76px', backgroundColor: headerBg, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 40, boxSizing: 'border-box' }}>
          <div style={{ position: 'relative', width: '340px' }}>
            <span style={{ position: 'absolute', [lang === 'ar' ? 'right' : 'left']: '14px', top: '50%', transform: 'translateY(-50%)', color: textMuted }}>🔍</span>
            <input 
              type="text" 
              placeholder={currentText.search} 
              style={{ width: '100%', height: '42px', [lang === 'ar' ? 'paddingRight' : 'paddingLeft']: '42px', [lang === 'ar' ? 'paddingLeft' : 'paddingRight']: '16px', borderRadius: '12px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)', color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(226, 232, 240, 0.8)', border: `1px solid ${borderColor}`, color: textColor, fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {lang === 'ar' ? '🇬🇧 English' : '🇸🇦 العربية'}
            </button>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(226, 232, 240, 0.8)', border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '16px' }}
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>

            <div style={{ backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(226, 232, 240, 0.8)', padding: '8px 14px', borderRadius: '10px', border: `1px solid ${borderColor}`, color: '#38BDF8', fontSize: '12px', fontWeight: 'bold' }}>
              📅 5 أغسطس 2026
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 12px', borderRadius: '12px', backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(226, 232, 240, 0.5)', border: `1px solid ${borderColor}` }}>
              <img src="/logo.jpg" alt="User Profile" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #3B82F6' }} />
              <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>عثمان إبراهيم</div>
                <div style={{ fontSize: '10px', color: '#38BDF8', fontWeight: '600' }}>مدير الأسطول والعمليات</div>
              </div>
            </div>
          </div>
        </header>

        <main style={{ padding: '32px', flex: 1, boxSizing: 'border-box' }} className="page-transition">
          
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: textColor }}>لوحة التحكم والعمليات اللوجستية</h2>
                  <p style={{ margin: '6px 0 0 0', color: textMuted, fontSize: '14px' }}>نظام Falcon ERP • متابعة الأداء اللحظي لأسطول صقور الغد</p>
                </div>
                <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: '#2563EB', color: '#FFF', padding: '12px 24px', borderRadius: '14px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                  {currentText.addDriverBtn}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'drivers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: textColor }}>إدارة المناديب والأسطول ({drivers.length})</h2>
                  <p style={{ margin: '4px 0 0 0', color: textMuted, fontSize: '14px' }}>عرض ومتابعة كافة بيانات المناديب المرتبطة بـ Supabase</p>
                </div>
                <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: '#2563EB', color: '#FFF', padding: '12px 24px', borderRadius: '14px', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                  {currentText.addDriverBtn}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <input 
                  type="text" 
                  placeholder="🔍 بحث بالاسم، رقم الإقامة أو الجوال..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ flex: 1, padding: '14px 20px', borderRadius: '14px', border: `1px solid ${borderColor}`, backgroundColor: cardBg, color: textColor, outline: 'none' }}
                />
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} style={{ padding: '14px 20px', borderRadius: '14px', border: `1px solid ${borderColor}`, backgroundColor: cardBg, color: textColor, outline: 'none' }}>
                  <option value="الكل">كل المشاريع</option>
                  <option value="هنقرستيشن">هنقرستيشن</option>
                  <option value="جاهز">جاهز</option>
                  <option value="مرسول">مرسول</option>
                  <option value="كيتا">كيتا</option>
                </select>
              </div>

              <div style={{ backgroundColor: cardBg, backdropFilter: 'blur(20px)', borderRadius: '24px', border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(226, 232, 240, 0.8)', color: textMuted, fontSize: '13px', borderBottom: `1px solid ${borderColor}` }}>
                      <th style={{ padding: '18px 24px' }}>اسم المندوب</th>
                      <th style={{ padding: '18px 24px' }}>رقم الإقامة</th>
                      <th style={{ padding: '18px 24px' }}>الجوال</th>
                      <th style={{ padding: '18px 24px' }}>المشروع</th>
                      <th style={{ padding: '18px 24px' }}>المدينة</th>
                      <th style={{ padding: '18px 24px' }}>المشرف</th>
                      <th style={{ padding: '18px 24px' }}>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.map((driver) => (
                      <tr key={driver.id} style={{ borderBottom: `1px solid ${borderColor}`, fontSize: '14px' }}>
                        <td style={{ padding: '18px 24px', fontWeight: 'bold', color: textColor }}>{driver.name}</td>
                        <td style={{ padding: '18px 24px', color: textMuted, fontFamily: 'monospace' }}>{driver.iqama_number || driver.iqama}</td>
                        <td style={{ padding: '18px 24px', color: textMuted, fontFamily: 'monospace' }}>{driver.phone}</td>
                        <td style={{ padding: '18px 24px' }}><span style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#38BDF8', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>{driver.project}</span></td>
                        <td style={{ padding: '18px 24px', color: textMuted }}>{driver.city}</td>
                        <td style={{ padding: '18px 24px', color: textMuted }}>{driver.supervisor}</td>
                        <td style={{ padding: '18px 24px', color: driver.status === 'نشط' ? '#22C55E' : '#EF4444', fontWeight: 'bold' }}>{driver.status || 'نشط'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'cars' && <Vehicles />}
          {activeTab === 'projects' && <Projects />}
          {activeTab === 'salaries' && <Salaries />}
{activeTab === 'violations' && <Violations />}

          {activeTab !== 'dashboard' && activeTab !== 'drivers' && activeTab !== 'cars' && activeTab !== 'projects' && activeTab !== 'salaries' && activeTab !== 'violations' && (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: textMuted }}>
              <h2 style={{ fontSize: '24px', color: textColor, marginBottom: '10px' }}>قسم {activeTab} تحت التطوير والتجهيز</h2>
              <p>تم تصميم الهيكل العام واختيار الألوان والـ Glassmorphism بمستوى الأنظمة العالمية بنجاح.</p>
            </div>
          )}

        </main>

        <footer style={{ backgroundColor: headerBg, borderTop: `1px solid ${borderColor}`, padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: textMuted, boxSizing: 'border-box' }}>
          <div>{currentText.version}</div>
          <div>{currentText.footerCopy}</div>
        </footer>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, overflowY: 'auto', padding: '20px' }}>
          <div style={{ backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF', padding: '40px', borderRadius: '28px', width: '100%', maxWidth: '1000px', border: `1px solid ${borderColor}`, color: textColor, boxShadow: '0 25px 50px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: textColor }}>➕ إضافة مندوب جديد (Falcon ERP Professional)</h2>
                <p style={{ margin: '4px 0 0 0', color: textMuted, fontSize: '13px' }}>إدخال بيانات المندوب الكاملة، فحص المستندات، وربط التنبيهات النظامية السحابية</p>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: textMuted, fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={(e) => handleSaveDriver(e, false)} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👤</span> القسم 1: المعلومات الأساسية
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>الاسم الرباعي (إجباري) *</label>
                    <input type="text" placeholder="الاسم الكامل" value={newDriver.name} onChange={(e) => setNewDriver({...newDriver, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                    {formErrors.name && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>رقم الهوية / الإقامة (إجباري) *</label>
                    <input type="text" placeholder="رقم الإقامة" value={newDriver.iqama_number} onChange={(e) => setNewDriver({...newDriver, iqama_number: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                    {formErrors.iqama_number && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{formErrors.iqama_number}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>الجنسية</label>
                    <input type="text" placeholder="مثال: سوداني، مصري، سعودي..." value={newDriver.nationality} onChange={(e) => setNewDriver({...newDriver, nationality: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>تاريخ الميلاد</label>
                    <input type="date" value={newDriver.birth_date} onChange={(e) => setNewDriver({...newDriver, birth_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>رقم الجوال *</label>
                    <input type="text" placeholder="05xxxxxxxx" value={newDriver.phone} onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                    {formErrors.phone && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{formErrors.phone}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>رقم جوال للطوارئ</label>
                    <input type="text" placeholder="رقم الطوارئ" value={newDriver.emergency_phone} onChange={(e) => setNewDriver({...newDriver, emergency_phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>البريد الإلكتروني</label>
                    <input type="email" placeholder="example@domain.com" value={newDriver.email} onChange={(e) => setNewDriver({...newDriver, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>الجنس</label>
                    <select value={newDriver.gender} onChange={(e) => setNewDriver({...newDriver, gender: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }}>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>الحالة</label>
                    <select value={newDriver.status} onChange={(e) => setNewDriver({...newDriver, status: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }}>
                      <option value="نشط">نشط</option>
                      <option value="إجازة">إجازة</option>
                      <option value="موقوف">موقوف</option>
                      <option value="مستقيل">مستقيل</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💼</span> القسم 2: بيانات العمل
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>المشروع</label>
                    <select value={newDriver.project} onChange={(e) => setNewDriver({...newDriver, project: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }}>
                      <option value="هنقرستيشن">هنقرستيشن</option>
                      <option value="جاهز">جاهز</option>
                      <option value="مرسول">مرسول</option>
                      <option value="كيتا">كيتا</option>
                      <option value="نينجا">نينجا</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>الفرع</label>
                    <input type="text" value={newDriver.branch} onChange={(e) => setNewDriver({...newDriver, branch: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>المدينة</label>
                    <input type="text" value={newDriver.city} onChange={(e) => setNewDriver({...newDriver, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>المشرف</label>
                    <input type="text" value={newDriver.supervisor} onChange={(e) => setNewDriver({...newDriver, supervisor: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>تاريخ بداية العمل</label>
                    <input type="date" value={newDriver.work_start_date} onChange={(e) => setNewDriver({...newDriver, work_start_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>نوع العقد</label>
                    <select value={newDriver.contract_type} onChange={(e) => setNewDriver({...newDriver, contract_type: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }}>
                      <option value="دوام كامل">دوام كامل</option>
                      <option value="دوام جزئي">دوام جزئي</option>
                      <option value="مؤقت">مؤقت</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>الراتب الأساسي (ر.س)</label>
                    <input type="number" value={newDriver.base_salary} onChange={(e) => setNewDriver({...newDriver, base_salary: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>التارجت اليومي (طلبات)</label>
                    <input type="number" value={newDriver.daily_target} onChange={(e) => setNewDriver({...newDriver, daily_target: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>التارجت الشهري (طلبات)</label>
                    <input type="number" value={newDriver.monthly_target} onChange={(e) => setNewDriver({...newDriver, monthly_target: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>سعر الطلب (ر.س)</label>
                    <input type="number" value={newDriver.order_price} onChange={(e) => setNewDriver({...newDriver, order_price: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>ساعات العمل اليومية</label>
                    <input type="number" value={newDriver.working_hours} onChange={(e) => setNewDriver({...newDriver, working_hours: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🪪</span> القسم 3: بيانات الإقامة (حساب تلقائي)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>رقم الإقامة</label>
                    <input type="text" value={newDriver.iqama_number} onChange={(e) => setNewDriver({...newDriver, iqama_number: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>تاريخ الإصدار</label>
                    <input type="date" value={newDriver.iqama_issue_date} onChange={(e) => setNewDriver({...newDriver, iqama_issue_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>تاريخ الانتهاء</label>
                    <input type="date" value={newDriver.iqama_expiry_date} onChange={(e) => setNewDriver({...newDriver, iqama_expiry_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9', padding: '14px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                    <div style={{ fontSize: '11px', color: textMuted, marginBottom: '4px' }}>حالة الإقامة المحسوبة:</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className={iqamaStatus.color}>{iqamaStatus.status}</span>
                      <span style={{ fontSize: '12px', color: textMuted }}>({iqamaStatus.days} يوم متبقي)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚗</span> القسم 4: رخصة القيادة (حساب تلقائي)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>رقم الرخصة</label>
                    <input type="text" placeholder="رقم الرخصة" value={newDriver.license_number} onChange={(e) => setNewDriver({...newDriver, license_number: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>نوع الرخصة</label>
                    <select value={newDriver.license_type} onChange={(e) => setNewDriver({...newDriver, license_type: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }}>
                      <option value="رخصة عمومي">رخصة عمومي</option>
                      <option value="رخصة خصوصي">رخصة خصوصي</option>
                      <option value="رخصة دراجة نارية">رخصة دراجة نارية</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>تاريخ الإصدار</label>
                    <input type="date" value={newDriver.license_issue_date} onChange={(e) => setNewDriver({...newDriver, license_issue_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>تاريخ الانتهاء</label>
                    <input type="date" value={newDriver.license_expiry_date} onChange={(e) => setNewDriver({...newDriver, license_expiry_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9', padding: '14px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                    <div style={{ fontSize: '11px', color: textMuted, marginBottom: '4px' }}>حالة الرخصة المحسوبة:</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className={licenseStatus.color}>{licenseStatus.status}</span>
                      <span style={{ fontSize: '12px', color: textMuted }}>({licenseStatus.days} يوم متبقي)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏦</span> القسم 5: الحساب البنكي والآيبان (IBAN)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>اسم البنك</label>
                    <select value={newDriver.bank_name} onChange={(e) => setNewDriver({...newDriver, bank_name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }}>
                      <option value="البنك الأهلي السعودي (SNB)">البنك الأهلي السعودي (SNB)</option>
                      <option value="مصرف الراجحي">مصرف الراجحي</option>
                      <option value="بنك الرياض">بنك الرياض</option>
                      <option value="بنك الانماء">بنك الانماء</option>
                      <option value="البنك السعودي الأول (SAB)">البنك السعودي الأول (SAB)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>اسم صاحب الحساب</label>
                    <input type="text" placeholder="الاسم مطابق للبنك" value={newDriver.account_holder} onChange={(e) => setNewDriver({...newDriver, account_holder: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>رقم الآيبان (IBAN)</label>
                    <input type="text" placeholder="SA0000000000000000000000" value={newDriver.iban} onChange={(e) => setNewDriver({...newDriver, iban: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box', fontFamily: 'monospace' }} />
                  </div>
                  <div>
                    <button type="button" onClick={handleVerifyIban} style={{ width: '100%', padding: '12px', backgroundColor: ibanVerified ? '#22C55E' : '#2563EB', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {ibanVerified ? '✅ الآيبان موثق وصحيح' : '🔍 التحقق من صحة الآيبان'}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚙</span> القسم 6: بيانات السيارة والأسطول المرتبط
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>هل للمندوب سيارة مسجلة؟</label>
                    <select value={newDriver.has_vehicle ? 'yes' : 'no'} onChange={(e) => setNewDriver({...newDriver, has_vehicle: e.target.value === 'yes'})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }}>
                      <option value="yes">نعم، لديه سيارة</option>
                      <option value="no">بدون سيارة (بدون أسطول)</option>
                    </select>
                  </div>
                  {newDriver.has_vehicle && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>نوع السيارة / الطراز</label>
                        <input type="text" placeholder="مثال: تويوتا يارس، هيونداي النترا" value={newDriver.vehicle_model} onChange={(e) => setNewDriver({...newDriver, vehicle_model: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>رقم اللوحة</label>
                        <input type="text" placeholder="أ ب ج 1234" value={newDriver.plate_number} onChange={(e) => setNewDriver({...newDriver, plate_number: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, boxSizing: 'border-box' }} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📁</span> القسم 7: رفع المستندات والملفات (Upload & Drag/Drop)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  {[
                    { key: 'photo', label: 'الصورة الشخصية' },
                    { key: 'iqamaFront', label: 'صورة الإقامة (الأمام)' },
                    { key: 'iqamaBack', label: 'صورة الإقامة (الخلف)' },
                    { key: 'license', label: 'رخصة القيادة' },
                    { key: 'contract', label: 'عقد العمل الموثق' },
                    { key: 'ibanDoc', label: 'شهادة الآيبان البنكي (اختياري)' },
                  ].map((fileItem) => {
                    const isUploaded = uploadedFiles[fileItem.key];
                    return (
                      <div 
                        key={fileItem.key}
                        onClick={() => setUploadedFiles({...uploadedFiles, [fileItem.key]: !isUploaded})}
                        style={{
                          border: `2px dashed ${isUploaded ? '#22C55E' : '#3B82F6'}`,
                          borderRadius: '14px', padding: '16px', textAlign: 'center', cursor: 'pointer',
                          backgroundColor: isDarkMode ? 'rgba(15,23,42,0.6)' : 'rgba(241,245,249,0.9)',
                          transition: '0.2s'
                        }}
                      >
                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>{isUploaded ? '✅' : '📤'}</div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: textColor, marginBottom: '4px' }}>{fileItem.label}</div>
                        <div style={{ fontSize: '11px', color: isUploaded ? '#22C55E' : textMuted }}>
                          {isUploaded ? 'تم الرفع بنجاح (Preview OK)' : 'اسحب الملف هنا أو انقر للرفع'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📝</span> القسم 8: الملاحظات الإدارية
                </h3>
                <textarea 
                  rows="3" 
                  placeholder="أدخل أي ملاحظات إدارية، تفاصيل سكن، أو ظروف خاصة بالمندوب..." 
                  value={newDriver.notes} 
                  onChange={(e) => setNewDriver({...newDriver, notes: e.target.value})}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: textColor, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', paddingTop: '10px', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={(e) => handleSaveDriver(e, false)}
                  style={{ flex: 2, padding: '16px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37,99,235,0.4)' }}
                >
                  💾 حفظ المندوب في النظام
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleSaveDriver(e, true)}
                  style={{ flex: 2, padding: '16px', backgroundColor: '#16A34A', color: '#FFF', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(22,163,74,0.4)' }}
                >
                  ➕ حفظ وإضافة مندوب جديد
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setNewDriver({
                      name: '', iqama_number: '', nationality: '', birth_date: '', phone: '', emergency_phone: '',
                      email: '', gender: 'ذكر', status: 'نشط', project: 'هنقرستيشن', branch: 'الفرع الرئيسي',
                      city: 'الرياض', supervisor: 'محمد عثمان', work_start_date: '', contract_type: 'دوام كامل',
                      base_salary: '4500', daily_target: '15', monthly_target: '400', order_price: '14',
                      working_hours: '8', iqama_issue_date: '', iqama_expiry_date: '', license_number: '',
                      license_type: 'رخصة عمومي', license_issue_date: '', license_expiry_date: '',
                      bank_name: 'البنك الأهلي السعودي (SNB)', iban: 'SA', account_holder: '', has_vehicle: true,
                      vehicle_model: 'تويوتا يارس', plate_number: '', notes: ''
                    });
                  }}
                  style={{ flex: 1, padding: '16px', backgroundColor: '#D97706', color: '#FFF', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  🗑️ مسح الحقول
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '16px', backgroundColor: '#475569', color: '#FFF', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ❌ إلغاء
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}