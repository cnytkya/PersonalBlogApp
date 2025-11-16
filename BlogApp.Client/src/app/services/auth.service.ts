import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs'; // 'tap' operatörünü import edin
import { environment } from '../env/environment';
// Modellerimizi import ediyoruz
import { Login } from '../models/auth/login.model';
import { AuthResponse } from '../models/auth/auth-response.model';
import { Register } from '../models/auth/register.model';
import { jwtDecode } from 'jwt-decode';

// JWT'yi local storage'da saklamak için anahtar
const AUTH_TOKEN_KEY = 'authToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // API endpoint'lerini environment'tan alıyoruz
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient, 
    private router: Router
  ) { }

  /**
   * API'ye login isteği gönderir.
   * Başarılıysa, token'ı kaydeder.
   */
  login(loginData: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        // 'tap' operatörü, Observable'a müdahale etmeden araya girer
        tap(response => {
          if (response.isSuccess && response.token) {
            this.saveToken(response.token);
          }
        })
      );
  }

  /**
   * API'ye register isteği gönderir.
   * Başarılıysa, token'ı kaydeder (opsiyonel olarak).
   */
  register(registerData: Register): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        // API'miz kayıt sonrası otomatik token döndürdüğü için, 
        // kullanıcıyı direkt giriş yapmış sayabiliriz.
        tap(response => {
          if (response.isSuccess && response.token) {
            this.saveToken(response.token);
          }
        })
      );
  }

  /**
   * Token'ı localStorage'a kaydeder.
   */
  private saveToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  /**
   * Token'ı localStorage'dan alır.
   */
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Kullanıcının giriş yapıp yapmadığını kontrol eder.
   */
  isLoggedIn(): boolean {
    // Sadece token'ın varlığını kontrol ediyoruz.
    // (Daha gelişmiş versiyonda token'ın süresini de kontrol edebiliriz)
    return this.getToken() !== null;
  }

  /**
   * Kullanıcı çıkışı yapar, token'ı siler ve login sayfasına yönlendirir.
   */
  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.router.navigate(['/']);
  }

  /**
   * Token'ı çözer ve içindeki tüm veriyi döndürür.
   */
  private getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        // Token'ı çöz
        return jwtDecode(token);
      } catch (Error) {
        // Token geçersizse veya süresi dolmuşsa
        console.error("Geçersiz token:", Error);
        this.logout(); // Hatalı token'ı temizle
        return null;
      }
    }
    return null;
  }

  /**
   * O an giriş yapmış kullanıcının ID'sini (JWT'deki 'sub' claim'i) döndürür.
   */
  public getCurrentUserId(): string | null {
    const decodedToken = this.getDecodedToken();
    // 'sub' (Subject), ASP.NET Identity'nin JWT'de kullandığı standart Kullanıcı ID'si claim'idir.
    return decodedToken ? decodedToken.sub : null;
  }

  /**
   * O an giriş yapmış kullanıcının Adını (JWT'deki 'firstName' claim'i) döndürür.
   * (Bunu TopBar'da "Hoşgeldin Admin" demek için kullanabiliriz)
   */
  public getCurrentUserFirstName(): string | null {
    const decodedToken = this.getDecodedToken();
    // API'deki TokenService'te 'firstName' adıyla özel bir claim eklemiştik.
    return decodedToken ? decodedToken.firstName : null;
  }
}