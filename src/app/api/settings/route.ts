import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = await getDb();
  const settings = await db.all('SELECT * FROM settings');
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const db = await getDb();
  const data = await request.json();

  await Promise.all(
    data.map((setting: { specialty: string; monthly_limit: number }) =>
      db.run('UPDATE settings SET monthly_limit = ? WHERE specialty = ?', setting.monthly_limit, setting.specialty)
    )
  );

  return NextResponse.json({ message: 'Settings updated successfully' });
}
