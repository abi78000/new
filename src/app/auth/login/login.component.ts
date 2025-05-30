import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  goToRegister() {
    this.router.navigate(['/menu-list']);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snack.open('Please fill in all required fields correctly.', '', { duration: 2000 });
      return;
    }

    const loginData = this.loginForm.value;

    console.log('Attempting login with:', loginData); // 🐞 Debug: see what's sent

    this.auth.login(loginData).subscribe({
      next: (res: any) => {
        if (res?.token) {
          this.auth.storeToken(res.token);
          this.snack.open('Login successful!', '', { duration: 2000 });
   //    this.router.navigate(['/menu-form']);
     this.router.navigate(['/menu-list']);  // Ensure '/menu-list' is the correct route for MenuListComponent

        } else {
          this.snack.open('Unexpected response from server.', '', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Login error:', err); // 🐞 Debug: log full error
        this.snack.open('Login failed. Check credentials.', '', { duration: 3000 });
      }
    });
  }
}
