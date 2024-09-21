import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../shared/stores/authStore';

const LoggedOutRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/purchase" />;
    }

    return <Outlet />;
};

export default LoggedOutRoute;
