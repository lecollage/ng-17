import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {User} from "./users-management.interface";
import {APP_CONFIG} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient, @Inject(APP_CONFIG) private readonly appConfig: { baseUrl: string }) {
  }

  public loadAll$(): Observable<User[]> {
    const url = `${this.appConfig.baseUrl}/users`;
    return this.http.get<User[]>(url);
  }

  public loadUser$(id: string | number): Observable<User> {
    const url = `${this.appConfig.baseUrl}/users/${id}`;
    return this.http.get<User>(url);
  }
  public putUser$(user: User): Observable<User> {
    const url = `${this.appConfig.baseUrl}/users/${user.id}`;
    return this.http.put<User>(url, user);
  }
}
