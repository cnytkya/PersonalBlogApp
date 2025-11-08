import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-visitor-header',
  imports: [RouterLinkActive,RouterLink],
  templateUrl: './visitor-header.component.html',
  styleUrl: './visitor-header.component.scss'
})
export class VisitorHeaderComponent {
   isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
