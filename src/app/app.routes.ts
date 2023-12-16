import {Routes} from '@angular/router';
import {inject} from "@angular/core";

import {AuthService} from "./services";

export const routes: Routes = [
  {
    title: 'Users',
    path: 'users-management',
    canActivate: [() => inject(AuthService).isAuthenticated(), () => inject(AuthService).isAdmin()],
    loadChildren: () =>
      import('./users-management')
        .then(m => m.USERS_MANAGEMENT)
  },
];
