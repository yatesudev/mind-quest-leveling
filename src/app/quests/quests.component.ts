import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { CharacterService } from '../character.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; // Import the Router

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.css'],
})
export class QuestsComponent implements OnInit {
  generalQuests: any[] = []; // General quests array
  classQuests: any = {}; // Class-specific quests object
  testQuests: any[] = []; // Test quests array

  selectedClass: string = ''; // Selected class

  displayedGeneralQuests: any[] = []; // Displayed general quests
  displayedClassQuests: any[] = []; // Displayed class-specific quests
  displayedTestQuests: any[] = []; // Displayed test quests

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private characterService: CharacterService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserClass();
    this.loadGeneralQuests();
    this.loadTestQuests();
  }

  // Load general quests from JSON
  loadGeneralQuests(): void {
    this.http
      .get<any[]>('assets/jsonDatabase/generalQuests.json')
      .subscribe((data) => {
        this.generalQuests = data;
        this.pickRandomQuests();
      });
  }

  // Load test quests from JSON
  loadTestQuests(): void {
    this.http
      .get<any[]>('assets/jsonDatabase/testQuests.json')
      .subscribe((data) => {
        this.testQuests = data;
        this.pickRandomQuests();
      });
  }

  // Load class-specific quests from JSON
  loadClassQuests(): void {
    this.http
      .get<{ [key: string]: any[] }>('assets/jsonDatabase/classQuests.json')
      .subscribe((data) => {
        this.classQuests = data;
        this.pickRandomQuests();
      });
  }

  // Get quests for selected class
  getSelectedClassQuests(): any[] {
    return this.classQuests[this.selectedClass] || [];
  }

  // Get user class and load corresponding quests
  getUserClass(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.characterService.getUserCharacter(userId).subscribe((response) => {
      if (response.character) {
        this.selectedClass = response.character.class;
        this.loadClassQuests();
      }
    });
  }

  // Pick random quests to display
  pickRandomQuests(): void {
    if (this.generalQuests.length > 0) {
      this.displayedGeneralQuests = this.getRandomItems(this.generalQuests, 5);
    }

    const selectedClassQuests = this.getSelectedClassQuests();

    if (selectedClassQuests.length > 0) {
      this.displayedClassQuests = this.getRandomItems(selectedClassQuests, 5);
    }

    if (this.testQuests.length > 0) {
      this.displayedTestQuests = this.getRandomItems(this.testQuests, 5);
    }
  }

  // Get random items from an array
  getRandomItems(array: any[], count: number): any[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Activate a quest by ID
  activateQuest(questId: string): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.characterService.getUserQuests(userId).subscribe(
      (response: any) => {
        const activeQuest = response.activeQuest;

        if (activeQuest && Object.keys(activeQuest).length > 0) {
          this.toastr.info('User already has an active quest:', activeQuest);
          return; // Exit if user already has an active quest
        }

        const questToActivate = this.findQuestById(questId); // Find quest by ID
        if (questToActivate) {
          this.characterService
            .activateQuest(userId, questToActivate)
            .subscribe(
              () => {
                this.toastr.success('Quest activated');
                this.router.navigate(['/dashboard']); // Navigate to dashboard
              },
              (error) => {
                console.error('Error activating quest:', error);
                this.toastr.error('You already have an active Quest');
              }
            );
        } else {
          console.error('Quest not found:', questId);
          this.toastr.error('Quest not found:');
        }
      },
      (error) => {
        console.error('Error fetching user quests:', error);
        this.toastr.error('Error fetching user quests:');
      }
    );
  }

  // Find a quest by ID in displayed quests
  findQuestById(questId: string): any {
    let quest = this.displayedGeneralQuests.find((q) => q.id === questId);
    if (!quest) {
      quest = this.displayedClassQuests.find((q) => q.id === questId);
    }
    if (!quest) {
      quest = this.displayedTestQuests.find((q) => q.id === questId);
    }
    return quest;
  }
}
