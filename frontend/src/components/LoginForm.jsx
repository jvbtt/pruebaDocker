import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginForm() {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isRegisterMode) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setIsRegisterMode(false);
    setEmail('admin@prueba.com');
    setPassword('123456');
    setError('');
  };

  const toggleMode = () => {
    setIsRegisterMode((prev) => !prev);
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-badge">React + Vite &bull; CodeIgniter 4 &bull; MySQL Docker</div>
        <h1 className="auth-title">
          {isRegisterMode ? 'Crear una cuenta' : 'Iniciar Sesión'}
        </h1>
        <p className="auth-subtitle">
          {isRegisterMode
            ? 'Regístrate para acceder al panel del sistema'
            : 'Ingresa tus credenciales para acceder al sistema'}
        </p>

        {error && (
          <div className="auth-alert" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegisterMode && (
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                placeholder="Ej. Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isRegisterMode ? 6 : 4}
              autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting
              ? 'Procesando...'
              : isRegisterMode
                ? 'Registrarse'
                : 'Entrar'}
          </button>
        </form>

        {!isRegisterMode && (
          <div className="demo-box">
            <div className="demo-info">
              <strong>Usuario de prueba (Seeder):</strong>
              <span>admin@prueba.com / 123456</span>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={fillDemoCredentials}
            >
              Autocompletar
            </button>
          </div>
        )}

        <div className="auth-footer">
          <span>
            {isRegisterMode ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
          </span>
          <button type="button" className="btn-link" onClick={toggleMode}>
            {isRegisterMode ? 'Inicia sesión aquí' : 'Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}

