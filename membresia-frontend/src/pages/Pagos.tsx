import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { listarPagos, registrarPago, anularPago } from "../services/pagoService";
import { listarMembresias } from "../services/membresiaService";
import type { Pago } from "../types/pago";

const formInicial: Pago = {
  idPago: null,
  idMembresia: 0,
  monto: 0,
  fechaPago: new Date().toISOString().split("T")[0],
  formaPago: "Efectivo",
  estado: true
};

function Pagos() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [membresias, setMembresias] = useState<any[]>([]);
  const [form, setForm] = useState<Pago>(formInicial);
  const [mensaje, setMensaje] = useState("");

  const cargarDatos = async () => {
    try {
      const [resPagos, resMembresias] = await Promise.all([
        listarPagos(),
        listarMembresias()
      ]);
      setPagos(resPagos.data);
      setMembresias(resMembresias.data);
    } catch (error) {
      console.error("Error al cargar datos de pagos", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "idMembresia" || type === "number" ? Number(value) : value
    }));
  };

  const obtenerMensajeError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.mensaje ?? error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Ocurrió un error inesperado";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.idMembresia === 0) {
      setMensaje("Por favor seleccione una membresía.");
      return;
    }

    try {
      const payload = {
        monto: Number(form.monto),
        fechaPago: form.fechaPago,
        formaPago: form.formaPago,
        membresias: {
          idMembresia: Number(form.idMembresia)
        }
      };

      await registrarPago(payload as any);
      setMensaje("Pago registrado correctamente");
      setForm(formInicial);
      cargarDatos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
      console.error("Error al registrar el pago", error);
    }
  };

  const handleAnular = async (idPago: number) => {
    const confirmar = window.confirm("¿Seguro que deseas anular este pago?");
    if (!confirmar) return;
    try {
      await anularPago(idPago);
      setMensaje("Pago anulado correctamente");
      cargarDatos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
      console.error("Error al anular el pago", error);
    }
  };

  const obtenerIdMembresia = (pago: any): number | string => {
    if (!pago) return "N/A";

    if (pago.membresias && typeof pago.membresias === 'object') {
      return pago.membresias.idMembresia ?? "N/A";
    }

    if (pago.membresias !== undefined && pago.membresias !== null) {
      return pago.membresias;
    }

    return "N/A";
  };

  const obtenerTextoMembresia = (m: any): string => {
    const idM = m.idMembresia;
    const nombre = 
      m.idMiembro?.nombre ?? 
      m.idMiembro?.nombreMiembro ?? 
      m.nombreMiembro ?? 
      (typeof m.idMiembro === 'number' ? `Miembro #${m.idMiembro}` : '');

    return `Membresía #${idM}${nombre ? ` - ${nombre}` : ''}`;
  };

  return (
    <div>
      <h2>Registrar Pago</h2>
      {mensaje && <p className="alert">{mensaje}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="idMembresia">Membresía:</label>
          <select
            id="idMembresia"
            name="idMembresia"
            value={form.idMembresia}
            onChange={handleChange}
            required
          >
            <option value={0}>-- Seleccione una Membresía --</option>
            {membresias.map((m) => {
              const idVal = m.idMembresia;
              return (
                <option key={idVal} value={idVal ?? 0}>
                  {obtenerTextoMembresia(m)}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label htmlFor="monto">Monto (Q):</label>
          <input
            type="number"
            id="monto"
            name="monto"
            step="0.01"
            value={form.monto}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="fechaPago">Fecha de Pago:</label>
          <input
            type="date"
            id="fechaPago"
            name="fechaPago"
            value={form.fechaPago}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="formaPago">Forma de Pago:</label>
          <select
            id="formaPago"
            name="formaPago"
            value={form.formaPago}
            onChange={handleChange}
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
            <option value="Transferencia">Transferencia Bancaria</option>
          </select>
        </div>

        <button type="submit">Guardar Pago</button>
      </form>

      <h2>Historial de Pagos</h2>
      <table>
        <thead>
          <tr>
            <th>ID Pago</th>
            <th>ID Membresía</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Forma de Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((p) => (
            <tr key={p.idPago}>
              <td>{p.idPago}</td>
              <td>{obtenerIdMembresia(p)}</td>
              <td>Q{p.monto}</td>
              <td>{p.fechaPago ? p.fechaPago.split('T')[0] : ''}</td>
              <td>{p.formaPago}</td>
              <td>
                <button
                  type="button"
                  onClick={() => p.idPago !== null && handleAnular(p.idPago)}
                >
                  Anular
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pagos;