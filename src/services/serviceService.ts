import type { Service, ServiceRequest } from '../types/service';

let services: Service[] = [
    {
        id: 1,
        nome: 'Design de Sobrancelha',
        descricao: 'Modelagem e definição das sobrancelhas',
        preco: 45,
        duracaoMinutos: 30,
    },
    {
        id: 2,
        nome: 'Limpeza de Pele',
        descricao: 'Limpeza facial completa',
        preco: 120,
        duracaoMinutos: 60,
    },
];

export const serviceService = {
    async findAll(): Promise<Service[]> {
        return [...services];
    },

    async create(data: ServiceRequest): Promise<Service> {
        const newService: Service = {
            id: Date.now(),
            ...data,
        };

        services.push(newService);
        return newService;
    },

    async update(id: number, data: ServiceRequest): Promise<Service> {
        const index = services.findIndex((service) => service.id === id);

        if (index === -1) {
            throw new Error('Serviço não encontrado');
        }

        services[index] = {
            ...services[index],
            ...data,
        };

        return services[index];
    },

    async remove(id: number): Promise<void> {
        services = services.filter((service) => service.id !== id);
    },
};