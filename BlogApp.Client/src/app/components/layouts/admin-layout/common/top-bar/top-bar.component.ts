import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  // AuthService'i enjekte ediyoruz
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Kullanıcı çıkışı yapar.
   * AuthService'teki logout metodu token'ı siler ve
   * bizi login sayfasına yönlendirir.
   */
  logout(): void {
    this.authService.logout();
  }
}
