import { Link, useNavigate } from "react-router-dom";
import AuthBanner from "../../components/auth/AuthBanner";
import Input from "../../components/form/Input";
import InputSenha from "../../components/form/InputSenha";
import Alert from "../../components/ui/Alert";
import { useState, type FormEvent } from "react";
import { authService } from "../../services/authService";
import { isAxiosError } from "axios";

// O back-end responde HTTP 400 (InvalidCredentialsException) quando e-mail ou senha estão incorretos.
// Como o formulário já valida campos obrigatórios e formato de e-mail antes de enviar, um 400 aqui
// não vem de validação de DTO. Falha de conexão (sem resposta) e erros 5xx NÃO são credenciais inválidas.
const credenciaisInvalidas = (error: unknown): boolean => {
    return isAxiosError(error) && error.response?.status === 400;
};

const mensagemErroNaoCredenciais = (error: unknown): string => {
    if (isAxiosError(error) && !error.response) {
        return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
    }

    if (isAxiosError(error) && (error.response?.status ?? 0) >= 500) {
        return "O servidor está indisponível no momento. Tente novamente em instantes.";
    }

    return "Não foi possível entrar agora. Tente novamente em instantes.";
};

export default function Login() {
    // definindo estados das informações do formulário
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [validated, setValidated] = useState(false);
    const [erro, setErro] = useState("");

    // o link "Esqueci minha senha?" só aparece depois da primeira tentativa com credenciais inválidas
    // e continua visível nas tentativas seguintes (nunca volta a ser ocultado nesta página)
    const [mostrarEsqueciSenha, setMostrarEsqueciSenha] = useState(false);

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

        // limpa a mensagem da tentativa anterior para não exibir um erro desatualizado
        setErro("");

        try {
            await authService.login({
                email: email,
                password: senha
            });
            navigate("/admin/dashboard");
        } catch (error) {
            console.error(error);

            if (credenciaisInvalidas(error)) {
                setErro("E-mail ou senha inválidos. Tente novamente.");
                setMostrarEsqueciSenha(true);
            } else {
                // erro de conexão ou do servidor: mostra a mensagem, mas não revela o link
                setErro(mensagemErroNaoCredenciais(error));
            }
        }
    }

    return(
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <AuthBanner />

                <div className="col-md-6 d-flex justify-content-center align-items-center">
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
                                    margin={mostrarEsqueciSenha ? "mb-2" : "mb-4"}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    errorFeedback="Insira sua senha"
                                />

                                {mostrarEsqueciSenha && (
                                    <div className="text-end mb-4">
                                        <Link to="/esqueci-senha" className="text-decoration-none small">
                                            Esqueci minha senha?
                                        </Link>
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary w-100 fw-medium">Entrar</button>
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