import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
   // Dashboard'da göstermek istediğimiz örnek veriler
  totalUsers: number = 0;
  totalBlogs: number = 0;
  totalCategories: number = 0;
  recentActivities: string[] = [];

  constructor() { }

  ngOnInit(): void {
    // Component yüklendiğinde çalışacak metot
    // Normalde burada API çağrıları yapılır ve veriler doldurulur.
    // Şimdilik örnek verilerle dolduruyoruz.
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Buradaki veriler ileride bir servis (örn: DashboardService) üzerinden
    // API'den çekilecektir.
    
    // Simülasyon: Veri yükleme süresi
    setTimeout(() => {
      this.totalUsers = 1250;
      this.totalBlogs = 450;
      this.totalCategories = 32;
      this.recentActivities = [
        "Yeni bir blog yazısı eklendi: 'Angular Nedir?'",
        "Kullanıcı 'Ahmet Yılmaz' kayıt oldu.",
        "Kategori 'Yazılım Geliştirme' güncellendi.",
        "Admin 'Mehmet Demir' bir yorumu sildi."
      ];
      console.log('Dashboard verileri yüklendi.');
    }, 500); // Yarım saniye sonra verileri yükle
  }
}
