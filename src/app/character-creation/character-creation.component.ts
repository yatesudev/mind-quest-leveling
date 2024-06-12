import { Component } from '@angular/core';

@Component({
  selector: 'app-character-creation',
  templateUrl: './character-creation.component.html',
  styleUrl: './character-creation.component.css',
})
export class CharacterCreationComponent {
  constructor() {}

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
}
