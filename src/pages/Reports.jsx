import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Reports() {
  const [byPlatform, setByPlatform] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: platforms } = await supabase.from('platforms').select('*')
    const { data: drivers } = await supabase.from('drivers').select('platform_id, status')
    const { data: violations } = await supabase.from('violations').select('driver_id, amount, payment_status, drivers(platform_id)')

    const rows = (platforms || []).map(p => {
      const platformDrivers = (drivers || []).filter(d => d.platform_id === p.id)
      const platformViolations = (violations || []).filter(v => v.drivers?.platform_id === p.id)
      const unpaid = platformViolations.filter(v => v.payment_status === 'unpaid')
      return {
        name: p.name,
        totalDrivers: platformDrivers.length,
        activeDrivers: platformDrivers.filter(d => d.status === 'active').length,
        unpaidCount: unpaid.length,
        unpaidAmount: unpaid.reduce((s, v) => s + Number(v.amount || 0), 0),
      }
    })
    setByPlatform(rows)
    setLoading(false)
  }

  if (loading) return <div className="page-loading">جاري التحميل...</div>

  return (
    <div>
      <h1 className="page-title">التقارير</h1>
      <div className="panel-card">
        <h2>ملخص حسب المنصة</h2>
        <table className="data-table">
          <thead><tr><th>المنصة</th><th>إجمالي المناديب</th><th>نشطين</th><th>مخالفات غير مسددة</th><th>المبلغ غير المسدد</th></tr></thead>
          <tbody>
            {byPlatform.map(r => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>{r.totalDrivers}</td>
                <td>{r.activeDrivers}</td>
                <td>{r.unpaidCount}</td>
                <td>{r.unpaidAmount.toLocaleString()} ج.س</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
