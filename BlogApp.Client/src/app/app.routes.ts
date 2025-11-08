import { Routes } from '@angular/router';
import { VisitorLayoutComponent } from './components/layouts/visitor-layout/visitor-layout.component';
import { HomeComponent } from './components/layouts/visitor-layout/pages/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

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
            
            // path: 'about' (yani /about) -> (İleride AboutComponent'i yükleyecek)
            // { path: 'about', component: AboutComponent },
        ]
    },

    // --- AUTH ROTALARI ---
    // Bu rotalar visitor layout dışında, kendi bağımsız sayfalarında gösterilir
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

    // --- ADMIN ROTALARI ---
    // (Admin layout'u oluşturduktan sonra burayı dolduracağız)
    // {
    //   path: 'admin',
    //   component: AdminLayoutComponent,
    //   children: [ ... ]
    // }

    // --- 404 SAYFASI ---
    // {
    //   path: '**',
    //   component: PageNotFoundComponent
    // }
];