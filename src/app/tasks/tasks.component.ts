import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;

  websitesEnrichment = [
    { name: 'Trolley Problems', url: 'https://neal.fun/absurd-trolley-problems/' },
    { name: 'Breath Excercise', url: 'https://mindfuldevmag.com/breathing-timer/' },
    { name: 'Meditation Timer', url: 'https://mindfuldevmag.com/meditation-timer/'},
    { name: 'Draw Perfect Circle', url: 'https://neal.fun/perfect-circle/' },
  ];

  websitesEducation = [
    { name: 'Dark Patterns', url: 'https://neal.fun/dark-patterns/' },
    { name: 'The Deep Sea', url: 'https://neal.fun/deep-sea/' },
    { name: 'The Size of Space', url: 'https://neal.fun/size-of-space/'},
    { name: 'Future of Universe', url: 'https://neal.fun/universe-forecast/' },
    { name: 'Life stats', url: 'https://neal.fun/life-stats/' },
  ];

  websitesGames = [
    { name: 'Key Quest', url: 'https://www.jopi.com/gam/key-quest/'},
    //https://www.jopi.com/gam/way-to-home/
    { name: 'Flappy Bird', url: 'https://flappybird.io/'},
    //https://www.jopi.com/gam/pixel-mini-golf/
    { name: 'Pixel Mini Golf', url: 'https://www.jopi.com/gam/pixel-mini-golf/'},
  ]

  currentUrl: string | null = null;

  loadWebsite(url: string) {
    if (this.iframe) {
      this.iframe.nativeElement.src = url;
      this.currentUrl = url; // Update currentUrl when a website is loaded

      setTimeout(() => {
        this.iframe.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      console.error('Iframe element not found');
    }
  }
}
