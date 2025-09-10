'use client';

import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Notification {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const addNotificationPassword = "RadIt@#2025";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [newNotificationTitle, setNewNotificationTitle] = useState('');
  const [newNotificationContent, setNewNotificationContent] = useState('');

  const fetchNotifications = async () => {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleShowPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordInput(''); // Clear password input
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === addNotificationPassword) {
      setShowPasswordModal(false);
      setShowAddModal(true); // Show add notification form
    } else {
      alert('Parola incorecta!');
    }
  };

  const handleAddNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newNotificationTitle, content: newNotificationContent }),
    });

    if (res.ok) {
      setNewNotificationTitle('');
      setNewNotificationContent('');
      setShowAddModal(false);
      fetchNotifications(); // Refresh list
    } else {
      alert('Eroare la adaugarea notificarii.');
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <>
      <Navbar />
      <main className="container mt-4">
        <h1 className="mb-4">Notificari</h1>
        <Button variant="success" className="mb-4" onClick={handleShowPasswordModal}>
          Adauga Notificare
        </Button>

        {notifications.length === 0 ? (
          <p>Nu exista notificari.</p>
        ) : (
          <div className="row">
            {notifications.map(notification => (
              <div key={notification.id} className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{notification.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{new Date(notification.created_at).toLocaleString()}</h6>
                    <p className="card-text">{notification.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Password Modal */}
      <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Acces Restrâns</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Parola</Form.Label>
              <Form.Control
                type="password"
                placeholder="Introduceti parola"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Acceseaza
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Notification Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adauga Notificare Noua</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddNotification}>
            <Form.Group className="mb-3">
              <Form.Label>Titlu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Titlul notificarii"
                value={newNotificationTitle}
                onChange={e => setNewNotificationTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Continut</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Continutul notificarii"
                value={newNotificationContent}
                onChange={e => setNewNotificationContent(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Adauga
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
