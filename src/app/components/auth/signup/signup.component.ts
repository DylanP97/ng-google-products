import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;
  showPassword = false;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router,
              public darkModeService: DarkModeService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  onSignup() {
    this.loading = true;
    const username = this.signupForm.get('username')!.value;
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    this.auth.createUser(email, password, username).pipe(
      switchMap(() => this.auth.loginUser(email, password)),
      tap(() => {
        this.loading = false;
        this.router.navigate(['/products']);
      }),
      catchError(error => {
        this.loading = false;
        this.errorMsg = "Either the username, the email or the password are not good";
        return EMPTY;
      })
    ).subscribe();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


}
