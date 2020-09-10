import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  firstName = new FormControl();
  lastName = new FormControl();
  userName = new FormControl('');
  email = new FormControl('');
  mobileval = new FormControl('', [
    Validators.required,
    Validators.min(1000000000),
    Validators.max(9999999999),
  ]);
  error: String;
  allowSubmitButton: boolean;
  password = new FormControl();
  spinner = false;

  constructor(private auth: AuthService, private router: Router) {
    // console.log('register called');
  }
  inputChange(event: any) {
    this.allowSubmitButton =
      !this.firstName.errors &&
      !this.lastName.errors &&
      !this.userName.errors &&
      !this.email.errors &&
      !this.mobileval.errors &&
      !this.password.errors;
  }
  inputToLower() {
    // console.log(this);
    if (this.userName.value) {
      this.userName.setValue(this.userName.value.toLowerCase());
    }
    if (this.email.value) {
      this.email.setValue(this.email.value.toLowerCase());
    }

    // return null;
  }

  ngOnInit(): void {}

  submitClicked() {
    // let firstName = this.firstName;
    this.spinner = true;
    this.auth
      .resgister({
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        userName: this.userName.value,
        email: this.email.value,
        password: this.password.value,
        mobile: this.mobileval.value,
      })
      .subscribe(
        (response: HttpResponse<any>) => {
          // console.log(response.body);
          localStorage.setItem('auth', response.body.token);
          // console.log(localStorage.getItem('auth'));
          this.router.navigateByUrl('/home');
        },
        (err) => {
          this.spinner = false;
          // console.log(err);
          if (err.status == 409) {
            this.error =
              err.error + ' \n if you have already registered please login';
            // console.log(this.error);
          } else {
            this.error =
              'Could not register you,Please try again after some time';
          }
          // console.log(err.error);
        }
      );
  }
}
