import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  token: string;
}

interface Config {
  key: string;
  value: string | null;
  description: string | null;
  updatedAt: string;
}

export default function Config({ token }: Props) {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [editing, setEditing] = useState<{ key: string; value: string } | null>(null);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    fetchConfigs();
  }, [token]);

  const fetchConfigs = () => {
    axios.get('/api/admin/config', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setConfigs(res.data.configs))
      .catch(console.error);
  };

  const save = async (key: string, value: string, description?: string) => {
    await axios.post('/api/admin/config', { key, value, description }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchConfigs();
    setEditing(null);
  };

  const del = async (key: string) => {
    if (!confirm('Tem certeza?')) return;
    await axios.delete(`/api/admin/config/${key}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchConfigs();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Configurações do Sistema</h1>
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-xl mb-4">Adicionar Nova Config</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Chave (ex: STRIPE_SECRET_KEY)"
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Valor"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={() => save(newKey, newValue, newDesc)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded"
          >
            Salvar
          </button>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2">Chave</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Descrição</th>
              <th className="p-2">Atualizado</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {configs.map(c => (
              <tr key={c.key} className="border-t border-gray-700">
                <td className="p-2 font-mono">{c.key}</td>
                <td className="p-2">
                  {editing?.key === c.key ? (
                    <input
                      type="text"
                      defaultValue={c.value || ''}
                      onChange={e => setEditing({ ...editing, value: e.target.value })}
                      className="w-full p-1 rounded bg-gray-700 text-white"
                    />
                  ) : (
                    (c.value || '')
                  )}
                </td>
                <td className="p-2 text-gray-400">{c.description || '-'}</td>
                <td className="p-2 text-gray-400">{new Date(c.updatedAt).toLocaleString()}</td>
                <td className="p-2">
                  {editing?.key === c.key ? (
                    <button onClick={() => save(editing.key, editing.value, c.description || '')} className="text-green-400 mr-2">Salvar</button>
                  ) : (
                    <button onClick={() => setEditing({ key: c.key, value: c.value || '' })} className="text-cyan-400 mr-2">Editar</button>
                  )}
                  <button onClick={() => del(c.key)} className="text-red-400">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
