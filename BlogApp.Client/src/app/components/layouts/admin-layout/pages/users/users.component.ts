import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUserDto, UpdateUserDto, User } from '../../../../../models/users/user.model';
import { finalize } from 'rxjs';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  // Component State
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Form ve Modal State
  isModalOpen = false;
  userForm: FormGroup;
  
  // 'null' ise "Create", 'string' (ID) ise "Edit" modundayız
  currentUserId: string | null = null; 

  // Rol listesi (Create modunda dropdown için)
  // Normalde bu da bir RoleService'ten gelmeli, şimdilik hard-coded.
  roles: string[] = ['User', 'Admin'];

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // Formu, CreateUserDto'daki TÜM alanları içerecek şekilde başlatıyoruz
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]], // Sadece Create modunda
      password: ['', [Validators.required, Validators.minLength(6)]], // Sadece Create modunda
      roleName: ['User', [Validators.required]] // Sadece Create modunda
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // --- 1. READ (Listeleme) ---
  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.userService.getUsers().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Kullanıcılar yüklenirken hata:', err);
        this.error = 'Kullanıcılar yüklenemedi. (Hata: ' + (err.error?.message || err.message) + ')';
      }
    });
  }

  // --- 2. CREATE & UPDATE (Form Gönderme) ---
  onSubmit(): void {
    if (this.userForm.invalid) {
      // Formu manuel olarak 'touched' (dokunulmuş) işaretle ki validasyon hataları görünsün
      this.userForm.markAllAsTouched();
      return;
    }

    // "Create" (Oluşturma) modundayız
    if (this.currentUserId === null) {
      // Formun tüm değerlerini CreateUserDto olarak al
      const dto: CreateUserDto = this.userForm.value;
      
      this.userService.createUser(dto).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => this.error = 'Kullanıcı oluşturulamadı. (Hata: ' + (err.error?.errors?.[0]?.description || 'Bilinmeyen Hata') + ')'
      });
    }
    // "Update" (Güncelleme) modundayız
    else {
      // Formun sadece UpdateUserDto için gerekli alanlarını al
      const dto: UpdateUserDto = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        email: this.userForm.value.email
      };
      
      this.userService.updateUser(this.currentUserId, dto).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => this.error = 'Kullanıcı güncellenemedi.'
      });
    }
  }

  // --- 3. DELETE (Silme) ---
  onDelete(id: string): void {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => this.error = 'Kullanıcı silinemedi.'
      });
    }
  }

  // --- Modal (Açılır Pencere) Kontrolleri ---
  
  // "Yeni Ekle" modalını açar
  openCreateModal(): void {
    this.currentUserId = null;
    this.userForm.reset();
    this.userForm.get('roleName')?.setValue('User'); // Varsayılan rol

    // CREATE MODU: Parola, Kullanıcı Adı ve Rol zorunlu
    this.userForm.get('userName')?.setValidators([Validators.required]);
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('roleName')?.setValidators([Validators.required]);

    // Validator değişikliklerini güncelle
    this.userForm.get('userName')?.updateValueAndValidity();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('roleName')?.updateValueAndValidity();
    
    this.isModalOpen = true;
  }

  // "Düzenle" modalını açar
  openEditModal(user: User): void {
    this.currentUserId = user.id;
    // Formu doldur (UpdateUserDto alanları)
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });

    // EDIT MODU: Parola, Kullanıcı Adı ve Rol zorunlu DEĞİL (ve gizlenecek)
    this.userForm.get('userName')?.clearValidators();
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('roleName')?.clearValidators();

    // Validator değişikliklerini güncelle
    this.userForm.get('userName')?.updateValueAndValidity();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('roleName')?.updateValueAndValidity();

    this.isModalOpen = true;
  }

  // Modalı kapatır
  closeModal(): void {
    this.isModalOpen = false;
    this.currentUserId = null;
    this.userForm.reset();
  }

  // Form validasyonu için getter
  get f() { return this.userForm.controls; }
}
