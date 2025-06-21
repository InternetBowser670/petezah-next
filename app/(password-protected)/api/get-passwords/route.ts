import { NextResponse } from 'next/server';
import { getAllPasswords } from '@/lib/password-store';

export async function GET() {
  return NextResponse.json({ passwords: (await getAllPasswords()) });
}
