import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../character.service';
import { AuthService } from '../auth.service';
import { ItemService } from '../item.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Defines the DashboardComponent with its metadata
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Character object with initial values
  character: any = {
    class: '',
    level: 0,
    stats: {
      xp: 0
    }
  };

  user: any; // Variable to store user data
  lootboxes: number = 0; // Number of lootboxes the user has
  characterImage: string = ''; // URL of the character's image
  xpPercentage: number = 0; // Percentage of XP towards the next level
  timeLeft: number = 0; // Time left for the current quest in minutes

  // Current quest object with initial values
  currentQuest: any = {
    name: "",
    description: "",
    xp: "",
    progress: 0,
    timeLeft: 0 // Time left in milliseconds
  };

  // Constructor for the dependencies of the DashboardComponent
  constructor(
    private characterService: CharacterService,
    private authService: AuthService,
    private itemService: ItemService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // Lifecycle hook called when the component initializes
  ngOnInit() {
    this.setCharacterPanel(); // Set up the character panel with user data
  }

  // Animates the progress bar for the current quest
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
      this.timeLeft = Math.max((endTime - now) / 1000 / 60, 0); // Convert to minutes
      this.timeLeft = parseFloat(this.timeLeft.toFixed(2)); // Round to 2 decimal places

      if (now < endTime) {
        requestAnimationFrame(animate); // Continue animation if time left
      } else {
        if (this.currentQuest.progress) {
          this.toastr.success('Quest completed');
          setTimeout(() => {
            window.location.reload(); // Refresh the page to update the character panel
          }, 1000);
        }
      }
    };

    requestAnimationFrame(animate); // Start animation
  }

  // Logs out the user and navigates to the login page
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Sets up the character panel with user and character data
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
        });
      }
    });
  }

  // Updates the current quest and starts the progress bar animation
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

  // Cancels the current quest
  cancelQuest() {
    const userId = this.authService.getUserId();
  
    if (!userId) {
      return;
    }
  
    this.characterService.cancelQuest(userId).subscribe(
      (response) => {
        window.location.reload(); // Refresh the page to update the character panel
        this.toastr.success('Quest cancelled');
      },
      (error) => {
        this.toastr.error('Failed to cancel quest');
      }
    );
  }

  // Calculates the time left for the current quest
  calculateTimeLeft(startTime: Date, endTime: Date): number {
    const now = new Date();
    const end = new Date(endTime);

    return Math.max(end.getTime() - now.getTime(), 0); // Time left in milliseconds
  }

  // Calculates the progress percentage for the current quest
  calculateQuestProgress(startTime: Date, endTime: Date): number {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = now.getTime() - start.getTime();

    return Math.min((elapsedDuration / totalDuration) * 100, 100);
  }

  // Returns the image URL for the character's class
  getCharacterImage(characterClass: string): string {
    return `assets/images/${characterClass}.png`;
  }

  // Calculates the XP percentage towards the next level
  calculateXpPercentage(xp: number): void {
    const xpForNextLevel = 100; // Assuming 100 XP is required for the next level
    this.xpPercentage = (xp / xpForNextLevel) * 100;
  }

  // Redirects to the lootbox page
  redirectToLootbox() {
    this.router.navigate(['/lootbox']);
  }

  // Checks if the time left is invalid
  isInvalidTime(timeLeft: number): boolean {
    return isNaN(timeLeft) || timeLeft === null || timeLeft === undefined;
  }

  // Requests random items and adds them to the user's inventory
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