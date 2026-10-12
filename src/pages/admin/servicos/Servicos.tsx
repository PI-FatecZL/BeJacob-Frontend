import { useState, useEffect } from 'react';
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { serviceService } from '../../../services/serviceService';
import type { ServiceResponse as Service, ServiceRequest } from '../../../types/service';

import CriarServico from './CriarServico';
import EditarServico from './EditarServico';
import ModalConfirmacao from '../../../components/ui/ModalConfirmacao';

export default function Servicos() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        loadServices();
    }, []);

    // função para carregar os serviços
    const loadServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceService.findAll();
            console.log("Dados dos serviços:", data);
            setServices(data);
        } catch {
            setError('Não foi possível carregar os serviços.');
        } finally {
            setLoading(false);
        }
    };

    // função para filtrar os serviços com base na busca
    const filteredServices = services.filter((s) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return (
            s.name.toLowerCase().includes(term) ||
            s.description.toLowerCase().includes(term)
        );
    });

    // função para criar um novo serviço
    const handleCreateService = async (data: ServiceRequest) => {
        setError(null);
        try {
            const created = await serviceService.create(data);
            setServices((prev) => [...prev, created]);
        } catch {
            setError('Não foi possível criar o serviço.');
        }
    };

    // função para editar um serviço existente
    const handleEditService = async (data: ServiceRequest) => {
        if (!selectedService) return;
        setError(null);
        try {
            const updated = await serviceService.update(selectedService.id, data);
            setServices((prev) => prev.map((s) => (s.id === selectedService.id ? updated : s)));
        } catch {
            setError('Não foi possível atualizar o serviço.');
        }
    };

    // função para excluir um serviço
    const handleDeleteService = async () => {
        if (!selectedService) return;
        setError(null);
        try {
            await serviceService.delete(selectedService.id);
            setServices((prev) => prev.filter((s) => s.id !== selectedService.id));
        } catch {
            setError('Não foi possível excluir o serviço.');
        }
    };

    const formatDuration = (totalMinutes: number): string => {
        if (!totalMinutes || totalMinutes <= 0) return '0 min';

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours === 0) {
            return `${minutes} min`;
        }

        if (minutes === 0) {
            return `${hours} h`;
        }

        // PadStart para garantir que os minutos tenham sempre 2 dígitos (ex: 1 h 05 min)
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${hours} h ${formattedMinutes} min`;
    };

    return (
        <DashboardLayout>
            <div className="bg-white rounded-3 shadow-sm">
                <div className="bg-primary text-white d-flex justify-content-between align-items-center p-3 rounded-top-3">
                    <h5 className="m-0">
                        <i className="bi bi-grid me-2"></i>
                        Serviços
                    </h5>
                    <button
                        className="btn btn-outline-light"
                        data-bs-toggle="modal"
                        data-bs-target="#modalCriarServico"
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Novo serviço
                    </button>
                </div>

                <div className="p-3">
                    {error && <div className="alert alert-danger py-2">{error}</div>}

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                        <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
                            <span className="input-group-text bg-white">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar serviço..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status" />
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <p className="text-muted text-center py-3">
                            {search
                                ? 'Nenhum serviço encontrado para essa busca.'
                                : 'Nenhum serviço cadastrado.'}
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Descrição</th>
                                        <th>Preço</th>
                                        <th>Duração</th>
                                        <th>Status</th>
                                        <th className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredServices.map((s) => (
                                        <tr key={s.id}>
                                            <td>{s.name}</td>
                                            <td className="text-muted small">{s.description}</td>
                                            <td>
                                                {s.price.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </td>
                                            <td>{formatDuration(s.durationMinutes)}</td>
                                            <td>
                                                <span className={`badge ${s.active ? 'bg-success' : 'bg-secondary'}`}>
                                                    {s.active ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-warning me-2"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modalEditarServico"
                                                    onClick={() => setSelectedService(s)}
                                                    title="Editar"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modalExcluirServico"
                                                    onClick={() => setSelectedService(s)}
                                                    title="Excluir"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para Criar Serviço */}
            <CriarServico
                idModal="modalCriarServico"
                onSave={handleCreateService}
            />

            {/* Modal para Editar Serviço */}
            <EditarServico
                idModal="modalEditarServico"
                service={selectedService}
                onSave={handleEditService}
            />

            {/* Modal de Confirmação para Exclusão */}
            <ModalConfirmacao
                id="modalExcluirServico"
                titulo="Confirmar Exclusão"
                descricao={
                    <>
                        Tem certeza que deseja excluir o serviço{' '}
                        <strong>{selectedService?.name}</strong>?
                    </>
                }
                tipo="danger"
                onConfirmar={handleDeleteService}
            />
        </DashboardLayout>
    );
}