import type { AppointmentResponse } from '../../../types/appointment';
import Modal from '../../../components/ui/Modal';

interface ResumoAgendamentoProps {
    idModal: string;
    appointment: AppointmentResponse | null;
}

export default function ResumoAgendamento({ idModal, appointment }: ResumoAgendamentoProps) {
    if (!appointment) return null;

    // função para traduzir status do agendamento
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'Agendado';
            case 'COMPLETED': return 'Concluído';
            case 'CANCELED': return 'Cancelado';
            case 'NO_SHOW': return 'Não Compareceu';
            default: return status;
        }
    };

    // função para associar cor com status
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'bg-primary';
            case 'COMPLETED': return 'bg-success';
            case 'CANCELED': return 'bg-danger';
            case 'NO_SHOW': return 'bg-warning text-dark';
            default: return 'bg-secondary';
        }
    };

    const getPaymentMethodLabel = (paymentMethod: string) => {
        switch (paymentMethod) {
            case 'CREDIT': return 'Cartão de Crédito';
            case 'PIX': return 'PIX';
            case 'DEBIT': return 'Cartão de Débito';
            case 'CASH': return 'Dinheiro';
            default: return status;
        }
    };

    // função para formatar data e hora
    const formatDateTime = (isoString?: string) => {
        if (!isoString) return '-';
        try {
            const date = new Date(isoString);
            return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        } catch {
            return isoString;
        }
    };

    // função para formatar telefone
    const formatPhone = (phone?: string) => {
        if (!phone) return 'Sem telefone';
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length === 11) {
            return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        }
        if (numbers.length === 10) {
            return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        }
        return phone;
    };

    return (
        <Modal id={idModal} title={`Detalhes do Agendamento #${appointment.id}`}>
            <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                    <span className="text-muted small fw-medium text-uppercase">Status do Agendamento</span>
                    <span className={`badge ${getStatusBadgeClass(appointment.status)} px-3 py-2 fs-6`}>
                        {getStatusLabel(appointment.status)}
                    </span>
                </div>

                <div className="p-3 bg-light rounded-3 border">
                    <h6 className="text-primary mb-2 d-flex align-items-center gap-2">
                        <i className="bi bi-person"></i> Cliente
                    </h6>
                    <div className="fw-semibold text-dark">{appointment.user.name}</div>
                    <div className="small text-muted">{formatPhone(appointment.user.phone)}</div>
                    <div className="small text-muted">{appointment.user.email}</div>
                </div>

                <div className="p-3 bg-light rounded-3 border">
                    <h6 className="text-primary mb-2 d-flex align-items-center gap-2">
                        <i className="bi bi-scissors"></i> Serviço
                    </h6>
                    <div className="fw-semibold text-dark">{appointment.service.name}</div>
                    {appointment.service.price !== undefined && (
                        <div className="small text-muted">
                            Preço: {appointment.service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                    )}
                </div>

                <div className="p-3 bg-light rounded-3 border">
                    <h6 className="text-primary mb-2 d-flex align-items-center gap-2">
                        <i className="bi bi-cash"></i> Forma de Pagamento
                    </h6>
                    <div className="fw-semibold text-dark">{getPaymentMethodLabel(appointment.paymentMethod)}</div>
                </div>

                <div className="row g-2">
                    <div className="col-6">
                        <div className="p-2 border rounded text-center">
                            <span className="d-block small text-muted">Início</span>
                            <span className="fw-medium text-dark">{formatDateTime(appointment.startsAt)}</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-2 border rounded text-center">
                            <span className="d-block small text-muted">Término Previsto</span>
                            <span className="fw-medium text-dark">{formatDateTime(appointment.endsAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-3 border rounded-3">
                    <h6 className="text-muted small fw-medium mb-1">Observações / Notas</h6>
                    <p className="m-0 small text-dark text-break">
                        {appointment.notes ? appointment.notes : 'Nenhuma observação registrada.'}
                    </p>
                </div>

                <div className="d-flex justify-content-end mt-2">
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        data-bs-dismiss="modal"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </Modal>
    );
}