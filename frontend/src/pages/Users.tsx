import { useEffect, useState } from 'react';
import { usersApi } from '../services/api';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (pageNum: number, searchQuery: string) => {
    setLoading(true);
    try {
      const res = await usersApi.list({ page: pageNum, limit: 20, search: searchQuery });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Usuários</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por email ou nome..."
          className="w-full max-w-md p-2 rounded bg-gray-800 text-white border border-gray-700"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="bg-surface rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3">Email</th>
                <th className="p-3">Nome</th>
                <th className="p-3">Tenant</th>
                <th className="p-3">Plano</th>
                <th className="p-3">Status</th>
                <th className="p-3">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.name || '-'}</td>
                  <td className="p-3">{u.tenant?.name || '-'}</td>
                  <td className="p-3">{u.tenant?.plan || '-'}</td>
                  <td className="p-3">{u.tenant?.status || '-'}</td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="mt-4 flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Anterior</button>
          <span>Página {page} de {pagination.pages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Próxima</button>
        </div>
      )}
    </div>
  );
}
