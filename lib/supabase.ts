import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './database.types';

// サーバーサイドでSupabaseクライアントを作成
export function createSupabaseServerClient() {
  return createServerComponentClient<Database>({
    cookies: () => cookies(),
  });
}

// クライアントサイドでSupabaseクライアントを作成
export function createSupabaseClient() {
  return createServerComponentClient<Database>({
    cookies: () => cookies(),
  });
}