import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.css']
})
export class QuestsComponent implements OnInit {
  generalQuests: any[] = [];
  classQuests: any = {};
  selectedClass: string = ""; // Default selected class

  displayedGeneralQuests: any[] = [];
  displayedClassQuests: any[] = [];

  constructor(
    private http: HttpClient, 
    private authService: AuthService, 
    private characterService: CharacterService
  ) { }

  ngOnInit(): void {
    this.getUserClass();
    this.loadGeneralQuests();
  }

  loadGeneralQuests(): void {
    this.http.get<any[]>('assets/jsonDatabase/generalQuests.json').subscribe(data => {
      this.generalQuests = data;
      this.pickRandomQuests();
    });
  }

  loadClassQuests(): void {
    this.http.get<{ [key: string]: any[] }>('assets/jsonDatabase/classQuests.json').subscribe(data => {
      this.classQuests = data;
      this.pickRandomQuests();
    });
  }

  getSelectedClassQuests(): any[] {
    return this.classQuests[this.selectedClass] || [];
  }

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

  pickRandomQuests(): void {
    if (this.generalQuests.length > 0) {
      this.displayedGeneralQuests = this.getRandomItems(this.generalQuests, 5);
    }

    const selectedClassQuests = this.getSelectedClassQuests();

    if (selectedClassQuests.length > 0) {
      this.displayedClassQuests = this.getRandomItems(selectedClassQuests, 5);
    }
  }

  getRandomItems(array: any[], count: number): any[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  activateQuest(questId: string): void {
    // Check if user has an active quest

    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.characterService.getUserQuests(userId).subscribe((response: any) => {
      console.log('User quests:', response);
    
      // Extract active quest from the response
      const activeQuest = response.activeQuest;
    
      // Check if activeQuest is defined and not empty
      if (activeQuest && Object.keys(activeQuest).length > 0) {
        console.log('User already has an active quest:', activeQuest);
        return; // Exit function if user already has an active quest
      }
    
      console.log('No active quest found for the user.');
    
      // Activate the quest
      const questToActivate = this.findQuestById(questId); // Replace with your logic to find quest by ID
      if (questToActivate) {
        this.characterService.activateQuest(userId, questToActivate).subscribe(
          (activationResponse) => {
            console.log('Quest activated:', questToActivate);
            // Handle success, e.g., display a message or update UI
          },
          (error) => {
            console.error('Error activating quest:', error);
          }
        );
      } else {
        console.error('Quest not found:', questId);
      }
    }, error => {
      console.error('Error fetching user quests:', error);
    });
  }

  findQuestById(questId: string): any {
    // Search in displayedGeneralQuests and displayedClassQuests
    let quest = this.displayedGeneralQuests.find(q => q.id === questId);
    if (!quest) {
      quest = this.displayedClassQuests.find(q => q.id === questId);
    }
    return quest;
  }
}
