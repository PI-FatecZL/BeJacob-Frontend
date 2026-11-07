import { Link, useParams } from "react-router-dom";
import AuthBanner from "../../components/auth/AuthBanner";
import InputSenha from "../../components/form/InputSenha";
import PasswordRequirements from "../../components/form/PasswordRequirements";
import Alert from "../../components/ui/Alert";
import { useState, type FormEvent } from "react";
import { passwordResetService, TokenRedefinicaoInvalidoError } from "../../services/passwordResetService";
import { escaparRegex } from "../../utils/escaparRegex";

const PADRAO_SENHA = "^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$";
const MENSAGEM_SENHA = "Sua senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial.";

type StatusTela = "formulario" | "sucesso" | "tokenInvalido";

export default function RedefinirSenha() {

    const { token } = useParams<{ token: string }>();

    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [validated, setValidated] = useState(false);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [status, setStatus] = useState<StatusTela>(token ? "formulario" : "tokenInvalido");

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
            setSenha("");
            setConfirmarSenha("");
            setStatus("sucesso");
        } catch (error) {
            if (error instanceof TokenRedefinicaoInvalidoError) {
                setStatus("tokenInvalido");
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
