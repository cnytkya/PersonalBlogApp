import { Routes } from '@angular/router';

// --- Auth Components (Layout'suz) ---
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

// --- Visitor Layout ve Sayfaları ---
import { VisitorLayoutComponent } from './components/layouts/visitor-layout/visitor-layout.component';
import { HomeComponent } from './components/layouts/visitor-layout/pages/home/home.component';

// --- Admin Layout ve Sayfaları (YENİ İMPORTLAR) ---
// Resimdeki şemanıza göre (pages klasörü altı) yolları güncelledim.
import { AdminLayoutComponent } from './components/layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/layouts/admin-layout/pages/dashboard/dashboard.component';
import { CategoriesComponent } from './components/layouts/admin-layout/pages/categories/categories.component';
import { ProfileComponent } from './components/layouts/admin-layout/pages/profile/profile.component';
import { ChangePasswordComponent } from './components/layouts/admin-layout/pages/profile/change-password/change-password.component';
import { RolesComponent } from './components/layouts/admin-layout/pages/roles/roles.component';
import { UsersComponent } from './components/layouts/admin-layout/pages/users/users.component';


export const routes: Routes = [

  // --- AUTH ROTALARI (Layout'suz) ---
  // Değişiklik yok, burası doğru.
  {
    path: 'login',
    component: LoginComponent,
    title: 'Giriş Yap'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Kayıt Ol'
  },


  // --- ADMIN ROTALARI (AdminLayout) ---
  // '/admin' ile başlayan tüm URL'ler buraya yönlenir
  // ve AdminLayoutComponent'i (Sidebar, Topbar vb.) yükler.
  // 'children' alanı resimdeki şemaya göre GÜNCELLENDİ.
  {
    path: 'admin',
    component: AdminLayoutComponent,
    // canActivate: [AdminGuard] <-- ÇOK ÖNEMLİ:
    // Bir sonraki adımda, buraya SADECE 'Admin' rolündekilerin
    // girmesini sağlayan bir 'AdminGuard' eklememiz gerekecek.
    children: [
      // path: 'admin/dashboard'
      // LoginComponent'te yönlendirdiğimiz 'admin/dashboard' burası.
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },

      // path: 'admin/users'
      { path: 'users', component: UsersComponent, title: 'Kullanıcı Yönetimi' },

      // path: 'admin/roles'
      { path: 'roles', component: RolesComponent, title: 'Rol Yönetimi' },

      // path: 'admin/categories'
      { path: 'categories', component: CategoriesComponent, title: 'Kategori Yönetimi' },
      
      // path: 'admin/profile'
      { path: 'profile', component: ProfileComponent, title: 'Profilim' },
      
      // path: 'admin/profile/change-password' (Resimdeki klasör yapısına göre)
      { path: 'profile/change-password', component: ChangePasswordComponent, title: 'Şifre Değiştir' },
      
      // /admin (boş) girilirse, otomatik olarak dashboard'a yönlendir:
      // (Her zaman 'children' listesinin en sonunda olmalı)
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },


  // --- ZİYARETÇİ ROTALARI (VisitorLayout) ---
  // Değişiklik yok, burası doğru.
  // BU BLOK HER ZAMAN EN SONDA OLMALIDIR.
  {
    path: '',
    component: VisitorLayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'Anasayfa' },
      // { path: 'blogs', component: BlogListComponent, title: 'Blog' },
    ]
  },

  
  // --- 404 SAYFASI ---
  // { path: '**', component: PageNotFoundComponent }
];