export interface Miembro {
    idMiembro: number | null;
    nombre: string;
    telefono: string;
    fechaNacimiento: string;
    estado: boolean;
}

export interface ApiMensaje {
    mensaje: string;
}