// character.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
    //private apiUrl = 'http://localhost:3000/auth';
    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  assignClassToUser(userId: string, characterClass: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign-class`, { userId, characterClass });
  }

  checkUserHasCharacter(userId: string): Observable<{ hasCharacter: boolean }> {
    return this.http.get<{ hasCharacter: boolean }>(`${this.apiUrl}/has-character/${userId}`);
  }

  getUserCharacter(userId: string): Observable<{ character: any }> {
    return this.http.get<{ character: any }>(`${this.apiUrl}/get-character/${userId}`);
  }
}
