import api from "../api/axios";
import type { Miembro } from "../types/miembro";

export const listarMiembrosActivos = () =>
    api.get<Miembro[]>("/miembros");

export const crearMiembro = (data: Omit<Miembro, "idMiembro">) =>
    api.post<Miembro>("/miembros", data);

export const actualizarMiembro = (id: number, data: Omit<Miembro, "idMiembro">) =>
    api.put<Miembro>(`/miembros/${id}`, data);

export const anularMiembro = (id: number) =>
    api.put<Miembro>(`/miembros/anular/${id}`);