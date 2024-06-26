// character.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = environment.apiUrl; // API base URL

  constructor(private http: HttpClient) {}

  // Assign class to user
  assignClassToUser(userId: string, characterClass: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign-class`, { userId, characterClass });
  }

  // Assign personality type to user
  assignPersonalityToUser(userId: string, personalityType: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign-personality`, { userId, personalityType });
  }

  // Check if user has a character
  checkUserHasCharacter(userId: string): Observable<{ hasCharacter: boolean }> {
    return this.http.get<{ hasCharacter: boolean }>(`${this.apiUrl}/has-character/${userId}`);
  }

  // Get user character details
  getUserCharacter(userId: string): Observable<{ character: any }> {
    return this.http.get<{ character: any }>(`${this.apiUrl}/get-character/${userId}`);
  }

  // Get user details
  getUser(userId: string): Observable<{ user: any }> {
    return this.http.get<{ user: any }>(`${this.apiUrl}/get-user/${userId}`);
  }

  // Activate a quest for user
  activateQuest(userId: string, quest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/activate-quest`, { userId, quest });
  }

  // Get user quests
  getUserQuests(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-user-quests/${userId}`);
  }

  // Cancel user's active quest
  cancelQuest(userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cancel-quest`, { userId });
  }

  // Get user's lootboxes count
  getUserLootboxes(userId: string): Observable<{ lootboxes: number }> {
    return this.http.get<{ lootboxes: number }>(`${this.apiUrl}/get-lootboxes/${userId}`);
  }

  // Remove a lootbox from user
  removeLootbox(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove-lootbox/${userId}`);
  }
}