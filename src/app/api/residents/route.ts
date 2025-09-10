import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  const db = await getDb();
  const { name, year_of_study, specialty, start_date, end_date } = await request.json();

  // Validation
  if (!name || !year_of_study || !specialty || !start_date || !end_date) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const startDate = new Date(start_date);
  const month = startDate.getMonth() + 1;
  const year = startDate.getFullYear();

  const setting = await db.get('SELECT monthly_limit FROM settings WHERE specialty = ?', specialty);
  if (!setting) {
    return NextResponse.json({ message: 'Invalid specialty' }, { status: 400 });
  }

  const residentsInMonth = await db.get(
    `SELECT COUNT(*) as count FROM residents WHERE specialty = ? AND strftime('%m', start_date) = ? AND strftime('%Y', start_date) = ?`,
    specialty,
    month.toString().padStart(2, '0'),
    year.toString()
  );

  if (residentsInMonth.count >= setting.monthly_limit) {
    return NextResponse.json({ message: 'Monthly limit reached for this specialty' }, { status: 400 });
  }

  await db.run(
    'INSERT INTO residents (name, year_of_study, specialty, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
    name,
    year_of_study,
    specialty,
    start_date,
    end_date
  );

  return NextResponse.json({ message: 'Resident added successfully' }, { status: 201 });
}

export async function GET() {
    const db = await getDb();
    const residents = await db.all('SELECT * FROM residents');
    return NextResponse.json(residents);
}
