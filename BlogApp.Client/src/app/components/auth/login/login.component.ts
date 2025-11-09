import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { Login } from '../../../models/auth/login.model';
import { AuthResponse } from '../../../models/auth/auth-response.model';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  authError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      // GÜNCELLENDİ: 'email' yerine 'usernameOrEmail'
      // GÜNCELLENDİ: Validators.email kaldırıldı. Sadece 'required' yeterli.
      usernameOrEmail: ['', [Validators.required]],
      
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    this.authError = null;
    if (this.loginForm.valid) {
      this.isSubmitting = true;

      const loginData: Login = {
        // GÜNCELLENDİ: 'usernameOrEmail' form alanını API'deki 'userName' alanına eşliyoruz
        userName: this.loginForm.value.usernameOrEmail, 
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).pipe(
        finalize(() => this.isSubmitting = false) 
      )
      .subscribe({
        next: (response: AuthResponse) => {
          if (response.roles && response.roles.includes('Admin')) {
            this.router.navigate(['/admin/dashboard']); 
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.authError = err.error?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // GÜNCELLENDİ: 'get' accessor'ı yeni form adıyla eşleşmeli
  get usernameOrEmail() { return this.loginForm.get('usernameOrEmail'); }
  
  get password() { return this.loginForm.get('password'); }
}