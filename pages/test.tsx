import { supabase } from '../supabaseClient'
import { useEffect, useState } from 'react'

export default function TestPage() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('*')
      setUsers(data || [])
    }
    fetchUsers()
  }, [])

  return (
    <div>
      <h1>Users</h1>
      {users.map(u => <p key={u.id}>{u.username} ({u.email})</p>)}
    </div>
  )
}