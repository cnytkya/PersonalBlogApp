import { Component } from '@angular/core';
import { VisitorHeaderComponent } from "../../pages/visitor-header/visitor-header.component";
import { VisitorFooterComponent } from "../../pages/visitor-footer/visitor-footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-visitor-layout',
  imports: [RouterOutlet, // Sayfa içeriğini yüklemek için
    VisitorHeaderComponent, // Header'ımız
    VisitorFooterComponent],  // Footer'ımız
  templateUrl: './visitor-layout.component.html',
  styleUrl: './visitor-layout.component.scss'
})
export class VisitorLayoutComponent {

}
