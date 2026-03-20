import { Link, useLocation } from 'react-router-dom';

interface Props {
  token: string;
  onLogout: () => void;
}

export default function Navbar({ token, onLogout }: Props) {
  const location = useLocation();
  const navs = [
    { path: '/', label: 'Dashboard' },
    { path: '/users', label: 'Usuários' },
    { path: '/subscriptions', label: 'Assinaturas' },
    { path: '/metrics', label: 'Métricas' },
    { path: '/config', label: 'Config' },
  ];

  return (
    <nav className="bg-gray-800 p-4 mb-6 flex justify-between items-center">
      <div className="flex space-x-4">
        {navs.map(n => (
          <Link
            key={n.path}
            to={n.path}
            className={`px-3 py-2 rounded ${location.pathname === n.path ? 'bg-cyan-600' : 'hover:bg-gray-700'}`}
          >
            {n.label}
          </Link>
        ))}
      </div>
      <button onClick={onLogout} className="text-red-400 hover:text-red-300">Sair</button>
    </nav>
  );
}
