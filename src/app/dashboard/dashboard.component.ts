import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../character.service';
import { AuthService } from '../auth.service';

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

  constructor(private characterService: CharacterService, private authService: AuthService) {}

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
}
