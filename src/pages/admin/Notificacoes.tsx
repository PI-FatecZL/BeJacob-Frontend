import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { notificationService } from "../../services/notificationService";
import type { NotificationResponse } from "../../types/notification";
import type { SpringPage } from "../../types/pagination";

export default function Notificacoes() {
    const [pageData, setPageData] = useState<SpringPage<NotificationResponse> | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await notificationService.findAll(currentPage, 10);
            setPageData(data);
        } catch {
            setError("Não foi possível carregar as notificações.");
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        let isActive = true;

        notificationService.findAll(currentPage, 10)
            .then((data) => {
                if (isActive) {
                    setPageData(data);
                    setError(null);
                }
            })
            .catch(() => {
                if (isActive) {
                    setError("Não foi possível carregar as notificações.");
                }
            })
            .finally(() => {
                if (isActive) {
                    setLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, [currentPage]);

    const handleMarkAsRead = async (id: number) => {
        setActionInProgress(true);
        setError(null);
        try {
            const updatedNotification = await notificationService.markAsRead(id);
            setPageData((currentData) => currentData
                ? {
                    ...currentData,
                    content: currentData.content.map((notification) =>
                        notification.id === id ? updatedNotification : notification
                    )
                }
                : currentData
            );
        } catch {
            setError("Não foi possível marcar a notificação como lida.");
        } finally {
            setActionInProgress(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        setActionInProgress(true);
        setError(null);
        try {
            await notificationService.markAllAsRead();
            setPageData((currentData) => currentData
                ? {
                    ...currentData,
                    content: currentData.content.map((notification) => ({
                        ...notification,
                        isRead: true
                    }))
                }
                : currentData
            );
        } catch {
            setError("Não foi possível marcar todas as notificações como lidas.");
        } finally {
            setActionInProgress(false);
        }
    };

    const handleDelete = async (id: number) => {
        setActionInProgress(true);
        setError(null);
        try {
            await notificationService.delete(id);

            if (pageData?.content.length === 1 && currentPage > 0) {
                setLoading(true);
                setCurrentPage((page) => page - 1);
            } else {
                await loadNotifications();
            }
        } catch {
            setError("Não foi possível excluir a notificação.");
        } finally {
            setActionInProgress(false);
        }
    };


    const formatDate = (value: string): string => {
        const isoDate = value.match(
            /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/
        );

        const brazilianDate = value.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ ,T]+(\d{1,2}):(\d{2}))?$/
        );

        if (isoDate) {
            const [, year, month, day, hours = "00", minutes = "00", timezone] = isoDate;

            if (timezone) {
                const date = new Date(value);

                if (Number.isNaN(date.getTime())) return value;

                const pad = (number: number) => String(number).padStart(2, "0");

                return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
            }

            return `${day}/${month}/${year}, ${hours}:${minutes}`;
        }

        if (brazilianDate) {
            const [, day, month, year, hours = "00", minutes = "00"] = brazilianDate;

            const pad = (value: string) => value.padStart(2, "0");

            return `${pad(day)}/${pad(month)}/${year}, ${pad(hours)}:${minutes}`;
        }

        return value;
    };

    return (
        <DashboardLayout>
            <div className="bg-white rounded-3 shadow-sm">
                <div className="bg-primary text-white d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 rounded-top-3">
                    <h5 className="m-0">
                        <i className="bi bi-bell me-2"></i>
                        Notificações
                    </h5>
                    <button
                        type="button"
                        className="btn btn-outline-light btn-sm"
                        onClick={handleMarkAllAsRead}
                        disabled={actionInProgress || !pageData?.totalElements}
                    >
                        <i className="bi bi-check2-all me-2"></i>
                        Marcar todas como lidas
                    </button>
                </div>

                <div className="p-3">
                    {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Carregando notificações...</span>
                            </div>
                        </div>
                    ) : pageData?.content.length ? (
                        <>
                            <div className="d-flex flex-column gap-3">
                                {pageData.content.map((notification) => (
                                    <article
                                        key={notification.id}
                                        className={`border rounded-3 p-3 ${notification.isRead ? "bg-white" : "bg-primary-subtle"}`}
                                    >
                                        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                                            <div className="d-flex gap-3">
                                                <i
                                                    className={`bi ${notification.isRead ? "bi-bell text-secondary" : "bi-bell-fill text-primary"} fs-4`}
                                                    aria-hidden="true"
                                                ></i>
                                                <div>
                                                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                                                        <h6 className="mb-0">{notification.message}</h6>
                                                        {!notification.isRead && (
                                                            <span className="badge bg-primary">Não lida</span>
                                                        )}
                                                    </div>
                                                    <small className="text-muted">
                                                        {formatDate(notification.createdAt)}
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-start gap-2 ms-md-3">
                                                {!notification.isRead && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary text-nowrap"
                                                        onClick={() => void handleMarkAsRead(notification.id)}
                                                        disabled={actionInProgress}
                                                    >
                                                        <i className="bi bi-check2 me-1"></i>
                                                        Marcar como lida
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => void handleDelete(notification.id)}
                                                    disabled={actionInProgress}
                                                    title="Excluir notificação"
                                                    aria-label={`Excluir notificação ${notification.id}`}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
                                <span className="text-muted small">
                                    Mostrando {pageData.numberOfElements} de {pageData.totalElements} notificações
                                </span>
                                <nav aria-label="Paginação das notificações">
                                    <ul className="pagination pagination-sm m-0">
                                        <li className={`page-item ${pageData.first ? "disabled" : ""}`}>
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() => {
                                                    setLoading(true);
                                                    setCurrentPage((page) => page - 1);
                                                }}
                                                disabled={pageData.first}
                                            >
                                                Anterior
                                            </button>
                                        </li>
                                        <li className="page-item disabled">
                                            <span className="page-link text-dark fw-medium">
                                                Página {currentPage + 1} de {pageData.totalPages}
                                            </span>
                                        </li>
                                        <li className={`page-item ${pageData.last ? "disabled" : ""}`}>
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() => {
                                                    setLoading(true);
                                                    setCurrentPage((page) => page + 1);
                                                }}
                                                disabled={pageData.last}
                                            >
                                                Próxima
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted py-5">
                            <i className="bi bi-bell-slash fs-1 d-block mb-2"></i>
                            <p className="mb-0">Nenhuma notificação encontrada.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}