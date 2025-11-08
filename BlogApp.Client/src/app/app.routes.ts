import { Routes } from '@angular/router';
import { VisitorLayoutComponent } from './components/layouts/visitor-layout/visitor-layout.component';
import { HomeComponent } from './components/pages/home/home.component';

export const routes: Routes = [
    // --- ZİYARETÇİ ROTALARI ---
  // path: '' (ana dizin) ile başlayan tüm rotalar
  // VisitorLayoutComponent'i ana bileşen olarak kullanır.
  {
    path: '',
    component: VisitorLayoutComponent,
    children: [
      // path: '' (yani /) -> HomeComponent'u yükler
      { path: '', component: HomeComponent, title: 'Anasayfa' },
      
      // path: 'blogs' (yani /blogs) -> (İleride BlogListComponent'i yükleyecek)
      // { path: 'blogs', component: BlogListComponent },
      
      // path: 'login' (yani /login) -> (İleride LoginComponent'i yükleyecek)
      // { path: 'login', component: LoginComponent },
    ]
  },

  // --- ADMIN ROTALARI ---
  // (Admin layout'u oluşturduktan sonra burayı dolduracağız)
  // {
  //   path: 'admin',
  //   component: AdminLayoutComponent,
  //   children: [ ... ]
  // }
];
