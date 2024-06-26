import { Component } from '@angular/core';
import { CharacterService } from '../character.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

// Defines the CharacterCreationComponent with its metadata
@Component({
  selector: 'app-character-creation',
  templateUrl: './character-creation.component.html',
  styleUrl: './character-creation.component.css',
})
export class CharacterCreationComponent {
  // Array of questions for the character creation process
  questions = [
    {
      text: 'How do you prefer to spend your free time?',
      options: [
        {
          text: 'Reading or solving puzzles',
          value: { healer: 2, rogue: 3, warrior: 1, mage: 3 },
        },
        {
          text: 'Playing sports or exercising',
          value: { healer: 1, rogue: 3, warrior: 3, mage: 1 },
        },
        {
          text: 'Socializing with friends',
          value: { healer: 3, rogue: 1, warrior: 2, mage: 1 },
        },
        {
          text: 'Engaging in creative hobbies like painting or writing',
          value: { healer: 3, rogue: 1, warrior: 1, mage: 3 },
        },
      ],
    },
    {
      text: 'Which activity do you find most enjoyable?',
      options: [
        {
          text: 'Learning new things or attending workshops',
          value: { healer: 2, rogue: 2, warrior: 1, mage: 3 },
        },
        {
          text: 'Participating in team sports or fitness classes',
          value: { healer: 1, rogue: 2, warrior: 3, mage: 1 },
        },
        {
          text: 'Volunteering or helping others',
          value: { healer: 3, rogue: 1, warrior: 3, mage: 1 },
        },
        {
          text: 'Playing strategy games or planning events',
          value: { healer: 2, rogue: 3, warrior: 2, mage: 3 },
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
          value: { healer: 2, rogue: 1, warrior: 1, mage: 3 },
        },
        {
          text: 'Fitness or health-related goals',
          value: { healer: 1, rogue: 3, warrior: 3, mage: 1 },
        },
        {
          text: 'Building and maintaining strong relationships',
          value: { healer: 3, rogue: 1, warrior: 3, mage: 1 },
        },
        {
          text: 'Personal growth goals, like learning a new hobby',
          value: { healer: 3, rogue: 2, warrior: 2, mage: 3 },
        },
      ],
    },
    {
      text: 'Which describes your ideal weekend activity?',
      options: [
        {
          text: 'Attending a seminar or reading a book',
          value: { healer: 2, rogue: 2, warrior: 1, mage: 3 },
        },
        {
          text: 'Hiking or playing sports',
          value: { healer: 1, rogue: 3, warrior: 3, mage: 1 },
        },
        {
          text: 'Hosting a get-together or meeting new people',
          value: { healer: 3, rogue: 1, warrior: 2, mage: 1 },
        },
        {
          text: 'Working on a personal project or crafting',
          value: { healer: 2, rogue: 2, warrior: 2, mage: 2 },
        },
      ],
    },
  ];

  // Constructor for the dependencies of the CharacterCreationComponent
  constructor(
    private characterService: CharacterService,
    private authService: AuthService,
    private toastr: ToastrService // Inject ToastrService here
  ) {}

  // Tracks the index of the current question
  currentQuestionIndex: number = 0;

  // Initializes the answers object to store the scores for each character class
  answers: { [key: string]: number } = {
    healer: 0,
    rogue: 0,
    warrior: 0,
    mage: 0,
  };

  // Variable to store the assigned character class
  assignedClass: string | null = null;

  // Event handler for answering a question
  onAnswer(option: any): void {
    // Updates the scores for each class based on the selected option
    Object.keys(option.value).forEach((key) => {
      this.answers[key] += option.value[key];
    });

    // Moves to the next question or submits the answers if all questions are answered
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.submitAnswers();
    }
  }

  // Submits the answers and assigns a character class based on the highest score
  submitAnswers() {
    const maxScore = Math.max(...Object.values(this.answers));
    const topClasses = Object.keys(this.answers).filter(
      (key) => this.answers[key] === maxScore
    );
    const assignedClass =
      topClasses[Math.floor(Math.random() * topClasses.length)];
    this.assignClassToUser(assignedClass);
  }

  // Assigns the character class to the user
  assignClassToUser(characterClass: string) {
    const userId = this.authService.getUserId();
    if (userId) {
      this.characterService.assignClassToUser(userId, characterClass).subscribe({
        next: (response) => {
          this.assignedClass = characterClass;
          this.toastr.success('Character class assigned successfully');
        },
        error: (error) => {
          this.toastr.error('Failed to assign character class. Please try again.');
        },
      });
    } else {
      this.toastr.error('Failed to get user ID. Please try again.');
    }
  }

  // Returns the image URL for the assigned character class
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