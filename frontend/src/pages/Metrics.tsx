import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  token: string;
}

export default function Metrics({ token }: Props) {
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/admin/metrics/overview', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOverview(res.data))
      .catch(console.error);
  }, [token]);

  // Placeholder chart data
  const data = [
    { month: 'Jan', mrr: 0 },
    { month: 'Feb', mrr: 0 },
    { month: 'Mar', mrr: 0 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Métricas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Receita Mensal (MRR)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="mrr" stroke="#00F5D4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Indicadores</h2>
          <div className="space-y-4">
            <Metric label="Total de Usuários" value={overview?.totalUsers ?? '-'} />
            <Metric label="Assinaturas Ativas" value={overview?.activeSubs ?? '-'} />
            <Metric label="Novos Usuários (30d)" value={overview?.newUsers ?? '-'} />
            <Metric label="Trials Expirando (7d)" value={overview?.trialsExpiring ?? '-'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between border-b border-gray-700 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
