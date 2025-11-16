import { Routes } from '@angular/router';

// --- Auth Components (Layout'suz) ---
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

// --- Visitor Layout ve Sayfaları ---
import { VisitorLayoutComponent } from './components/layouts/visitor-layout/visitor-layout.component';
import { HomeComponent } from './components/layouts/visitor-layout/pages/home/home.component';

// --- Admin Layout ve Sayfaları ---
import { AdminLayoutComponent } from './components/layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/layouts/admin-layout/pages/dashboard/dashboard.component';
import { CategoriesComponent } from './components/layouts/admin-layout/pages/categories/categories.component';
import { ProfileComponent } from './components/layouts/admin-layout/pages/profile/profile.component';
import { ChangePasswordComponent } from './components/layouts/admin-layout/pages/profile/change-password/change-password.component';
import { RolesComponent } from './components/layouts/admin-layout/pages/roles/roles.component';
import { UsersComponent } from './components/layouts/admin-layout/pages/users/users.component';

// --- GUARDS ---
// AuthGuard'ı import ediyoruz
import { AuthGuard } from './guards/auth.guard'; 
import { BlogsComponent } from './components/layouts/admin-layout/pages/blogs/blogs.component';

export const routes: Routes = [

  // --- AUTH ROTALARI (Layout'suz) ---
  // Bu rotalar için AuthGuard kullanmıyoruz. LoginComponent'in kendisi
  // giriş başarılı olduğunda yönlendirme yapacaktır.
  // Giriş yapmış kullanıcıların bu sayfaları tekrar görmesini engellemek için
  // özel bir PublicGuard (veya LoginGuard) yazılabilir, ancak şimdilik bu şekilde bırakıyoruz.
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
  // SADECE GİRİŞ YAPMIŞ KULLANICILAR admin rotalarına erişebilir.
  // Rol bazlı kontrol (Admin rolü) için AdminGuard daha sonra eklenecek.
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard], // <-- Buraya AuthGuard eklendi!
    children: [
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
      { path: 'users', component: UsersComponent, title: 'Kullanıcı Yönetimi' },
      { path: 'roles', component: RolesComponent, title: 'Rol Yönetimi' },
      { path: 'categories', component: CategoriesComponent, title: 'Kategori Yönetimi' },
      { path: 'profile', component: ProfileComponent, title: 'Profilim' },
      { path: 'blogs', component: BlogsComponent, title: 'Makaleler' },
      { path: 'profile/change-password', component: ChangePasswordComponent, title: 'Şifre Değiştir' },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },


  // --- ZİYARETÇİ ROTALARI (VisitorLayout) ---
  // Ziyaretçi rotaları için giriş yapma zorunluluğu yok.
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