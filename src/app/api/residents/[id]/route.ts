import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { start_date, end_date } = await request.json();
  const id = params.id;

  if (!start_date || !end_date) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  await db.run('UPDATE residents SET start_date = ?, end_date = ? WHERE id = ?', start_date, end_date, id);

  return NextResponse.json({ message: 'Resident updated successfully' });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  const id = params.id;

  await db.run('DELETE FROM residents WHERE id = ?', id);

  return NextResponse.json({ message: 'Resident deleted successfully' });
}
