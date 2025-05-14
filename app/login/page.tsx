'use client';

import { useState, FormEvent } from 'react';
import type { JSX } from 'react';
import { login, signup } from '@/actions/auth';

type AuthAction = 'login' | 'signup';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    action: AuthAction
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = action === 'login' ? await login(formData) : await signup(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      const successMsg = action === 'login' ? 'ログイン成功！' : 'サインアップ成功！';
      setMessage(successMsg);
      if (action === 'login') {
        window.location.href = '/game';
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">ログイン / サインアップ</h1>

        {/* フィードバック領域 */}
        {error && (
          <p className="mb-4 text-center text-sm text-red-500" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-4 text-center text-sm text-green-600" role="status" aria-live="polite">
            {message}
          </p>
        )}

        <form
          className="space-y-4"
          onSubmit={(e) => handleSubmit(e, 'login')}
        >
          {/* メール */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              required
              autoComplete="email"
            />
          </div>

          {/* パスワード */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              required
              autoComplete="current-password"
            />
          </div>

          {/* ボタン群 */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>, 'signup')}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              サインアップ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
