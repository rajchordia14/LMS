import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  pageTitle: string = 'Leave Portal';
  nonValidEmailError: string = '*Email must be valid';
  emptyEmailError: string = '*Email is required'
  emptyPasswordError: string = '*Password is required';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor() { }

  ngOnInit(): void {
  }

  login() : void
 {
   if (!this.loginForm.valid) return;
 }

}
