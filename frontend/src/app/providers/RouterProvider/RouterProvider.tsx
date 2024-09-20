import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import LoggedInRoute from './LoggedInRoute';
import LoggedOutRoute from './LoggedOutRoute';
import MainPage from '../../../pages/MainPage/MainPage';
import BalancePage from '../../../pages/BalancePage/BalancePage';
import PurchasePage from '../../../pages/PurchasePage/PurchasePage';
import NotFoundPage from '../../../pages/NotFoundPage/NotFoundPage';
import LoggedInLayout from '../../layouts/LoggedInLayout';
import LoggedOutLayout from '../../layouts/LoggedOutLayout';

const AppRoutes: React.FC = () => {
    const routes = useRoutes([
        {
            element: <LoggedOutLayout />,
            children: [
                {
                    element: <LoggedOutRoute />,
                    children: [{ path: '/', element: <MainPage /> }],
                },
            ],
        },
        {
            element: <LoggedInLayout />,
            children: [
                {
                    element: <LoggedInRoute />,
                    children: [
                        { path: '/balance', element: <BalancePage /> },
                        { path: '/purchase', element: <PurchasePage /> },
                    ],
                },
            ],
        },
        {
            path: '*',
            element: <NotFoundPage />,
        },
    ]);

    return routes;
};

const RouterProviderWrapper: React.FC = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};

export default RouterProviderWrapper;
