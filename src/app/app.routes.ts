import { Routes } from '@angular/router';
import {Home} from "./components/home/home";
import {Dogs} from "./components/dogs/dogs";
import {Cats} from "./components/cats/cats";
import {Favorites} from "./components/favorites/favorites";
import {Care} from "./components/care/care";
import { Agenda } from './components/agenda/agenda';
import { HealthHistory } from './components/health-history/health-history';
import { Calendar } from './components/calendar/calendar';
import { Login } from './components/login/login';
import { MyPets } from './components/my-pet/my-pet';

export const routes: Routes = [
    { path: "", component: Home },
    {path: "perros", component: Dogs},
    { path: "gatos", component: Cats },
    {path: "favoritos", component: Favorites},
    {path: "cuidados", component: Care},
    {path: "agenda", component: Agenda},
    {path: "historial-salud", component: HealthHistory},
    {path:"calendario", component: Calendar},
    {path: "login", component: Login},
    {path: "mis-mascotas", component: MyPets},
    {path: "**", redirectTo: ""}
];

