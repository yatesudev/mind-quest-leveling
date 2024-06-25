// app.component.ts
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showFooter: boolean = true;
  isSpecialEvent: boolean = false;
  
  constructor(private toastr: ToastrService) { }

  specialEvent() {
    console.log('Special event');
    this.toastr.info('Special Event triggered', 'Success');

    // Play the audio
    const audio = document.getElementById('specialEventAudio') as HTMLAudioElement;
    if (audio) {
      audio.play();
    }

    this.isSpecialEvent = true;
  }

  clearSpecialEvent() {
    console.log('Clear special event');
    const audio = document.getElementById('specialEventAudio') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.isSpecialEvent = false;
  }
}
