'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function login(formData: FormData) {
  const supabase = createServerActionClient({ cookies });
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: 'ログインに失敗しました。' };
    }
    revalidatePath('/game');
    return { success: true };
  } catch (error) {
    return { error: 'エラーが発生しました。' };
  }
}

export async function signup(formData: FormData) {
  const supabase = createServerActionClient({ cookies });
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { error: 'サインアップに失敗しました。' };
    }
    return { success: true };
  } catch (error) {
    return { error: 'エラーが発生しました。' };
  }
}

export async function getWords() {
  try {
    const words = await prisma.word.findMany();
    return { data: words };
  } catch (error) {
    return { error: '単語の取得に失敗しました。' };
  }
}