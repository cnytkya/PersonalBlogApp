import { Component, OnInit, OnDestroy, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Blog } from '../../../../../models/blogs/blog.model';
import { BlogService } from '../../../../../services/blog.service';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent implements OnInit, OnDestroy {
  // Signals for modern Angular approach
  recentBlogs = signal<Blog[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentSlide = signal(0);
  isAutoPlaying = signal(true);

  // Computed values
  totalSlides = computed(() => this.recentBlogs().length);
  currentBlog = computed(() => this.recentBlogs()[this.currentSlide()]);

  private autoPlayInterval: any;
  private readonly AUTO_PLAY_DELAY = 5000;
  private touchStartX = 0;
  private touchEndX = 0;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadRecentBlogs();
  }

  ngOnDestroy(): void {
    this.clearAutoPlay();
  }

  // Klavye navigasyonu için
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.recentBlogs().length <= 1) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.prevSlide();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextSlide();
        break;
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        this.toggleAutoPlay();
        break;
    }
  }

  // Touch events for mobile swipe
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  loadRecentBlogs(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.blogService.getPublicRecentBlogs().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (blogs) => {
        this.recentBlogs.set(blogs);
        if (blogs.length > 0) {
          this.startAutoPlay();
        }
      },
      error: (err) => {
        this.error.set("Son bloglar yüklenemedi. Lütfen daha sonra tekrar deneyin.");
        console.error('Blog yükleme hatası:', err);
      }
    });
  }

  // --- SLIDER KONTROLLERİ ---

  startAutoPlay(): void {
    if (this.isAutoPlaying() && this.recentBlogs().length > 1) {
      this.clearAutoPlay();
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, this.AUTO_PLAY_DELAY);
    }
  }

  clearAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  toggleAutoPlay(): void {
    this.isAutoPlaying.set(!this.isAutoPlaying());
    
    if (this.isAutoPlaying()) {
      this.startAutoPlay();
    } else {
      this.clearAutoPlay();
    }
  }

  nextSlide(): void {
    if (this.recentBlogs().length === 0) return;
    
    const nextSlide = (this.currentSlide() + 1) % this.recentBlogs().length;
    this.currentSlide.set(nextSlide);
    
    // Auto-play'i sıfırla (kullanıcı etkileşimi sonrası)
    if (this.isAutoPlaying()) {
      this.restartAutoPlay();
    }
  }

  prevSlide(): void {
    if (this.recentBlogs().length === 0) return;
    
    const prevSlide = (this.currentSlide() - 1 + this.recentBlogs().length) % this.recentBlogs().length;
    this.currentSlide.set(prevSlide);
    
    // Auto-play'i sıfırla (kullanıcı etkileşimi sonrası)
    if (this.isAutoPlaying()) {
      this.restartAutoPlay();
    }
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.recentBlogs().length) {
      this.currentSlide.set(index);
      
      // Auto-play'i sıfırla (kullanıcı etkileşimi sonrası)
      if (this.isAutoPlaying()) {
        this.restartAutoPlay();
      }
    }
  }

  private restartAutoPlay(): void {
    this.clearAutoPlay();
    this.startAutoPlay();
  }

  // Yardımcı metodlar
  getSlideProgress(): number {
    return ((this.currentSlide() + 1) / this.recentBlogs().length) * 100;
  }

  // Blog özeti oluşturma (eğer modelde yoksa)
  generateSummary(content: string, maxLength: number = 150): string {
    if (!content) return 'Bu blog yazısını okumak için devamını oku butonuna tıklayın.';
    
    const cleanedContent = content.replace(/<[^>]*>/g, ''); // HTML tag'larını temizle
    return cleanedContent.length > maxLength 
      ? cleanedContent.substring(0, maxLength) + '...' 
      : cleanedContent;
  }

  // Resim yükleme hatası durumunda fallback
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://placehold.co/1920x1080/E0E7FF/333?text=Resim+Yok';
  }

  // Kategori rengi belirleme
  getCategoryColor(categoryName: string): string {
    const colors: { [key: string]: string } = {
      '.NET Core': 'from-blue-400 to-blue-600',
      'Yaşam': 'from-green-400 to-green-600',
      'Eğitim': 'from-purple-400 to-purple-600',
      'Sanat': 'from-pink-400 to-pink-600',
      'Spor': 'from-red-400 to-red-600',
      'default': 'from-amber-400 to-amber-500'
    };

    return colors[categoryName] || colors['default'];
  }
}