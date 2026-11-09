import { Link, useNavigate } from "react-router-dom";
import AuthBanner from "../../components/auth/AuthBanner";
import Input from "../../components/form/Input";
import InputSenha from "../../components/form/InputSenha";
import Alert from "../../components/ui/Alert";
import { useState, type FormEvent } from "react";
import { authService } from "../../services/authService";
import { isAxiosError } from "axios";

export default function Login() {
    // definindo estados das informações do formulário
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [validated, setValidated] = useState(false);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    // gerenciador de navegação para uso das rotas definidas em AppRoutes
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        setValidated(true);

        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        setErro("");
        setCarregando(true);

        try {
            await authService.login({ email: email.trim(), password: senha });
            navigate("/admin/dashboard");
        } catch (error) {
            // O back-end usado nos testes retorna 400 para credenciais inválidas.
            // Não mostramos recuperação em falhas de rede ou erros de servidor.
            const credenciaisInvalidas = isAxiosError(error) &&
                (error.response?.status === 400 || error.response?.status === 401);

            if (credenciaisInvalidas) {
                setErro("E-mail ou senha inválidos. Tente novamente.");
            } else {
                setErro("Não foi possível entrar agora. Tente novamente em instantes.");
            }
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="container-fluid vh-100 auth-banner-bg bg-md-white">
            <div className="row h-100">
                <AuthBanner />

                <div className="col-md-6 d-flex justify-content-center align-items-center h-100 bg-md-white">
                    <div className="card shadow rounded-4 border-0 p-4"
                        style={{ width: "100%", maxWidth: "450px" }}>
                        <div className="card-body">
                            <h2 className="text-center mb-4">Entrar</h2>

                            <form onSubmit={handleSubmit} noValidate className={validated ? "was-validated" : ""}>
                                <Alert mensagem={erro} />

                                <Input
                                    label="E-mail"
                                    margin="mb-3"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    errorFeedback="Insira seu e-mail"
                                />

                                <InputSenha
                                    margin="mb-2"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    errorFeedback="Insira sua senha"
                                />

                                <div className="text-end mb-4">
                                    <Link to="/esqueci-senha" className="text-decoration-none small">
                                        Esqueci minha senha?
                                    </Link>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 fw-medium" disabled={carregando}>
                                    {carregando ? "Entrando..." : "Entrar"}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <span>Não possui conta?</span>

                                <br />

                                <Link to="/register" className="text-decoration-none">
                                    Cadastre-se
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
