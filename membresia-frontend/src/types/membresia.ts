export interface Membresia {

    idMembresia: number | null;
    idMiembro: number;
    idPlan: number;
    idUsuario: number;
    fechaInicio: string;
    fechaFin: string;
    estado: boolean;


    nombreMiembro?: string;
    nombrePlan?: string;
    nombreUsuario?: string;
}