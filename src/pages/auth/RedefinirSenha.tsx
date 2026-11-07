import { Link, useSearchParams } from "react-router-dom";
import AuthBanner from "../../components/auth/AuthBanner";
import InputSenha from "../../components/form/InputSenha";
import PasswordRequirements from "../../components/form/PasswordRequirements";
import Alert from "../../components/ui/Alert";
import { useEffect, useState, type FormEvent } from "react";
import {
    passwordResetService,
    SenhaRejeitadaError,
    RequisicaoRedefinicaoInvalidaError,
    TokenRedefinicaoInvalidoError
} from "../../services/passwordResetService";
import { escaparRegex } from "../../utils/escaparRegex";

// Regra de senha exigida pelo back-end: mínimo de 8 caracteres, uma letra maiúscula e um
// caractere especial da lista abaixo (a mesma regex do Java, adaptada para o atributo `pattern`).
// Por isso, `( ) [ ] { } | / - \` aparecem escapados dentro dos colchetes: o navegador compila o
// `pattern` no modo "v", que exige isso. Em Java (e no modo "u") esses escapes também são válidos.
// String.raw evita ter de duplicar cada barra invertida.
const PADRAO_SENHA = String.raw`^(?=.*[A-Z])(?=.*[!@#$%^&*\(\)_+\-=\[\]\{\};':"\\\|,.<>\/?]).{8,}$`;
const MENSAGEM_SENHA = "Sua senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial: ! @ # $ % ^ & * ( ) _ + - = [ ] { } ; ' : \" \\ | , . < > / ?";

type StatusTela = "validando" | "formulario" | "tokenInvalido" | "erroServidor" | "sucesso";

export default function RedefinirSenha() {
    // token recebido no link do e-mail (/redefinir-senha?token=TOKEN)
    // Não é salvo em localStorage nem enviado a logs pela tela; permanece na URL até a navegação.
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    // definindo estados das informações do formulário
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [validated, setValidated] = useState(false);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    // sem token na URL o link é inválido; com token, ele precisa ser validado antes de mostrar o formulário
    const [status, setStatus] = useState<StatusTela>(token ? "validando" : "tokenInvalido");
    const [tentativa, setTentativa] = useState(0);

    // validação antecipada: o formulário só aparece depois que o back-end confirma que o token é válido
    useEffect(() => {
        if (!token) return;

        const controller = new AbortController();

        const validarToken = async () => {
            try {
                await passwordResetService.validateResetToken(token, controller.signal);
                setStatus("formulario");
            } catch (error) {
                // requisição cancelada (a tela foi fechada ou a validação reiniciada): nada a mostrar
                if (controller.signal.aborted) return;

                // não registramos o erro no console para não expor o token
                setStatus(error instanceof TokenRedefinicaoInvalidoError ? "tokenInvalido" : "erroServidor");
            }
        };

        validarToken();

        return () => controller.abort();
    }, [token, tentativa]);

    const tentarNovamente = () => {
        setStatus("validando");
        setTentativa((n) => n + 1);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        setValidated(true);

        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        if (!token) {
            setStatus("tokenInvalido");
            return;
        }

        setErro("");
        setCarregando(true);

        try {
            await passwordResetService.resetPassword({ token: token, newPassword: senha });
            // as senhas não ficam guardadas depois do envio
            setSenha("");
            setConfirmarSenha("");
            setStatus("sucesso");
        } catch (error) {
            // não registramos o erro no console para não expor o token
            if (error instanceof TokenRedefinicaoInvalidoError) {
                setStatus("tokenInvalido");
            } else if (error instanceof SenhaRejeitadaError) {
                // o formulário continua aberto para o usuário corrigir a senha
                setErro("Não foi possível redefinir a senha. Confira os requisitos e se ela é diferente da senha atual.");
            } else if (error instanceof RequisicaoRedefinicaoInvalidaError) {
                setErro("Não foi possível concluir a redefinição. Confira os dados ou solicite outro link de recuperação.");
            } else {
                setErro("Não foi possível redefinir sua senha agora. Tente novamente em instantes.");
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <AuthBanner />

                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className="card shadow rounded-4 border-0 p-4"
                        style={{ width: "100%", maxWidth: "450px" }}>
                        <div className="card-body">
                            {status === "sucesso" && (
                                <div className="text-center" role="status">
                                    <i className="bi bi-check-circle-fill text-success display-4"></i>

                                    <h2 className="mt-3 mb-3">Senha redefinida!</h2>

                                    <p className="text-secondary">
                                        Sua senha foi alterada com sucesso. Agora você já pode entrar com a nova senha.
                                    </p>

                                    <Link to="/login" className="btn btn-primary w-100 fw-medium mt-2">
                                        Ir para o login
                                    </Link>
                                </div>
                            )}

                            {status === "tokenInvalido" && (
                                <div className="text-center" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill text-danger display-4"></i>

                                    <h2 className="mt-3 mb-3">Link inválido ou expirado</h2>

                                    <p className="text-secondary">
                                        Este link de redefinição não é mais válido. Solicite um novo link para continuar.
                                    </p>

                                    <Link to="/esqueci-senha" className="btn btn-primary w-100 fw-medium mt-2">
                                        Solicitar novo link
                                    </Link>

                                    <div className="mt-3">
                                        <Link to="/login" className="text-decoration-none">
                                            Voltar ao login
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {status === "validando" && (
                                <div className="text-center py-3" role="status">
                                    <div className="spinner-border text-primary mb-3" aria-hidden="true"></div>

                                    <p className="text-secondary mb-0">Validando seu link...</p>
                                </div>
                            )}

                            {status === "erroServidor" && (
                                <div className="text-center" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill text-warning display-4"></i>

                                    <h2 className="mt-3 mb-3">Não foi possível verificar o link</h2>

                                    <p className="text-secondary">
                                        Ocorreu um problema de conexão ou no servidor. Tente novamente em instantes.
                                    </p>

                                    <button
                                        type="button"
                                        className="btn btn-primary w-100 fw-medium mt-2"
                                        onClick={tentarNovamente}
                                    >
                                        Tentar novamente
                                    </button>

                                    <div className="mt-3">
                                        <Link to="/login" className="text-decoration-none">
                                            Voltar ao login
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {status === "formulario" && (
                                <>
                                    <h2 className="text-center mb-4">Redefinir senha</h2>

                                    <form onSubmit={handleSubmit} noValidate className={validated ? "was-validated" : ""}>
                                        <Alert mensagem={erro} />

                                        <InputSenha
                                            label="Nova senha"
                                            margin="mb-2"
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            required
                                            disabled={carregando}
                                            pattern={PADRAO_SENHA}
                                            errorFeedback={MENSAGEM_SENHA}
                                        />

                                        <PasswordRequirements senha={senha} />

                                        <InputSenha
                                            label="Confirmar nova senha"
                                            margin="mb-4"
                                            value={confirmarSenha}
                                            onChange={(e) => setConfirmarSenha(e.target.value)}
                                            required
                                            disabled={carregando}
                                            pattern={`^${escaparRegex(senha)}$`}
                                            errorFeedback="As senhas informadas não são iguais."
                                        />

                                        <button type="submit" className="btn btn-primary w-100 fw-medium" disabled={carregando}>
                                            {carregando ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                                    Redefinindo...
                                                </>
                                            ) : (
                                                "Redefinir senha"
                                            )}
                                        </button>
                                    </form>

                                    <div className="text-center mt-3">
                                        <Link to="/login" className="text-decoration-none">
                                            Voltar ao login
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
