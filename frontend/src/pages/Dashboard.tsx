import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { metricsApi } from '../services/api';

export default function Dashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    metricsApi.overview()
      .then(res => setOverview(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Visão Geral</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-lg">
          <p className="text-muted">Usuários</p>
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
        <div className="bg-surface p-6 rounded-lg">
          <p className="text-muted">Trials Expirando (7d)</p>
          <p className="text-2xl font-bold">{overview?.trialsExpiring || 0}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Navegação Rápida</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/users" className="bg-primary text-black px-4 py-2 rounded hover:opacity-90">Usuários</Link>
          <Link to="/subscriptions" className="bg-secondary text-white px-4 py-2 rounded hover:opacity-90">Assinaturas</Link>
          <Link to="/metrics" className="bg-primary text-black px-4 py-2 rounded hover:opacity-90">Métricas</Link>
          <Link to="/logs" className="bg-secondary text-white px-4 py-2 rounded hover:opacity-90">Logs</Link>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Status do Sistema</h2>
        <p>{overview?.note || 'Sistema operacional'}</p>
      </div>
    </div>
  );
}
