import { useState } from 'react';
import type { ServiceRequest } from '../../../types/service';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/form/Input';
import TextArea from '../../../components/form/TextArea';
import Checkbox from '../../../components/form/Checkbox';

interface CriarServicoProps {
    idModal: string;
    onSave: (data: ServiceRequest) => Promise<void>;
}

// Converte número em formato visual "1.250,50"
const formatarParaMoeda = (valor: number | string): string => {
    const apenasNumeros = String(valor).replace(/\D/g, '');
    if (!apenasNumeros) return '';
    const valorNumerico = Number(apenasNumeros) / 100;
    return valorNumerico.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// Converte string "1.250,50" de volta para number (1250.5)
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
    
    // Estado para controlar a exibição do texto no input de preço
    const [precoExibicao, setPrecoExibicao] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const textoDigitado = e.target.value;
        const textoFormatado = formatarParaMoeda(textoDigitado);
        
        setPrecoExibicao(textoFormatado);
        setForm((prev) => ({
            ...prev,
            price: converterParaNumero(textoFormatado),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            await onSave(form);
            
            // Reseta o formulário e a exibição do preço
            setForm({ name: '', description: '', price: 0, durationMinutes: 0, active: true });
            setPrecoExibicao('');

            // Fecha o modal
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
            <form onSubmit={handleSubmit}>
                <Input
                    label="Nome"
                    margin="mb-3"
                    placeholder="Insira o nome do serviço, ex: Lash Design"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
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
                        />
                    </div>
                    <div className="col-6">
                        <Input
                            label="Duração (min)"
                            type="number"
                            placeholder="60 minutos = 1 hora"
                            value={form.durationMinutes || ''}
                            onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                            required
                        />
                    </div>
                </div>

                <Checkbox
                    id="criarAtivoCheck"
                    label="Ativo"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />

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