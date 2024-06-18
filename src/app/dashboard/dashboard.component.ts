import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../character.service';
import { AuthService } from '../auth.service';

import { ItemService } from '../item.service';


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

  characterImage: string = '';
  xpPercentage: number = 0;

  currentQuest: any = {
    name: "",
    description: "",
    xp: "",
    progress: 0,
    timeLeft: 0
  };


  constructor(
    private characterService: CharacterService,
    private authService: AuthService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.setCharacterPanel();
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
        this.updateCurrentQuest(this.user.activeQuest)
        this.calculateXpPercentage(this.character.stats.xp);
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

    console.log(this.currentQuest.progress);

  }

  calculateTimeLeft(startTime: Date, endTime: Date): number {
    const now = new Date();
    const end = new Date(endTime);

    let time = ((end.getTime() - now.getTime()) / 1000 / 60);
    /* round time */ 
    time = Math.floor(time+0.99);
    return time;
  }

  calculateQuestProgress(startTime: Date, endTime: Date): number {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = now.getTime() - start.getTime();

    return (elapsedDuration / totalDuration) * 100;
  }

  getCharacterImage(characterClass: string): string {
    // Assuming you have images stored in assets folder
    return `assets/images/${characterClass}.png`;
  }

  calculateXpPercentage(xp: number): void {
    // Assuming level up requires 100 XP for simplicity
    const xpForNextLevel = 100;
    this.xpPercentage = (xp / xpForNextLevel) * 100;
  }

  requestRandomItems() {
    const randomItemId = this.itemService.getRandomItemId(); // Replace with your logic to get a random item ID
    const randomRarity = this.itemService.getRandomRarity(); // Replace with your logic to get a random rarity level

    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    console.log("Rarity: ", randomRarity);

    this.itemService.addItemToInventory(userId, randomItemId, randomRarity).subscribe(
      () => {
        console.log('Random item added to inventory successfully');
        // Optionally, refresh inventory display or perform other actions
      },
      (error) => {
        console.error('Failed to add random item to inventory', error);
      }
    );
  }
}
