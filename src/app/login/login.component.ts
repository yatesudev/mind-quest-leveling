import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

// Defines the LoginComponent with its metadata
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // Constructor for the dependencies of the LoginComponent
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

  // Event handler for submitting the login form
  onSubmit(form: any) {
    // Performs the login process and handles the response
    this.authService.login(form.value).subscribe({
      next: (response) => {
        this.toastr.success('Login successful'); // Displays success message
        localStorage.setItem('token', response.token); // Stores the token
        this.router.navigate(['/dashboard']); // Navigates to the dashboard
      },
      error: (error) => {
        // Error handling based on the error status
        if (error.status === 0) {
          this.toastr.error(
            'Unable to connect to the server. Please try again later.'
          );
        } else if (error.status >= 500 && error.status < 600) {
          this.toastr.error('A server error occurred. Please try again later.');
        } else if (error.error && error.error.msg) {
          this.toastr.error(error.error.msg);
        } else {
          this.toastr.error('An unexpected error occurred. Please try again.');
        }
      },
    });
  }
}
