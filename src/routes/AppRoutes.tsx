import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import EsqueciSenha from '../pages/auth/EsqueciSenha';
import RedefinirSenha from '../pages/auth/RedefinirSenha';
import PrivateRoute from './PrivateRoute';
import SolicitarAgendamento from '../pages/SolicitarAgendamento';
import MinhaConta from '../pages/MinhaConta';
import Dashboard from '../pages/admin/Dashboard';
import NotFound from '../pages/NotFound';
import Servicos from '../pages/admin/servicos/Servicos';
import Clientes from '../pages/admin/clientes/Clientes';
import Agendamentos from '../pages/admin/agendamentos/Agendamentos';
import NovoAgendamento from '../pages/admin/agendamentos/NovoAgendamento';
import EditarAgendamento from '../pages/admin/agendamentos/EditarAgendamento';
import Notificacoes from '../pages/admin/Notificacoes';
import Configuracoes from '../pages/admin/Configuracoes';
import AlterarSenha from '../pages/auth/AlterarSenha';

export default function AppRoutes() {
    return (
        <Routes>
            <Route
                path={"/"}
                element={
                    <LandingPage />
                }
            />

            <Route
                path={"/login"}
                element={
                    <Login />
                }
            />

            <Route
                path={"/register"}
                element={
                    <Register />
                }
            />

            <Route
                path={"/esqueci-senha"}
                element={
                    <EsqueciSenha />
                }
            />

            <Route
                path={"/redefinir-senha"}
                element={
                    <RedefinirSenha />
                }
            />

            <Route
                path={"/solicitar-agendamento"}
                element={
                    <PrivateRoute>
                        <SolicitarAgendamento />
                    </PrivateRoute>
                }
            />

            <Route
                path={"/minha-conta"}
                element={
                    <PrivateRoute>
                        <MinhaConta />
                    </PrivateRoute>
                }
            />

            <Route
                path={"/alterar-senha"}
                element={
                    <PrivateRoute>
                        <AlterarSenha />
                    </PrivateRoute>
                }
            />

            <Route
                path={"/admin/dashboard"}
                element={
                    <PrivateRoute requiredRole="ADMIN">
                        <Dashboard />
                    </PrivateRoute>
                }
            />

            <Route
                path={"/admin/servicos"}
                element={
                    <PrivateRoute requiredRole="ADMIN">
                        <Servicos />
                    </PrivateRoute>
                }
            />

            <Route
                path={"/admin/clientes"}
                element={
                    <PrivateRoute requiredRole="ADMIN">
                        <Clientes />
                    </PrivateRoute>
                }
            />

            <Route
                path={"/admin/agendamentos"}
                element={
                    <PrivateRoute requiredRole="ADMIN">
                        <Agendamentos />
                    </PrivateRoute>
                }
            />

            <Route
                path={"/admin/notificacoes"}
                element={
                    <PrivateRoute requiredRole="ADMIN">
                        <Notificacoes />
                    </PrivateRoute>
                }
            />

            <Route
                path={"/admin/configuracoes"}
                element={
                    <PrivateRoute requiredRole="ADMIN">
                        <Configuracoes />
                    </PrivateRoute>
                }
            />

            <Route
                path={"/admin/agendamentos/novo"}
                element={
                    <PrivateRoute requiredRole="ADMIN">
                        <NovoAgendamento />
                    </PrivateRoute>
                }
            />

            <Route
                path={"/admin/agendamentos/editar/:id"}
                element={
                    <PrivateRoute requiredRole="ADMIN">
                        <EditarAgendamento />
                    </PrivateRoute>
                }
            />

            <Route
                path={"*"}
                element={
                    <NotFound />
                }
            />
        </Routes>
    );
}
