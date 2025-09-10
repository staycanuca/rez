'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4 sticky-top">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
          Programare Rezidenti
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                Calendar
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/add" className={`nav-link ${pathname === '/add' ? 'active' : ''}`}>
                Adauga Programare
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/settings" className={`nav-link ${pathname === '/settings' ? 'active' : ''}`}>
                Management Rezidenti
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/limits" className={`nav-link ${pathname === '/limits' ? 'active' : ''}`}>
                Setari Limite
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/notifications" className={`nav-link ${pathname === '/notifications' ? 'active' : ''}`}>
                Notificari
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
