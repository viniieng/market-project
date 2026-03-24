import { Navigate, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute';
import { AppLayout } from '../shared/components/AppLayout';
import { ProductsPage } from '../modules/products/pages/ProductsPage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/app',
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />,
                    },
                    {
                        path: 'dashboard',
                        element: <DashboardPage />,
                    },
                    {
                        path: 'products',
                        element: <ProductsPage />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/app" replace />,
    },
]);
