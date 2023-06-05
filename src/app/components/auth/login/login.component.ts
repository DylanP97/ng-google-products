import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;
  redColor = 'rgba(255,23,23,0.5802696078431373)';
  showPassword = false;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router,
              public darkModeService: DarkModeService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  onLogin() {
    this.loading = true;
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
    this.auth.loginUser(email, password).pipe(
      tap(() => {
        this.loading = false;
        this.router.navigate(['/products']);
      }),
      catchError(error => {
        this.loading = false;
        this.errorMsg = "Either the email or the password are not good";
        return EMPTY;
      })
    ).subscribe();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

}
