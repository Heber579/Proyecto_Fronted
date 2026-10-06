import api from "../api/axios";
import type { Plan } from "../types/plan";

export const listarPlanes = () =>
  api.get<Plan[]>("/planes");

export const crearPlan = (data: Omit<Plan, "idPlan">) =>
  api.post<Plan>("/planes", data);

export const actualizarPlan = (id: number, data: Omit<Plan, "idPlan">) =>
  api.put<Plan>(`/planes/${id}`, data);

export const anularPlan = (id: number) =>
  api.put<Plan>(`/planes/anular/${id}`);