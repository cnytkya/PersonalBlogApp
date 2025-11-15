import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment';
import { AuthService } from './auth.service';
import { Category } from '../models/categories/category.model';
import { CreateCategoryDto } from '../models/categories/create-category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  // API adresini environment'tan alıyoruz
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(
    private http: HttpClient,
    private authService: AuthService // Token'ı almak için AuthServis'i enjekte ediyoruz
  ) { }

  /**
   * INTERCEPTOR KULLANMADIĞIMIZ İÇİN GEREKLİ:
   * Her yetkili istek için Authorization (Bearer Token) başlığını (Header)
   * manuel olarak oluşturan özel bir metot.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    
    // Token yoksa (kullanıcı giriş yapmamışsa) login'e yönlendir
    if (!token) {
      this.authService.logout();
      return new HttpHeaders();
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // --- CRUD METOTLARI ---

  /**
   * (GET) Tüm kategorileri listeler.
   * Admin paneli olduğu için bu isteği de yetkili (token ile) yapıyoruz.
   */
  getCategories(): Observable<Category[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Category[]>(this.apiUrl, { headers: headers });
  }

  /**
   * (GET) ID'ye göre tek bir kategori getirir.
   */
  getCategoryById(id: number): Observable<Category> {
    const headers = this.getAuthHeaders();
    return this.http.get<Category>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  /**
   * (POST) Yeni bir kategori oluşturur.
   */
  createCategory(categoryDto: CreateCategoryDto): Observable<Category> {
    const headers = this.getAuthHeaders();
    // API (CreatedAtAction) yeni oluşturulan kategoriyi döndürür
    return this.http.post<Category>(this.apiUrl, categoryDto, { headers: headers });
  }

  /**
   * (PUT) Mevcut bir kategoriyi günceller.
   */
  updateCategory(id: number, category: Category): Observable<void> {
    const headers = this.getAuthHeaders();
    // PUT istekleri genellikle 204 No Content (içerik yok) döndürür
    return this.http.put<void>(`${this.apiUrl}/${id}`, category, { headers: headers });
  }

  /**
   * (DELETE) Bir kategoriyi siler.
   */
  deleteCategory(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    // DELETE istekleri de genellikle 204 No Content döndürür
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }
}