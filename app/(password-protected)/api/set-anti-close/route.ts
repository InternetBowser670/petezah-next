import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createAdminClient();

  const { anti_close_enabled, user_id } = await req.json();

  if (typeof anti_close_enabled !== 'boolean' || typeof user_id !== 'string') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { error } = await supabase
    .from('profiles_private')
    .update({ anti_close_enabled })
    .eq('id', user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
