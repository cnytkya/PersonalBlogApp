import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-visitor-footer',
  imports: [RouterLink],
  templateUrl: './visitor-footer.component.html',
  styleUrl: './visitor-footer.component.scss'
})
export class VisitorFooterComponent {
  currentYear = new Date().getFullYear();
}
