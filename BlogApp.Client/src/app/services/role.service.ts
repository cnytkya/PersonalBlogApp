import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Gerekli servis ve modeller
import { environment } from '../env/environment';
import { AuthService } from './auth.service';
import { Role, CreateRoleDto } from '../models/roles/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  // API endpoint'ini '/api/roles' olarak varsayıyoruz
  private apiUrl = `${environment.apiUrl}/roles`;

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

  // --- CRUD METOTLARI ---

  /**
   * (GET) Tüm rolleri listeler.
   */
  getRoles(): Observable<Role[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Role[]>(this.apiUrl, { headers: headers });
  }

  /**
   * (POST) Yeni bir rol oluşturur.
   */
  createRole(roleDto: CreateRoleDto): Observable<Role> {
    const headers = this.getAuthHeaders();
    return this.http.post<Role>(this.apiUrl, roleDto, { headers: headers });
  }

  /**
   * (PUT) Mevcut bir rolü günceller.
   * Not: API'niz muhtemelen ID'yi URL'den, 'name'i body'den alacaktır.
   */
  updateRole(id: string, role: Role): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(`${this.apiUrl}/${id}`, role, { headers: headers });
  }

  /**
   * (DELETE) Bir rolü siler.
   * Not: 'Admin' ve 'User' gibi temel rolleri API'de silmeyi engellemeniz önerilir.
   */
  deleteRole(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }
}