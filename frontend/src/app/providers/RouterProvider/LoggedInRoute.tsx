import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../shared/stores/authStore';

const LoggedInRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default LoggedInRoute;
