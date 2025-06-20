import { NextResponse } from 'next/server';
import { getPassword } from '@/lib/password-store';

export async function GET() {
  return NextResponse.json({ password: getPassword() });
}
