import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Gerekli servis ve modeller
import { environment } from '../env/environment';
import { AuthService } from './auth.service';
import { User, CreateUserDto, UpdateUserDto } from '../models/users/user.model';
import { ChangePassword } from '../models/profile/change-password.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = `${environment.apiUrl}/users`;

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

  // --- CRUD METOTLARI (API'deki UsersController'a göre) ---

  /**
   * (GET) Tüm kullanıcıları listeler.
   */
  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(this.apiUrl, { headers: headers });
  }

  /**
   * (GET) ID'ye göre tek bir kullanıcı getirir.
   */
  getUserById(id: string): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/id/${id}`, { headers: headers });
  }

  /**
   * (POST) Yeni bir kullanıcı oluşturur (Admin tarafından).
   */
  createUser(userDto: CreateUserDto): Observable<User> {
    const headers = this.getAuthHeaders();
    // API (CreatedAtAction) yeni oluşturulan kullanıcıyı döndürür
    return this.http.post<User>(this.apiUrl, userDto, { headers: headers });
  }

  /**
   * (PUT) Mevcut bir kullanıcıyı günceller.
   */
  updateUser(id: string, userDto: UpdateUserDto): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(`${this.apiUrl}/${id}`, userDto, { headers: headers });
  }

  /**
   * (DELETE) Bir kullanıcıyı siler.
   */
  deleteUser(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  /**
   * (POST) Giriş yapmış kullanıcının şifresini değiştirir.
   */
  changePassword(dto: ChangePassword): Observable<void> {
    const headers = this.getAuthHeaders();
    // 'change-password' endpoint'ine POST isteği atıyoruz
    return this.http.post<void>(`${this.apiUrl}/change-password`, dto, { headers: headers });
  }
}