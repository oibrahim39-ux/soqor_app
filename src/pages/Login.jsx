import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await signIn(email, password)
    setBusy(false)
    if (error) { setError('البريد أو كلمة المرور غلط'); return }
    navigate('/')
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>صقور الغد</h1>
        <p className="sub">تسجيل الدخول للوحة التحكم</p>

        <label>البريد الإلكتروني</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label>كلمة المرور</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={busy}>{busy ? '...جاري الدخول' : 'دخول'}</button>
      </form>
    </div>
  )
}
