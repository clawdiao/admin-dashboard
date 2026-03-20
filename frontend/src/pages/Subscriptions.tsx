import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  token: string;
}

export default function Subscriptions({ token }: Props) {
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/admin/subscriptions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSubs(res.data.subscriptions))
      .catch(console.error);
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Assinaturas</h1>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Usuário</th>
              <th className="p-2">Status</th>
              <th className="p-2">Período Atual</th>
              <th className="p-2">Cancel no Período</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.id} className="border-t border-gray-700">
                <td className="p-2 text-xs">{s.id}</td>
                <td className="p-2">{s.user?.email}</td>
                <td className="p-2">{s.status}</td>
                <td className="p-2">{new Date(s.currentPeriodStart).toLocaleDateString()} - {new Date(s.currentPeriodEnd).toLocaleDateString()}</td>
                <td className="p-2">{s.cancelAtPeriodEnd ? 'Sim' : 'Não'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
