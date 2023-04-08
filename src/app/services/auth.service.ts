import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = new BehaviorSubject<boolean>(false); 
  private authToken = '';
  private userId = '';
  private username = '';
  private isAdmin = false;

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
    // Check if user is admin
    const isAdmin = this.cookieService.get('isAdmin');
    if (isAdmin) {
      this.isAdmin = isAdmin === 'true' ? true : false;
      this.isAdmin$.next(this.isAdmin);
    }
  }

  getIsAuth(): Observable<boolean> {
    return this.isAuth$.asObservable();
  }

  createUser(email: string, password: string, username: string) {
    return this.http.post<{ message: string }>(
      `${environment.API_URL}/api/user/signup`,
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
    return this.http.post<{ userId: string, username: string, token: string, isAdmin: boolean }>(`${environment.API_URL}/api/user/login`, {email: email, password: password}).pipe(
      tap(({ userId, username, token, isAdmin }) => {
        this.userId = userId;
        this.username = username;
        this.authToken = token;
        this.isAdmin = isAdmin;
        this.isAuth$.next(true);
        this.isAdmin$.next(this.isAdmin);
        // Set token and user ID cookies
        this.cookieService.set('token', token);
        this.cookieService.set('userId', userId);
        this.cookieService.set('isAdmin', isAdmin.toString());
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
