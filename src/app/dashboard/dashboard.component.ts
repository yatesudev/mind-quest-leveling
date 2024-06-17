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
  characterImage: string = '';
  xpPercentage: number = 0;


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

    this.characterService.getUserCharacter(userId).subscribe((response) => {
      if (response.character) {
        this.character = response.character;
        this.characterImage = this.getCharacterImage(response.character.class);
        this.calculateXpPercentage(response.character.stats.xp);
      }
    });
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
