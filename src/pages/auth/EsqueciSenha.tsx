import { Link, useNavigate } from "react-router-dom";
import AuthBanner from "../../components/auth/AuthBanner";
import Input from "../../components/form/Input";
import Alert from "../../components/ui/Alert";
import { useEffect, useState, type FormEvent } from "react";
import { passwordResetService } from "../../services/passwordResetService";

export default function EsqueciSenha() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [validated, setValidated] = useState(false);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [enviado, setEnviado] = useState(false);

    // Redireciona apenas após sucesso. Erros permanecem visíveis até a pessoa agir.
    useEffect(() => {
        if (!enviado) return;

        const timer = window.setTimeout(() => {
            navigate("/login");
        }, 10000);

        return () => window.clearTimeout(timer);
    }, [enviado, navigate]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        setValidated(true);

        if (!form.checkValidity()) {
            e.stopPropagation();
            return;
        }

        // Limpa mensagens anteriores apenas quando a pessoa tenta novamente.
        setErro("");
        setEnviado(false);
        setCarregando(true);

        try {
            await passwordResetService.requestReset({ email: email.trim() });
            // O HTTP 200 não confirma entrega nem existência da conta.
            setEnviado(true);
        } catch {
            setErro("Não foi possível solicitar o link agora. Tente novamente em instantes.");
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
                            <h2 className="text-center mb-3">Esqueceu sua senha?</h2>
                            <p className="text-center text-secondary mb-4">
                                Informe o e-mail cadastrado e enviaremos um link para você criar uma nova senha.
                            </p>

                            {/* Sucesso: confirmação e retorno ao login em 10 segundos. */}
                            {enviado && (
                                <div className="alert alert-success" role="status" aria-live="polite">
                                    <strong>Verifique seu e-mail!</strong>
                                    <p className="mb-1 mt-2">
                                        Se o endereço informado estiver cadastrado, você receberá um link para redefinir sua senha.
                                    </p>
                                    <p className="mb-1">Confira também a caixa de spam ou lixo eletrônico.</p>
                                    <p className="mb-0 small">Você voltará ao login em 10 segundos.</p>
                                </div>
                            )}

                            <Alert mensagem={erro} />

                            <form onSubmit={handleSubmit} noValidate className={validated ? "was-validated" : ""}>
                                <Input
                                    label="E-mail"
                                    margin="mb-4"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={carregando}
                                    errorFeedback="Insira um e-mail válido"
                                />

                                <button type="submit" className="btn btn-primary w-100 fw-medium" disabled={carregando}>
                                    {carregando ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                            Enviando...
                                        </>
                                    ) : (
                                        "Enviar link de recuperação"
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <Link to="/login" className="text-decoration-none">Voltar ao login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
