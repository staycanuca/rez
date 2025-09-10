import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = await getDb();
  const notifications = await db.all('SELECT * FROM notifications ORDER BY created_at DESC');
  return NextResponse.json(notifications);
}

export async function POST(request: Request) {
  const db = await getDb();
  const { title, content } = await request.json();

  if (!title || !content) {
    return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
  }

  await db.run('INSERT INTO notifications (title, content) VALUES (?, ?)', title, content);

  return NextResponse.json({ message: 'Notification added successfully' }, { status: 201 });
}
