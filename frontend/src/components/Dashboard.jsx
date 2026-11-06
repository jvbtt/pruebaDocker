import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user, logout, refreshProfile } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleVerifySession = async () => {
    setVerifying(true);
    setStatusMsg('');
    const updatedUser = await refreshProfile();
    setVerifying(false);
    if (updatedUser) {
      setStatusMsg('Sesión verificada correctamente contra /api/auth/me (MySQL en Docker).');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <span className="status-pill">Sesión Activa (JWT)</span>
            <h1 className="dashboard-title">Bienvenido, {user?.name}</h1>
            <p className="dashboard-subtitle">
              Has iniciado sesión correctamente mediante CodeIgniter 4 y MySQL.
            </p>
          </div>
          <button type="button" className="btn-danger" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        <div className="user-details-grid">
          <div className="detail-item">
            <span className="detail-label">ID de Usuario</span>
            <span className="detail-value">#{user?.id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Nombre</span>
            <span className="detail-value">{user?.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Correo Electrónico</span>
            <span className="detail-value">{user?.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Fecha de Registro</span>
            <span className="detail-value">{user?.created_at || 'Reciente'}</span>
          </div>
        </div>

        {statusMsg && <div className="success-banner">{statusMsg}</div>}

        <div className="dashboard-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleVerifySession}
            disabled={verifying}
          >
            {verifying ? 'Consultando API...' : 'Verificar sesión en el Backend (/api/auth/me)'}
          </button>
        </div>
      </div>
    </div>
  );
}

