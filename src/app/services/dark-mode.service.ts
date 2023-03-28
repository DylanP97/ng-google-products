import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private readonly key = 'darkMode';
  isDarkMode = false;

  constructor() {
    const storedValue = localStorage.getItem(this.key);
    if (storedValue) {
      this.isDarkMode = JSON.parse(storedValue);
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem(this.key, JSON.stringify(this.isDarkMode));
  }
}
