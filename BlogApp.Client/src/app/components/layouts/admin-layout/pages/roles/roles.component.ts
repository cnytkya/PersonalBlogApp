import { Component } from '@angular/core';
import { CreateRoleDto, Role } from '../../../../../models/roles/role.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '../../../../../services/role.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {
  // Component State
  roles: Role[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Form ve Modal State
  isModalOpen = false;
  roleForm: FormGroup;
  
  // 'null' ise "Create", 'string' (ID) ise "Edit" modundayız
  currentRoleId: string | null = null; 

  constructor(
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  // --- 1. READ (Listeleme) ---
  loadRoles(): void {
    this.isLoading = true;
    this.error = null;
    
    this.roleService.getRoles().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Roller yüklenirken hata:', err);
        this.error = 'Roller yüklenemedi. (Hata: ' + (err.error?.message || err.message) + ')';
      }
    });
  }

  // --- 2. CREATE & UPDATE (Form Gönderme) ---
  onSubmit(): void {
    if (this.roleForm.invalid) {
      return;
    }

    // "Create" (Oluşturma) modundayız
    if (this.currentRoleId === null) {
      const dto: CreateRoleDto = {
        name: this.roleForm.value.name
      };
      this.roleService.createRole(dto).subscribe({
        next: () => {
          this.loadRoles();
          this.closeModal();
        },
        error: (err) => this.error = 'Rol oluşturulamadı.'
      });
    }
    // "Update" (Güncelleme) modundayız
    else {
      const updatedRole: Role = {
        id: this.currentRoleId,
        name: this.roleForm.value.name
      };
      this.roleService.updateRole(this.currentRoleId, updatedRole).subscribe({
        next: () => {
          this.loadRoles();
          this.closeModal();
        },
        error: (err) => this.error = 'Rol güncellenemedi.'
      });
    }
  }

  // --- 3. DELETE (Silme) ---
  onDelete(id: string): void {
    // ÖNEMLİ: Gerçek bir uygulamada, 'Admin' veya 'User' rolünün
    // silinmesini engellemek için burada (veya API'de) ekstra kontrol yapılmalıdır.
    if (confirm('Bu rolü silmek istediğinizden emin misiniz?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.loadRoles();
        },
        error: (err) => this.error = 'Rol silinemedi.'
      });
    }
  }

  // --- Modal (Açılır Pencere) Kontrolleri ---
  
  openCreateModal(): void {
    this.currentRoleId = null;
    this.roleForm.reset();
    this.isModalOpen = true;
  }

  openEditModal(role: Role): void {
    this.currentRoleId = role.id;
    this.roleForm.patchValue({ name: role.name });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentRoleId = null;
    this.roleForm.reset();
  }

  // Form validasyonu için getter
  get name() {
    return this.roleForm.get('name');
  }
}
