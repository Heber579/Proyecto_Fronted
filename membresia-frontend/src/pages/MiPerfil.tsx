import { useEffect, useState } from 'react';
import { registrarCheckIn, obtenerAsistenciasMiembro, type Asistencia } from '../services/asistenciaService';

export function MiPerfil() {
  const [user, setUser] = useState<any>(null);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [mensaje, setMensaje] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  useEffect(() => {
    const session = localStorage.getItem('user');
    if (session) {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      if (parsedUser.idMiembro) {
        cargarAsistencias(parsedUser.idMiembro);
      }
    }
  }, []);

  const cargarAsistencias = async (idMiembro: number) => {
    try {
      const data = await obtenerAsistenciasMiembro(idMiembro);
      setAsistencias(data);
    } catch (err) {
      console.error('Error al cargar asistencias', err);
    }
  };

  const handleCheckIn = async () => {
    if (!user?.idMiembro) {
      setMensaje('No tienes un perfil de miembro asociado para marcar asistencia.');
      return;
    }

    setCargando(true);
    setMensaje('');
    try {
      await registrarCheckIn(user.idMiembro);
      setMensaje('¡Check-in registrado con éxito! 💪');
      await cargarAsistencias(user.idMiembro);
    } catch (err: any) {
      setMensaje(err.response?.data || 'Error al registrar el check-in.');
    } finally {
      setCargando(false);
    }
  };

  if (!user) return <p style={{ padding: '20px' }}>Cargando perfil...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h2>Bienvenido, {user.nombre}</h2>
        <p><strong>Usuario:</strong> {user.usuario}</p>
        <p><strong>Correo:</strong> {user.correo || 'No registrado'}</p>
        <p><strong>Perfil:</strong> {user.perfilNombre}</p>
        <p><strong>ID Miembro:</strong> {user.idMiembro ? `#${user.idMiembro}` : 'Sin membresía vinculada'}</p>
      </div>

      <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
        <button
          onClick={handleCheckIn}
          disabled={cargando || !user.idMiembro}
          style={{
            padding: '12px 20px',
            backgroundColor: '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: user.idMiembro ? 'pointer' : 'not-allowed',
          }}
        >
          {cargando ? 'Registrando...' : '📍 Registrar Asistencia (Check-in)'}
        </button>
      </div>

      {mensaje && (
        <div style={{ marginTop: '15px', padding: '10px', borderRadius: '4px', backgroundColor: '#dcfce7', color: '#15803d' }}>
          {mensaje}
        </div>
      )}

      <hr style={{ margin: '30px 0', borderTop: '1px solid #cbd5e1' }} />

      <h3>Histórico de Asistencias</h3>
      {asistencias.length === 0 ? (
        <p style={{ color: '#64748b' }}>No has registrado asistencias aún.</p>
      ) : (
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {asistencias.map((item) => (
            <li
              key={item.idAsistencia}
              style={{
                padding: '10px 15px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Entrada registrada</span>
              <strong>{new Date(item.fechaAsistencia).toLocaleString()}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}