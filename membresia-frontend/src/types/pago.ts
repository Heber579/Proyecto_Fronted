export interface Pago {
    idPago: number | null;
    idMembresia: number;
    monto: number;
    fechaPago: string;
    formaPago: string;
    estado: boolean;
}