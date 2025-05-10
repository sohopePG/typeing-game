'use client';

import { useState } from 'react';
import { login, signup } from '@/actions/auth';

// ログインとサインアップを処理するページコンポーネント
export default function LoginPage() {
  // フォームの状態を管理するstate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // ログインまたはサインアップを処理する関数
  const handleSubmit = async (action: 'login' | 'signup') => {
    // エラーとメッセージをリセット
    setError(null);
    setMessage(null);
    
    // フォームデータの作成
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    // 選択されたアクションに基づいて認証を実行
    const result = action === 'login' ? await login(formData) : await signup(formData);

    // 結果の処理
    if (result?.error) {
      setError(result.error);
    } else {
      setMessage(action === 'login' ? 'ログイン成功！' : 'サインアップ成功！');
      if (action === 'login') {
        window.location.href = '/game';
      }
    }
  };

  return (
    // ページ全体のレイアウト
    <div className="flex min-h-screen items-center justify-center">
      {/* ログインフォームのコンテナ */}
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">ログイン / サインアップ</h1>
        {/* エラーとメッセージの表示 */}
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <div className="space-y-4">
          {/* メールアドレス入力フィールド */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              required
            />
          </div>
          {/* パスワード入力フィールド */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              required
            />
          </div>
          {/* アクションボタン */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleSubmit('login')}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              ログイン
            </button>
            <button
              onClick={() => handleSubmit('signup')}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              サインアップ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}