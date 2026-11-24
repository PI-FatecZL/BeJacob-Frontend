import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { notificationService } from "../../services/notificationService";

interface NotificationIconProps {
    size?: string;
}

const REFRESH_INTERVAL = 30_000;

export default function NotificationIcon({ size = "fs-4" }: NotificationIconProps) {
    const [unreadCount, setUnreadCount] = useState<number | null>(null);

    useEffect(() => {
        let isMounted = true;
        let isLoading = false;

        const loadUnreadCount = async () => {
            if (isLoading) return;
            isLoading = true;

            try {
                const count = await notificationService.countUnread();
                if (isMounted) setUnreadCount(count);
            } catch (error) {
                console.error("Erro ao carregar a contagem de notificações:", error);
            } finally {
                isLoading = false;
            }
        };

        const refreshWhenVisible = () => {
            if (document.visibilityState === "visible") {
                void loadUnreadCount();
            }
        };

        void loadUnreadCount();
        const intervalId = window.setInterval(loadUnreadCount, REFRESH_INTERVAL);
        window.addEventListener("focus", loadUnreadCount);
        document.addEventListener("visibilitychange", refreshWhenVisible);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
            window.removeEventListener("focus", loadUnreadCount);
            document.removeEventListener("visibilitychange", refreshWhenVisible);
        };
    }, []);

    return (
        <Link
            to="/admin/notificacoes"
            className="position-relative text-white text-decoration-none d-inline-flex align-items-center"
            title="Notificações"
            aria-label={
                unreadCount === null
                    ? "Notificações"
                    : `Notificações, ${unreadCount} não lidas`
            }
        >
            <i className={`bi bi-bell ${size}`}></i>

            {unreadCount !== null && unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadCount}
                    <span className="visually-hidden">
                        Notificações não lidas
                    </span>
                </span>
            )}
        </Link>
    );
}
