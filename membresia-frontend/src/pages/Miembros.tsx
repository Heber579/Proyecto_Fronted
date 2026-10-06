import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
    listarMiembrosActivos,
    crearMiembro,
    actualizarMiembro,
    anularMiembro
} from "../services/miembroService";
import type { Miembro } from "../types/miembro";

const formInicial: Miembro = {
    idMiembro: null,
    nombre: "",
    telefono: "",
    fechaNacimiento: "",
    estado: true
};

function Miembros() {
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [form, setForm] = useState<Miembro>(formInicial);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const cargarMiembros = async () => {
        try {
            const respuesta = await listarMiembrosActivos();
            setMiembros(respuesta.data);
        } catch (error) {
            console.error("Error al listar miembros", error);
        }
    };

    useEffect(() => {
        cargarMiembros();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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
            if (modoEdicion && form.idMiembro !== null) {
                await actualizarMiembro(form.idMiembro, form);
                setMensaje("Miembro actualizado correctamente");
            } else {
                await crearMiembro(form);
                setMensaje("Miembro creado correctamente");
            }
            setForm(formInicial);
            setModoEdicion(false);
            cargarMiembros();
        } catch (error) {
            setMensaje(obtenerMensajeError(error));
            console.error("Error al guardar miembro", error);
        }
    };

    const handleModificar = (miembro: Miembro) => {
        setForm(miembro);
        setModoEdicion(true);
    };

    const handleAnular = async (idMiembro: number) => {
        const confirmar = window.confirm("¿Seguro que deseas anular este miembro?");
        if (!confirmar) return;
        try {
            await anularMiembro(idMiembro);
            setMensaje("Miembro anulado correctamente");
            cargarMiembros();
        } catch (error) {
            setMensaje(obtenerMensajeError(error));
            console.error("Error al anular el miembro", error);
        }
    };

    return (
        <div>
            <h2>Ingresar/Modificar Miembros</h2>
            {mensaje && <p>{mensaje}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombre">Nombre Completo:</label>
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
                    <label htmlFor="telefono">Teléfono:</label>
                    <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="fechaNacimiento">Fecha Nacimiento:</label>
                    <input
                        type="date"
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        value={form.fechaNacimiento}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Guardar</button>
            </form>

            <h2>Listado de Miembros</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Fecha Nacimiento</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {miembros.map((miembro) => (
                        <tr key={miembro.idMiembro}>
                            <td>{miembro.nombre}</td>
                            <td>{miembro.telefono}</td>
                            <td>{miembro.fechaNacimiento ? miembro.fechaNacimiento.split('T')[0] : ''}</td>
                            <td>
                                <button type="button" onClick={() => handleModificar(miembro)}>
                                    Modificar
                                </button>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    onClick={() =>
                                        miembro.idMiembro !== null && handleAnular(miembro.idMiembro)
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

export default Miembros;