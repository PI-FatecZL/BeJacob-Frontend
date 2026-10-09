import { useMemo, useState } from "react";

// Colocar dados do banco correto
export interface ServicoOpcao {
    id: number;
    nome: string;
    preco: number;
    duracaoMinutos: number; 
}

export interface DadosAgendamento {
    servicoId: number;
    servico: string;
    data: string;
    horario: string;
    observacao: string;
}

interface Props {
    nomeUsuario: string;
    servicos: ServicoOpcao[];
    //  Confirmar os horários ocupados na data (Conferir se está certo)
    horariosOcupados?: (data: string) => string[];
    onSalvar: (dados: DadosAgendamento) => void;
    onCancelar: () => void;
}

const COR_PRIMARIA = "#4F694F";

// mesmos horários da tela administrativa
function gerarHorarios(): string[] {
    const lista: string[] = [];
    for (let h = 8; h <= 19; h++) {
        lista.push(`${String(h).padStart(2, "0")}:00`);
        lista.push(`${String(h).padStart(2, "0")}:30`);
    }
    return lista;
}

function formatarDuracao(min: number): string {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

export default function FormAgendamento({
    nomeUsuario,
    servicos,
    horariosOcupados,
    onSalvar,
    onCancelar,
}: Props) {
    const [servicoId, setServicoId] = useState<string>("");
    const [data, setData] = useState<string>("");
    const [horario, setHorario] = useState<string>("");
    const [observacao, setObservacao] = useState<string>("");

    const servicoSelecionado = servicos.find((s) => String(s.id) === servicoId);
    const horarios = useMemo(gerarHorarios, []);
    const ocupados = data && horariosOcupados ? horariosOcupados(data) : [];

    const hoje = new Date();
    const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(
        hoje.getDate()
    ).padStart(2, "0")}`;

    const podeSalvar = !!servicoSelecionado && !!data && !!horario;

    const handleData = (valor: string) => {
        setData(valor);
        setHorario("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!servicoSelecionado || !podeSalvar) return;
        onSalvar({
            servicoId: servicoSelecionado.id,
            servico: servicoSelecionado.nome,
            data,
            horario,
            observacao: observacao.trim(),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Nome do usuário só para confirmar?!?! */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Cliente</label>
                <input type="text" className="form-control" value={nomeUsuario} readOnly disabled />
            </div>

            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-semibold">
                        Serviço <span className="text-danger">*</span>
                    </label>
                    <select
                        className="form-select"
                        value={servicoId}
                        onChange={(e) => setServicoId(e.target.value)}
                    >
                        <option value="">Selecione um serviço</option>
                        {servicos.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold">
                        Data do Atendimento <span className="text-danger">*</span>
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        value={data}
                        min={hojeStr}
                        onChange={(e) => handleData(e.target.value)}
                    />
                </div>
            </div>

            {/* IDEIA: mostrar preço e tempo médio */}
            {servicoSelecionado && (
                <div
                    className="d-flex flex-wrap gap-4 rounded-3 px-3 py-2 mb-3"
                    style={{ backgroundColor: "#EEF2EE" }}
                >
                    <span>
                        <i className="bi bi-cash-coin me-2" style={{ color: COR_PRIMARIA }}></i>
                        <small className="text-muted">Preço: </small>
                        <strong>
                            {servicoSelecionado.preco.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </strong>
                    </span>
                    <span>
                        <i className="bi bi-clock me-2" style={{ color: COR_PRIMARIA }}></i>
                        <small className="text-muted">Tempo médio: </small>
                        <strong>{formatarDuracao(servicoSelecionado.duracaoMinutos)}</strong>
                    </span>
                </div>
            )}

            {/*IDEIA: o horario é para aparecer só aparece depois de escolher a data */}
            {data && (
                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        Horários Disponíveis <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                        {horarios.map((h) => {
                            const indisponivel = ocupados.includes(h);
                            const ativo = horario === h;
                            return (
                                <button
                                    key={h}
                                    type="button"
                                    disabled={indisponivel}
                                    onClick={() => setHorario(h)}
                                    className="btn d-flex flex-column align-items-center px-3 py-2"
                                    style={{
                                        minWidth: "88px",
                                        border: `1px solid ${indisponivel ? "#ced4da" : COR_PRIMARIA}`,
                                        backgroundColor: ativo ? COR_PRIMARIA : "#fff",
                                        color: ativo ? "#fff" : indisponivel ? "#adb5bd" : "#212529",
                                    }}
                                >
                                    <span className="fw-semibold">{h}</span>
                                    <small style={{ fontSize: "0.7rem", opacity: 0.8 }}>
                                        {indisponivel ? "Ocupado" : "Disponível"}
                                    </small>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mb-4">
                <label className="form-label fw-semibold">Observações</label>
                <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Preferências, observações, etc."
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                />
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: COR_PRIMARIA, opacity: podeSalvar ? 1 : 0.6 }}
                    disabled={!podeSalvar}
                >
                    Confirmar Agendamento
                </button>
            </div>
        </form>
    );
}