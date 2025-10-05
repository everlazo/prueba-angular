import { Component } from '@angular/core';

@Component({
  selector: 'app-side-rail',
  standalone: true,
  templateUrl: './side-rail.component.html',
  styleUrls: ['./side-rail.component.scss']
})
export class SideRailComponent {
  onMenuClick() {
    // Aquí podrías emitir un evento o abrir un panel lateral
    console.log('[SideRail] Menu clicked');
  }
}
