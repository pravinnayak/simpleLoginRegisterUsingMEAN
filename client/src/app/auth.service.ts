import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  previuosUrl: string;
  // baseurl = 'http://localhost:3001';
  baseurl = '';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response',
  };
  constructor(private http: HttpClient, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    this.previuosUrl = state.url;
    return this.authenticate();
  }

  authenticate(): Promise<boolean> {
    const idToken = 'Bearer ' + localStorage.getItem('auth');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: idToken,
      }),
      observe: 'response' as 'response',
    };
    return new Promise((resolve) => {
      this.http.get(this.baseurl + '/authenticateUser', httpOptions).subscribe(
        (response) => {
          if (response.body['success']) {
            let token = response.body['token'];
            if (token) {
              localStorage.setItem('auth', token);
            }
            localStorage.setItem(
              'serializeUser',
              JSON.stringify(response.body['user'])
            );

            resolve(true);
          }
        },
        (error) => {
          localStorage.removeItem('auth');
          localStorage.removeItem('serializeUser');
          this.router.navigateByUrl('/login');
          resolve(false);
        }
      );
    });
  }

  login(userName: string, password: string): Array<Observable<any>> {
    return [
      this.http.post(
        this.baseurl + '/loginUser',
        {
          userName: userName,
          password: password,
        },
        this.httpOptions
      ),
      of(this.previuosUrl),
    ];
  }
  resgister(form): Observable<any> {
    return this.http.post(
      this.baseurl + '/registerUser',
      form,
      this.httpOptions
    );
  }
}
