import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export interface LoginData {
  usuario: string;
  contrasena: string;
}

export interface UserSession {
  idUsuario: number;
  nombre: string;
  usuario: string;
  correo: string;
  idPerfil: number; // 1 = Admin, 2 = Cliente
  perfilNombre: string;
  idMiembro: number | null;
}

export const loginService = async (datos: LoginData): Promise<UserSession> => {
  const response = await axios.post(`${API_URL}/login`, datos);
  return response.data;
};