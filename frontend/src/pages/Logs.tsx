import { useEffect, useState } from 'react';
import { logsApi } from '../services/api';

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logsApi.list({ limit: 100 })
      .then(res => setLogs(res.data.logs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-secondary">Logs de Administração</h1>
      <div className="bg-surface rounded-lg overflow-auto max-h-[80vh]">
        <table className="w-full text-left">
          <thead className="bg-gray-800 sticky top-0">
            <tr>
              <th className="p-3">Data/Hora</th>
              <th className="p-3">Admin</th>
              <th className="p-3">Ação</th>
              <th className="p-3">Entidade</th>
              <th className="p-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-gray-700">
                <td className="p-3 text-sm">{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
                <td className="p-3">{log.admin?.email}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.entityType || '-'}</td>
                <td className="p-3">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
