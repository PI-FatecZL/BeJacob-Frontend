import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import PublicRoute from './PublicRoute';

export default function AppRoutes() {
    return (
        <Routes>
            <Route
                path={"/"}
                element={
                    <PublicRoute>
                        <LandingPage />
                    </PublicRoute>
                }
            />

            <Route
                path={"/login"}
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            <Route
                path={"/register"}
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />
        </Routes>
    );
}