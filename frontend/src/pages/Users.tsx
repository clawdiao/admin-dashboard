import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  token: string;
}

export default function Users({ token }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [token, search]);

  const fetchUsers = () => {
    axios.get('/api/admin/users' + (search ? `?search=${encodeURIComponent(search)}` : ''), {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data.users))
      .catch(console.error);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Usuários</h1>
      <input
        type="text"
        placeholder="Buscar por email ou nome..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700"
      />
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">Nome</th>
              <th className="p-2">Tenant</th>
              <th className="p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-gray-700">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.tenant?.name}</td>
                <td className="p-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
