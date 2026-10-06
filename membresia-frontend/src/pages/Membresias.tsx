import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
    listarMembresias,
    crearMembresia,
    actualizarMembresia,
    anularMembresia
} from "../services/membresiaService";
import { listarMiembrosActivos } from "../services/miembroService";
import { listarPlanes } from "../services/planService";
import type { Membresia } from "../types/membresia";
import type { Miembro } from "../types/miembro";
import type { Plan } from "../types/plan";

const formInicial: Membresia = {
    idMembresia: null,
    idMiembro: 0,
    idPlan: 0,
    idUsuario: 1,
    fechaInicio: "",
    fechaFin: "",
    estado: true
};

function Membresias() {
    const [membresias, setMembresias] = useState<Membresia[]>([]);
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [form, setForm] = useState<Membresia>(formInicial);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const cargarDatos = async () => {
        try {
            const [resMembresias, resMiembros, resPlanes] = await Promise.all([
                listarMembresias(),
                listarMiembrosActivos(),
                listarPlanes()
            ]);
            setMembresias(resMembresias.data);
            setMiembros(resMiembros.data);
            setPlanes(resPlanes.data);
        } catch (error) {
            console.error("Error al cargar datos", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "idMiembro" || name === "idPlan" || name === "idUsuario" ? Number(value) : value
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
            if (modoEdicion && form.idMembresia !== null) {
                await actualizarMembresia(form.idMembresia, form);
                setMensaje("Membresía actualizada correctamente");
            } else {
                await crearMembresia(form);
                setMensaje("Membresía creada correctamente");
            }
            setForm(formInicial);
            setModoEdicion(false);
            cargarDatos();
        } catch (error) {
            setMensaje(obtenerMensajeError(error));
            console.error("Error al guardar membresía", error);
        }
    };

    const handleModificar = (membresia: any) => {

        const idM = typeof membresia.idMiembro === 'object' ? membresia.idMiembro?.idMiembro : membresia.idMiembro;
        const idP = typeof membresia.idPlan === 'object' ? membresia.idPlan?.idPlan : membresia.idPlan;
        const idU = typeof membresia.idUsuario === 'object' ? membresia.idUsuario?.idUsuario : membresia.idUsuario;

        setForm({
            ...membresia,
            idMiembro: idM ?? 0,
            idPlan: idP ?? 0,
            idUsuario: idU ?? 1
        });
        setModoEdicion(true);
    };

    const handleAnular = async (idMembresia: number) => {
        const confirmar = window.confirm("¿Seguro que deseas anular esta membresía?");
        if (!confirmar) return;
        try {
            await anularMembresia(idMembresia);
            setMensaje("Membresía anulada correctamente");
            cargarDatos();
        } catch (error) {
            setMensaje(obtenerMensajeError(error));
            console.error("Error al anular la membresía", error);
        }
    };


    const obtenerNombreMiembro = (m: any): string => {
        if (m.nombreMiembro) return m.nombreMiembro;
        if (typeof m.idMiembro === 'object' && m.idMiembro !== null) {
            return m.idMiembro.nombre ?? `Miembro #${m.idMiembro.idMiembro}`;
        }
        const encontrado = miembros.find((item) => item.idMiembro === m.idMiembro);
        return encontrado ? encontrado.nombre : `Miembro #${m.idMiembro}`;
    };

    const obtenerNombrePlan = (m: any): string => {
        if (m.nombrePlan) return m.nombrePlan;
        if (typeof m.idPlan === 'object' && m.idPlan !== null) {
            return m.idPlan.nombre ?? `Plan #${m.idPlan.idPlan}`;
        }
        const encontrado = planes.find((item) => item.idPlan === m.idPlan);
        return encontrado ? encontrado.nombre : `Plan #${m.idPlan}`;
    };

    const obtenerNombreUsuario = (m: any): string => {
        if (m.nombreUsuario) return m.nombreUsuario;
        if (typeof m.idUsuario === 'object' && m.idUsuario !== null) {
            return m.idUsuario.nombre ?? `Usuario #${m.idUsuario.idUsuario}`;
        }
        return `Usuario #${m.idUsuario ?? 1}`;
    };

    return (
        <div>
            <h2>Ingresar/Modificar Membresías</h2>
            {mensaje && <p className="alert">{mensaje}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="idMiembro">Miembro:</label>
                    <select
                        id="idMiembro"
                        name="idMiembro"
                        value={form.idMiembro}
                        onChange={handleChange}
                        required
                    >
                        <option value={0}>-- Seleccione un Miembro --</option>
                        {miembros.map((m) => (
                            <option key={m.idMiembro} value={m.idMiembro ?? 0}>
                                {m.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="idPlan">Plan:</label>
                    <select
                        id="idPlan"
                        name="idPlan"
                        value={form.idPlan}
                        onChange={handleChange}
                        required
                    >
                        <option value={0}>-- Seleccione un Plan --</option>
                        {planes.map((p) => (
                            <option key={p.idPlan} value={p.idPlan ?? 0}>
                                {p.nombre} - Q{p.precio}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="idUsuario">ID Usuario/Empleado:</label>
                    <input
                        type="number"
                        id="idUsuario"
                        name="idUsuario"
                        value={form.idUsuario}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="fechaInicio">Fecha Inicio:</label>
                    <input
                        type="date"
                        id="fechaInicio"
                        name="fechaInicio"
                        value={form.fechaInicio}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="fechaFin">Fecha Fin:</label>
                    <input
                        type="date"
                        id="fechaFin"
                        name="fechaFin"
                        value={form.fechaFin}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Guardar</button>
            </form>

            <h2>Listado de Membresías</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Miembro</th>
                        <th>Plan</th>
                        <th>Usuario</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {membresias.map((m) => (
                        <tr key={m.idMembresia}>
                            <td>{m.idMembresia}</td>
                            <td>{obtenerNombreMiembro(m)}</td>
                            <td>{obtenerNombrePlan(m)}</td>
                            <td>{obtenerNombreUsuario(m)}</td>
                            <td>{m.fechaInicio ? m.fechaInicio.split('T')[0] : ''}</td>
                            <td>{m.fechaFin ? m.fechaFin.split('T')[0] : ''}</td>
                            <td>
                                <button type="button" onClick={() => handleModificar(m)}>
                                    Modificar
                                </button>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    onClick={() =>
                                        m.idMembresia !== null && handleAnular(m.idMembresia)
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

export default Membresias;