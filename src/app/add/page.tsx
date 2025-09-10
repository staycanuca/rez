'use client';

import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPage() {
  return (
    <>
      <Navbar />
      <main className="container mt-4">
        <h1>Adauga Programare</h1>
        <AddForm />
      </main>
    </>
  );
}

function AddForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch('/api/residents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const errorData = await res.json();
      setError(errorData.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nume si Prenume</label>
        <input type="text" className="form-control" id="name" name="name" required />
      </div>
      <div className="mb-3">
        <label htmlFor="year_of_study" className="form-label">An Studii</label>
        <select className="form-select" id="year_of_study" name="year_of_study" required>
          <option value="">Alege anul</option>
          <option value="An 1">An 1</option>
          <option value="An 2">An 2</option>
          <option value="An 3">An 3</option>
          <option value="An 4">An 4</option>
          <option value="An 5">An 5</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="specialty" className="form-label">Specialitate</label>
        <select className="form-select" id="specialty" name="specialty" required>
          <option value="">Alege specialitatea</option>
          <option value="Radiologie">Radiologie</option>
          <option value="Pediatrie">Pediatrie</option>
          <option value="Alta">Alta</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="start_date" className="form-label">Data Start</label>
        <input type="date" className="form-control" id="start_date" name="start_date" required onChange={(e) => {
          const date = new Date(e.target.value);
          const day = date.getUTCDate(); // Correctly get the day in UTC
          if (day !== 1 && day !== 15) {
            e.target.setCustomValidity('Data de start trebuie sa fie 1 sau 15 ale lunii.');
          } else {
            e.target.setCustomValidity('');
          }
        }} />
      </div>
      <div className="mb-3">
        <label htmlFor="end_date" className="form-label">Data Sfarsit</label>
        <input type="date" className="form-control" id="end_date" name="end_date" required />
      </div>
      <button type="submit" className="btn btn-primary">Adauga</button>
    </form>
  );
}
