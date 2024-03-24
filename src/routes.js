import * as Page from './pages';

const AppRoutes = [
    {
        path: '/login',
        Component: Page?.LoginPage,
    },
    {
        path: '/',
        Component: Page?.DashboardPage,
    },
    {
        path: '/form/:formId',
        Component: Page?.FormPage,
    }
];

export default AppRoutes;