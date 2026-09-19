import { useEffect, useState } from 'react';
import { serviceService } from '../../services/serviceService';
import type { Service, ServiceRequest } from '../../types/service';

interface ServicosPanelProps {
    onClose: () => void;
}

const emptyForm: ServiceRequest = {
    nome: '',
    descricao: '',
    preco: 0,
    duracaoMinutos: 30,
};

export default function ServicosPanel({ onClose }: ServicosPanelProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<ServiceRequest>(emptyForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceService.findAll();
            setServices(data);
        } catch {
            setError('Não foi possível carregar os serviços.');
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter((s) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return (
            s.nome.toLowerCase().includes(term) ||
            s.descricao.toLowerCase().includes(term)
        );
    });

    const handleNew = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setForm({
            nome: service.nome,
            descricao: service.descricao,
            preco: service.preco,
            duracaoMinutos: service.duracaoMinutos,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;
        try {
            await serviceService.remove(id);
            setServices((prev) => prev.filter((s) => s.id !== id));
        } catch {
            setError('Não foi possível excluir o serviço.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (editingId) {
                const updated = await serviceService.update(editingId, form);
                setServices((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
            } else {
                const created = await serviceService.create(form);
                setServices((prev) => [...prev, created]);
            }
            setShowForm(false);
            setForm(emptyForm);
            setEditingId(null);
        } catch {
            setError('Não foi possível salvar o serviço.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-3 shadow-sm">
            <div className="bg-primary text-white d-flex justify-content-between align-items-center p-3 rounded-top-3">
                <h5 className="m-0">
                    <i className="bi bi-grid me-2"></i>
                    Serviços
                </h5>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={onClose}
                >
                    <i className="bi bi-arrow-left me-1"></i>
                    Voltar
                </button>
            </div>

            <div className="p-3">
                {error && <div className="alert alert-danger py-2">{error}</div>}

                {!showForm && (
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

                        <button className="btn btn-primary btn-sm flex-shrink-0" onClick={handleNew}>
                            <i className="bi bi-plus-lg me-1"></i>
                            Novo serviço
                        </button>
                    </div>
                )}

                {showForm && (
                    <form onSubmit={handleSubmit} className="border rounded p-3 mb-3 bg-light">
                        <div className="row g-2">
                            <div className="col-12">
                                <label className="form-label small mb-1">Nome</label>
                                <input
                                    className="form-control form-control-sm"
                                    value={form.nome}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label small mb-1">Descrição</label>
                                <textarea
                                    className="form-control form-control-sm"
                                    value={form.descricao}
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                    rows={2}
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label small mb-1">Preço (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="form-control form-control-sm"
                                    value={form.preco}
                                    onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label small mb-1">Duração (min)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control form-control-sm"
                                    value={form.duracaoMinutos}
                                    onChange={(e) =>
                                        setForm({ ...form, duracaoMinutos: Number(e.target.value) })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                }}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                                {saving ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                )}

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
                                    <th className="text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map((s) => (
                                    <tr key={s.id}>
                                        <td>{s.nome}</td>
                                        <td className="text-muted small">{s.descricao}</td>
                                        <td>
                                            {s.preco.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                        </td>
                                        <td>{s.duracaoMinutos} min</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEdit(s)}
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(s.id)}
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
    );
}