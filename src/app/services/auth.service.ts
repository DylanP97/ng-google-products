import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken = '';
  private userId = '';
  private username = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    // Check for token cookie when the app initializes
    const token = this.cookieService.get('token');
    if (token) {
      this.authToken = token;
      this.isAuth$.next(true);
    }
    // Check for user ID cookie when the app initializes
    const userId = this.cookieService.get('userId');
    if (userId) {
      this.userId = userId;
    }
  }

  getIsAuth(): Observable<boolean> {
    return this.isAuth$.asObservable();
  }

  createUser(email: string, password: string, username: string) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/user/signup',
      { username: username, email: email, password: password }
    );
  }

  getToken() {
    return this.authToken;
  }

  getUsername() {
    return this.username;
  }

  getUserId() {
    return this.userId;
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post<{ userId: string, username: string, token: string }>('http://localhost:3000/api/user/login', {email: email, password: password}).pipe(
      tap(({ userId, username, token }) => {
        this.userId = userId;
        this.username = username;
        this.authToken = token;
        this.isAuth$.next(true);
        // Set token and user ID cookies
        this.cookieService.set('token', token);
        this.cookieService.set('userId', userId);
      })
    );
  }
  

  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    this.cookieService.delete('token');
    this.cookieService.delete('userId'); // Delete the userId cookie
    this.router.navigate(['login']);
  }  
}
