import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { metricsApi } from '../services/api';

export default function Metrics() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    metricsApi.overview()
      .then(res => setOverview(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Dummy chart data — substituir por API real posteriormente
  const dummyRevenue = [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1900 },
    { month: 'Mar', revenue: 1500 },
    { month: 'Apr', revenue: 2200 },
    { month: 'May', revenue: 2800 },
    { month: 'Jun', revenue: 2400 }
  ];

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Métricas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-lg">
          <p className="text-muted">Usuários Totais</p>
          <p className="text-2xl font-bold">{overview?.totalUsers || 0}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg">
          <p className="text-muted">Assinaturas Ativas</p>
          <p className="text-2xl font-bold">{overview?.activeSubs || 0}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg">
          <p className="text-muted">Novos (30d)</p>
          <p className="text-2xl font-bold">{overview?.newUsers || 0}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Receita Mensal (demo)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dummyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#00F5D4" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted mt-4">{overview?.note || 'Implementar Stripe sync para dados reais'}</p>
      </div>
    </div>
  );
}
