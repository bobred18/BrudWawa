import { Routes } from '@angular/router';
import {Login} from './login/login'
import { Home } from './home/home';
import { E404 } from './e404/e404';
import { AddIssue } from './add-issue/add-issue';
import { Statistics } from './statistics/statistics';
import { Map } from './map/map';
import { IssueView } from './issue-view/issue-view';
import { adminGuard } from './guards/admin-guard';
import { Admin } from './admin/admin';

export const routes: Routes = [
    {path:'', component: Home,data: { hideNavbar: true }},
    {path:'login', component: Login,data: { hideNavbar: true }},
    {path:'home', component: Home,data: { hideNavbar: true }},
    {path:'add_issue', component: AddIssue},
    {path:'statistics', component: Statistics},
    {path:'map', component: Map},
    {path:'issue/:id', component: IssueView},
    {path:'admin', component: Admin, canActivate:[adminGuard]},


    {path:'**', component: E404,data: { hideNavbar: true }}

];
