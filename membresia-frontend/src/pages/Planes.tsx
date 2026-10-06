import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarPlanes,
  crearPlan,
  actualizarPlan,
  anularPlan
} from "../services/planService";
import type { Plan } from "../types/plan";

const formInicial: Plan = {
  idPlan: null,
  nombre: "",
  precio: 0,
  duracionMeses: 1,
  estado: true
};

function Planes() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [form, setForm] = useState<Plan>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarPlanes = async () => {
    try {
      const respuesta = await listarPlanes();
      setPlanes(respuesta.data);
    } catch (error) {
      console.error("Error al listar planes", error);
    }
  };

  useEffect(() => {
    cargarPlanes();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
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
    try {
      if (modoEdicion && form.idPlan !== null) {
        await actualizarPlan(form.idPlan, form);
        setMensaje("Plan actualizado correctamente");
      } else {
        await crearPlan(form);
        setMensaje("Plan creado correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarPlanes();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
      console.error("Error al guardar plan", error);
    }
  };

  const handleModificar = (plan: Plan) => {
    setForm(plan);
    setModoEdicion(true);
  };

  const handleAnular = async (idPlan: number) => {
    const confirmar = window.confirm("¿Seguro que deseas anular este plan?");
    if (!confirmar) return;
    try {
      await anularPlan(idPlan);
      setMensaje("Plan anulado correctamente");
      cargarPlanes();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
      console.error("Error al anular el plan", error);
    }
  };

  return (
    <div>
      <h2>Ingresar/Modificar Planes</h2>
      {mensaje && <p>{mensaje}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre del Plan:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="precio">Precio (Q):</label>
          <input
            type="number"
            id="precio"
            name="precio"
            step="0.01"
            value={form.precio}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="duracionMeses">Duración (Meses):</label>
          <input
            type="number"
            id="duracionMeses"
            name="duracionMeses"
            value={form.duracionMeses}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Guardar</button>
      </form>

      <h2>Listado de Planes</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Duración (Meses)</th>
            <th>Modificar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {planes.map((plan) => (
            <tr key={plan.idPlan}>
              <td>{plan.nombre}</td>
              <td>Q{plan.precio}</td>
              <td>{plan.duracionMeses} mes(es)</td>
              <td>
                <button type="button" onClick={() => handleModificar(plan)}>
                  Modificar
                </button>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() =>
                    plan.idPlan !== null && handleAnular(plan.idPlan)
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Planes;