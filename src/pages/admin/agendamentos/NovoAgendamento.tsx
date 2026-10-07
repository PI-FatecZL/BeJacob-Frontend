import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { appointmentService } from '../../../services/appointmentService';
import { userService } from '../../../services/userService';
import { serviceService } from '../../../services/serviceService';

interface OptionItem {
    id: number;
    name: string;
}

export default function NovoAgendamento() {
    const navigate = useNavigate();

    const [users, setUsers] = useState<OptionItem[]>([]);
    const [services, setServices] = useState<OptionItem[]>([]);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedServiceId && selectedDate) {
            loadAvailableTimes(selectedDate, Number(selectedServiceId));
        } else {
            setAvailableTimes([]);
            setSelectedTime('');
        }
    }, [selectedServiceId, selectedDate]);

    const loadInitialData = async () => {
        setLoadingOptions(true);
        try {
            const [usersData, servicesData] = await Promise.all([
                userService.findAll(),
                serviceService.findAll()
            ]);

            const typedUsers = usersData as any;
            const typedServices = servicesData as any;

            setUsers(Array.isArray(typedUsers) ? typedUsers : typedUsers?.content || []);
            setServices(Array.isArray(typedServices) ? typedServices : typedServices?.content || []);
        } catch {
            setError('Erro ao carregar a lista de clientes e serviços.');
        } finally {
            setLoadingOptions(false);
        }
    };

    const loadAvailableTimes = async (date: string, serviceId: number) => {
        setLoadingTimes(true);
        setSelectedTime(''); 
        try {
            const times = await appointmentService.getAvailableTimes(date, serviceId);
            setAvailableTimes(times);
        } catch {
            setError('Erro ao buscar horários disponíveis para este dia.');
            setAvailableTimes([]);
        } finally {
            setLoadingTimes(false);
        }
    };

    const formatTimeDisplay = (timeString: string) => {
        if (!timeString) return '';
        return timeString.substring(0, 5);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUserId || !selectedServiceId || !selectedDate || !selectedTime) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setSubmitting(true);
        setError(null);

        const formattedTime = selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime;
        const startsAt = `${selectedDate}T${formattedTime}`;

        try {
            await appointmentService.createAdmin({
                userId: Number(selectedUserId),
                serviceId: Number(selectedServiceId),
                startsAt,
                notes,
                status: 'SCHEDULED'
            });

            navigate('/admin/agendamentos');
        } catch {
            setError('Não foi possível realizar o agendamento. Verifique os dados e tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="bg-white rounded-3 shadow-sm maxWidth-container">
                <div className="bg-primary text-white d-flex align-items-center justify-content-between p-3 rounded-top-3">
                    <h5 className="m-0 d-flex align-items-center gap-2">
                        <i className="bi bi-calendar-plus"></i>
                        Novo Agendamento
                    </h5>
                    <button
                        type="button"
                        className="btn btn-outline-light btn-sm"
                        onClick={() => navigate('/admin/agendamentos')}
                    >
                        <i className="bi bi-arrow-left me-1"></i>
                        Voltar
                    </button>
                </div>

                <div className="p-4">
                    {error && <div className="alert alert-danger py-2 mb-4">{error}</div>}

                    {loadingOptions ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" />
                            <p className="text-muted small mt-2">Carregando formulário...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-medium">Cliente <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        required
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">Selecione um cliente...</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-medium">Serviço <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        required
                                        value={selectedServiceId}
                                        onChange={(e) => setSelectedServiceId(e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">Selecione um serviço...</option>
                                        {services.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-medium">Data do Atendimento <span className="text-danger">*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        required
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-medium d-block">
                                        Horário Disponíveis <span className="text-danger">*</span>
                                    </label>

                                    {!selectedServiceId || !selectedDate ? (
                                        <div className="alert alert-secondary py-2 mb-0 text-muted small">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Selecione o serviço e a data primeiro para ver os horários.
                                        </div>
                                    ) : loadingTimes ? (
                                        <div className="d-flex align-items-center gap-2 py-2 text-primary">
                                            <div className="spinner-border spinner-border-sm" role="status"></div>
                                            <span className="small">Buscando horários disponíveis...</span>
                                        </div>
                                    ) : availableTimes.length === 0 ? (
                                        <div className="alert alert-warning py-2 mb-0 small">
                                            <i className="bi bi-exclamation-triangle me-1"></i>
                                            Nenhum horário disponível para esta data.
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-wrap gap-2 mt-1">
                                            {availableTimes.map((time) => {
                                                const formattedTime = formatTimeDisplay(time);
                                                const isSelected = selectedTime === time;

                                                return (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-primary'
                                                            } rounded-3 px-3 py-2 fw-semibold d-flex flex-column align-items-center justify-content-center`}
                                                        style={{ minWidth: '90px', transition: 'all 0.15s ease-in-out' }}
                                                        onClick={() => setSelectedTime(time)}
                                                    >
                                                        <span className="fs-6">{formattedTime}</span>
                                                        <span className="small opacity-75" style={{ fontSize: '0.7rem' }}>
                                                            {isSelected ? 'Selecionado' : 'Disponível'}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-medium">Observações</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Preferências do cliente, observações, etc."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>

                                <div className="col-12 d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/admin/agendamentos')}
                                        disabled={submitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                        disabled={submitting || !selectedTime}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Salvando...
                                            </>
                                        ) : (
                                            'Confirmar Agendamento'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}