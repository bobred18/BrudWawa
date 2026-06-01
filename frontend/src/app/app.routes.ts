import { Routes } from '@angular/router';
import {Login} from './login/login'
import { Home } from './home/home';
import { E404 } from './e404/e404';

export const routes: Routes = [
    {path:'', component: Home},
    {path:'login', component: Login},
    {path:'home', component: Home},
    {path:'**', component: E404}

];
