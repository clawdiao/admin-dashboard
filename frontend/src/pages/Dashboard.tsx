import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  token: string;
}

export default function Dashboard({ token }: Props) {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/admin/metrics/overview', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMetrics(res.data))
      .catch(console.error);
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Users" value={metrics?.totalUsers ?? '-'} />
        <MetricCard title="Active Subscriptions" value={metrics?.activeSubs ?? '-'} />
        <MetricCard title="New Users (30d)" value={metrics?.newUsers ?? '-'} />
        <MetricCard title="Trials Expiring" value={metrics?.trialsExpiring ?? '-'} />
      </div>
      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h2 className="text-xl font-semibold mb-2">Notas</h2>
        <p className="text-gray-400">{metrics?.note || 'Sem dados adicionais.'}</p>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="text-gray-400 text-sm">{title}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
