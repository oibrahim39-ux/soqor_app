import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Settings() {
  const [platforms, setPlatforms] = useState([])
  const [profiles, setProfiles] = useState([])
  const [newPlatform, setNewPlatform] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [p, pr] = await Promise.all([
      supabase.from('platforms').select('*').order('name'),
      supabase.from('profiles').select('*').order('created_at'),
    ])
    setPlatforms(p.data || [])
    setProfiles(pr.data || [])
    setLoading(false)
  }

  async function addPlatform(e) {
    e.preventDefault()
    if (!newPlatform.trim()) return
    const { error } = await supabase.from('platforms').insert({ name: newPlatform.trim() })
    if (error) { alert('خطأ: ' + error.message); return }
    setNewPlatform('')
    load()
  }

  async function changeRole(profile, role) {
    await supabase.from('profiles').update({ role }).eq('id', profile.id)
    load()
  }

  if (loading) return <div className="page-loading">جاري التحميل...</div>

  return (
    <div>
      <h1 className="page-title">الإعدادات</h1>

      <div className="panel-card">
        <h2>المنصات</h2>
        <form className="inline-form" onSubmit={addPlatform}>
          <input placeholder="اسم منصة جديدة" value={newPlatform} onChange={e => setNewPlatform(e.target.value)} />
          <button type="submit" className="primary-btn">إضافة</button>
        </form>
        <ul className="simple-list">
          {platforms.map(p => <li key={p.id}>{p.name}</li>)}
        </ul>
      </div>

      <div className="panel-card">
        <h2>المستخدمون والأدوار</h2>
        <table className="data-table">
          <thead><tr><th>الاسم</th><th>الدور</th></tr></thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.id}>
                <td>{p.full_name}</td>
                <td>
                  <select value={p.role} onChange={e => changeRole(p, e.target.value)}>
                    <option value="admin">مدير</option>
                    <option value="employee">موظف</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint">ملاحظة: إضافة مستخدم جديد بتتم من Supabase Auth، وبعدين يتسجل ليهو صف في جدول profiles.</p>
      </div>
    </div>
  )
}
