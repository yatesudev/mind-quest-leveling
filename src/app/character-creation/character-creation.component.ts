import { Component } from '@angular/core';
import { CharacterService } from '../character.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-character-creation',
  templateUrl: './character-creation.component.html',
  styleUrl: './character-creation.component.css',
})
export class CharacterCreationComponent {
  questions = [
    {
      text: 'How do you prefer to spend your free time?',
      options: [
        {
          text: 'Reading or solving puzzles',
          value: { healer: 1, rogue: 2, warrior: 1, mage: 3 },
        },
        {
          text: 'Playing sports or exercising',
          value: { healer: 1, rogue: 2, warrior: 3, mage: 1 },
        },
        {
          text: 'Socializing with friends',
          value: { healer: 3, rogue: 1, warrior: 2, mage: 1 },
        },
        {
          text: 'Engaging in creative hobbies like painting or writing',
          value: { healer: 2, rogue: 1, warrior: 1, mage: 3 },
        },
      ],
    },
    {
      text: 'Which activity do you find most enjoyable?',
      options: [
        {
          text: 'Learning new things or attending workshops',
          value: { healer: 1, rogue: 2, warrior: 1, mage: 3 },
        },
        {
          text: 'Participating in team sports or fitness classes',
          value: { healer: 1, rogue: 2, warrior: 3, mage: 1 },
        },
        {
          text: 'Volunteering or helping others',
          value: { healer: 3, rogue: 1, warrior: 2, mage: 1 },
        },
        {
          text: 'Playing strategy games or planning events',
          value: { healer: 2, rogue: 1, warrior: 1, mage: 3 },
        },
      ],
    },
    {
      text: 'How do you handle stressful situations?',
      options: [
        {
          text: 'Analyzing the situation and coming up with a logical solution',
          value: { healer: 1, rogue: 2, warrior: 1, mage: 3 },
        },
        {
          text: 'Going for a run or doing a workout to clear your mind',
          value: { healer: 1, rogue: 2, warrior: 3, mage: 1 },
        },
        {
          text: 'Talking it out with friends or family',
          value: { healer: 3, rogue: 1, warrior: 2, mage: 1 },
        },
        {
          text: 'Taking a break to relax and gather your thoughts',
          value: { healer: 2, rogue: 1, warrior: 1, mage: 3 },
        },
      ],
    },
    {
      text: 'What type of goals do you set for yourself?',
      options: [
        {
          text: 'Academic or career goals that challenge your mind',
          value: { healer: 1, rogue: 2, warrior: 1, mage: 3 },
        },
        {
          text: 'Fitness or health-related goals',
          value: { healer: 1, rogue: 2, warrior: 3, mage: 1 },
        },
        {
          text: 'Building and maintaining strong relationships',
          value: { healer: 3, rogue: 1, warrior: 2, mage: 1 },
        },
        {
          text: 'Personal growth goals, like learning a new hobby',
          value: { healer: 2, rogue: 1, warrior: 1, mage: 3 },
        },
      ],
    },
    {
      text: 'Which describes your ideal weekend activity?',
      options: [
        {
          text: 'Attending a seminar or reading a book',
          value: { healer: 1, rogue: 2, warrior: 1, mage: 3 },
        },
        {
          text: 'Hiking or playing sports',
          value: { healer: 1, rogue: 2, warrior: 3, mage: 1 },
        },
        {
          text: 'Hosting a get-together or meeting new people',
          value: { healer: 3, rogue: 1, warrior: 2, mage: 1 },
        },
        {
          text: 'Working on a personal project or crafting',
          value: { healer: 2, rogue: 1, warrior: 1, mage: 3 },
        },
      ],
    },
  ];

  constructor(private characterService: CharacterService, private authService: AuthService) {
    console.log('Character creation component loaded');
  }

  currentQuestionIndex: number = 0;
  answers: { [key: string]: number } = {
    healer: 0,
    rogue: 0,
    warrior: 0,
    mage: 0,
  };
  assignedClass: string | null = null;

  onAnswer(option: any): void {
    Object.keys(option.value).forEach(key => {
      this.answers[key] += option.value[key];
    });

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.submitAnswers();
    }
  }

  submitAnswers() {
    console.log('User answers:', this.answers);
    const assignedClass = Object.keys(this.answers).reduce((a, b) => this.answers[a] > this.answers[b] ? a : b);
    console.log('Assigned class:', assignedClass);
    this.assignClassToUser(assignedClass);
  }

  assignClassToUser(characterClass: string) {
    const userId = this.authService.getUserId();
    if (userId) {
      this.characterService.assignClassToUser(userId, characterClass)
        .subscribe(response => {
          console.log('Class assigned:', response);
          this.assignedClass = characterClass;
        }, error => {
          console.error('Error assigning class:', error);
        });
    } else {
      console.error('User ID is null');
    }
  }

  getCharacterImage(): string {
    switch (this.assignedClass) {
      case 'warrior':
        return 'assets/images/warrior.png';
      case 'mage':
        return 'assets/images/mage.png';
      case 'healer':
        return 'assets/images/healer.png';
      case 'rogue':
        return 'assets/images/rogue.png';
      default:
        return 'assets/images/default.png';
    }
  }
}
