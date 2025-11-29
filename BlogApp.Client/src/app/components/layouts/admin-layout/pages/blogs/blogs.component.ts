import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { BlogService } from '../../../../../services/blog.service';
import { CategoryService } from '../../../../../services/category.service';
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

  blogs: Blog[] = [];
  categories: Category[] = [];
  isLoading = false;
  error: string | null = null;
  
  isModalOpen = false;
  blogForm: FormGroup;
  currentBlogId: number | null = null; 

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private categoryService: CategoryService
  ) {
    // Formu başlatırken 'content' alanını ekliyoruz
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      // YENİ: Content alanı (Zorunlu ve min 50 karakter)
      content: ['', [Validators.required, Validators.minLength(50)]], 
      imgUrl: [''],
      categoryId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadBlogs();
    this.loadCategories();
  }

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
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error("Kategoriler yüklenemedi", err)
    });
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

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
  
  openCreateModal(): void {
    this.currentBlogId = null;
    this.blogForm.reset();
    this.isModalOpen = true;
  }

  openEditModal(blog: Blog): void {
    this.currentBlogId = blog.id;
    // Formu doldururken 'content'i de ekliyoruz
    this.blogForm.patchValue({
      title: blog.title,
      content: blog.content, // YENİ
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

  get f() { return this.blogForm.controls; }
}