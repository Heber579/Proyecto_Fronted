import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService, type UserSession } from '../services/authService';

interface LoginProps {
  onLoginSuccess: (user: UserSession) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const user = await loginService({ usuario, contrasena });
      
      // Guardar sesión en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);

      // Redireccionar según el perfil/rol
      if (user.idPerfil === 1 || user.perfilNombre.toUpperCase().includes('ADMIN')) {
        navigate('/pagos'); // O al Dashboard principal de Admin
      } else {
        navigate('/mi-perfil'); // Vista exclusiva de Cliente
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Iniciar Sesión - Gimnasio</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Usuario:</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" disabled={cargando} style={{ width: '100%', padding: '10px' }}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}