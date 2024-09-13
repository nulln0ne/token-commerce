import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import LoggedInRoute from './LoggedInRoute';
import LoggedOutRoute from './LoggedOutRoute';
import MainPage from '../../../pages/MainPage/MainPage';
import BalancePage from '../../../pages/BalancePage/BalancePage';
import PurchasePage from '../../../pages/PurchasePage/PurchasePage';
import NotFoundPage from '../../../pages/NotFoundPage/NotFoundPage';
import LoggedInLayout from '../../layouts/LoggedInLayout';
import LoggedOutLayout from '../../layouts/LoggedOutLayout';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<LoggedOutLayout />}>
                <Route element={<LoggedOutRoute />}>
                    <Route path="/" element={<MainPage />} />
                </Route>
            </Route>

            <Route element={<LoggedInLayout />}>
                <Route element={<LoggedInRoute />}>
                    <Route path="/balance" element={<BalancePage />} />
                    <Route path="/purchase" element={<PurchasePage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </>
    )
);

const RouterProviderWrapper: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default RouterProviderWrapper;
