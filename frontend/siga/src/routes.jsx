import Login from './pages/login'; 
import Roles from './pages/asignacion_roles';
import Home from './pages/home'; // cambio 1: importacion de home para la ruta (http://localhost:5173/home)

const routes = [
    { path: '/', component: Login },
    { path: '/asignacion_roles', component: Roles },
    { path: '/home', component: Home }, // definicion de la ruta para la pagina de inicio
];

export default routes;