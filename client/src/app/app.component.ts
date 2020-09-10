import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'tydy';
  user: any;
  userLoggedIn: boolean = false;
  constructor(private router: Router) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        // this.userLoggedIn = false;
        this.user = localStorage.getItem('serializeUser');
        this.user = this.user ? JSON.parse(this.user) : this.user;

        if (this.user != null && Object.keys(this.user).length > 0) {
          this.userLoggedIn = true;
        } else {
          this.userLoggedIn = false;
          // console.log(event.url);
          if (!['/login', '/register'].includes(event.url)) {
            // console.log(event.url);
            this.router.navigateByUrl('/login');
          }
        }
      }
    });
  }
  logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('serializeUser');
    this.router.navigateByUrl('/login');
  }
  ngOnInit() {}
}
