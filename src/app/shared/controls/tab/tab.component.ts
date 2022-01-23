import { Component, Input } from '@angular/core';
import { TabbedPaneComponent } from '../tabbed-pane/tabbed-pane.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {
  @Input({ required: true }) title!: string;
  visible = true;

  constructor(pane: TabbedPaneComponent) {
    pane.register(this);
  }
}
