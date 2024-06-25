// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showFooter: boolean = true;
  isSpecialEvent: boolean = false;
  

  specialEvent() {
    console.log('Special event');
    this.isSpecialEvent = true;
  }

  clearSpecialEvent() {
    console.log('Clear special event');
    this.isSpecialEvent = false;
  }
}
