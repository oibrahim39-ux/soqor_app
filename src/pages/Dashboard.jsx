import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [stats, setStats] = useState({
    drivers: 0, activeDrivers: 0, vehicles: 0, unpaidViolations: 0, unpaidAmount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    setLoading(true)
    const [driversRes, activeDriversRes, vehiclesRes, violationsRes] = await Promise.all([
      supabase.from('drivers').select('id', { count: 'exact', head: true }),
      supabase.from('drivers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('vehicles').select('id', { count: 'exact', head: true }),
      supabase.from('violations').select('amount').eq('payment_status', 'unpaid'),
    ])

    const unpaidAmount = (violationsRes.data || []).reduce((sum, v) => sum + Number(v.amount || 0), 0)

    setStats({
      drivers: driversRes.count || 0,
      activeDrivers: activeDriversRes.count || 0,
      vehicles: vehiclesRes.count || 0,
      unpaidViolations: (violationsRes.data || []).length,
      unpaidAmount,
    })
    setLoading(false)
  }

  if (loading) return <div className="page-loading">جاري التحميل...</div>

  return (
    <div>
      <h1 className="page-title">لوحة التحكم</h1>
      <div className="stats-grid">
        <div className="stat-card"><div className="num">{stats.drivers}</div><div className="label">إجمالي المناديب</div></div>
        <div className="stat-card accent-green"><div className="num">{stats.activeDrivers}</div><div className="label">مناديب نشطين</div></div>
        <div className="stat-card"><div className="num">{stats.vehicles}</div><div className="label">إجمالي السيارات</div></div>
        <div className="stat-card accent-red"><div className="num">{stats.unpaidViolations}</div><div className="label">مخالفات غير مسددة</div></div>
        <div className="stat-card accent-red"><div className="num">{stats.unpaidAmount.toLocaleString()} ج.س</div><div className="label">إجمالي المبالغ غير المسددة</div></div>
      </div>
    </div>
  )
}
