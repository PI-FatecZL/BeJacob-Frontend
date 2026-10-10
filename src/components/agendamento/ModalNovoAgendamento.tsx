import { useEffect } from "react";
import FormAgendamento, {
    type DadosAgendamento,
    type ServicoOpcao,
} from "./Agendamento";

interface Props {
    nomeUsuario: string;
    servicos: ServicoOpcao[];
    horariosOcupados?: (data: string) => string[]; 
    onSalvar: (dados: DadosAgendamento) => void;
    onFechar: () => void;
}

export default function ModalNovoAgendamento({
    nomeUsuario,
    servicos,
    horariosOcupados,
    onSalvar,
    onFechar,
}: Props) {
    useEffect(() => {
        const aoPressionar = (e: KeyboardEvent) => {
            if (e.key === "Escape") onFechar();
        };
        document.addEventListener("keydown", aoPressionar);
        return () => document.removeEventListener("keydown", aoPressionar);
    }, [onFechar]);

    return (
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />

            <div
                className="modal fade show d-block"
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-novo-agendamento"
                style={{ zIndex: 1050 }}
                onClick={onFechar}
            >
                <div
                    className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content border-0 rounded-4 overflow-hidden">
                        <div
                            className="modal-header text-white border-0"
                            style={{ backgroundColor: "#4F694F" }}
                        >
                            <h5 className="modal-title fw-bold" id="titulo-novo-agendamento">
                                <i className="bi bi-calendar-plus me-2"></i>
                                Novo Agendamento
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                aria-label="Fechar"
                                onClick={onFechar}
                            />
                        </div>

                        <div className="modal-body p-4">
                            {/* Cancelar do formulário também fecha o modal */}
                            <FormAgendamento
                                nomeUsuario={nomeUsuario}
                                servicos={servicos}
                                horariosOcupados={horariosOcupados}
                                onSalvar={onSalvar}
                                onCancelar={onFechar}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}