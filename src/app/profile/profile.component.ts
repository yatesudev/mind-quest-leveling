import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CharacterService } from '../character.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})


export class ProfileComponent implements OnInit{
  character: any;
  aviableClasses: any;

  newChangedClass: any;

  constructor(
    private characterService: CharacterService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log(this.character);
    this.setProfilePanel();
  }

  setProfilePanel() {
    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.characterService.getUserCharacter(userId).subscribe((response) => {
      if (response.character) {
        this.character = response.character;
        console.log(this.character);
      }
    });
  }

  changedClass(value: string) {
    this.newChangedClass = value;
  }

  changeClass(classType: string) {
    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    if (!this.newChangedClass) {
      this.newChangedClass = classType;
    }
    

    console.log('New class:', this.newChangedClass);

    this.characterService.assignClassToUser(userId, this.newChangedClass).subscribe((response) => {
      console.log('Class changed:', response);
    });

    /* refresh component */
    this.setProfilePanel();
  }
}
