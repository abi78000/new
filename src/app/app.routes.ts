import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { MenuListComponent } from './menu/menu-list/menu-list.component';
import { MenuFormComponent } from './menu/menu-form/menu-form.component';
import { Component } from '@angular/core';
import { ReportsComponent } from './pages/reports.component';


export const routes: Routes = [
  // Public Routes
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected Layout Routes
  {
    path: '',
    component: DashboardComponent, // Layout component with sidebar
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'menu-list', component: MenuListComponent },
      { path: 'menu-form', component: MenuFormComponent },
      {path:'reports',component:ReportsComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Wildcard - Redirect any unknown routes to login
  { path: '**', redirectTo: 'login' }
];
