import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  onSubmit(form: any) {
    this.authService.login(form.value).subscribe({
      next: (response) => {
        //console.log(response);
        this.toastr.success('Login successful');
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        //console.error(error);
        this.toastr.error(error.error.msg);
      },
    });
  }
}
