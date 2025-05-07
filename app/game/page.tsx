import { createSupabaseServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import TypingGame from '../../components/TypingGame';

export default async function GamePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <TypingGame />
      </div>
    </div>
  );
}