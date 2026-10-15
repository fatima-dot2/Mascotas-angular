import { Routes } from '@angular/router';
import {Home} from "./components/home/home";
import {Dogs} from "./components/dogs/dogs";
import {Cats} from "./components/cats/cats";

export const routes: Routes = [
    { path: "", component: Home },
    {path: "perros", component: Dogs},
    { path: "gatos", component: Cats },
    {path: "**", redirectTo: ""}
];

