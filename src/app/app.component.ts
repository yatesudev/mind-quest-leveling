// app.component.ts
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showFooter: boolean = true; // Flag to show/hide footer
  isSpecialEvent: boolean = false; // Flag for special event state
  
  constructor(private toastr: ToastrService) { }

  // Handle special event
  specialEvent() {
    console.log('Special event');
    this.toastr.info('Special Event triggered', 'Success'); // Show toast message

    const audio = document.getElementById('specialEventAudio') as HTMLAudioElement;
    if (audio) {
      audio.play(); // Play audio if available
    }

    this.isSpecialEvent = true; // Set special event flag
  }

  // Clear special event
  clearSpecialEvent() {
    const audio = document.getElementById('specialEventAudio') as HTMLAudioElement;
    if (audio) {
      audio.pause(); // Pause audio
      audio.currentTime = 0; // Reset audio time
    }
    this.isSpecialEvent = false; // Reset special event flag
  }
}