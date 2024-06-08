import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(form: any) {

    if (form.valid) {
      // Username validation
      if (!this.isUsernameValid(form.value.username)) {
        this.toastr.error(
          'Username must be at least 6 characters long.');
        return;
      }

      // Email validation
      if (!this.isEmailValid(form.value.email)) {
        this.toastr.error('Invalid email format.');
        return;
      }

      // Password validation
      if (!this.isPasswordValid(form.value.password)) {
        this.toastr.error('Password must be at least 8 characters long and include at least one number.');
        return;
      }

      if (form.value.password !== form.value.confirmPassword) {
        this.toastr.error('Passwords do not match.');
        return;
      }

      this.authService.register(form.value).subscribe({
        next: (response) => {
          //console.log(response);
          this.toastr.success('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.toastr.error(error.error.msg);
        },
      });
    }
  }

  isUsernameValid(username: string): boolean {
    return username.length >= 6;
  }

  isEmailValid(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  isPasswordValid(password: string): boolean {
    const passwordPattern =
      /^(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
  }
}
