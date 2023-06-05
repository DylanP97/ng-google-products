import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, shareReplay } from 'rxjs';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuth$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;
  color = '#673ab7'; // declare the color property and assign a value

  constructor(
    private auth: AuthService,
    public darkModeService: DarkModeService
  ) {}

  ngOnInit() {
    this.darkModeService;
    this.isAuth$ = this.auth.isAuth$.pipe(shareReplay(1));
    this.isAdmin$ = this.auth.isAdmin$.pipe(shareReplay(1));
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  onLogout() {
    this.auth.logout();
  }
}
