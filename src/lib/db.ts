import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

let db: Database | null = null;

// Helper function to generate random data
const generateDemoData = () => {
  const residents = [];
  const names = [
    'Popescu Andrei', 'Ionescu Maria', 'Dumitru Alexandru', 'Stan Ana', 'Georgescu Ion',
    'Mihai Elena', 'Constantin Vasile', 'Florea Cristina', 'Dinu Stefan', 'Gheorghe Andreea',
    'Radu Gabriel', 'Vasile Ioana', 'Lungu Adrian', 'Serban Laura', 'Toma Mihai',
    'Nistor Alexandra', 'Ciobanu Daniel', 'Marin Oana', 'Barbu Cristian', 'Avram Diana',
    'Mocanu Florin', 'Voicu Teodora', 'Stoica Bogdan', 'Petrescu Irina', 'Neagu Robert'
  ];
  const specialties = ['Radiologie', 'Pediatrie', 'Alta'];
  const years = ['An 1', 'An 2', 'An 3', 'An 4', 'An 5'];

  for (let i = 0; i < 25; i++) {
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    const year_of_study = years[Math.floor(Math.random() * years.length)];
    
    const monthOffset = Math.floor(Math.random() * 6);
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(startDate.getMonth() + monthOffset);
    
    const day = Math.random() < 0.5 ? 1 : 15;
    startDate.setDate(day);

    const endDate = new Date(startDate);
    const durationMonths = Math.floor(Math.random() * 3) + 1; // 1 to 3 months
    endDate.setMonth(endDate.getMonth() + durationMonths);

    residents.push({
      name: names[i],
      year_of_study,
      specialty,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    });
  }
  return residents;
};

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './database.db',
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS residents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        year_of_study TEXT NOT NULL,
        specialty TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        specialty TEXT NOT NULL UNIQUE,
        monthly_limit INTEGER NOT NULL
      );

      INSERT OR IGNORE INTO settings (specialty, monthly_limit) VALUES ('Radiologie', 20);
      INSERT OR IGNORE INTO settings (specialty, monthly_limit) VALUES ('Pediatrie', 20);
      INSERT OR IGNORE INTO settings (specialty, monthly_limit) VALUES ('Alta', 20);

      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed demo data if the residents table is empty
    const count = await db.get('SELECT COUNT(*) as count FROM residents');
    if (count.count === 0) {
        const demoResidents = generateDemoData();
        const stmt = await db.prepare('INSERT INTO residents (name, year_of_study, specialty, start_date, end_date) VALUES (?, ?, ?, ?, ?)');
        for (const res of demoResidents) {
            await stmt.run(res.name, res.year_of_study, res.specialty, res.start_date, res.end_date);
        }
        await stmt.finalize();
    }
  }
  return db;
}
