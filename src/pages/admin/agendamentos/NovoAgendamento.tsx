import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { appointmentService } from '../../../services/appointmentService';
import { userService } from '../../../services/userService';
import { serviceService } from '../../../services/serviceService';
import Select from '../../../components/form/Select';
import Input from '../../../components/form/Input';
import TextArea from '../../../components/form/TextArea';

// interface genérica para determinar itens em um select 
interface OptionItem {
    id: number;
    name: string;
}

export default function NovoAgendamento() {
    const navigate = useNavigate();

    const [users, setUsers] = useState<OptionItem[]>([]);
    const [services, setServices] = useState<OptionItem[]>([]);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    const serviceOptions = services.map((s) => ({
        label: s.name,
        value: s.id
    }));

    const userOptions = users.map((u) => ({
        label: u.name,
        value: u.id
    }));

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

    // carregar dados nos selects
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

    // carregar horários disponíveis para o agendamento
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

    // função para formatar horários disponíveis no padrão HH:mm
    const formatTimeDisplay = (timeString: string) => {
        if (!timeString) return '';
        return timeString.substring(0, 5);
    };

    // função para cadastrar o agendamento como administrador
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

    // função para buscar a data de hoje e restringir datas anteriores
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <DashboardLayout>
            <div className="bg-white rounded-3 shadow-sm mb-5">
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
                            <p className="text-muted small mt-2">Carregando informações...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-12">
                                    <Select
                                        label="Cliente"
                                        required
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : "")}
                                        placeholder="Selecione um cliente..."
                                        options={userOptions}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <Select
                                        label="Serviço"
                                        required
                                        value={selectedServiceId}
                                        onChange={(e) => setSelectedServiceId(e.target.value ? Number(e.target.value) : "")}
                                        placeholder="Selecione um serviço..."
                                        options={serviceOptions}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <Input
                                        label="Data do Atendimento"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={getTodayDateString()}
                                        required
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label text-primary fw-medium d-block">
                                        Horários Disponíveis
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
                                    <TextArea
                                        label="Observações do atendimento (opcional)"
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
                                        Voltar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                        disabled={submitting || !selectedTime}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Confirmando...
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