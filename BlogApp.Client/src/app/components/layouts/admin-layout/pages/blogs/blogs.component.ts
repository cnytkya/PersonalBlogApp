import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

// Gerekli servis ve modeller
import { BlogService } from '../../../../../services/blog.service';
import { CategoryService } from '../../../../../services/category.service'; // Kategori dropdown'ı için
import { Blog, CreateBlogDto, UpdateBlogDto } from '../../../../../models/blogs/blog.model';
import { Category } from '../../../../../models/categories/category.model';


@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit {

  // Component State
  blogs: Blog[] = [];
  categories: Category[] = []; // Kategori <select> listesi için
  isLoading = false;
  error: string | null = null;
  
  // Form ve Modal State
  isModalOpen = false;
  blogForm: FormGroup;
  
  // 'null' ise "Create", 'number' (ID) ise "Edit" modundayız
  currentBlogId: number | null = null; 

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private categoryService: CategoryService // Kategorileri çekmek için
  ) {
    // Formu, tüm DTO alanlarını içerecek şekilde başlatıyoruz
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      imgUrl: [''], // Resim URL'si (opsiyonel)
      categoryId: [null, [Validators.required]] // Kategori ID'si
    });
  }

  ngOnInit(): void {
    // Sayfa yüklendiğinde hem blogları hem de kategorileri yükle
    this.loadBlogs();
    this.loadCategories();
  }

  // --- VERİ YÜKLEME METOTLARI ---

  loadBlogs(): void {
    this.isLoading = true;
    this.error = null;
    
    this.blogService.getBlogs().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.blogs = data;
      },
      error: (err) => {
        this.error = 'Blog yazıları yüklenemedi.';
      }
    });
  }

  loadCategories(): void {
    // Blog formundaki dropdown'ı doldurmak için
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error("Kategoriler yüklenemedi", err);
      }
    });
  }

  // --- CRUD (Form Gönderme) ---
  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    // "Create" (Oluşturma) modundayız
    if (this.currentBlogId === null) {
      const dto: CreateBlogDto = this.blogForm.value;
      
      this.blogService.createBlog(dto).subscribe({
        next: () => {
          this.loadBlogs();
          this.closeModal();
        },
        error: (err) => this.error = 'Blog yazısı oluşturulamadı.'
      });
    }
    // "Update" (Güncelleme) modundayız
    else {
      const dto: UpdateBlogDto = {
        id: this.currentBlogId,
        ...this.blogForm.value
      };
      
      this.blogService.updateBlog(this.currentBlogId, dto).subscribe({
        next: () => {
          this.loadBlogs();
          this.closeModal();
        },
        error: (err) => this.error = 'Blog yazısı güncellenemedi.'
      });
    }
  }

  // --- DELETE (Silme) ---
  onDelete(id: number): void {
    if (confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      this.blogService.deleteBlog(id).subscribe({
        next: () => {
          this.loadBlogs();
        },
        error: (err) => this.error = 'Blog yazısı silinemedi.'
      });
    }
  }

  // --- Modal (Açılır Pencere) Kontrolleri ---
  
  openCreateModal(): void {
    this.currentBlogId = null;
    this.blogForm.reset();
    this.isModalOpen = true;
  }

  openEditModal(blog: Blog): void {
    this.currentBlogId = blog.id;
    // Formu, seçilen blog'un verileriyle doldur
    this.blogForm.patchValue({
      title: blog.title,
      imgUrl: blog.imgUrl,
      categoryId: blog.categoryId
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentBlogId = null;
    this.blogForm.reset();
  }

  // Form validasyonu için getter
  get f() { return this.blogForm.controls; }
}