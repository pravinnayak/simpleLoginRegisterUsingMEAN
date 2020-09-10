import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
// import { Router, NavigationEnd } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  usernameOrEmail: string = 'hi';
  password: string;
  error: string;
  spinner = false;

  identifier = new FormControl('', [
    Validators.required,
    this.inputToLower,
    Validators.minLength(4),
  ]);
  constructor(private auth: AuthService, private router: Router) {}

  inputToLower() {
    // console.log(this);
    if (this) this.identifier.setValue(this.identifier.value.toLowerCase());
    return null;
  }
  ngOnInit(): void {}
  submitClicked() {
    this.spinner = true;
    let loginReturn = this.auth.login(this.identifier.value, this.password);
    // console.log(loginReturn);
    loginReturn[0].subscribe(
      (response: HttpResponse<any>) => {
        loginReturn[1].subscribe((res) => {
          if (res) {
            localStorage.setItem('auth', response.body.token);
            this.router.navigateByUrl(res);
          } else {
            localStorage.setItem('auth', response.body.token);
            this.router.navigateByUrl('/home');
          }
        });
      },
      (error) => {
        this.spinner = false;
        //  this.router.navigateByUrl('/');
        this.error = 'Username  or password is incorrect';
        // console.log(error);
      }
    );
  }
}
