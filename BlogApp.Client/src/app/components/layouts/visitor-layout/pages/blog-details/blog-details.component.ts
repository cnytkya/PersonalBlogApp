import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // HTML Güvenliği için
import { finalize } from 'rxjs/operators';

// Servis ve Model importlarını kendi dosya yolunuza göre kontrol edin
import { BlogService } from '../../../../../services/blog.service';
import { Blog } from '../../../../../models/blogs/blog.model';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss'
})
export class BlogDetailsComponent implements OnInit {

  // Modern Angular State Yönetimi (Signals)
  blog = signal<Blog | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  
  // HTML içeriğini güvenli bir şekilde saklamak için
  safeContent = signal<SafeHtml | null>(null);

  constructor(
    private route: ActivatedRoute, // URL'den ID okumak için
    private blogService: BlogService, // API isteği için
    private sanitizer: DomSanitizer // HTML içeriğini temizlemek/onaylamak için
  ) {}

  ngOnInit(): void {
    // Sayfa yüklendiğinde URL'deki değişiklikleri dinle
    // (Örn: /blogs/1'den /blogs/2'ye geçişte sayfa yenilenmez, bu yüzden subscribe oluyoruz)
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      
      if (idParam) {
        // String ID'yi number'a çevirip yüklemeyi başlat
        this.loadBlogDetails(+idParam);
      } else {
        this.error.set("Geçersiz Blog ID'si.");
        this.isLoading.set(false);
      }
    });
  }

  loadBlogDetails(id: number): void {
    this.isLoading.set(true);
    this.error.set(null); // Önceki hataları temizle

    // Public (Token gerektirmeyen) metodu çağırıyoruz
    this.blogService.getPublicBlogById(id).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.blog.set(data);
        
        // API'den gelen HTML içeriğini (Content) güvenli hale getir
        if (data.content) {
          // bypassSecurityTrustHtml: Angular'a "Bu HTML güvenlidir, render et" der.
          this.safeContent.set(
            this.sanitizer.bypassSecurityTrustHtml(data.content)
          );
        }
      },
      error: (err) => {
        this.error.set("Blog yazısı bulunamadı veya bir hata oluştu.");
        console.error('Blog detayı hatası:', err);
      }
    });
  }
}