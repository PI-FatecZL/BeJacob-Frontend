import { Link, useNavigate } from "react-router-dom";
import AuthBanner from "../../components/auth/AuthBanner";
import Input from "../../components/form/Input";
import InputSenha from "../../components/form/InputSenha";
import Alert from "../../components/ui/Alert";
import { useState, type FormEvent } from "react";
import { authService } from "../../services/authService";

export default function Register() {
    // definindo estados das informações do formulário
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const formatarTelefone = (valor: string): string => {
        const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);

        return apenasNumeros
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    };

    const [erro, setErro] = useState("");

    // gerenciador de navegação para uso das rotas definidas em AppRoutes
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const telefoneApenasNumeros = telefone.replace(/\D/g, "");

        try {
            await authService.register({
                name: nome,
                email: email,
                password: senha,
                phone: telefoneApenasNumeros
            });
            navigate("/")
        } catch (error) {
            console.error(error);
            setErro("Os dados inseridos estão inválidos. Tente novamente.");
        }
    }

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <AuthBanner />

                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className="card shadow rounded-4 border-0 p-4"
                        style={{ width: "100%", maxWidth: "450px" }}>
                        <div className="card-body">
                            <h2 className="text-center mb-4">Entrar</h2>

                            <form onSubmit={handleSubmit}>
                                <Alert mensagem={erro} />

                                <Input 
                                    label="Nome Completo"
                                    margin="mb-3"
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />

                                <Input 
                                    label="Telefone"
                                    margin="mb-3"
                                    type="tel"
                                    value={telefone}
                                    onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                                    required
                                />

                                <Input
                                    label="Email"
                                    margin="mb-3"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <InputSenha
                                    margin="mb-4"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
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