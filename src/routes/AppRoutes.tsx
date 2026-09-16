import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import PrivateRoute from './PrivateRoute';
import SolicitarAgendamento from '../pages/SolicitarAgendamento';
import MinhaConta from '../pages/MinhaConta';

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
        </Routes>
    );
}