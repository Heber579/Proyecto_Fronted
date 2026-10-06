import axios from 'axios';

const API_URL = 'http://localhost:8080/api/asistencias';

export interface Asistencia {
  idAsistencia: number;
  fechaAsistencia: string;
}

export const registrarCheckIn = async (idMiembro: number) => {
  const response = await axios.post(`${API_URL}/checkin/${idMiembro}`);
  return response.data;
};

export const obtenerAsistenciasMiembro = async (idMiembro: number): Promise<Asistencia[]> => {
  const response = await axios.get(`${API_URL}/miembro/${idMiembro}`);
  return response.data;
};