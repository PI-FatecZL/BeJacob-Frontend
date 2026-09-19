export interface Service {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracaoMinutos: number;
}

// Ajuste esses campos para bater exatamente com o ServiceRequest do backend
export type ServiceRequest = Omit<Service, 'id'>;
