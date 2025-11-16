import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // AuthService'i import edin

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // AuthService üzerinden kullanıcının giriş yapıp yapmadığını kontrol et
    if (this.authService.isLoggedIn()) {
      return true; // Giriş yapmışsa rotaya erişime izin ver
    } else {
      // Giriş yapmamışsa login sayfasına yönlendir ve erişime izin verme
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}