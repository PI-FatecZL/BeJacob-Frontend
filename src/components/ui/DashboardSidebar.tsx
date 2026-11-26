import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import type { UserResponse } from '../../types/user';
import NotificationIcon from './NotificationIcon';

export default function DashboardSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<UserResponse | null>(null);

    useEffect(() => {
        let isMounted = true;

        authService.getMe()
            .then((user) => {
                if (isMounted) {
                    setUsuario(user);
                }
            })
            .catch((error) => {
                console.error('Não foi possível carregar o usuário logado:', error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const userName = usuario?.name ?? 'Usuário';
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=ffffff&color=4F694F&bold=true&size=128`;

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const getLinkClass = (path: string) => {
        if (location.pathname === path) {
            return 'bg-white text-primary fw-bold';
        }

        return 'text-white opacity-75 opacity-100-hover';
    };

    return (
        <>
            {/* SIDEBAR DESKTOP */}
            <div
                className="d-none d-lg-flex flex-column flex-shrink-0 p-3 text-white bg-primary"
                style={{
                    width: '280px',
                    minWidth: '280px',
                    height: '100vh',
                    position: 'sticky',
                    top: 0
                }}
            >
                {/* Logo / Nome */}
                <Link
                    to="/admin/dashboard"
                    className="d-flex flex-column align-items-start mb-3 text-white text-decoration-none"
                >
                    <span className="fs-4 fw-bold">
                        Be Jacob Beauty Studio
                    </span>
                    <span className="small">
                        Sistema Administrativo
                    </span>
                </Link>

                <hr />

                {/* Navegação */}
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link
                            to="/admin/dashboard"
                            className={`nav-link text-start px-3 py-2 ${getLinkClass('/admin/dashboard')}`}
                        >
                            <i className="bi bi-speedometer2 me-2"></i>
                            Geral
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/agendamentos"
                            className={`nav-link text-start px-3 py-2 ${getLinkClass('/admin/agendamentos')}`}
                        >
                            <i className="bi bi-table me-2"></i>
                            Agendamentos
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/servicos"
                            className={`nav-link text-start px-3 py-2 ${getLinkClass('/admin/servicos')}`}
                        >
                            <i className="bi bi-grid me-2"></i>
                            Serviços
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/clientes"
                            className={`nav-link text-start px-3 py-2 ${getLinkClass('/admin/clientes')}`}
                        >
                            <i className="bi bi-people me-2"></i>
                            Clientes
                        </Link>
                    </li>
                </ul>

                <hr />

                {/* Notificações e Perfil */}
                <div className="d-flex align-items-center justify-content-between">
                    {/* Dropdown do usuário */}
                    <div className="dropdown">
                        <a
                            href="#/"
                            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                            id="dropdownUser1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img
                                src={avatarUrl}
                                alt="Foto do usuário"
                                width="32"
                                height="32"
                                className="rounded-circle me-2"
                            />

                            <strong>{userName}</strong>
                        </a>

                        <ul
                            className="dropdown-menu dropdown-menu-dark text-small shadow"
                            aria-labelledby="dropdownUser1"
                        >
                            <li>
                                <Link className="dropdown-item" to="/admin/meu-perfil">
                                    Meu Perfil
                                </Link>
                            </li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={handleLogout}
                                >
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </div>

                    <NotificationIcon />
                </div>
            </div>

            {/* SIDEBAR MOBILE */}
            <nav
                className="d-lg-none fixed-bottom bg-primary border-top border-opacity-10 border-white shadow-lg"
                style={{ zIndex: 1030 }}
            >
                <div className="d-flex justify-content-around align-items-center py-2 px-1">

                    {/* Geral */}
                    <Link
                        to="/admin/dashboard"
                        className={`nav-link text-center p-2 rounded-3 ${getLinkClass('/admin/dashboard')}`}
                        title="Geral"
                        style={{
                            width: '45px',
                            height: '45px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <i className="bi bi-speedometer2 fs-3"></i>
                    </Link>

                    {/* Agendamentos */}
                    <Link
                        to="/admin/agendamentos"
                        className={`nav-link text-center p-2 rounded-3 ${getLinkClass('/admin/agendamentos')}`}
                        title="Agendamentos"
                        style={{
                            width: '45px',
                            height: '45px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <i className="bi bi-table fs-3"></i>
                    </Link>

                    {/* Serviços */}
                    <Link
                        to="/admin/servicos"
                        className={`nav-link text-center p-2 rounded-3 ${getLinkClass('/admin/servicos')}`}
                        title="Serviços"
                        style={{
                            width: '45px',
                            height: '45px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <i className="bi bi-grid fs-3"></i>
                    </Link>

                    {/* Clientes */}
                    <Link
                        to="/admin/clientes"
                        className={`nav-link text-center p-2 rounded-3 ${getLinkClass('/admin/clientes')}`}
                        title="Clientes"
                        style={{
                            width: '45px',
                            height: '45px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <i className="bi bi-people fs-3"></i>
                    </Link>

                    {/* Notificações */}
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: '45px', height: '45px' }}
                    >
                        <NotificationIcon size="fs-3" />
                    </div>

                    {/* Dropdown do usuário */}
                    <div className="dropup">
                        <a
                            href="#/"
                            className="d-flex align-items-center p-2 text-white opacity-75 opacity-100-hover dropdown-toggle no-arrow"
                            id="dropdownUserMobile"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img
                                src={avatarUrl}
                                alt="Foto do usuário"
                                width="30"
                                height="30"
                                className="rounded-circle"
                            />
                        </a>

                        <ul
                            className="dropdown-menu dropdown-menu-dark text-small shadow"
                            aria-labelledby="dropdownUserMobile"
                        >
                            <li>
                                <Link className="dropdown-item" to="/admin/meu-perfil">
                                    Meu Perfil
                                </Link>
                            </li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={handleLogout}
                                >
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
