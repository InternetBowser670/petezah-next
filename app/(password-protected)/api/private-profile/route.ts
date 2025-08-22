import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const userId = body.user_id;

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid user_id' }, { status: 400 });
  }

  const { data, error } = await createAdminClient()
    .from('profiles_private')
    .select('anti_close_enabled, discord_id, starred_songs')
    .eq('id', userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ antiClose: data.anti_close_enabled, discordId: data.discord_id, starredSongs: data.starred_songs });
}
