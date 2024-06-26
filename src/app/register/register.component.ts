import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

// Defines the RegisterComponent with its metadata
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  // Constructor for the dependencies of the RegisterComponent
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private appComponent: AppComponent
  ) {}

  // Lifecycle hook called when the component initializes
  ngOnInit() {
    this.appComponent.showFooter = false; // Hides the footer element
  }

  // Lifecycle hook called when the component is destroyed
  ngOnDestroy() {
    this.appComponent.showFooter = true; // Shows the footer element again
  }

  // Event handler for submitting the registration form
  onSubmit(form: any) {
    // Checks if the form is valid
    if (form.valid) {
      // Validates the username
      if (!this.isUsernameValid(form.value.username)) {
        this.toastr.error('Username must be at least 4 characters long.');
        return;
      }

      // Validates the email format
      if (!this.isEmailValid(form.value.email)) {
        this.toastr.error('Invalid email format.');
        return;
      }

      // Validates the password
      if (!this.isPasswordValid(form.value.password)) {
        this.toastr.error('Password must be at least 8 characters long and include at least one number.');
        return;
      }

      // Checks if the password and confirm password match
      if (form.value.password !== form.value.confirmPassword) {
        this.toastr.error('Passwords do not match.');
        return;
      }

      // Performs the registration process and handles the response
      this.authService.register(form.value).subscribe({
        next: (response) => {
          this.toastr.success('Registration successful!'); // Displays success message
          this.router.navigate(['/login']); // Navigates to the login page
        },
        error: (error) => {
          this.toastr.error(error.error.msg); // Displays error message
        },
      });
    }
  }

  // Validates the username length
  isUsernameValid(username: string): boolean {
    return username.length >= 4;
  }

  // Validates the email format using a regex pattern
  isEmailValid(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Validates the password length and checks if it contains at least one number
  isPasswordValid(password: string): boolean {
    const hasNumber = /\d/;
    return hasNumber.test(password) && password.length >= 8;
  }
}