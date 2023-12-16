import {inject} from '@angular/core';
import {Routes} from '@angular/router';
import {AuthService} from "../services";
import {UsersManagementComponent} from "./users-management.component";
import {UserComponent} from "./user/user.component";

export const USERS_MANAGEMENT: Routes = [
  {
    path: '',
    canActivate: [() => inject(AuthService).isAdmin()],
    children: [
      {
        path: '',
        component: UsersManagementComponent,
        pathMatch: 'full',
      },
      {
        path: 'user/:id',
        component: UserComponent,
        pathMatch: 'full',
      },
    ],
  },
];

export default USERS_MANAGEMENT;
