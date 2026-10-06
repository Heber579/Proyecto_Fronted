import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Login } from "./pages/Login";
import { MiPerfil } from "./pages/MiPerfil";
import Pagos from "./pages/Pagos"; // La página que ya tenías funcionando
import type { UserSession } from "./services/authService";

function App() {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    // Restaurar sesión persistente desde localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData: UserSession) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Verificar si el usuario es Administrador
  const esAdmin = user && (user.idPerfil === 1 || user.perfilNombre.toUpperCase().includes("ADMIN"));

  return (
    <>
      {user && (
        <nav style={{ padding: "10px 20px", background: "#1e293b", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Sistema Gimnasio</strong> | Hola, {user.nombre} ({user.perfilNombre})
          </div>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            {esAdmin ? (
              <>
                <Link to="/pagos" style={{ color: "#fff", textDecoration: "none" }}>Pagos</Link>
              </>
            ) : (
              <>
                <Link to="/mi-perfil" style={{ color: "#fff", textDecoration: "none" }}>Mi Perfil</Link>
              </>
            )}
            <button onClick={handleLogout} style={{ padding: "5px 10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      )}

      <Routes>
        {/* Ruta pública de Login */}
        <Route
          path="/login"
          element={
            !user ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to={esAdmin ? "/pagos" : "/mi-perfil"} replace />
            )
          }
        />

        {/* Ruta para el Cliente */}
        <Route
          path="/mi-perfil"
          element={
            user ? <MiPerfil /> : <Navigate to="/login" replace />
          }
        />

        {/* Ruta para el Administrador (Pagos) */}
        <Route
          path="/pagos"
          element={
            user && esAdmin ? <Pagos /> : <Navigate to="/login" replace />
          }
        />

        {/* Redirección por defecto */}
        <Route
          path="*"
          element={<Navigate to={user ? (esAdmin ? "/pagos" : "/mi-perfil") : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;