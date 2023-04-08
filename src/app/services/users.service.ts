import { Injectable } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, mapTo, Observable, of, Subject, tap, throwError } from 'rxjs';
import { User } from '../models/User.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  static getUserById(id: string) {
    throw new Error('Method not implemented.');
  }

  users$ = new Subject<User[]>();
  user$ = new Subject<User | null>();;

  constructor(private http: HttpClient,
              private auth: AuthService) {}

  getUsers() {
    this.http.get<User[]>(`${environment.API_URL}/api/user/`).pipe(
      tap(users => this.users$.next(users)),
      catchError(error => {
        console.error(error.error.message);
        return of([]);
      })
    ).subscribe();
  }

getUserById(id: string) {
  return this.http.get<User>(`${environment.API_URL}/api/user/` + id).pipe(
    tap(user => {
      this.user$.next(user);
    }),
    catchError(error => {
      console.error(error.error.message);
      this.user$.next(null); // emit null in case of error
      return of(null);
    })
  );
}

}
