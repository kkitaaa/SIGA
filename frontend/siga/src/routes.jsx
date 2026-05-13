import Login from './pages/login'; 
import Roles from './pages/asignacion_roles';
import Home from './pages/home'; 

const routes = [
    { path: '/', component: Login },
    { path: '/asignacion_roles', component: Roles },
    { path: '/home', component: Home },
];

export default routes;