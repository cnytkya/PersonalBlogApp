import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../services/auth.service';
import { UserService } from '../../../../../services/user.service';
import { finalize } from 'rxjs';
import { UpdateUserDto } from '../../../../../models/users/user.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUserId: string | null = null;
  isLoading = false;
  error: string | null = null;
  success: string | null = null; // Başarı mesajı

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    // Formu, API'deki UpdateUserDto'ya göre başlatıyoruz
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
      // Not: Kullanıcı adı (UserName) genellikle değiştirilemez
    });
  }

  ngOnInit(): void {
    // 1. Giriş yapan kullanıcının ID'sini al
    this.currentUserId = this.authService.getCurrentUserId();
    
    if (this.currentUserId) {
      // 2. O ID'ye ait kullanıcı bilgilerini API'den çek
      this.loadUserProfile(this.currentUserId);
    } else {
      this.error = "Kullanıcı ID'si bulunamadı. Lütfen tekrar giriş yapın.";
      this.authService.logout();
    }
  }

  /**
   * API'den kullanıcı bilgilerini yükler ve formu doldurur.
   */
  loadUserProfile(id: string): void {
    this.isLoading = true;
    this.userService.getUserById(id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (user) => {
        // Formu API'den gelen verilerle doldur
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      },
      error: (err) => {
        this.error = "Profil bilgileri yüklenemedi.";
      }
    });
  }

  /**
   * Formu gönderir ve profili günceller.
   */
  onSubmit(): void {
    if (this.profileForm.invalid || !this.currentUserId) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.success = null;

    // DTO'yu formdan al
    const dto: UpdateUserDto = this.profileForm.value;

    this.userService.updateUser(this.currentUserId, dto).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = "Profiliniz başarıyla güncellendi.";
        // (Opsiyonel: Eğer adını güncellediyse token'ı yenilemek gerekebilir)
      },
      error: (err) => {
        this.isLoading = false;
        this.error = "Profil güncellenemedi. Lütfen tekrar deneyin.";
      }
    });
  }

  // Form validasyonu için getter
  get f() { return this.profileForm.controls; }
}
