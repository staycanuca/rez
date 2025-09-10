'use client';

import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Resident {
  id: number;
  name: string;
  specialty: string;
  start_date: string;
  end_date: string;
}

const pagePassword = "RadIt@#2025";
const localStorageKey = "isSettingsPageAuthenticated";

export default function SettingsPage() {
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
        <ResidentManager />
      </main>
    </>
  );
}

function ResidentManager() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  useEffect(() => {
    fetch('/api/residents')
      .then(res => res.json())
      .then(data => {
        setResidents(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Sunteti sigur ca doriti sa stergeti acest rezident?')) {
      await fetch(`/api/residents/${id}`, { method: 'DELETE' });
      setResidents(residents.filter(r => r.id !== id));
    }
  };

  const handleShowModal = (resident: Resident) => {
    setEditingResident(resident);
    setNewStartDate(resident.start_date.split('T')[0]);
    setNewEndDate(resident.end_date.split('T')[0]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingResident(null);
  };

  const handleSaveChanges = async () => {
    if (!editingResident) return;

    const res = await fetch(`/api/residents/${editingResident.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start_date: newStartDate, end_date: newEndDate }),
    });

    if (res.ok) {
      setResidents(residents.map(r => 
        r.id === editingResident.id ? { ...r, start_date: newStartDate, end_date: newEndDate } : r
      ));
      handleCloseModal();
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>Management Rezidenti</h1>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nume</th>
              <th>Specialitate</th>
              <th>Data Start</th>
              <th>Data Sfarsit</th>
              <th>Actiuni</th>
            </tr>
          </thead>
          <tbody>
            {residents.map(resident => (
              <tr key={resident.id}>
                <td>{resident.name}</td>
                <td>{resident.specialty}</td>
                <td>{new Date(resident.start_date).toLocaleDateString()}</td>
                <td>{new Date(resident.end_date).toLocaleDateString()}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleShowModal(resident)}>
                    Modifica
                  </Button>
                  <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(resident.id)}>
                    Sterge
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Perioada pentru {editingResident?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Data Start</Form.Label>
              <Form.Control type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data Sfarsit</Form.Label>
              <Form.Control type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Anuleaza</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Salveaza Modificarile</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
