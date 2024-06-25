import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CharacterService } from '../character.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

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

  personality: any;
  newChangedClass: any;
  newChangedPersonality: String = "";

  powerText: string = "";

  constructor(
    private characterService: CharacterService,
    private authService: AuthService,
    private toastr: ToastrService
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
        this.updatePowerText();
      }
    });


    this.characterService.getUser(userId).subscribe((response) => {
      if (response.user) {
        console.log('User:', response.user.personalityType);
        this.personality = response.user.personalityType;

      }
    }
    );
  }

  updatePowerText() {
    switch (this.character.class) {
      case 'warrior':
        this.powerText = `
          <p><b>Strength and Valor:</b> Embrace the path of the warrior, where courage and might are your steadfast companions. As you wield your blade, remember that with great strength comes the duty to protect the weak and uphold justice.</p>
          <p><b>Honor in Battle:</b> Let your actions in combat speak of honor and glory. Through your deeds, carve a legacy worthy of songs sung by bards for generations to come.</p>
        `;
        break;
      case 'mage':
        this.powerText = `
          <p><b>Mystical Wisdom:</b> Delve into the arcane mysteries, where spells weave the tapestry of reality. With each incantation, remember the responsibility to wield magic wisely, lest its untamed power bring chaos.</p>
          <p><b>Seeker of Knowledge:</b> As a scholar of the arcane arts, let your thirst for wisdom guide you. In your pursuit of magical mastery, remain vigilant against the temptations that lead lesser minds astray.</p>
        `;
        break;
      case 'healer':
        this.powerText = `
          <p><b>Compassion and Healing:</b> Your hands are the vessels of mercy, where healing flows to mend wounds and soothe suffering. Embrace the duty to heal not only bodies but also spirits weary from the trials of life.</p>
          <p><b>Sacrifice for Others:</b> Let your selflessness be your strength. In the face of adversity, your willingness to give of yourself for the sake of others shall shine as a beacon of hope.</p>
        `;
        break;
      case 'rogue':
        this.powerText = `
          <p><b>Stealth and Cunning:</b> Navigate the shadows with nimble grace, where stealth and cunning are your greatest tools. Remember, with great agility comes the responsibility to wield it wisely, for the shadows hold both secrets and dangers.</p>
          <p><b>Master of Deception:</b> Let your wit and guile be your allies. In the intricate dance of deception, trust in your instincts and adapt swiftly to unravel the schemes of your foes.</p>
        `;
        break;
      default:
        this.powerText = `
          <p><b>Undefined Class:</b> Embrace the journey ahead with courage and determination. Though your path may be undefined, remember that every choice shapes your destiny.</p>
          <p><b>Forge Your Legacy:</b> Let your actions speak louder than words. As you traverse the realms, leave a mark that echoes through the annals of time.</p>
        `;
        break;
    }
  }

  changedClass(value: string) {
    this.newChangedClass = value;
  }

  changedPersonality(value: string) {
    this.newChangedPersonality = value;
  }

  changePersonality(personality: string) {
    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.characterService.assignPersonalityToUser(userId, personality).subscribe((response) => {
      console.log('Personality changed:', personality);
          /* refresh component */
      this.setProfilePanel();
      this.toastr.success('Personality changed successfully');
    });
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
          /* refresh component */
      this.setProfilePanel();
      this.toastr.success('Class changed successfully');
    });


  }
}
