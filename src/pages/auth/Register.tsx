import { Link, useNavigate } from "react-router-dom";
import AuthBanner from "../../components/auth/AuthBanner";
import Input from "../../components/form/Input";
import InputSenha from "../../components/form/InputSenha";
import Alert from "../../components/ui/Alert";
import { useState, type FormEvent } from "react";
import { authService } from "../../services/authService";
import PasswordRequirements from "../../components/form/PasswordRequirements";

export default function Register() {
    // definindo estados das informações do formulário
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [validated, setValidated] = useState(false);
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    const formatarTelefone = (valor: string): string => {
        const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
        return apenasNumeros
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    };

    const escaparRegex = (texto: string) => {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        setValidated(true);

        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        const telefoneApenasNumeros = telefone.replace(/\D/g, "");

        try {
            await authService.register({
                name: nome,
                email: email,
                password: senha,
                phone: telefoneApenasNumeros
            });
            navigate("/");
        } catch (error) {
            console.error(error);
            setErro("Os dados inseridos estão inválidos. Tente novamente.");
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
                            <h2 className="text-center mb-4">Cadastro</h2>

                            <form onSubmit={handleSubmit} noValidate className={validated ? "was-validated" : ""}>
                                <Alert mensagem={erro} />

                                <Input
                                    label="Nome Completo"
                                    margin="mb-3"
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                    errorFeedback="Preencha esse campo"
                                />

                                <Input
                                    label="Telefone"
                                    margin="mb-3"
                                    type="tel"
                                    value={telefone}
                                    onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                                    required
                                    pattern="^\(\d{2}\)\s\d{5}-\d{4}$"
                                    errorFeedback="Insira um telefone celular válido."
                                />

                                <Input
                                    label="E-mail"
                                    margin="mb-3"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    errorFeedback="Insira um email válido"
                                />

                                <InputSenha
                                    label="Senha"
                                    margin="mb-2"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                    pattern="^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$"
                                    errorFeedback="Sua senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial."
                                />

                                <PasswordRequirements senha={senha} />

                                <InputSenha
                                    label="Confirmar Senha"
                                    margin="mb-4"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    required
                                    pattern={`^${escaparRegex(senha)}$`}
                                    errorFeedback="As senhas informadas não são iguais."
                                />

                                <button type="submit" className="btn btn-primary w-100 fw-medium">Cadastrar</button>
                            </form>

                            <div className="text-center mt-3">
                                <span>Já possui uma conta?</span>
                                <br />
                                <Link to="/login" className="text-decoration-none">
                                    Fazer login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}