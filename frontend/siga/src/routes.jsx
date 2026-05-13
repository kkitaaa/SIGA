import Login from './pages/login'; 
import Roles from './pages/asignacion_roles';

const routes = [
    { path: '/', component: Login },
    { path: '/asignacion_roles', component: Roles },
    { path: '/home', component: Home }, // definicion de la ruta para la pagina de inicio
];

export default routes;