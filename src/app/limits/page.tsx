'use client';

import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';

interface Setting {
  specialty: string;
  monthly_limit: number;
}

const pagePassword = "RadIt@#2025";
const localStorageKey = "isLimitsPageAuthenticated";

export default function LimitsPage() {
  const [isPageAuthenticated, setIsPageAuthenticated] = useState(false);
  const [pagePasswordInput, setPagePasswordInput] = useState('');

  useEffect(() => {
    const storedAuth = localStorage.getItem(localStorageKey);
    if (storedAuth === 'true') {
      setIsPageAuthenticated(true);
    }
  }, []);

  const handlePageLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pagePasswordInput === pagePassword) {
      setIsPageAuthenticated(true);
      localStorage.setItem(localStorageKey, 'true');
    } else {
      alert('Parola incorecta pentru aceasta pagina!');
    }
  };

  if (!isPageAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="container mt-4 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
          <div className="card p-4 shadow-sm text-center">
            <h2 className="mb-4">Acces Restrâns</h2>
            <form onSubmit={handlePageLogin}>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Introduceti parola paginii"
                  value={pagePasswordInput}
                  onChange={(e) => setPagePasswordInput(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Acceseaza</button>
            </form>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mt-4">
        <h1>Setari Limite Specialitati</h1>
        <LimitsForm />
      </main>
    </>
  );
}

function LimitsForm() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
        [key: string]: HTMLInputElement;
    };
    const newSettings = settings.map(s => ({
        specialty: s.specialty,
        monthly_limit: Number(formElements[s.specialty].value)
    }));


    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {settings.map((setting) => (
        <div className="mb-3" key={setting.specialty}>
          <label htmlFor={setting.specialty} className="form-label text-capitalize">
            {setting.specialty}
          </label>
          <input
            type="number"
            className="form-control"
            id={setting.specialty}
            name={setting.specialty}
            defaultValue={setting.monthly_limit}
          />
        </div>
      ))}
      <button type="submit" className="btn btn-primary">
        Salveaza
      </button>
    </form>
  );
}