import { useState, useEffect } from 'react';
import DashboardLayout from "../../../components/layout/DashboardLayout";

import ModalConfirmacao from '../../../components/ui/ModalConfirmacao';
import type { UserResponse } from '../../../types/user';
import type { SpringPage } from '../../../types/pagination';
import { userService } from '../../../services/userService';
import { authService } from '../../../services/authService';
import Select from '../../../components/form/Select';

export default function Clientes() {
    const [pageData, setPageData] = useState<SpringPage<UserResponse> | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

    const [statusFilter, setStatusFilter] = useState<'ativos' | 'inativos'>('ativos');

    const [loggedUserId, setLoggedUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchLoggedUser = async () => {
            try {
                const user = await authService.getMe(); // Espera a Promise resolver
                if (user?.id) {
                    setLoggedUserId(String(user.id));
                }
            } catch (err) {
                console.error("Erro ao buscar usuário logado:", err);
            }
        };
        fetchLoggedUser();
    }, []);

    useEffect(() => {
        loadUsers();
    }, [currentPage]);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.findAll(currentPage, 10);
            setPageData(data);
        } catch {
            setError('Não foi possível carregar os usuários.');
        } finally {
            setLoading(false);
        }
    };

    // Extrai a lista de usuários segura do pageData para fazer o filtro visual
    const usersList = pageData?.content || [];

    const term = search.trim().toLowerCase();

    // função para filtrar usuário
    const filteredUsers = usersList.filter((u) => {
        if (loggedUserId && String(u.id) === loggedUserId) {
            return false;
        }

        if (statusFilter === 'ativos' && !u.isActive) {
            return false;
        }
        if (statusFilter === 'inativos' && u.isActive) {
            return false;
        }

        if (!term) return true;
        return u.name.toLowerCase().includes(term);
    });

    // função para deletar usuário
    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setError(null);
        try {
            await userService.delete(selectedUser.id);
            loadUsers();
        } catch (err: any) {
            if (err.response && err.response.status == 409) {
                setError(`O cliente possui agendamentos futuros pendentes. Cancele ou conclua os agendamentos pendentes antes de excluir o usuário`);
            } else {
                setError('Não foi possível excluir o usuário.');
            }
        }
    };

    const handleReactiveUser = async () => {
        if (!selectedUser) return;
        setError(null);
        try {
            await userService.reactive(selectedUser.id);
            loadUsers();
        } catch {
            setError('Não foi possível reativar o usuário.');
        }
    };

    const statusOptions = [
        { label: 'Ativos', value: 'ativos' },
        { label: 'Inativos', value: 'inativos' }
    ];

    return (
        <DashboardLayout>
            <div className="bg-white rounded-3 shadow-sm">
                <div className="bg-primary text-white d-flex justify-content-between align-items-center p-3 rounded-top-3">
                    <h5 className="m-0">
                        <i className="bi bi-people me-2"></i>
                        Clientes
                    </h5>
                </div>

                <div className="p-3">
                    {error && <div className="alert alert-danger py-2">{error}</div>}

                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                        <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
                            <span className="input-group-text bg-white">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar cliente..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Select
                            size="sm"
                            placeholder=""
                            value={statusFilter}
                            options={statusOptions}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-muted text-center py-3">
                            {search
                                ? 'Nenhum cliente encontrado para essa busca.'
                                : 'Nenhum cliente cadastrado.'}
                        </p>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Telefone</th>
                                            <th className="text-end">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id}>
                                                <td>{u.name}</td>
                                                <td className="text-muted small">{u.email}</td>
                                                <td className="text-muted small">{u.phone}</td>
                                                <td className="text-end">
                                                    {u.isActive ? (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#modalExcluirUsuario"
                                                            onClick={() => setSelectedUser(u)}
                                                            title="Excluir"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm btn-outline-warning"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#modalReativarUsuario"
                                                            onClick={() => setSelectedUser(u)}
                                                            title="Reativar"
                                                        >
                                                            <i className="bi bi-arrow-counterclockwise"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-3 field-pagination">
                                <span className="text-muted small">
                                    Mostrando {filteredUsers.length} de {pageData?.totalElements || 0} clientes
                                </span>
                                <nav>
                                    <ul className="pagination pagination-sm m-0">
                                        <li className={`page-item ${pageData?.first ? 'disabled' : ''}`}>
                                            <button
                                                className="page-item page-link"
                                                onClick={() => setCurrentPage(prev => prev - 1)}
                                                disabled={pageData?.first}
                                            >
                                                Anterior
                                            </button>
                                        </li>
                                        <li className="page-item disabled">
                                            <span className="page-link text-dark fw-medium">
                                                Página {currentPage + 1} de {pageData?.totalPages || 1}
                                            </span>
                                        </li>
                                        <li className={`page-item ${pageData?.last ? 'disabled' : ''}`}>
                                            <button
                                                className="page-item page-link"
                                                onClick={() => setCurrentPage(prev => prev + 1)}
                                                disabled={pageData?.last}
                                            >
                                                Próximo
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal de Confirmação para Exclusão */}
            <ModalConfirmacao
                id="modalExcluirUsuario"
                titulo="Confirmar Exclusão"
                descricao={
                    <>
                        Tem certeza que deseja excluir o cliente{' '}
                        <strong>{selectedUser?.name}</strong>?
                    </>
                }
                tipo="danger"
                onConfirmar={handleDeleteUser}
            />

            <ModalConfirmacao
                id="modalReativarUsuario"
                titulo="Confirmar Reativação"
                descricao={
                    <>
                        Tem certeza que deseja reativar o perfil do cliente{' '}
                        <strong>{selectedUser?.name}</strong>?
                    </>
                }
                tipo="warning"
                onConfirmar={handleReactiveUser}
            />
        </DashboardLayout>
    );
}
