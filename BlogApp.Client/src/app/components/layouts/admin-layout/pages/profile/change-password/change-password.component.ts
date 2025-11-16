import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Geri dönmek için
import { finalize } from 'rxjs/operators';

// Gerekli servis ve modeller
import { UserService } from '../../../../../../services/user.service';
import { AuthService } from '../../../../../../services/auth.service';
import { IdentityError } from '../../../../../../models/auth/identity-error.model'; // API Hataları için
import { ChangePassword } from '../../../../../../models/profile/change-password.model';

// --- Özel Validator Fonksiyonu ---
/**
 * 'newPassword' ve 'confirmNewPassword' alanlarının eşleşip eşleşmediğini kontrol eder.
 * Eşleşmezse, 'confirmNewPassword' kontrolüne 'mismatch' hatası ekler.
 */
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmNewPassword = control.get('confirmNewPassword');

  // Formlar henüz başlatılmadıysa
  if (!newPassword || !confirmNewPassword) {
    return null;
  }

  // Alanlar eşleşmiyorsa
  if (newPassword.value !== confirmNewPassword.value) {
    // Hatayı 'confirmNewPassword' alanına set et
    confirmNewPassword.setErrors({ 'mismatch': true });
    return { 'mismatch': true };
  } 
  
  // Eşleşiyorsa, (varsa) 'mismatch' hatasını kaldır
  confirmNewPassword.setErrors(null);
  return null;
}
// --- Validator Bitti ---


@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  changePasswordForm: FormGroup;
  isLoading = false;
  
  // API'den dönen hataları (örn: "Mevcut şifre yanlış") saklamak için
  apiErrors: IdentityError[] = []; 
  
  success: string | null = null; // Başarı mesajı

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, {
      // Formun tamamına 'passwordMatchValidator'ı uygula
      validators: passwordMatchValidator 
    });
  }

  onSubmit(): void {
    this.apiErrors = [];
    this.success = null;

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const dto: ChangePassword = this.changePasswordForm.value;

    this.userService.changePassword(dto).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.success = "Şifreniz başarıyla değiştirildi. Güvenlik nedeniyle tekrar giriş yapmanız gerekmektedir.";
        // Şifre değiştiği için mevcut token'ı geçersiz kıl ve 3 saniye sonra logout yap
        setTimeout(() => {
          this.authService.logout();
        }, 3000);
      },
      error: (err) => {
        // API'den dönen 'IdentityError' listesini al
        if (err.error && Array.isArray(err.error)) {
          this.apiErrors = err.error;
        } else if (err.error?.message) {
          this.apiErrors = [{ code: 'Error', description: err.error.message }];
        } else {
          this.apiErrors = [{ code: 'Error', description: 'Bilinmeyen bir hata oluştu.' }];
        }
      }
    });
  }

  // Form validasyonu için getter
  get f() { return this.changePasswordForm.controls; }
}