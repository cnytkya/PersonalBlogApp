import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../../models/categories/category.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../../services/category.service';
import { finalize } from 'rxjs';
import { CreateCategoryDto } from '../../../../../models/categories/create-category.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-categories',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit{
  // Component State (Bileşenin durumları)
  categories: Category[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Form ve Modal State
  isModalOpen = false;
  categoryForm: FormGroup;
  
  // 'null' ise "Create" modundayız, 'number' ise "Edit" modundayız
  currentCategoryId: number | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder // FormBuilder'ı enjekte et
  ) {
    // Kategori Ekle/Düzenle formunu başlatıyoruz
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
  ngOnInit(): void {
    this.loadCategories();
  }

  // --- 1. READ (Listeleme) ---
  loadCategories(): void {
    this.isLoading = true;
    this.error = null;
    
    this.categoryService.getCategories().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Kategoriler yüklenirken hata:', err);
        this.error = 'Kategoriler yüklenemedi. (Hata: ' + (err.error?.message || err.message) + ')';
      }
    });
  }
  // --- 2. CREATE & UPDATE (Form Gönderme) ---
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return; // Form geçerli değilse gönderme
    }

    // "Create" (Oluşturma) modundayız
    if (this.currentCategoryId === null) {
      const dto: CreateCategoryDto = {
        name: this.categoryForm.value.name
      };
      this.categoryService.createCategory(dto).subscribe({
        next: () => {
          this.loadCategories(); // Listeyi yenile
          this.closeModal(); // Modalı kapat
        },
        error: (err) => this.error = 'Kategori oluşturulamadı.'
      });
    }
    // "Update" (Güncelleme) modundayız
    else {
      const updatedCategory: Category = {
        id: this.currentCategoryId,
        name: this.categoryForm.value.name
      };
      this.categoryService.updateCategory(this.currentCategoryId, updatedCategory).subscribe({
        next: () => {
          this.loadCategories(); // Listeyi yenile
          this.closeModal(); // Modalı kapat
        },
        error: (err) => this.error = 'Kategori güncellenemedi.'
      });
    }
  }

  // --- 3. DELETE (Silme) ---
  onDelete(id: number): void {
    // Silmeden önce kullanıcıdan onay al
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories(); // Listeyi yenile
        },
        error: (err) => this.error = 'Kategori silinemedi.'
      });
    }
  }

  // --- Modal (Açılır Pencere) Kontrolleri ---
  
  // "Yeni Ekle" modalını açar
  openCreateModal(): void {
    this.currentCategoryId = null; // Create modundayız
    this.categoryForm.reset(); // Formu temizle
    this.isModalOpen = true; // Modalı aç
  }

  // "Düzenle" modalını açar
  openEditModal(category: Category): void {
    this.currentCategoryId = category.id; // Edit modundayız
    this.categoryForm.patchValue({ name: category.name }); // Formu doldur
    this.isModalOpen = true; // Modalı aç
  }

  // Modalı kapatır
  closeModal(): void {
    this.isModalOpen = false;
    this.currentCategoryId = null;
    this.categoryForm.reset();
  }

  // Form validasyonu için getter
  get name() {
    return this.categoryForm.get('name');
  }
}
