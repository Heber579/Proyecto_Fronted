import api from "../api/axios";
import type { Membresia } from "../types/membresia";

export const listarMembresias = () =>
  api.get<Membresia[]>("/membresias");

export const crearMembresia = (data: Omit<Membresia, "idMembresia">) =>
  api.post<Membresia>("/membresias", data);

export const actualizarMembresia = (id: number, data: Omit<Membresia, "idMembresia">) =>
  api.put<Membresia>(`/membresias/${id}`, data);

export const anularMembresia = (id: number) =>
  api.put<Membresia>(`/membresias/anular/${id}`);