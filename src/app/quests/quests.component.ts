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
  styleUrls: ['./quests.component.css']
})
export class QuestsComponent implements OnInit {
  generalQuests: any[] = [];
  classQuests: any = {};
  testQuests: any[] = [];

  selectedClass: string = ""; // Default selected class

  displayedGeneralQuests: any[] = [];
  displayedClassQuests: any[] = [];
  displayedTestQuests: any[] = [];

  constructor(
    private http: HttpClient, 
    private authService: AuthService, 
    private characterService: CharacterService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserClass();
    this.loadGeneralQuests();
    this.loadTestQuests();
  }

  loadGeneralQuests(): void {
    this.http.get<any[]>('assets/jsonDatabase/generalQuests.json').subscribe(data => {
      this.generalQuests = data;
      this.pickRandomQuests();
    });
  }

  loadTestQuests(): void {
    this.http.get<any[]>('assets/jsonDatabase/testQuests.json').subscribe(data => {
      this.testQuests = data;
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

    if (this.testQuests.length > 0) {
      this.displayedTestQuests = this.getRandomItems(this.testQuests, 5);
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
        this.toastr.info('User already has an active quest:', activeQuest);

        return; // Exit function if user already has an active quest
      }
    


      // Activate the quest
      const questToActivate = this.findQuestById(questId); // Replace with your logic to find quest by ID
      if (questToActivate) {
        this.characterService.activateQuest(userId, questToActivate).subscribe(
          (activationResponse) => {
            console.log('Quest activated:', questToActivate);
            this.toastr.success('Quest activated');
           
            // Navigate to the dashboard upon successful activation
            this.router.navigate(['/dashboard']);

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
    }, error => {
      console.error('Error fetching user quests:', error);
      this.toastr.error('Error fetching user quests:');
    });
  }

  findQuestById(questId: string): any {
    let quest = this.displayedGeneralQuests.find(q => q.id === questId);
    if (!quest) {
      quest = this.displayedClassQuests.find(q => q.id === questId);
    }
    if (!quest) {
      quest = this.displayedTestQuests.find(q => q.id === questId);
    }
    return quest;
  }
  
}
