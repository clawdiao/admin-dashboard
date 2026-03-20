import { useEffect, useState } from 'react';
import { subscriptionsApi } from '../services/api';

export default function Subscriptions() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const res = await subscriptionsApi.list({ limit: 100 });
      setSubs(res.data.subscriptions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubs(); }, []);

  const handleAction = async (id: string, action: string, priceId?: string) => {
    setActionLoading(id);
    try {
      await subscriptionsApi.update(id, { action, priceId });
      alert('Ação executada com sucesso!');
      fetchSubs();
    } catch (error: any) {
      alert('Erro: ' + (error.response?.data?.error || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-secondary">Assinaturas</h1>
      <div className="bg-surface rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3">Usuário</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Plano</th>
              <th className="p-3">Próximo billing</th>
              <th className="p-3">Cancel em</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-t border-gray-700 hover:bg-gray-800">
                <td className="p-3">{s.user?.name || '-'}</td>
                <td className="p-3">{s.user?.email}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3">{s.user?.tenant?.plan || '-'}</td>
                <td className="p-3">{new Date(s.currentPeriodEnd).toLocaleDateString('pt-BR')}</td>
                <td className="p-3">{s.cancelAtPeriodEnd ? 'Sim' : 'Não'}</td>
                <td className="p-3 flex gap-2">
                  {s.status === 'active' && !s.cancelAtPeriodEnd && (
                    <button onClick={() => handleAction(s.id, 'cancel')} disabled={actionLoading === s.id} className="px-2 py-1 bg-red-700 rounded text-sm">Cancelar</button>
                  )}
                  {s.cancelAtPeriodEnd && (
                    <button onClick={() => handleAction(s.id, 'reactivate')} disabled={actionLoading === s.id} className="px-2 py-1 bg-green-700 rounded text-sm">Reativar</button>
                  )}
                  {/* Change plan button would open modal with price options */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
