import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthService {
  isAdmin(): boolean {
    return true;
  }

  isAuthenticated(): boolean {
    return true;
  }
}
