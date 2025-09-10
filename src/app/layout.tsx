'use client'; // layout.tsx needs to be a client component for state and localStorage

import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapClient from '@/components/BootstrapClient';
import React, { useState, useEffect } from 'react'; // Import React and hooks

const inter = Inter({ subsets: ["latin"] });

// Metadata export is not allowed in a client component, so it's commented out.
// export const metadata: Metadata = {
//   title: "Programare Rezidenti",
//   description: "Aplicatie pentru programarea rezidentilor",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const staticPassword = "RezidentiGrigore";

  useEffect(() => {
    // Check if already authenticated in localStorage
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === staticPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      alert('Parola incorecta!'); // Simple alert for incorrect password
    }
  };

  if (!isAuthenticated) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow-sm text-center">
              <h1 className="mb-3">SCUC Grigore Alexandrescu</h1>
              <h2 className="mb-3">Laborator Radiologie Imagistica</h2>
              <h3 className="mb-4">Programari Rezidenti</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Introduceti parola"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Acceseaza Aplicatia
                </button>
              </form>
            </div>
          </div>
          <BootstrapClient />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}