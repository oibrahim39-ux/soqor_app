import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function Drivers() {
  const { isAdmin } = useAuth()
  const [drivers, setDrivers] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ full_name: '', phone: '', national_id: '', platform_id: '', vehicle_id: '' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [d, p, v] = await Promise.all([
      supabase.from('drivers').select('*, platforms(name), vehicles(plate_number)').order('created_at', { ascending: false }),
      supabase.from('platforms').select('*'),
      supabase.from('vehicles').select('*'),
    ])
    setDrivers(d.data || [])
    setPlatforms(p.data || [])
    setVehicles(v.data || [])
    setLoading(false)
  }

  async function addDriver(e) {
    e.preventDefault()
    const payload = {
      full_name: form.full_name,
      phone: form.phone || null,
      national_id: form.national_id || null,
      platform_id: form.platform_id || null,
      vehicle_id: form.vehicle_id || null,
    }
    const { error } = await supabase.from('drivers').insert(payload)
    if (error) { alert('خطأ: ' + error.message); return }
    setForm({ full_name: '', phone: '', national_id: '', platform_id: '', vehicle_id: '' })
    setShowForm(false)
    loadAll()
  }

  async function toggleStatus(driver) {
    const newStatus = driver.status === 'active' ? 'inactive' : 'active'
    await supabase.from('drivers').update({ status: newStatus }).eq('id', driver.id)
    loadAll()
  }

  if (loading) return <div className="page-loading">جاري التحميل...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">المناديب</h1>
        {isAdmin && <button className="primary-btn" onClick={() => setShowForm(s => !s)}>+ إضافة مندوب</button>}
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={addDriver}>
          <input placeholder="الاسم الكامل" required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          <input placeholder="رقم الهاتف" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="الرقم الوطني" value={form.national_id} onChange={e => setForm({ ...form, national_id: e.target.value })} />
          <select value={form.platform_id} onChange={e => setForm({ ...form, platform_id: e.target.value })}>
            <option value="">-- المنصة --</option>
            {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={form.vehicle_id} onChange={e => setForm({ ...form, vehicle_id: e.target.value })}>
            <option value="">-- السيارة --</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate_number}</option>)}
          </select>
          <button type="submit" className="primary-btn">حفظ</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr><th>الاسم</th><th>الهاتف</th><th>المنصة</th><th>السيارة</th><th>الحالة</th>{isAdmin && <th></th>}</tr>
        </thead>
        <tbody>
          {drivers.length === 0 && <tr><td colSpan="6" className="empty-cell">لا يوجد مناديب بعد</td></tr>}
          {drivers.map(d => (
            <tr key={d.id}>
              <td>{d.full_name}</td>
              <td>{d.phone || '—'}</td>
              <td>{d.platforms?.name || '—'}</td>
              <td>{d.vehicles?.plate_number || '—'}</td>
              <td><span className={'badge ' + d.status}>{d.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
              {isAdmin && <td><button className="link-btn" onClick={() => toggleStatus(d)}>تغيير الحالة</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
