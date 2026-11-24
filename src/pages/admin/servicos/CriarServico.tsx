import { useState } from 'react';
import type { ServiceRequest } from '../../../types/service';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/form/Input';
import TextArea from '../../../components/form/TextArea';

interface CriarServicoProps {
    idModal: string;
    onSave: (data: ServiceRequest) => Promise<void>;
}

const formatarParaMoeda = (valor: number | string): string => {
    const apenasNumeros = String(valor).replace(/\D/g, '');
    if (!apenasNumeros) return '';
    
    const valorNumerico = Number(apenasNumeros) / 100;
    if (valorNumerico === 0) return '';

    return valorNumerico.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const converterParaNumero = (valorFormatado: string): number => {
    const apenasNumeros = valorFormatado.replace(/\D/g, '');
    return apenasNumeros ? Number(apenasNumeros) / 100 : 0;
};

export default function CriarServico({ idModal, onSave }: CriarServicoProps) {
    const [form, setForm] = useState<ServiceRequest>({
        name: '',
        description: '',
        price: 0,
        durationMinutes: 0,
        active: true,
    });

    const [precoExibicao, setPrecoExibicao] = useState('');
    const [loading, setLoading] = useState(false);

    const [validated, setValidated] = useState(false);

    const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const textoDigitado = e.target.value;
        const textoFormatado = formatarParaMoeda(textoDigitado);

        setPrecoExibicao(textoFormatado);
        setForm((prev) => ({
            ...prev,
            price: converterParaNumero(textoFormatado),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formElement = e.currentTarget;

        setValidated(true);

        if (!formElement.checkValidity()) {
            e.stopPropagation();
            return;
        }

        try {
            setLoading(true);
            await onSave(form);

            setForm({ name: '', description: '', price: 0, durationMinutes: 0, active: true });
            setPrecoExibicao('');
            setValidated(false);

            const modalElement = document.getElementById(idModal);
            const closeBtn = modalElement?.querySelector<HTMLButtonElement>('[data-bs-dismiss="modal"]');
            closeBtn?.click();
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal id={idModal} title="Novo Serviço">
            <form onSubmit={handleSubmit} noValidate className={validated ? "was-validated" : ""}>
                <Input
                    label="Nome"
                    margin="mb-3"
                    placeholder="Insira o nome do serviço, ex: Lash Design"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    errorFeedback="Insira o nome do serviço"
                />

                <TextArea
                    label="Descrição"
                    margin="mb-3"
                    placeholder="Insira a descrição do serviço"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                />

                <div className="row g-2 mb-3">
                    <div className="col-6">
                        <Input
                            label="Preço (R$)"
                            type="text"
                            placeholder="0,00"
                            value={precoExibicao}
                            onChange={handlePrecoChange}
                            required
                            errorFeedback="Insira o preço para o serviço"
                        />
                    </div>
                    <div className="col-6">
                        <Input
                            label="Duração (min)"
                            type="number"
                            min={1}
                            placeholder="60 minutos = 1 hora"
                            value={form.durationMinutes || ''}
                            onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                            required
                            errorFeedback="Insira uma duração válida (mínimo 1 min)"
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary text-white"
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}