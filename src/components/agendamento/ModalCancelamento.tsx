import { useState } from 'react';

interface ModalCancelamentoProps {
    id: string;
    titulo: string;
    onConfirmar: (motivo: string) => void;
}

export function ModalCancelamento({
    id,
    titulo,
    onConfirmar,
}: ModalCancelamentoProps) {
    const [motivo, setMotivo] = useState('');

    const handleConfirmar = () => {
        onConfirmar(motivo);
        setMotivo(''); // Limpa o campo após confirmar
    };

    return (
        <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-body p-4">
                        <div
                            className="mx-auto mb-3 text-danger bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "60px", height: "60px" }}
                        >
                            <i className="bi bi-exclamation-circle fs-3"></i>
                        </div>

                        <h5 className="fw-bold text-dark text-center mb-3">{titulo}</h5>

                        <div className="mb-4">
                            <label htmlFor="motivoCancelamento" className="form-label small fw-medium text-secondary">
                                Motivo do Cancelamento
                            </label>
                            <textarea
                                id="motivoCancelamento"
                                className="form-box form-control rounded-3"
                                rows={3}
                                placeholder="Digite o motivo aqui..."
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="d-flex justify-content-center gap-2">
                            <button
                                type="button"
                                className="btn btn-light rounded-3 px-4 fw-medium text-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => setMotivo('')}
                            >
                                Voltar
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger rounded-3 px-4 fw-medium text-white"
                                data-bs-dismiss="modal"
                                onClick={handleConfirmar}
                                disabled={!motivo.trim()} // Opcional: desativa se estiver vazio
                            >
                                Confirmar Cancelamento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalCancelamento;
