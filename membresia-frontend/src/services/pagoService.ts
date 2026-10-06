import api from "../api/axios";
import type { Pago } from "../types/pago";

export const listarPagos = () =>
  api.get<Pago[]>("/pagos");

export const registrarPago = (data: Omit<Pago, "idPago">) =>
  api.post<Pago>("/pagos", data);

export const anularPago = (id: number) =>
  api.put<Pago>(`/pagos/anular/${id}`);