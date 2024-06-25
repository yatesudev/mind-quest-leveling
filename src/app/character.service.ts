// character.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  assignClassToUser(userId: string, characterClass: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign-class`, { userId, characterClass });
  }

  assignPersonalityToUser(userId: string, personalityType: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign-personality`, { userId, personalityType });
  }

  checkUserHasCharacter(userId: string): Observable<{ hasCharacter: boolean }> {
    return this.http.get<{ hasCharacter: boolean }>(`${this.apiUrl}/has-character/${userId}`);
  }

  getUserCharacter(userId: string): Observable<{ character: any }> {
    return this.http.get<{ character: any }>(`${this.apiUrl}/get-character/${userId}`);
  }

  getUser(userId: string): Observable<{ user: any }> {
    return this.http.get<{ user: any }>(`${this.apiUrl}/get-user/${userId}`);
  }

  activateQuest(userId: string, quest: any): Observable<any> {
    console.log('quest', quest);
    return this.http.post<any>(`${this.apiUrl}/activate-quest`, { userId, quest });
  }

  getUserQuests(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-user-quests/${userId}`);
  }

  cancelQuest(userId: string) {
    return this.http.post<any>(`${this.apiUrl}/cancel-quest`, { userId });
  }

  getUserLootboxes(userId: string): Observable<{ lootboxes: number }> {
    return this.http.get<{ lootboxes: number }>(`${this.apiUrl}/get-lootboxes/${userId}`);
  }

  removeLootbox(userId: string) {
    return this.http.delete<any>(`${this.apiUrl}/remove-lootbox/${userId}`);
  }  
}
