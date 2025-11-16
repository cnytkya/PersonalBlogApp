import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ngFor için
import { RouterLink } from '@angular/router';
import { SliderComponent } from '../../common/slider/slider.component';


@Component({
  selector: 'app-home',
  standalone: true,
  // YENİ: SliderComponent'i imports dizisine ekle
  imports: [CommonModule, RouterLink, SliderComponent], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  // Bu veriler (features, recentPosts)
  // HTML'inizin alt kısımlarında kullanılıyor, o yüzden kalmalılar.
  features = [
    { icon: 'fas fa-rocket', title: 'Hızlı ve Modern', description: 'En son teknolojilerle anında yüklenme hızları.' },
    { icon: 'fas fa-palette', title: 'Özelleştirilebilir', description: 'Kendi tarzınızı yansıtan temalar ve ayarlar.' },
    { icon: 'fas fa-users', title: 'Topluluk Odaklı', description: 'Yorum yapın, tartışın ve topluluğa katılın.' },
    { icon: 'fas fa-shield-alt', title: 'Güvenli ve Güvenilir', description: 'Verileriniz bizimle güvende, kesintisiz hizmet.' }
  ];

  recentPosts = [
    { category: 'Teknoloji', date: '10 Kasım 2025', title: 'Angular 19 ile Gelenler', excerpt: 'Angular 19, yepyeni özellikleri ve performans iyileştirmeleri ile... ', author: 'Ahmet Y.' },
    { category: 'Yazılım', date: '8 Kasım 2025', title: '.NET 9\'da API Geliştirme', excerpt: 'ASP.NET 9, minimal API\'ler ve güvenlik konusunda çığır açıyor...', author: 'Elif K.' },
    { category: 'Kariyer', date: '5 Kasım 2025', title: 'Başarılı Bir Proje Yöneticisi Olmak', excerpt: 'Ekip yönetimi, zaman planlaması ve daha fazlası hakkında ipuçları...', author: 'Can S.' }
  ];
}