import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Gerekli servis ve modeller
import { environment } from '../env/environment';
import { AuthService } from './auth.service';
import { Blog, CreateBlogDto, UpdateBlogDto } from '../models/blogs/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  private apiUrl = `${environment.apiUrl}/blogs`;//admin tarafındaki blogs yönetimi için kullanıldı
  private publicApiUrl = `${environment.apiUrl}/publicblogs`; //visitor tarafındaki slider için

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) { }

  /**
   * Her istek için Authorization (Bearer Token) başlığını oluşturur.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    
    if (!token) {
      this.authService.logout();
      return new HttpHeaders();
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // --- CRUD METOTLARI (api/blogs için) ---

  /**
   * (GET) Tüm blogları listeler (Admin için).
   */
  getBlogs(): Observable<Blog[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Blog[]>(this.apiUrl, { headers: headers });
  }

  /**
   * (GET) ID'ye göre tek bir blog getirir.
   */
  getBlogById(id: number): Observable<Blog> {
    const headers = this.getAuthHeaders();
    return this.http.get<Blog>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  /**
   * (POST) Yeni bir blog oluşturur.
   */
  createBlog(blogDto: CreateBlogDto): Observable<Blog> {
    const headers = this.getAuthHeaders();
    return this.http.post<Blog>(this.apiUrl, blogDto, { headers: headers });
  }

  /**
   * (PUT) Mevcut bir blogu günceller.
   */
  updateBlog(id: number, blogDto: UpdateBlogDto): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(`${this.apiUrl}/${id}`, blogDto, { headers: headers });
  }

  /**
   * (DELETE) Bir blogu siler.
   */
  deleteBlog(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  /**
   * (GET) Herkese açık, son eklenen 5 blogu getirir.
   * Bu metot 'getAuthHeaders' ÇAĞIRMAZ, çünkü token'a ihtiyacı yoktur.
   */
  getPublicRecentBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.publicApiUrl}/recent`);
  }
}