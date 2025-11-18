import { useState } from 'react';
import { useStore } from '../store/store';
import { checkToken } from '../utils/api';

export default function AuthForm() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setToken: setStoreToken, setAuthenticated } = useStore();

  const handleLogin = async () => {
    if (!token.trim()) {
      setError('Введите токен');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isValid = await checkToken(token.trim());
      if (isValid) {
        setStoreToken(token.trim());
        setAuthenticated(true);
      } else {
        setError('Неверный токен');
      }
    } catch {
      setError('Ошибка проверки токена');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Авторизация
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Токен авторизации
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              placeholder="Введите токен"
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Проверка...' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}

