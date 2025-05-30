import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Create the registration form
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
    });

    // Custom validator for password confirmation
    this.registerForm.controls['confirmPassword'].setValidators([
      Validators.required,
      this.passwordMatchValidator.bind(this)
    ]);
  }

  // Password match validation
  passwordMatchValidator(control: FormControl): { [s: string]: boolean } | null {
    if (this.registerForm && control.value !== this.registerForm.controls['password'].value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Submit form data
  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.authService.register(formData).subscribe(response => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      }, error => {
        console.log('Registration failed', error);
      });
    } else {
      console.log('Form is invalid');
    }
  }

  // Navigate to the login page
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
