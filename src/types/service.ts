export interface Service {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracaoMinutos: number;
}

export type ServiceRequest = Omit<Service, 'id'>;
