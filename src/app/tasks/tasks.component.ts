import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>; // Reference to iframe element

  // Enrichment websites list
  websitesEnrichment = [
    {
      name: 'Trolley Problems',
      url: 'https://neal.fun/absurd-trolley-problems/',
    },
    {
      name: 'Breath Exercise',
      url: 'https://mindfuldevmag.com/breathing-timer/',
    },
    {
      name: 'Meditation Timer',
      url: 'https://mindfuldevmag.com/meditation-timer/',
    },
    { name: 'Draw Perfect Circle', url: 'https://neal.fun/perfect-circle/' },
  ];

  // Education websites list
  websitesEducation = [
    { name: 'Dark Patterns', url: 'https://neal.fun/dark-patterns/' },
    { name: 'The Deep Sea', url: 'https://neal.fun/deep-sea/' },
    { name: 'The Size of Space', url: 'https://neal.fun/size-of-space/' },
    { name: 'Future of Universe', url: 'https://neal.fun/universe-forecast/' },
    { name: 'Life stats', url: 'https://neal.fun/life-stats/' },
  ];

  // Games websites list
  websitesGames = [
    { name: 'Key Quest', url: 'https://www.jopi.com/gam/key-quest/' },
    { name: 'Flappy Bird', url: 'https://flappybird.io/' },
    {
      name: 'Pixel Mini Golf',
      url: 'https://www.jopi.com/gam/pixel-mini-golf/',
    },
  ];

  currentUrl: string | null = null; // Current URL being displayed

  // Load a website into the iframe
  loadWebsite(url: string) {
    if (this.iframe) {
      this.iframe.nativeElement.src = url; // Set iframe source
      this.currentUrl = url; // Update current URL

      setTimeout(() => {
        this.iframe.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100); // Smooth scroll to iframe
    } else {
      console.error('Iframe element not found');
    }
  }
}
