import { Component } from '@angular/core';
import { SideBarComponent } from "./common/side-bar/side-bar.component";
import { TopBarComponent } from "./common/top-bar/top-bar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [SideBarComponent, TopBarComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
