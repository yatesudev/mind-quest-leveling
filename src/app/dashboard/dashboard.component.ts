import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../character.service';
import { AuthService } from '../auth.service';
import { ItemService } from '../item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  character: any = {
    class: '',
    level: 0,
    stats: {
      xp: 0
    }
  };

  user: any;
  lootboxes: number = 0;

  characterImage: string = '';
  xpPercentage: number = 0;


  timeLeft: number = 0;

  currentQuest: any = {
    name: "",
    description: "",
    xp: "",
    progress: 0,
    timeLeft: 0 // time left in milliseconds
  };

  constructor(
    private characterService: CharacterService,
    private authService: AuthService,
    private itemService: ItemService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setCharacterPanel();
  }

  animateProgressBar() {
    const startProgress = this.currentQuest.progress;
    const startTime = Date.now();
    const endTime = startTime + this.currentQuest.timeLeft;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(startProgress + (elapsed / this.currentQuest.timeLeft) * (100 - startProgress), 100);

      this.currentQuest.progress = progress;

      // Update timeLeft for display
      this.timeLeft = Math.max((endTime - now) / 1000 / 60, 0); // convert to minutes
      this.timeLeft = parseFloat(this.timeLeft.toFixed(2)); // round to 2 decimal places

      if (now < endTime) {
        requestAnimationFrame(animate);
      } else {
        if (this.currentQuest.progress) {
          window.location.reload(); // Refresh the page to update the character panel
        }
      }
    };

    requestAnimationFrame(animate);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setCharacterPanel() {
    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.characterService.getUser(userId).subscribe((response) => {
      if (response.user) {
        this.character = response.user.character;
        this.user = response.user;
        this.updateCurrentQuest(this.user.activeQuest);
        this.calculateXpPercentage(this.character.stats.xp);

        // Fetch lootboxes
        this.characterService.getUserLootboxes(userId).subscribe((lootboxResponse) => {
          this.lootboxes = lootboxResponse.lootboxes;
          console.log("Check amount of Lootboxes:", this.lootboxes);
        });
      }
    });
  }

  updateCurrentQuest(quest: any) {
    if (!quest) {
      return;
    }

    this.currentQuest = {
      name: quest.name,
      description: quest.description,
      xp: quest.xp,
      progress: this.calculateQuestProgress(quest.startTime, quest.endTime),
      timeLeft: this.calculateTimeLeft(quest.startTime, quest.endTime)
    };

    this.animateProgressBar(); // Ensure the animation starts after setting the current quest
  }

  calculateTimeLeft(startTime: Date, endTime: Date): number {
    const now = new Date();
    const end = new Date(endTime);

    return Math.max(end.getTime() - now.getTime(), 0); // time left in milliseconds
  }

  calculateQuestProgress(startTime: Date, endTime: Date): number {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = now.getTime() - start.getTime();

    return Math.min((elapsedDuration / totalDuration) * 100, 100);
  }

  getCharacterImage(characterClass: string): string {
    return `assets/images/${characterClass}.png`;
  }

  calculateXpPercentage(xp: number): void {
    const xpForNextLevel = 100;
    this.xpPercentage = (xp / xpForNextLevel) * 100;
  }

  redirectToLootbox() {
    this.router.navigate(['/lootbox']);
  }

  isInvalidTime(timeLeft: number): boolean {
    return isNaN(timeLeft) || timeLeft === null || timeLeft === undefined;
  }

  requestRandomItems() {
    const randomItemId = this.itemService.getRandomItemId();
    const randomRarity = this.itemService.getRandomRarity();

    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.itemService.addItemToInventory(userId, randomItemId, randomRarity).subscribe(
      () => {
        console.log('Random item added to inventory successfully');
      },
      (error) => {
        console.error('Failed to add random item to inventory', error);
      }
    );
  }
}
