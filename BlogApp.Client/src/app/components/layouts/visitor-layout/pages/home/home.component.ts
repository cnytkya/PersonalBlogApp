import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
   features = [
    {
      icon: 'fas fa-pencil-alt',
      title: 'Kolay Yazım',
      description: 'Zengin metin editörü ile kolayca blog yazıları oluşturun.'
    },
    {
      icon: 'fas fa-users',
      title: 'Topluluk',
      description: 'Binlerce yazar ve okuyucudan oluşan topluluğa katılın.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'İstatistikler',
      description: 'Yazılarınızın performansını detaylı istatistiklerle takip edin.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobil Uyumlu',
      description: 'Tüm cihazlarda mükemmel görünen responsive tasarım.'
    }
  ];

  recentPosts = [
    {
      title: 'Angular ile Modern Web Uygulamaları',
      excerpt: 'Angular frameworkünü kullanarak nasıl modern web uygulamaları geliştirebileceğinizi öğrenin.',
      author: 'Ahmet Yılmaz',
      date: '15 Ara 2023',
      category: 'Teknoloji'
    },
    {
      title: 'Tailwind CSS ile Hızlı Tasarım',
      excerpt: 'Tailwind CSS kullanarak nasıl hızlı ve modern arayüzler tasarlayabileceğinizi keşfedin.',
      author: 'Ayşe Demir',
      date: '12 Ara 2023',
      category: 'Tasarım'
    },
    {
      title: 'TypeScript Best Practices',
      excerpt: 'TypeScript projelerinizde uygulayabileceğiniz en iyi pratikleri ve patternleri inceleyelim.',
      author: 'Mehmet Kaya',
      date: '10 Ara 2023',
      category: 'Programlama'
    }
  ];
}
